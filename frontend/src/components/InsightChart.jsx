import React, { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

export default function InsightChart({ rows }) {
  const data = useMemo(() => {
    const buckets = { '<=3%':0, '3–4%':0, '4–5%':0, '5–6%':0, '6–7%':0, '>=7%':0 }
    rows.forEach(r => {
      const y = Number(r.gross_yield_pct)
      if (!y && y !== 0) return
      if (y <= 3) buckets['<=3%']++
      else if (y <= 4) buckets['3–4%']++
      else if (y <= 5) buckets['4–5%']++
      else if (y <= 6) buckets['5–6%']++
      else if (y <= 7) buckets['6–7%']++
      else buckets['>=7%']++
    })
    return Object.entries(buckets).map(([name, value]) => ({ name, value }))
  }, [rows])

  return (
    <div style={{width:'100%', height: 260}}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeOpacity={0.15} vertical={false}/>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#2AFFDF" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}