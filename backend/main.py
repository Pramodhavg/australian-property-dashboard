import os
from typing import List, Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.real_estate_api import RealEstateAPI

# Optional OpenAI client (used if OPENAI_API_KEY exists)
try:
    from openai import OpenAI
except Exception:
    OpenAI = None

app = FastAPI(title='Australian Property Micro-Dashboard', version='0.2.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

api = RealEstateAPI()

class PropertyOut(BaseModel):
    id: str
    address: str
    bedrooms: int
    bathrooms: int
    car_spaces: int
    listed_price: float
    weekly_rent_estimate: float
    suburb: str
    state: str
    days_on_market: Optional[int] = None
    gross_yield_pct: Optional[float] = None
    dom_risk_band: Optional[str] = None

def compute_gross_yield(weekly_rent: Optional[float], listed_price: Optional[float]) -> Optional[float]:
    if not weekly_rent or not listed_price or listed_price <= 0:
        return None
    annual_rent = weekly_rent * 52.0
    return round((annual_rent / listed_price) * 100.0, 2)

def dom_band(days_on_market: Optional[int]) -> Optional[str]:
    if days_on_market is None:
        return None
    if days_on_market < 21:
        return 'Fast'
    if days_on_market <= 45:
        return 'Average'
    return 'Slow'

@app.get('/api/health')
async def health():
    return {'ok': True}

@app.get('/api/properties', response_model=List[PropertyOut])
async def properties(suburb: Optional[str] = Query(None), state: Optional[str] = Query(None)):
    rows = await api.list_properties(suburb=suburb, state=state)
    enriched = []
    for r in rows:
        r = dict(r)
        r['gross_yield_pct'] = compute_gross_yield(r.get('weekly_rent_estimate'), r.get('listed_price'))
        r['dom_risk_band'] = dom_band(r.get('days_on_market'))
        enriched.append(r)
    return enriched

@app.get('/api/insights/summary')
async def insights_summary(suburb: Optional[str] = Query(None), state: Optional[str] = Query(None)):
    rows = await api.list_properties(suburb=suburb, state=state)
    yields = []
    doms = {'Fast': 0, 'Average': 0, 'Slow': 0}
    for r in rows:
        y = compute_gross_yield(r.get('weekly_rent_estimate'), r.get('listed_price'))
        if y is not None:
            yields.append(y)
        band = dom_band(r.get('days_on_market'))
        if band:
            doms[band] += 1
    out = {
        'count': len(rows),
        'yield_avg': round(sum(yields) / len(yields), 2) if yields else None,
        'yield_p25': round(sorted(yields)[max(0, int(0.25*len(yields))-1)], 2) if yields else None,
        'yield_p75': round(sorted(yields)[min(len(yields)-1, int(0.75*len(yields)) )], 2) if yields else None,
        'dom_mix': doms
    }
    return out

# -------- AI COACH --------
class CoachRequest(BaseModel):
    address: str
    bedrooms: int
    bathrooms: int
    car_spaces: int
    listed_price: float
    weekly_rent_estimate: float
    suburb: str
    state: str
    days_on_market: Optional[int] = None
    gross_yield_pct: Optional[float] = None
    dom_risk_band: Optional[str] = None

def heuristic_advice(p: dict) -> str:
    y = p.get("gross_yield_pct") or 0
    dom = (p.get("dom_risk_band") or "Unknown").lower()
    notes = []
    if y >= 5.5:
        notes.append("Strong cash flow (gross yield ≥ 5.5%).")
    elif y >= 4.5:
        notes.append("Balanced yield; negotiate or uplift rent via minor works.")
    else:
        notes.append("Low gross yield; growth story must justify entry.")
    if dom == "fast":
        notes.append("Liquid market; lower resale risk.")
    elif dom == "slow":
        notes.append("Slower resale; price in longer selling time.")
    if p.get("bedrooms", 0) >= 3 and p.get("car_spaces", 0) >= 2:
        notes.append("Family spec; check school catchments for demand uplift.")
    return " ".join(notes)

@app.post("/api/coach")
async def coach(req: CoachRequest):
    advice = heuristic_advice(req.model_dump())
    key = os.getenv("OPENAI_API_KEY")
    if OpenAI and key:
        try:
            client = OpenAI(api_key=key)
            prompt = (
                "You are an Australian property investment coach. "
                "Give a short, practical recommendation (max 80 words) in plain English. "
                "Focus on cash flow (gross yield) vs resale/liquidity (DOM band) and any quick checks.\n\n"
                f"PROPERTY:\n{req.model_dump()}\n\n"
                f"Heuristic summary: {advice}\n\n"
                "Now produce your final advice:"
            )
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
            )
            advice = resp.choices[0].message.content.strip()
        except Exception:
            pass
    return {"advice": advice}