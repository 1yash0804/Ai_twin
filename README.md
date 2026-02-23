# AI Twin - End-to-End Full Stack Setup

This repo contains:
- `backend/` → FastAPI + JWT auth + OTP signup + extraction pipelines + Celery worker
- `frontend/` → Next.js app (signup/login/dashboard)
- `training_pipeline/` → ingestion/export utilities

## What I added in this integration pass
- ✅ Runtime readiness endpoint: `GET /setup/requirements`
- ✅ `.env.example` with all keys/services required
- ✅ `REDIS_URL` now centralized in Celery app config
- ✅ Backend dependency list updated to include missing packages for LLM/extraction stack
- ✅ `PINECONE_INDEX` now configurable from env

---

## 1) Required API keys / secrets / services

### Required to run core auth/chat backend
- `SECRET_KEY`
- `DATABASE_URL` (SQLite works locally)
- `GROQ_API_KEY` (for cloud/general model)

### Required for OTP email signup
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM` (optional but recommended)

### Required for extraction + document pipeline
- `REDIS_URL` (for Celery broker/backend)
- `PINECONE_API_KEY`
- `PINECONE_INDEX` (default: `aitwin`, expected dimension 384)

### Optional integrations
- `TELEGRAM_BOT_TOKEN` (webhook + auto-reply)
- Local Ollama runtime (for local model mode)

Use template:
```bash
cp backend/.env.example backend/.env
```

---

## 2) Install and run everything

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Celery worker (for extraction jobs)
```bash
cd backend
source .venv/bin/activate
celery -A app.core.celery_app worker --loglevel=info
```

### Redis (local)
```bash
docker run -d --name ai-twin-redis -p 6379:6379 redis:7
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:3000`
Backend URL: `http://localhost:8000`

---

## 3) Start extraction process (document ingestion)

1. Login from frontend to obtain JWT token.
2. Upload document through backend endpoint:
```bash
curl -X POST "http://localhost:8000/upload-doc/" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "file=@/path/to/file.pdf"
```
3. Celery worker will process the file and push embeddings to Pinecone.

---

## 4) Health + readiness checks

- Backend health:
```bash
curl http://localhost:8000/health
```

- Setup readiness (keys/services visibility):
```bash
curl http://localhost:8000/setup/requirements
```

---

## 5) Notes

- If SMTP is not configured, OTP email send will log OTP server-side for development.
- If `PINECONE_API_KEY` or index is missing, extraction endpoints may queue but ingestion will fail in worker logs.
- If `GROQ_API_KEY` is missing, general model calls fail; local mode needs Ollama running.
