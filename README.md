Australian Property Micro-Dashboard:
An interactive full-stack web application built with React and FastAPI to visualise Australian residential property data.
It analyses property yield, market liquidity, and provides AI-generated investment advice through an integrated OpenAI API.

Overview:
This project demonstrates an interface for exploring real estate performance metrics through a clean, data-driven dashboard.
It connects a mock or sandboxed API to calculate gross rental yield, categorises properties by time-on-market, and uses a simple AI assistant to interpret trade-offs between cash flow and resale potential.

Key capabilities:
-> Visualises gross rental yield and days-on-market using charts and summary statistics.
-> Allows users to select individual properties and receive AI-generated advice.
-> Features a dark-theme interface optimised for clarity and engagement.
-> Built as a modular, production-ready example of data-to-insight conversion.

Architecture:
australian-property/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── services/
│       └── real_estate_api.py
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── theme.css
│       ├── services/
│       │   └── api.js
│       └── components/
│           ├── PropertyTable.jsx
│           ├── InsightChart.jsx
│           └── ChatCoach.jsx
│
└── README.md

Technology Stack:
| Layer       | Technologies                          |
| ----------- | ------------------------------------- |
| Frontend    | React, Vite, Recharts, Tailwind CSS   |
| Backend     | FastAPI, Uvicorn                      |
| AI Engine   | OpenAI GPT-4o-mini                    |
| Data        | Mock JSON dataset (sample properties) |
| Environment | Node.js 18+, Python 3.10+             |

Setup and Run Instructions:
Backend:
cd backend
python -m venv .venv
# Activate the virtual environment
.venv\Scripts\activate   # Windows
source .venv/bin/activate # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

Frontend:
cd ../frontend
npm install
npm run dev

Then open the browser at:
http://localhost:5173

How It Works:
1. The backend (FastAPI) serves a set of sample property listings with attributes such as price, rent, and days on market.
2. Yield is calculated as:
    (weekly_rent_estimate * 52) / listed_price * 100
3. DOM (Days on Market) is classified as Fast, Average, or Slow to represent market liquidity.
4. The frontend visualises this data using Recharts and a custom React table.
5. When a user selects a property, details are passed to an OpenAI API endpoint (/ai/advice) which generates a concise insight such as “Low yield, strong family demand potential."

Example Output:
| Address                     | Yield | DOM | Band    | AI Insight                                           |
| --------------------------- | ----- | --- | ------- | ---------------------------------------------------- |
| 12 Smith St, Richmond VIC   | 3.54% | 21  | Average | Balanced yield with moderate liquidity.              |
| 8 George St, Parramatta NSW | 4.33% | 55  | Slow    | Higher yield; longer resale cycle expected.          |
| 5 Jones Ave, Carindale QLD  | 4.12% | 33  | Average | Low gross yield; suitable for growth-focused buyers. |

Environtmental Variables:
Create a .env file in the backend directory:
OPENAI_API_KEY=your_openai_api_key_here
Alternatively, rename .env.example to .env and update your credentials.

Learnings and Design Notes:
-> Built iteratively from a static mock into a dynamic full-stack interface.
-> Combined conventional analytics (yield, DOM) with AI-driven qualitative commentary.
-> Focused on lightweight, modular design for rapid experimentation.
-> Validated asynchronous communication between React and FastAPI for real-time AI responses.

Future Enhancements:
-> Integrate live market data APIs (e.g. CoreLogic, REA Group).
-> Implement suburb filters and interactive heat maps.
-> Extend AI assistant to compare properties and suggest portfolio mixes.
-> Export reports and investor summaries as PDFs.
-> Add authentication and user preferences.

Known Limitations:
-> Current data is static and limited to mock examples.
-> Chart scaling is fixed for sample ranges.
-> AI advice depends on model context rather than real market history.

Tagline:
“Know your yield before you bid — actionable property insights powered by AI.”
