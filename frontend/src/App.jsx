import React, { useEffect, useState } from "react"
import { fetchProperties, fetchSummary } from "./services/api.js"
import PropertyTable from "./components/PropertyTable.jsx"
import InsightChart from "./components/InsightChart.jsx"
import ChatCoach from "./components/ChatCoach.jsx"

export default function App() {
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    (async () => {
      const data = await fetchProperties()
      setRows(data || [])
      if ((data || []).length && !selected) setSelected(data[0])   // auto-select first row
      const s = await fetchSummary()
      setSummary(s || null)
    })()
  }, [])

  return (
    <div style={{padding:'28px', maxWidth: 1200, margin:'0 auto'}}>
      <div className="h1">Australian Property Micro-Dashboard</div>
      <p className="muted">Mock or sandbox-backed. Shows gross rental yield and time-on-market banding.</p>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'24px', marginTop: 24}}>
        <div className="card" style={{gridColumn:'span 2'}}>
          <h3 style={{marginTop:0}}>Yield Distribution</h3>
          <InsightChart rows={rows} />
        </div>
        <div className="card">
          <h3 style={{marginTop:0}}>Summary</h3>
          {summary ? (
            <ul>
              <li><strong>Properties:</strong> {summary.count}</li>
              <li><strong>Avg Yield:</strong> {summary.yield_avg ?? 'n/a'}%</li>
              <li><strong>25th–75th pct:</strong> {summary.yield_p25 ?? 'n/a'}% – {summary.yield_p75 ?? 'n/a'}%</li>
              <li><strong>DOM mix:</strong> Fast {summary.dom_mix.Fast}, Avg {summary.dom_mix.Average}, Slow {summary.dom_mix.Slow}</li>
            </ul>
          ) : <p>Loading…</p>}
        </div>
        <ChatCoach selected={selected} />
      </div>

      <div className="card" style={{marginTop:24}}>
        <h3 style={{marginTop:0}}>Properties</h3>
        <PropertyTable rows={rows} selectedId={selected?.id} onSelect={setSelected} />
      </div>
    </div>
  )
}