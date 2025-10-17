# Australian Property Micro-Dashboard 🏠

An interactive React + FastAPI dashboard visualising property yield and market speed,
with an AI Property Coach powered by OpenAI.

## Features
- FastAPI backend serving property mock data and AI advice
- React + Recharts frontend visualising yield and DOM distributions
- Dark-themed UI with property selection and AI-driven insights
- Modular structure (`backend` + `frontend` folders)

## Run locally
```bash
# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate  # or source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd ../frontend
npm install
npm run dev

