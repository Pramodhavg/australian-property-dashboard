const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export async function fetchProperties() {
  try {
    const r = await fetch(`${BASE}/api/properties`)
    return await r.json()
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function fetchSummary() {
  try {
    const r = await fetch(`${BASE}/api/insights/summary`)
    return await r.json()
  } catch (e) {
    console.error(e)
    return null
  }
}