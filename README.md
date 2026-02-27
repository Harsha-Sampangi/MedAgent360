# MedAgent 360 🏥
### Autonomous Healthcare AI Agent

> *650 million Indians in rural areas cannot understand their medical reports.*
> *MedAgent 360 is their AI healthcare companion — reading, explaining, and following up in their own language.*

![Python](https://img.shields.io/badge/Python-3.10+-blue) ![Gemini](https://img.shields.io/badge/LLM-Gemini-orange) ![React](https://img.shields.io/badge/UI-React+Vite-61DAFB) ![FastAPI](https://img.shields.io/badge/API-FastAPI-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 💡 Solution Overview

MedAgent 360 is a unified, end-to-end autonomous AI agent with three modules:

**🔬 Module A — Lab Report Intelligence**
Reads a PDF blood report → extracts all test values → compares against medical benchmarks using RAG → classifies each as NORMAL / HIGH / LOW / CRITICAL → generates a plain-language summary in Telugu, Hindi, or English → plays it as audio.

**💊 Module B — Prescription Parser**
Accepts a prescription photo (printed or handwritten) → preprocesses with OpenCV (grayscale, denoise, deskew) → runs Tesseract OCR → uses Gemini to identify medicine names, dosage, frequency, duration → translates instructions to Telugu/Hindi → generates per-medicine voice audio → schedules WhatsApp medication reminders.

**📞 Module C — Autonomous Follow-up Agent**
Enrolls patients → sends scheduled WhatsApp check-ins at 8 AM via Twilio → receives patient replies → runs Gemini triage (NORMAL / CONCERNING / CRITICAL) → fires immediate SMS/WhatsApp alert to doctor if critical → logs daily recovery data for tracking.

---

## 🏗️ Architecture

```
Patient PDF / Image / WhatsApp
         │
         ▼
┌─────────────────────────────────────┐
│         FastAPI Backend             │
│   /analyze-lab  /parse-prescription │
│   /checkin/webhook  /checkin/enroll │
└───────────┬─────────────────────────┘
            │
    ┌───────┼───────┐
    ▼       ▼       ▼
  Lab    Prescr.  Followup
  Report  Parser   Agent
  (A)     (B)      (C)
    │       │       │
    └───────┴───────┘
            │
     ChromaDB + SQLite
            │
     Gemini Flash LLM
            │
     React + Vite Frontend
```

**Agent Flow:**
- Module A: PDF → PDFPlumber → ChromaDB RAG → Gemini classify → gTTS audio
- Module B: Image → OpenCV → Tesseract OCR → Gemini parse → Translation → gTTS → APScheduler
- Module C: APScheduler → Twilio WhatsApp → patient reply → Gemini triage → doctor alert → SQLite recovery log

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| LLM | Google Gemini Flash | Classification, summarisation, triage, translation |
| Orchestration | LangChain | Agent chains, prompt management |
| RAG | ChromaDB + sentence-transformers (all-MiniLM-L6-v2) | Medical benchmark vector store |
| PDF Parsing | PDFPlumber + Pandas | Structured table + text extraction |
| OCR | Tesseract + pytesseract | Prescription image text extraction |
| Image Processing | OpenCV + Pillow | Grayscale, denoise, deskew, binarize |
| Translation | Gemini (IndicTrans2 upgrade path) | Telugu / Hindi instruction translation |
| Voice | gTTS | MP3 audio from summaries and instructions |
| Messaging | Twilio API | WhatsApp check-ins + SMS doctor alerts |
| Scheduling | APScheduler | Daily 8 AM autonomous check-in jobs |
| Backend | FastAPI + Uvicorn | REST API layer |
| Frontend | React 18 + Vite | Modern single-page application UI |
| Database | SQLite | Patient records, alerts, recovery timeline |
| Tunnel | ngrok | Expose Twilio webhook in dev environment |

---



## 🚀 Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- Google Gemini API key (from [Google AI Studio](https://aistudio.google.com))
- Twilio account (for Module C WhatsApp features — optional)
- Tesseract OCR installed on system

### 1. Clone the repository
```bash
git clone https://github.com/harinithangellapalli/MedAgent360.git
cd MedAgent360
```

### 2. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 3. Install Tesseract OCR (for Module B)
```bash
# Ubuntu / Debian
sudo apt-get install tesseract-ocr tesseract-ocr-hin tesseract-ocr-tel

# macOS
brew install tesseract

# Windows — Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
```

### 4. Configure environment variables
```bash
cp .env.example .env
# Open .env and fill in:
#   GOOGLE_API_KEY      → your Gemini API key (required)
#   TWILIO_ACCOUNT_SID  → from Twilio console (optional)
#   TWILIO_AUTH_TOKEN   → from Twilio console (optional)
#   DOCTOR_PHONE        → doctor's WhatsApp number (optional)
```

### 5. Install React frontend dependencies
```bash
cd medagent-ui
npm install
cd ..
```

### 6. Start the FastAPI backend
```bash
uvicorn main:app --reload --port 8000
# API docs available at: http://localhost:8000/docs
```

### 7. Start the React frontend
```bash
cd medagent-ui
npm run dev
# Frontend opens at: http://localhost:5173
```

### 8. (Optional) Start ngrok for Twilio webhook
```bash
ngrok http 8000
# Copy the https URL → set as NGROK_TUNNEL_URL in .env
# Add <ngrok_url>/checkin/webhook as Twilio WhatsApp webhook
```

---

## 📁 Project Structure

```
MedAgent360/
│
├── lab_report/                    # Module A — Lab Report Intelligence
│   ├── pdf_parser.py              # Multi-strategy PDF extraction (table + text fallback)
│   ├── vector_store.py            # ChromaDB with 30+ medical benchmarks
│   ├── rag_pipeline.py            # RAG classification + Gemini multilingual summary
│   ├── voice.py                   # gTTS audio generator (EN/Telugu/Hindi)
│   └── data/                      # ChromaDB + sample reports
│
├── prescription/                  # Module B — Prescription Parser
│   ├── image_processor.py         # OpenCV preprocessing (deskew, denoise, binarize)
│   ├── ocr_engine.py              # Tesseract OCR with auto printed/handwritten detection
│   └── parser.py                  # Gemini extraction + translation + gTTS + reminders
│
├── followup/                      # Module C — Autonomous Follow-up Agent
│   └── agent.py                   # Full autonomous loop: enroll→checkin→triage→alert→track
│
├── medagent-ui/                   # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx                # Root — routing
│   │   ├── main.jsx               # Vite entry point
│   │   ├── styles/globals.css     # Design system
│   │   ├── utils/
│   │   │   ├── lang.js            # Translations (EN/TE/HI)
│   │   │   └── api.js             # FastAPI client
│   │   ├── components/
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   ├── Topbar.jsx         # Page header
│   │   │   └── UI.jsx             # Reusable UI primitives
│   │   └── pages/
│   │       ├── Dashboard.jsx      # Home — stat cards + summaries
│   │       ├── LabReport.jsx      # PDF upload + AI analysis
│   │       ├── Prescription.jsx   # Image upload + OCR results
│   │       ├── FollowUp.jsx       # Chat + agent settings + enrollment
│   │       ├── Alerts.jsx         # Active alert list
│   │       └── Recovery.jsx       # Day-by-day progress + vitals
│   └── package.json
│
├── scripts/
│   ├── config.py                  # Typed environment config loader
│   ├── logger.py                  # Shared structured logger
│   └── smoke_test.py              # Setup verification
│
├── main.py                        # FastAPI backend — all endpoints
├── requirements.txt               # Pinned Python dependencies
├── .env.example                   # Environment variable template
└── README.md
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Project info and status |
| GET | `/health` | Check API status and missing env vars |
| POST | `/analyze-lab` | Upload lab report PDF → get AI analysis |
| POST | `/parse-prescription` | Upload prescription image → get medicines |
| POST | `/checkin/enroll` | Register patient for follow-up monitoring |
| POST | `/checkin/send` | Manually trigger a WhatsApp check-in |
| POST | `/checkin/webhook` | Twilio inbound webhook (patient replies) |
| GET | `/checkin/recovery/{phone}` | Get patient recovery timeline |
| GET | `/checkin/alerts` | List all doctor alerts sent |
| GET | `/api/dashboard` | Dashboard statistics |
| GET | `/api/alerts` | Active alerts for frontend |
| GET | `/api/recovery` | Recovery progress data |

---

## 🎬 Demo Scenarios

**Demo 1 — Lab Report:** Upload a lab report PDF → select Telugu → click Analyze → see color-coded results table + AI summary.

**Demo 2 — Prescription:** Upload prescription photo → select Hindi → see parsed medicine cards with translated instructions.

**Demo 3 — Follow-up:** Go to Follow-up Agent → Click Trigger Check-in → Enroll a patient → Monitor recovery on the Recovery page.

---

## ⚠️ Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| Gemini API rate limits | Fall back to `gemini-1.5-flash` if quota exceeded |
| Tesseract low accuracy on handwriting | Auto-fallback to handwritten mode; multiple pre-tested images ready |
| Twilio sandbox not approved | App works fully without Twilio in demo mode |
| React build issues | Vite dev server with HMR provides instant feedback |

---

## 📊 Impact

- **650 million** rural Indians targeted
- **3 modules** in one unified agent
- **3 languages** supported: English, Telugu, Hindi
- **Modern React UI** with real-time API integration


