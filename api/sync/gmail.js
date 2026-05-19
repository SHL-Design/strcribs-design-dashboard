// /api/sync/gmail
// Scans Gmail for: presentation invites, KOC concept replies,
// proposal presentations, Drive proposal shares, KOC dates.

import { google } from 'googleapis'
import { scoreConceptConfirmed, findProject } from '../../lib/signals'

function oauthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/callback`
  )
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { accessToken, projectNames } = req.body
  if (!accessToken) return res.status(401).json({ error: 'No access token' })

  const auth = oauthClient()
  auth.setCredentials({ access_token: accessToken })
  const gmail = google.gmail({ version: 'v1', auth })

  const updates = []

  async function search(query) {
    try {
      const r = await gmail.users.messages.list({ userId: 'me', q: query, maxResults: 50 })
      return r.data.messages || []
    } catch { return [] }
  }

  async function getMessage(id) {
    try {
      const r = await gmail.users.messages.get({ userId: 'me', id, format: 'full' })
      return r.data
    } catch { return null }
  }

  async function getThread(id) {
    try {
      const r = await gmail.users.threads.get({ userId: 'me', id, format: 'full' })
      return r.data.messages || []
    } catch { return [] }
  }

  function header(msg, name) {
    return msg?.payload?.headers?.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || ''
  }

  function body(msg) {
    const parts = msg?.payload?.parts || []
    const plain = parts.find(p => p.mimeType === 'text/plain')
    if (plain?.body?.data) return Buffer.from(plain.body.data, 'base64').toString('utf8')
    if (msg?.payload?.body?.data) return Buffer.from(msg.payload.body.data, 'base64').toString('utf8')
    return msg?.snippet || ''
  }

  function extractDateFromSubject(subject) {
    // "@ Mon May 18, 2026 1:30pm" or "@ Thu Apr 23, 2026"
    const m = subject.match(/@\s+\w+\s+(\w+\s+\d+,\s+\d{4})/)
    if (m) {
      const d = new Date(m[1])
      if (!isNaN(d)) return d.toISOString().split('T')[0]
    }
    return null
  }

  // 1. Full Design Presentation invites
  const presMessages = await search('subject:"Full Design Presentation" newer_than:90d')
  for (const m of presMessages) {
    const msg = await getMessage(m.id)
    if (!msg) continue
    const subject = header(msg, 'subject')
    if (/cancel/i.test(subject)) continue
    const searchText = subject + ' ' + body(msg).substring(0, 400)
    const project = findProject(searchText, projectNames)
    if (!project) continue
    const date = extractDateFromSubject(subject)
    updates.push({
      project,
      signal: 'PRESENTATION_SCHEDULED',
      field: 'pres_date',
      value: date,
      source: `Gmail invite: ${subject.replace(/^(Invitation|Updated invitation):\s*/i, '').substring(0, 60)}`,
      date: date || new Date().toISOString().split('T')[0],
    })
  }

  // 2. KOC Follow-Up threads — look for client concept confirmation
  const kocMessages = await search('subject:"KOC Follow" newer_than:90d')
  const seenThreads = new Set()
  for (const m of kocMessages) {
    const msg = await getMessage(m.id)
    if (!msg) continue
    const threadId = msg.threadId
    if (seenThreads.has(threadId)) continue
    seenThreads.add(threadId)
    const subject = header(msg, 'subject')
    const searchText = subject + ' ' + body(msg).substring(0, 300)
    const project = findProject(searchText, projectNames)
    if (!project) continue

    // Check all messages in thread for client reply
    const threadMsgs = await getThread(threadId)
    for (const tm of threadMsgs) {
      const from = header(tm, 'from').toLowerCase()
      if (from.includes('strcribs') || from.includes('tcc-contracting') || from.includes('techvestor')) continue
      const b = body(tm)
      if (scoreConceptConfirmed(b) >= 1) {
        const dateHeader = header(tm, 'date')
        const d = dateHeader ? new Date(dateHeader).toISOString().split('T')[0] : null
        const senderName = header(tm, 'from').split('<')[0].trim()
        updates.push({
          project,
          signal: 'CONCEPT_CONFIRMED',
          field: 'concept_date',
          value: d,
          source: `Client email confirms concept (${senderName})`,
          date: d,
        })
        break
      }
    }
  }

  // 3. Client Proposal Presentation invites
  const propMessages = await search('subject:"Client Proposal Presentation" newer_than:90d')
  for (const m of propMessages) {
    const msg = await getMessage(m.id)
    if (!msg) continue
    const subject = header(msg, 'subject')
    if (/cancel/i.test(subject)) continue
    const searchText = subject + ' ' + body(msg).substring(0, 300)
    const project = findProject(searchText, projectNames)
    if (!project) continue
    const date = extractDateFromSubject(subject)
    updates.push({
      project,
      signal: 'PROPOSAL_SENT',
      field: 'bt_date',
      value: date,
      source: 'Gmail: Client Proposal Presentation scheduled',
      date: date,
    })
  }

  // 4. Design & Construction Proposal Google Drive shares
  const driveMessages = await search('subject:"Design & Construction Proposal" newer_than:90d from:drive-shares-dm-noreply@google.com')
  for (const m of driveMessages) {
    const msg = await getMessage(m.id)
    if (!msg) continue
    const subject = header(msg, 'subject')
    const searchText = subject + ' ' + body(msg).substring(0, 300)
    const project = findProject(searchText, projectNames)
    if (!project) continue
    const dateHeader = header(msg, 'date')
    const d = dateHeader ? new Date(dateHeader).toISOString().split('T')[0] : null
    updates.push({
      project,
      signal: 'PROPOSAL_SENT',
      field: 'bt_date',
      value: d,
      source: 'Proposal deck shared via Google Drive',
      date: d,
    })
  }

  // 5. Kickoff call invites — capture KOC date
  const kocInvites = await search('subject:("Cribs Kickoff" OR "Kick Off Your STR") newer_than:90d')
  for (const m of kocInvites) {
    const msg = await getMessage(m.id)
    if (!msg) continue
    const subject = header(msg, 'subject')
    if (/cancel/i.test(subject)) continue
    const searchText = subject + ' ' + body(msg).substring(0, 300)
    const project = findProject(searchText, projectNames)
    if (!project) continue
    const date = extractDateFromSubject(subject)
    if (date) {
      updates.push({
        project,
        signal: 'KOC_SCHEDULED',
        field: 'koc',
        value: date,
        source: `Gmail: Kickoff call invite`,
        date,
      })
    }
  }

  res.json({ updates, scanned: { presentations: presMessages.length, koc: kocMessages.length } })
}
