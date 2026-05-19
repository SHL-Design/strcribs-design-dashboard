// Flexible intent detection — scores messages for design workflow signals.
// Returns 0-3. Score >= 2 triggers an update, >= 1 for low-risk fields.
// No rigid keyword lists — catches natural language variations.

export function scoreConceptConfirmed(text) {
  const t = text.toLowerCase()
  let score = 0
  if (/move forward|going with|we('ll| will) go|let('s| us) proceed|ready to (proceed|move|start|go)|we('re| are) (in|on board|ready)|sounds (good|great|perfect)|love (this|it|the concept|the design|the direction)|looks (amazing|great|good|perfect|wonderful)|we (choose|pick|select|prefer|want|like)|option [123abc]|concept [123abc]|this one|that one|the first|the second|the third|confirmed|we approve|go ahead|we're excited/.test(t)) score++
  if (/concept|design|style|theme|direction|option|deck|proposal|palette|color|look|feel|vibe/.test(t)) score++
  if (/excited|can't wait|looking forward|thank you|thanks for|appreciate/.test(t)) score++
  return score
}

export function scoreRevisionSent(text) {
  const t = text.toLowerCase()
  let score = 0
  if (/revision|revisions|notes|feedback|client (notes|comments|feedback|wants|requested)|please (see|check|review|update|fix|change|adjust|make)|here are|here('?s| is) the|attached|take a look|lmk if|let me know if/.test(t)) score++
  if (/docs\.google\.com|drive\.google\.com|canva\.com|google doc|design doc|attached doc|linked doc|notes (are |is )?here|see below|see attached/.test(t)) score++
  if (/please (update|change|swap|replace|remove|add|adjust|fix|revise)|make sure|don't forget|also (please|note|make)|can you (please|update|change|fix|remove|add)|i('ve| have) (provided|added|included|left|noted)|direction in (pink|red|blue|yellow)/.test(t)) score++
  return score
}

export function scoreDesignerFinished(text) {
  const t = text.toLowerCase()
  let score = 0
  if (/done|finished|completed|ready|submitted|sent|updated|revised|all (done|set|good|complete|finished)|wrapped up|good to go|please (review|check|take a look|see)|here('?s| is) (the|my|our|it|the updated|the revised)|i('ve| have) (done|finished|completed|updated|revised|sent|submitted|made|incorporated|applied)|checked (almost )?everything|just (sent|submitted|updated|finished|completed|wrapped)/.test(t)) score++
  if (/deck|design|canva|slides|presentation|design deck|full design|revision|doc|link/.test(t)) score++
  if (/canva\.com|docs\.google\.com|drive\.google\.com|https?:\/\//.test(t)) score++
  return score
}

export function scoreDeckApproved(text) {
  const t = text.toLowerCase()
  let score = 0
  if (/(final|fully|officially|completely)? ?(approved?|approval)|this is (good|great|approved|ready|perfect|all set)|looks (good|great|perfect|approved|amazing|beautiful|fantastic)|good to (go|send|qc|submit)|ready to (send|go|be sent|submit to qc|move forward)|all (good|set|done|approved|looks good)|send (this|it|the deck) to (client|them|qc)|this can (be sent|go out|go to client)|please send/.test(t)) score++
  if (/design|deck|approved|qc|client|send|final/.test(t)) score++
  if (/(final approved|approved design deck|approved!|approved deck|this is it|this is the one|the final)/.test(t)) score++
  return score
}

export function scoreQcSubmitted(text) {
  const t = text.toLowerCase()
  let score = 0
  if (/qc|quality control|pull (the )?numbers|procurement|pull numbers|pull items|ordering|ready for (you to )?pull|ready for qc|submitting to qc|submitted to qc|ready for ordering|mica|numbers (are )?ready/.test(t)) score++
  if (/design deck|deck|design|numbers|items|procurement|ordering/.test(t)) score++
  if (/docs\.google\.com|drive\.google\.com|here('?s| is) the/.test(t)) score++
  return score
}

export function scoreKocNotesSent(text) {
  const t = text.toLowerCase()
  let score = 0
  if (/koc notes|kickoff notes|notes (are |have been )?(sent|ready|attached|here)|please (see|review|check|use) (the )?notes|here are the notes|design notes|concept notes|attached (are )?the notes|here('?s| is) (the |your )?notes|i('ve| have) (sent|attached|shared) (the )?notes|(notes|doc|document) (is |are )?ready/.test(t)) score++
  if (/docs\.google\.com|drive\.google\.com|koc|kickoff|concept|design|notes/.test(t)) score++
  if (/please (proceed|start|begin|work|get started|review)|here you go|lmk|let me know/.test(t)) score++
  return score
}

// Extract a project name from freeform text by matching against known projects
export function findProject(text, projectNames) {
  if (!text) return null
  const t = text.toLowerCase()

  // Full name match
  for (const name of projectNames) {
    if (t.includes(name.toLowerCase())) return name
  }

  // Partial: street number + first word
  for (const name of projectNames) {
    const parts = name.toLowerCase().split(' ')
    if (parts.length >= 2) {
      const partial = parts[0] + ' ' + parts[1]
      if (partial.length > 4 && t.includes(partial)) return name
    }
  }

  // Hyphenated channel name style: "icy-ln-222" → try reversed "222 icy ln"
  const dehyphenated = text.replace(/-staging-design.*/, '').replace(/-/g, ' ').trim().toLowerCase()
  for (const name of projectNames) {
    const parts = name.toLowerCase().split(' ')
    const reversed = [...parts].reverse().join(' ')
    if (dehyphenated === reversed || dehyphenated === name.toLowerCase()) return name
    if (parts.length >= 2) {
      const revPartial = parts[parts.length - 1] + ' ' + parts[0]
      if (dehyphenated.includes(revPartial)) return name
    }
  }

  return null
}
