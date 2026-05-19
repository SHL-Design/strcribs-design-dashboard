import { useState, useEffect, useCallback, useRef } from 'react'
import { PROJECTS, STATUS_META, DESIGNER_COLORS, STATUS_ORDER } from '../lib/projects'
import Head from 'next/head'

const P = {
  bg:'#FDF6FF', card:'#FFFFFF', lavender:'#C9A8D4', lilac:'#E8D5F5',
  pink:'#F7C5D5', blush:'#FFE4EC', mint:'#B8E6C4', sage:'#D4EDD4',
  teal:'#B8E6E0', sky:'#B8D4F0', peach:'#F5D4B0', butter:'#FFF0C2',
  rose:'#F0B8C8', plum:'#5A2D7A', green:'#1A5C2D', blue:'#1A3A5C',
  deepRose:'#7A1830', deepTeal:'#1A5C52', deepPeach:'#7A3A00',
  muted:'#9E8FAD', border:'#E8D5F5', flagBg:'#FFD6E0', flagText:'#8B0030',
  alt:'#F7FAFD',
}

function fmtDate(d) {
  if (!d) return null
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' })
}

function daysSince(d) {
  if (!d) return null
  return Math.round((new Date('2026-05-18') - new Date(d + 'T00:00:00')) / 86400000)
}

function stageProgress(p) {
  return [!!p.koc,!!p.concept_date,!!p.pres_date||!!p.rev_date,!!p.submit_date||!!p.approved_date,!!p.qc_date,!!p.bt_date].filter(Boolean).length / 6
}

// ── Sub-components ─────────────────────────────────────────────
function DesignerBadge({ name }) {
  const c = DESIGNER_COLORS[name] || { bg:'#F2F0F5', text:'#9E8FAD' }
  return (
    <span style={{ background:c.bg, color:c.text, borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>
      {name}
    </span>
  )
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || { color:'#F2F0F5', text:'#9E8FAD', icon:'•' }
  return (
    <span style={{ background:m.color, color:m.text, borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:700, display:'inline-flex', alignItems:'center', gap:4 }}>
      <span style={{ fontSize:10 }}>{m.icon}</span>{status}
    </span>
  )
}

function ProgressBar({ project: p }) {
  const stages = [
    { l:'KOC', done:!!p.koc },{ l:'Concept', done:!!p.concept_date },
    { l:'Full Design', done:!!p.pres_date },{ l:'Revision', done:!!p.rev_date },
    { l:'Submit', done:!!p.submit_date },{ l:'Approved', done:!!p.approved_date },
    { l:'QC', done:!!p.qc_date },{ l:'BT', done:!!p.bt_date },
  ]
  return (
    <div style={{ marginTop:8, display:'flex', gap:2 }}>
      {stages.map((s,i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
          <div style={{ width:'100%', height:5, borderRadius:3, background:s.done?P.mint:P.border, transition:'background 0.3s' }}/>
          <span style={{ fontSize:7, color:s.done?P.green:P.muted, fontWeight:s.done?700:400 }}>{s.l}</span>
        </div>
      ))}
    </div>
  )
}

function ProjectCard({ project: p, onClick }) {
  const [hov, setHov] = useState(false)
  const flagged = p.flags.length > 0
  const critical = p.flags.some(f => f.includes('overdue'))
  return (
    <div
      onClick={() => onClick(p)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:P.card, borderRadius:16, padding:'14px 16px', cursor:'pointer',
        border:`1.5px solid ${flagged?P.pink:P.border}`,
        boxShadow:hov?'0 6px 20px rgba(201,168,212,0.28)':flagged?'0 2px 12px rgba(240,184,200,0.3)':'0 1px 6px rgba(201,168,212,0.1)',
        transform:hov?'translateY(-2px)':'none', transition:'all 0.2s',
        position:'relative', overflow:'hidden',
      }}
    >
      {flagged && <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:critical?'linear-gradient(90deg,#E8A0B0,#F0B8C8)':'linear-gradient(90deg,#F5D4B0,#F0B8C8)', borderRadius:'16px 16px 0 0' }}/>}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
        <div style={{ fontWeight:700, fontSize:13, color:P.plum, lineHeight:1.3, flex:1 }}>{p.project}</div>
        {flagged && <span style={{ background:P.flagBg, color:P.flagText, borderRadius:10, padding:'1px 7px', fontSize:10, fontWeight:700, whiteSpace:'nowrap' }}>{p.flags.length} flag{p.flags.length>1?'s':''}</span>}
      </div>
      <div style={{ display:'flex', gap:6, marginTop:7, flexWrap:'wrap', alignItems:'center' }}>
        <DesignerBadge name={p.designer}/>
        <span style={{ fontSize:11, color:P.muted }}>·</span>
        <span style={{ fontSize:11, color:P.muted }}>{p.pm}</span>
      </div>
      {p.fd_status && (
        <div style={{ marginTop:7, fontSize:11, fontWeight:600, color:p.fd_status.includes('Approved')?P.green:p.fd_status.includes('Revision')||p.fd_status.includes('Extreme')?P.deepRose:P.blue }}>
          {p.fd_status}
        </div>
      )}
      <div style={{ display:'flex', gap:6, marginTop:7, flexWrap:'wrap' }}>
        {p.pres_date && <span style={{ fontSize:10, background:P.lilac, color:P.plum, borderRadius:8, padding:'2px 7px', fontWeight:600 }}>📅 Pres {fmtDate(p.pres_date)}</span>}
        {p.rev_date && !p.submit_date && <span style={{ fontSize:10, background:P.blush, color:P.deepRose, borderRadius:8, padding:'2px 7px', fontWeight:600 }}>📝 Rev {fmtDate(p.rev_date)} ({daysSince(p.rev_date)}d)</span>}
        {p.approved_date && <span style={{ fontSize:10, background:P.sage, color:P.green, borderRadius:8, padding:'2px 7px', fontWeight:600 }}>✓ Approved {fmtDate(p.approved_date)}</span>}
        {p.bt_date && <span style={{ fontSize:10, background:P.peach, color:P.deepPeach, borderRadius:8, padding:'2px 7px', fontWeight:600 }}>🏠 BT {fmtDate(p.bt_date)}</span>}
      </div>
      <ProgressBar project={p}/>
      {p.flags.length > 0 && (
        <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:3 }}>
          {p.flags.map((f,i) => <div key={i} style={{ fontSize:10, color:P.flagText, fontWeight:600 }}>{f}</div>)}
        </div>
      )}
    </div>
  )
}

