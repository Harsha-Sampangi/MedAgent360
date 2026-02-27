"""
MedAgent 360 · FastAPI Backend (Phase 1 — All Modules Active)
All 3 modules wired: /analyze-lab, /parse-prescription, /checkin webhook
Run with: uvicorn main:app --reload
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tempfile
import os
from scripts.logger import get_logger
from scripts.config import config

logger = get_logger("medagent360.api")

app = FastAPI(
    title="MedAgent 360 API",
    description="Autonomous Healthcare AI Agent",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Lifecycle ─────────────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup():
    logger.info("MedAgent 360 API starting up...")
    # Init Module C database
    try:
        from followup.agent import init_database
        init_database()
        logger.info("✅ Module C database initialized")
    except Exception as e:
        logger.warning(f"DB init skipped: {e}")
    # Start scheduler
    try:
        from followup.agent import start_scheduler
        app.state.scheduler = start_scheduler()
        logger.info("✅ APScheduler started")
    except Exception as e:
        logger.warning(f"Scheduler skipped: {e}")


@app.on_event("shutdown")
async def shutdown():
    if hasattr(app.state, "scheduler"):
        app.state.scheduler.shutdown()


# ── Root & Health ─────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "project": "MedAgent 360",
        "version": "1.1.0",
        "modules": ["lab_report", "prescription", "followup"],
        "status": "running",
    }


@app.get("/health")
def health():
    missing = config.validate()
    return {
        "status": "ok" if not missing else "degraded",
        "missing_env_vars": missing,
    }


# ── Module A: Lab Report ──────────────────────────────────────────────────────

@app.post("/analyze-lab")
async def analyze_lab_report(
    file: UploadFile = File(...),
    language: str = Form(default="English"),
):
    """Upload a lab report PDF and get AI analysis."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        from lab_report.rag_pipeline import run_full_pipeline
        result = run_full_pipeline(tmp_path, language=language)
        return result
    except Exception as e:
        logger.error(f"Lab report analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


# ── Module B: Prescription Parser ─────────────────────────────────────────────

@app.post("/parse-prescription")
async def parse_prescription(
    file: UploadFile = File(...),
    language: str = Form(default="English"),
    patient_phone: str = Form(default=""),
    schedule_reminders: bool = Form(default=False),
):
    """Upload a prescription image and get structured medicine info."""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}:
        raise HTTPException(400, "Please upload an image file (JPG, PNG, etc.)")

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        from prescription.parser import run_prescription_pipeline
        result = run_prescription_pipeline(
            tmp_path,
            language=language,
            patient_phone=patient_phone,
            schedule=schedule_reminders,
        )
        # Remove local file paths from response
        for med in result.get("medicines", []):
            med.pop("audio_path", None)
        return result
    except Exception as e:
        logger.error(f"Prescription parse failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


# ── Module C: Follow-up Agent ─────────────────────────────────────────────────

@app.post("/checkin/webhook")
async def twilio_webhook(request: Request):
    """Twilio WhatsApp webhook endpoint for patient check-ins."""
    form = await request.form()
    patient_phone = form.get("From", "")
    body = form.get("Body", "")
    if not patient_phone or not body:
        return JSONResponse({"error": "Missing From or Body"}, status_code=400)
    try:
        from followup.agent import handle_patient_response
        result = handle_patient_response(patient_phone, body)
        return JSONResponse(result)
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(500, str(e))


@app.post("/checkin/enroll")
async def enroll_patient_endpoint(
    phone: str = Form(...),
    name: str = Form(default="Patient"),
    language: str = Form(default="English"),
    doctor_phone: str = Form(default=""),
):
    """Register a new patient for follow-up monitoring."""
    from followup.agent import enroll_patient
    return enroll_patient(phone, name, language, doctor_phone)


@app.post("/checkin/send")
async def manual_checkin(
    phone: str = Form(...),
    name: str = Form(default="Patient"),
    language: str = Form(default="English"),
):
    """Manually trigger a WhatsApp check-in message."""
    from followup.agent import send_checkin_message
    return send_checkin_message(phone, name, language)


@app.get("/checkin/recovery/{phone}")
async def get_recovery_timeline(phone: str, days: int = 14):
    """Fetch recovery timeline for a patient."""
    from followup.agent import get_recovery_timeline
    return {"phone": phone, "timeline": get_recovery_timeline(phone, days)}


@app.get("/checkin/alerts")
async def get_checkin_alerts():
    """Fetch doctor alert history from SQLite."""
    import sqlite3
    try:
        conn = sqlite3.connect(config.SQLITE_DB_PATH)
        rows = conn.execute(
            "SELECT * FROM doctor_alerts ORDER BY sent_at DESC LIMIT 20"
        ).fetchall()
        conn.close()
        cols = ["id", "patient_phone", "doctor_phone", "alert_message", "severity", "sent_at", "message_sid"]
        return [dict(zip(cols, r)) for r in rows]
    except Exception as e:
        logger.warning(f"Alert fetch failed: {e}")
        return []


# ── React Dashboard API ──────────────────────────────────────────────────────

@app.get("/api/dashboard")
def dashboard_stats():
    """Dashboard statistics for the React frontend."""
    return {
        "lab_count": 24,
        "rx_count": 4,
        "alert_count": 3,
        "recovery_day": 5,
    }


@app.get("/api/alerts")
def get_alerts():
    """Active alerts list for the React frontend."""
    return {
        "alerts": [
            {"type": "critical", "title": "High Blood Sugar Detected", "sub": "Lab result: 142 mg/dL", "time": "2h ago"},
            {"type": "warning", "title": "Missed Check-in", "sub": "Morning symptom check", "time": "5h ago"},
            {"type": "info", "title": "New Prescription Added", "sub": "Metformin 500mg", "time": "1d ago"},
        ]
    }


@app.get("/api/recovery")
def get_recovery():
    """Recovery progress data for the React frontend."""
    return {
        "current_day": 5,
        "total_days": 7,
        "vitals": {
            "pain": {"value": 6, "max": 10, "label": "6/10"},
            "energy": {"value": 4, "max": 10, "label": "Low"},
            "sleep": {"value": 6, "max": 10, "label": "6h"},
            "appetite": {"value": 8, "max": 10, "label": "Good"},
        },
        "history": [
            {"day": "Day 1", "text": "Resting, mild pain (6/10). All normal.", "ok": True},
            {"day": "Day 2", "text": "Appetite recovering. Pain reduced to 5/10.", "ok": True},
            {"day": "Day 3", "text": "Sleeping well. Energy improving.", "ok": True},
            {"day": "Day 4", "text": "Good recovery. Medication adherence 100%.", "ok": True},
            {"day": "Day 5 (Today)", "text": "Dizziness + headache reported. Doctor alerted.", "ok": False},
        ],
    }
