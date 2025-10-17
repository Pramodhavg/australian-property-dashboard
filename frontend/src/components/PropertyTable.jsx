import React from "react"

export default function PropertyTable({ rows, selectedId, onSelect }) {
  return (
    <div style={{overflowX:'auto'}}>
      <table className="table">
        <thead>
          <tr>
            <th style={th}>Select</th>
            <th style={th}>Address</th>
            <th style={th}>Beds</th>
            <th style={th}>Baths</th>
            <th style={th}>Car</th>
            <th style={th}>Price (A$)</th>
            <th style={th}>Rent/wk (A$)</th>
            <th style={th}>Yield %</th>
            <th style={th}>DOM</th>
            <th style={th}>DOM Band</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr
              key={r.id}
              className={r.id===selectedId ? "row--active" : ""}
              onClick={() => onSelect && onSelect(r)}
              style={{cursor:"pointer"}}
            >
              <td style={{...td, width:72}} onClick={e=>e.stopPropagation()}>
                <input
                  type="radio"
                  name="propSelect"
                  checked={r.id===selectedId}
                  onChange={() => onSelect && onSelect(r)}
                  aria-label={`Select ${r.address}`}
                />
              </td>
              <td style={td}>{r.address}</td>
              <td style={td}>{r.bedrooms}</td>
              <td style={td}>{r.bathrooms}</td>
              <td style={td}>{r.car_spaces}</td>
              <td style={td}>{r.listed_price?.toLocaleString?.() ?? r.listed_price}</td>
              <td style={td}>{r.weekly_rent_estimate?.toLocaleString?.() ?? r.weekly_rent_estimate}</td>
              <td style={td}>{r.gross_yield_pct ?? '—'}</td>
              <td style={td}>{r.days_on_market ?? '—'}</td>
              <td style={td}>{r.dom_risk_band ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const th = { textAlign:'left', borderBottom:'1px solid #1f252d', padding:'8px' }
const td = { borderBottom:'1px solid #1f252d', padding:'8px' }