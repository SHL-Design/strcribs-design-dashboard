// /api/sync/slack
// Scans all #address-staging-design private channels and #design-qc
// for flexible design workflow signals.

import {
  scoreRevisionSent, scoreDesignerFinished, scoreDeckApproved,
  scoreQcSubmitted, scoreKocNotesSent, scoreConceptConfirmed, findProject
} from '../../lib/signals'

const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN
const BASE = 'https://slack.com/api'

async function slackGet(endpoint, params = {}) {
  const url = new URL(`${BASE}/${endpoint}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const r = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
  })
  return r.json()
}

async function getPrivateChannels() {
  const data = await slackGet('conversations.list', {
    types: 'private_channel', limit: 200, exclude_archived: false,
  })
  if (!data.ok) return []
  return (data.channels || []).filter(c => c.name?.includes('staging-design'))
}

async function getHistory(channelId, oldestTs) {
  const data = await slackGet('conversations.history', {
    channel: channelId, limit: 100, oldest: oldestTs,
  })
  if (!data.ok) return []
  return data.messages || []
}

async function searchMessages(query, count = 30) {
  const data = await slackGet('search.messages', {
    query, count, sort: 'timestamp', sort_dir: 'desc',
  })
  if (!data.ok) return []
  return data.messages?.matches || []
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!SLACK_TOKEN || SLACK_TOKEN === 'xoxb-YOUR-SLACK-BOT-TOKEN-HERE') {
    return res.json({ updates: [], error: 'Slack token not configured' })
  }

  const { projectNames, lookbackMinutes = 15 } = req.body
  const oldestTs = ((Date.now() - lookbackMinutes * 60 * 1000) / 1000).toString()
  const updates = []
  const log = []

  // ── Staging-design channels ──────────────────────────────────
  const channels = await getPrivateChannels()
  log.push(`Found ${channels.length} staging-design channels`)

  for (const ch of channels) {
    const messages = await getHistory(ch.id, oldestTs)
    if (!messages.length) continue

    const project = findProject(ch.name, projectNames)
    if (!project) {
      log.push(`No match: #${ch.name}`)
      continue
    }
    log.push(`#${ch.name} → "${project}" (${messages.length} msgs)`)

    for (const msg of messages) {
      const text = msg.text || ''
      if (!text.trim()) continue
      const ts = new Date(parseFloat(msg.ts) * 1000).toISOString().split('T')[0]

      // KOC notes sent / designer tagged
      if (scoreKocNotesSent(text) >= 1) {
        updates.push({
          project, signal: 'KOC_NOTES_SENT', field: 'koc_notes_sent', value: true,
          source: `KOC notes sent – #${ch.name}`, date: ts,
          secondaryField: 'des_tagged_dt', secondaryValue: ts,
        })
      }

      // Revision notes sent to designer (Olivia/Sophia → designer)
      if (scoreRevisionSent(text) >= 2) {
        updates.push({
          project, signal: 'REVISION_SENT', field: 'rev_date', value: ts,
          source: `Rev notes sent – #${ch.name} (${ts})`, date: ts,
        })
      }

      // Designer finished and submitted work
      if (scoreDesignerFinished(text) >= 2) {
        updates.push({
          project, signal: 'DESIGNER_SUBMITTED', field: 'submit_date', value: ts,
          source: `Designer submitted – #${ch.name}`, date: ts,
          secondaryField: 'full_ready_dt', secondaryValue: ts,
        })
      }

      // Deck approved by Olivia
      if (scoreDeckApproved(text) >= 2) {
        updates.push({
          project, signal: 'DECK_APPROVED', field: 'approved_date', value: ts,
          source: `Deck approved – #${ch.name}`, date: ts,
          secondaryField: 'deck_approved', secondaryValue: '✓ YES',
        })
      }

      // QC submitted
      if (scoreQcSubmitted(text) >= 2) {
        updates.push({
          project, signal: 'QC_SUBMITTED', field: 'qc_date', value: ts,
          source: `QC submitted – #${ch.name}`, date: ts,
        })
      }
    }
  }

  // ── Broad search: #design-qc ──────────────────────────────────
  const qcMsgs = await searchMessages('in:#design-qc', 50)
  for (const msg of qcMsgs) {
    if (scoreQcSubmitted(msg.text || '') < 1) continue
    const project = findProject(msg.text, projectNames)
    if (!project) continue
    const ts = new Date(parseFloat(msg.ts) * 1000).toISOString().split('T')[0]
    updates.push({
      project, signal: 'QC_SUBMITTED', field: 'qc_date', value: ts,
      source: 'Submitted to QC – #design-qc', date: ts,
    })
  }

  // ── Broad search: concept confirmations forwarded into Slack ──
  const conceptMsgs = await searchMessages('concept approved OR "move forward" OR "love this" newer:1d', 20)
  for (const msg of conceptMsgs) {
    if (scoreConceptConfirmed(msg.text || '') < 2) continue
    const project = findProject(msg.text, projectNames)
    if (!project) continue
    const ts = new Date(parseFloat(msg.ts) * 1000).toISOString().split('T')[0]
    updates.push({
      project, signal: 'CONCEPT_CONFIRMED', field: 'concept_date', value: ts,
      source: 'Concept confirmed – Slack', date: ts,
    })
  }

  res.json({ updates, log, channelsScanned: channels.length })
}
