import React, { useState } from "react"

export default function ChatCoach({ selected }) {
  const [loading, setLoading] = useState(false)
  const [advice, setAdvice] = useState("")

  const selectedLine = selected
    ? `${selected.address} • ${selected.bedrooms}bd/${selected.bathrooms}ba • Yield ${selected.gross_yield_pct ?? 'n/a'}% • DOM ${selected.days_on_market ?? 'n/a'}`
    : "No property selected"

  async function ask() {
    if (!selected || loading) return
    setLoading(true); setAdvice("")
    try {
      const base = import.meta.env.VITE_API_BASE || "http://localhost:8000"
      const r = await fetch(`${base}/api/coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected)
      })
      const data = await r.json()
      setAdvice(data.advice || "No advice returned.")
    } catch(e) {
      setAdvice("Couldn’t get advice. Check backend.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>AI Property Coach</h3>
      <p className="muted" style={{marginTop:-6}}>Get a short, practical take on cash-flow vs resale risk.</p>

      <div className="muted" style={{margin:'10px 0 14px 0'}}>
        <small>Selected: {selectedLine}</small>
      </div>

      <button className="btn" disabled={!selected || loading} onClick={ask}>
        {loading ? "Thinking…" : (selected ? "Ask about selected property" : "Select a property in the table")}
      </button>

      {advice && <div style={{marginTop:12, lineHeight:1.45}}>{advice}</div>}
    </div>
  )
}