function ProjectModal({ project: p, onClose, onSave }) {
  const [editing, setEditing] = useState(false)
  const [local, setLocal] = useState({ ...p })

  const Field = ({ label, field, type = 'text' }) => (
    <div style={{ marginBottom:12 }}>
      <div style={{ fontSize:10, fontWeight:700, color:P.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:3 }}>{label}</div>
      {editing
        ? <input type={type === 'date' ? 'date' : 'text'} value={local[field] || ''} onChange={e => setLocal(l => ({ ...l, [field]: e.target.value }))}
            style={{ width:'100%', padding:'6px 10px', borderRadius:8, border:`1.5px solid ${P.border}`, fontSize:12, color:P.plum, background:P.bg, outline:'none', boxSizing:'border-box', fontFamily:'inherit' }}/>
        : <div style={{ fontSize:13, color:local[field]?P.plum:P.muted }}>
            {local[field] ? (type === 'date' ? fmtDate(local[field]) : local[field]) : '—'}
          </div>
      }
    </div>
  )

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(90,45,122,0.25)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={onClose}>
      <div style={{ background:P.card, borderRadius:20, padding:28, maxWidth:640, width:'100%', maxHeight:'85vh', overflowY:'auto', boxShadow:'0 20px 60px rgba(90,45,122,0.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:P.plum, lineHeight:1.2 }}>{p.project}</div>
            <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
              <StatusBadge status={p.status}/><DesignerBadge name={p.designer}/>
              <span style={{ fontSize:11, color:P.muted, alignSelf:'center' }}>{p.pm}</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {editing
              ? <>
                  <button onClick={() => { onSave(local); setEditing(false) }} style={{ background:P.mint, color:P.green, border:'none', borderRadius:10, padding:'7px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Save</button>
                  <button onClick={() => { setLocal(p); setEditing(false) }} style={{ background:P.border, color:P.muted, border:'none', borderRadius:10, padding:'7px 14px', fontSize:12, cursor:'pointer' }}>Cancel</button>
                </>
              : <button onClick={() => setEditing(true)} style={{ background:P.lilac, color:P.plum, border:'none', borderRadius:10, padding:'7px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>✏️ Edit</button>
            }
            <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:P.muted }}>×</button>
          </div>
        </div>
        {p.flags.length > 0 && <div style={{ background:P.flagBg, borderRadius:12, padding:12, marginBottom:16 }}>{p.flags.map((f,i) => <div key={i} style={{ fontSize:12, color:P.flagText, fontWeight:600, marginBottom:i<p.flags.length-1?4:0 }}>{f}</div>)}</div>}
        {p.notes && <div style={{ background:P.butter, borderRadius:12, padding:12, marginBottom:16, fontSize:12, color:P.deepPeach }}>📌 {p.notes}</div>}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 24px' }}>
          <Field label="KOC Date" field="koc" type="date"/>
          <Field label="Concept Confirmed" field="concept_date" type="date"/>
          <Field label="Full Design Ready" field="full_ready_dt" type="date"/>
          <Field label="Presentation Date" field="pres_date" type="date"/>
          <Field label="1st Revision Sent" field="rev_date" type="date"/>
          <Field label="Designer Submitted" field="submit_date" type="date"/>
          <Field label="Deck Approved" field="approved_date" type="date"/>
          <Field label="Submitted to QC" field="qc_date" type="date"/>
          <Field label="Proposal / BT Date" field="bt_date" type="date"/>
          <Field label="Full Design Status" field="fd_status"/>
        </div>
        <div style={{ marginTop:16 }}>
          <div style={{ fontSize:10, fontWeight:700, color:P.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>Pipeline Progress</div>
          <ProgressBar project={local}/>
        </div>
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────
export default function Dashboard({ authed }) {
  const [projects, setProjects] = useState(PROJECTS)
  const [view, setView] = useState('board')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDesigner, setFilterDesigner] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [syncLog, setSyncLog] = useState([])
  const [showLog, setShowLog] = useState(false)
  const [isAuthed, setIsAuthed] = useState(authed)
  const syncRef = useRef(null)

  // Apply an update to the projects list (only fills empty cells)
  const applyUpdate = useCallback((update) => {
    setProjects(prev => prev.map(p => {
      if (p.project.toLowerCase() !== update.project.toLowerCase()) return p
      const next = { ...p }
      if (update.field && !next[update.field]) next[update.field] = update.value
      if (update.secondaryField && !next[update.secondaryField]) next[update.secondaryField] = update.secondaryValue
      return next
    }))
  }, [])

  const runSync = useCallback(async () => {
    if (syncing) return
    setSyncing(true)
    setSyncLog(['🔍 Starting sync...'])
    setShowLog(true)

    const projectNames = projects.map(p => p.project)
    let totalUpdates = 0

    try {
      // Get access token
      const tokenRes = await fetch('/api/auth/token')
      if (!tokenRes.ok) {
        setSyncLog(l => [...l, '⚠ Not authenticated with Gmail — connect Google above'])
        setSyncing(false)
        return
      }
      const { accessToken } = await tokenRes.json()

      // Gmail sync
      setSyncLog(l => [...l, '📧 Scanning Gmail...'])
      const gmailRes = await fetch('/api/sync/gmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, projectNames }),
      })
      const gmailData = await gmailRes.json()
      for (const u of gmailData.updates || []) {
        applyUpdate(u)
        setSyncLog(l => [...l, `  ✓ ${u.project}: ${u.signal}`])
        totalUpdates++
      }
      setSyncLog(l => [...l, `  ${gmailData.updates?.length || 0} Gmail updates`])

      // Slack sync
      setSyncLog(l => [...l, '💬 Scanning Slack...'])
      const slackRes = await fetch('/api/sync/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectNames, lookbackMinutes: 15 }),
      })
      const slackData = await slackRes.json()
      if (slackData.error) {
        setSyncLog(l => [...l, `  ⚠ Slack: ${slackData.error}`])
      } else {
        for (const u of slackData.updates || []) {
          applyUpdate(u)
          setSyncLog(l => [...l, `  ✓ ${u.project}: ${u.signal}`])
          totalUpdates++
        }
        setSyncLog(l => [...l, `  ${slackData.updates?.length || 0} Slack updates (${slackData.channelsScanned} channels)`])
      }

    } catch (e) {
      setSyncLog(l => [...l, `⚠ Error: ${e.message}`])
    }

    setSyncLog(l => [...l, `✅ Sync complete — ${totalUpdates} update(s) — ${new Date().toLocaleTimeString()}`])
    setSyncing(false)
  }, [syncing, projects, applyUpdate])

  // Auto-sync every 10 minutes
  useEffect(() => {
    syncRef.current = setInterval(runSync, 10 * 60 * 1000)
    return () => clearInterval(syncRef.current)
  }, [runSync])

  const filtered = projects.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false
    if (filterDesigner !== 'all' && p.designer !== filterDesigner) return false
    if (search && !p.project.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const byStatus = STATUS_ORDER.map(s => ({
    status: s, meta: STATUS_META[s],
    projects: filtered.filter(p => p.status === s),
    flagCount: filtered.filter(p => p.status === s && p.flags.length > 0).length,
  })).filter(g => g.projects.length > 0)

  const designers = ['Aya','CJ','Kim','Shiela','Kassel','Martin']
  const allFlags = projects.filter(p => p.flags.length > 0)

  return (
    <>
      <Head>
        <title>STR Cribs Design Tracker</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0;font-family:'DM Sans',sans-serif}
          body{background:#FDF6FF;color:#3A1A5C}
          ::-webkit-scrollbar{width:6px;height:6px}
          ::-webkit-scrollbar-track{background:transparent}
          ::-webkit-scrollbar-thumb{background:#E8D5F5;border-radius:3px}
          .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(275px,1fr));gap:14px}
          button{font-family:inherit}
          @keyframes spin{to{transform:rotate(360deg)}}
        `}</style>
      </Head>

      {/* ── HEADER ── */}
      <div style={{ background:'linear-gradient(135deg,#F3E8FF 0%,#FFE4EC 50%,#E8F5E9 100%)', borderBottom:`1px solid ${P.border}`, padding:'18px 28px 14px', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#C9A8D4,#F7C5D5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🏡</div>
            <div>
              <div style={{ fontSize:18, fontWeight:800, color:P.plum, fontFamily:"'DM Serif Display',serif" }}>STR Cribs Design Tracker</div>
              <div style={{ fontSize:11, color:P.muted }}>{projects.length} active projects · {allFlags.length} flagged · syncs every 10 min</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
            {!isAuthed
              ? <a href="/api/auth/login" style={{ background:'linear-gradient(135deg,#C9A8D4,#A8C8E8)', color:'#fff', borderRadius:20, padding:'8px 18px', fontSize:12, fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', gap:6 }}>🔐 Connect Gmail</a>
              : <div style={{ fontSize:11, color:P.green, fontWeight:600 }}>✓ Gmail connected</div>
            }
            <input placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding:'8px 14px', borderRadius:20, border:`1.5px solid ${P.border}`, background:P.card, fontSize:12, color:P.plum, outline:'none', width:180 }}/>
            <button onClick={runSync} disabled={syncing} style={{ padding:'8px 18px', borderRadius:20, background:syncing?P.border:'linear-gradient(135deg,#C9A8D4,#E8D5F5)', color:syncing?P.muted:P.plum, border:'none', fontSize:12, fontWeight:700, cursor:syncing?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ display:'inline-block', animation:syncing?'spin 1s linear infinite':'none' }}>⟳</span>
              {syncing ? 'Syncing…' : 'Sync Now'}
            </button>
            {showLog && <button onClick={() => setShowLog(false)} style={{ background:'none', border:'none', color:P.muted, cursor:'pointer', fontSize:12 }}>Hide log</button>}
          </div>
        </div>

        {/* Status filter pills */}
        <div style={{ display:'flex', gap:8, marginTop:14, flexWrap:'wrap' }}>
          <button onClick={() => setFilterStatus('all')} style={{ borderRadius:20, padding:'4px 12px', fontSize:11, fontWeight:700, border:'none', cursor:'pointer', background:filterStatus==='all'?P.lavender:P.border, color:filterStatus==='all'?'#fff':P.muted }}>All ({projects.length})</button>
          {STATUS_ORDER.map(s => {
            const cnt = projects.filter(p => p.status === s).length
            if (!cnt) return null
            const m = STATUS_META[s]
            return <button key={s} onClick={() => setFilterStatus(filterStatus===s?'all':s)} style={{ borderRadius:20, padding:'4px 12px', fontSize:11, fontWeight:700, border:`1.5px solid ${filterStatus===s?m.dot:'transparent'}`, cursor:'pointer', background:filterStatus===s?m.color:'rgba(255,255,255,0.6)', color:m.text, transition:'all 0.2s' }}>{m.icon} {s} ({cnt})</button>
          })}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding:'20px 28px' }}>
        {/* View tabs + designer filter */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.7)', borderRadius:12, padding:4, border:`1px solid ${P.border}` }}>
            {[['board','🗂 Board'],['designer','👤 By Designer'],['flags',`🚩 Flags${allFlags.length>0?` (${allFlags.length})`:''}`]].map(([v,l]) => (
              <button key={v} onClick={() => setView(v)} style={{ padding:'6px 14px', borderRadius:9, fontSize:12, fontWeight:700, border:'none', cursor:'pointer', background:view===v?P.lavender:'transparent', color:view===v?'#fff':P.muted, transition:'all 0.2s' }}>{l}</button>
            ))}
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            <button onClick={() => setFilterDesigner('all')} style={{ padding:'5px 12px', borderRadius:16, fontSize:11, fontWeight:700, border:'none', cursor:'pointer', background:filterDesigner==='all'?P.lavender:P.border, color:filterDesigner==='all'?'#fff':P.muted }}>All</button>
            {designers.map(d => {
              const c = DESIGNER_COLORS[d]
              return <button key={d} onClick={() => setFilterDesigner(filterDesigner===d?'all':d)} style={{ padding:'5px 12px', borderRadius:16, fontSize:11, fontWeight:700, border:'none', cursor:'pointer', background:filterDesigner===d?c.bg:P.border, color:filterDesigner===d?c.text:P.muted, outline:filterDesigner===d?`1.5px solid ${c.text}`:'none' }}>{d}</button>
            })}
          </div>
        </div>

        {/* Board view */}
        {view === 'board' && byStatus.map(({ status, meta: m, projects: sp, flagCount }) => (
          <div key={status} style={{ marginBottom:28 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:m.dot }}/>
              <span style={{ fontSize:13, fontWeight:800, color:P.plum }}>{status}</span>
              <span style={{ fontSize:11, color:P.muted }}>({sp.length})</span>
              {flagCount > 0 && <span style={{ fontSize:10, background:P.flagBg, color:P.flagText, borderRadius:8, padding:'2px 7px', fontWeight:700 }}>{flagCount} flagged</span>}
            </div>
            <div className="grid">{sp.map(p => <ProjectCard key={p.id} project={p} onClick={setSelected}/>)}</div>
          </div>
        ))}

        {/* Designer view */}
        {view === 'designer' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
            {designers.map(d => {
              const c = DESIGNER_COLORS[d]
              const dps = projects.filter(p => p.designer === d)
              const flags = dps.filter(p => p.flags.length > 0).length
              return (
                <div key={d} style={{ background:P.card, borderRadius:16, overflow:'hidden', border:`1.5px solid ${P.border}` }}>
                  <div style={{ background:`linear-gradient(135deg,${c.bg},${P.card})`, padding:'16px 18px', borderBottom:`1px solid ${P.border}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ fontSize:16, fontWeight:800, color:c.text }}>{d}</div>
                      <div style={{ display:'flex', gap:8 }}>
                        <span style={{ background:c.bg, color:c.text, borderRadius:10, padding:'3px 9px', fontSize:11, fontWeight:700 }}>{dps.length}</span>
                        {flags > 0 && <span style={{ background:P.flagBg, color:P.flagText, borderRadius:10, padding:'3px 9px', fontSize:11, fontWeight:700 }}>{flags} ⚠</span>}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
                      {STATUS_ORDER.map(s => { const cnt = dps.filter(p => p.status===s).length; if (!cnt) return null; const m = STATUS_META[s]; return <span key={s} style={{ fontSize:10, background:m.color, color:m.text, borderRadius:8, padding:'2px 7px', fontWeight:600 }}>{m.icon} {cnt}</span> })}
                    </div>
                  </div>
                  <div style={{ padding:'10px 14px', maxHeight:280, overflowY:'auto' }}>
                    {dps.filter(p => p.status==='In Design').map(p => (
                      <div key={p.id} onClick={() => setSelected(p)} style={{ padding:'8px 10px', borderRadius:10, marginBottom:6, cursor:'pointer', background:p.flags.length>0?P.flagBg:P.alt, border:`1px solid ${p.flags.length>0?P.pink:P.border}` }}>
                        <div style={{ fontSize:12, fontWeight:700, color:P.plum }}>{p.project}</div>
                        <div style={{ fontSize:10, color:p.fd_status?.includes('Approved')?P.green:p.fd_status?.includes('Revision')||p.fd_status?.includes('Extreme')?P.deepRose:P.muted, marginTop:2, fontWeight:600 }}>{p.fd_status||'—'}</div>
                        {p.flags.length>0 && <div style={{ fontSize:10, color:P.flagText, marginTop:2 }}>{p.flags[0]}</div>}
                      </div>
                    ))}
                    {dps.filter(p => p.status==='In Design').length === 0 && <div style={{ fontSize:12, color:P.muted, textAlign:'center', padding:'20px 0' }}>No active design projects</div>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Flags view */}
        {view === 'flags' && (
          allFlags.length === 0
            ? <div style={{ textAlign:'center', padding:'60px 0' }}><div style={{ fontSize:40, marginBottom:12 }}>🎉</div><div style={{ fontSize:16, fontWeight:700, color:P.plum }}>All clear — no flags!</div></div>
            : <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {allFlags.sort((a,b) => b.flags.length-a.flags.length).map(p => (
                  <div key={p.id} onClick={() => setSelected(p)} style={{ background:P.card, borderRadius:14, padding:'14px 18px', border:`1.5px solid ${P.pink}`, cursor:'pointer', display:'flex', gap:16, alignItems:'flex-start' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                        <span style={{ fontSize:14, fontWeight:800, color:P.plum }}>{p.project}</span>
                        <StatusBadge status={p.status}/><DesignerBadge name={p.designer}/>
                      </div>
                      <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:4 }}>
                        {p.flags.map((f,i) => <div key={i} style={{ fontSize:12, color:P.flagText, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}><span style={{ width:6, height:6, borderRadius:'50%', background:P.flagText, display:'inline-block', flexShrink:0 }}/>{f}</div>)}
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end', flexShrink:0 }}>
                      {p.rev_date && <span style={{ fontSize:10, color:P.muted }}>Rev: {fmtDate(p.rev_date)}</span>}
                      {p.pres_date && <span style={{ fontSize:10, color:P.muted }}>Pres: {fmtDate(p.pres_date)}</span>}
                      {p.approved_date && <span style={{ fontSize:10, color:P.green, fontWeight:600 }}>✓ {fmtDate(p.approved_date)}</span>}
                    </div>
                  </div>
                ))}
              </div>
        )}
      </div>

      {/* ── SYNC LOG PANEL ── */}
      {showLog && (
        <div style={{ position:'fixed', bottom:24, right:24, width:320, background:P.card, borderRadius:16, padding:16, border:`1.5px solid ${P.border}`, boxShadow:'0 8px 32px rgba(90,45,122,0.15)', zIndex:200 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <span style={{ fontSize:12, fontWeight:800, color:P.plum }}>⟳ Sync Log</span>
            <button onClick={() => setShowLog(false)} style={{ background:'none', border:'none', cursor:'pointer', color:P.muted, fontSize:16 }}>×</button>
          </div>
          <div style={{ maxHeight:160, overflowY:'auto', display:'flex', flexDirection:'column', gap:3 }}>
            {syncLog.map((l,i) => <div key={i} style={{ fontSize:11, color:P.plum, padding:'2px 0', borderBottom:`1px solid ${P.border}` }}>{l}</div>)}
            {syncLog.length === 0 && <div style={{ fontSize:11, color:P.muted }}>No activity yet</div>}
          </div>
        </div>
      )}

      {/* ── PROJECT MODAL ── */}
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} onSave={updated => { setProjects(ps => ps.map(p => p.id===updated.id?updated:p)); setSelected(updated) }}/>}
    </>
  )
}

export async function getServerSideProps({ req }) {
  const cookies = req.headers.cookie || ''
  const authed = cookies.includes('gat=') && !cookies.includes('gat=;')
  return { props: { authed } }
}
