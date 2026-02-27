# AI Twin

AI Twin is a full-stack assistant platform with:
- **FastAPI backend** for auth, chat, memory, tasks, channel ingestion, and document processing.
- **Next.js frontend** for marketing pages, auth flows, and user dashboard.
- **Training utilities** for data ingest/export.

It is built to evolve into a multi-channel AI copilot (Telegram now, extensible to WhatsApp/Slack/email) with confidence-aware extraction and operational visibility.

---

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Repository Structure](#repository-structure)
- [Core Features](#core-features)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Quick Start (Local)](#quick-start-local)
- [Telegram Webhook Setup](#telegram-webhook-setup)
- [Document Ingestion Flow](#document-ingestion-flow)
- [Frontend Notes](#frontend-notes)
- [Data Model Summary](#data-model-summary)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Roadmap Context](#roadmap-context)

---

## Architecture Overview

### Backend (`backend/`)
- FastAPI app entrypoint: `backend/main.py`
- SQLModel-based persistence (`backend/app/models.py`, `backend/app/database.py`)
- JWT auth + OTP flows
- Chat endpoint with intent classification, context building, and response caching
- Telegram webhook normalization + pipeline processing
- Celery-backed async document extraction workflow

### Frontend (`frontend/`)
- Next.js App Router app with:
  - marketing pages
  - login/signup flows
  - authenticated dashboard sections (stats, tasks, memory, activity, telegram)
- Typed API client in `frontend/src/lib/api.ts`

### Pipeline / Ingestion
- Message normalization contract in `backend/app/pipeline/contracts.py`
- Pipeline processing in `backend/app/pipeline/runner.py`
- Telegram normalization gateway in `backend/app/ingestion/gateway.py`

---

## Repository Structure

```text
Ai_twin/
├── README.md
├── PROJECT_HANDOFF_PROMPT.md
├── backend/
│   ├── main.py
│   ├── .env.example
│   ├── requirements.txt
│   ├── docs/
│   │   ├── telegram_webhook.md
│   │   └── multi_channel_ingestion_plan.md
│   └── app/
│       ├── models.py
│       ├── database.py
│       ├── tasks.py
│       ├── core/
│       ├── ingestion/gateway.py
│       ├── pipeline/
│       ├── queue/
│       └── services/
├── frontend/
│   ├── package.json
│   └── src/
│       ├── app/
│       ├── components/
│       └── lib/
└── training_pipeline/
    ├── unified_ingest.py
    └── export.py
```

---

## Core Features

- **Auth**
  - Legacy direct signup/login
  - OTP-based signup and login verification
- **Chat**
  - Authenticated assistant chat endpoint
  - Intent classification + response cache + memory context
- **User data surfaces**
  - Task list + manual task creation
  - Memory list
  - Unified activity feed
  - Personal stats
- **LoRA metadata endpoints**
  - View/schedule per-user adapter status
- **Channel controls**
  - Auto-reply configuration per channel
- **Telegram integration**
  - Signed webhook endpoint
  - Inbound normalization + pipeline persistence
  - Telegram overview endpoint for dashboard consumption
- **Document ingestion**
  - Upload endpoint queues Celery processing task

---

## API Reference

Base URL (local): `http://localhost:8000`

### Public / Infra
- `GET /health`
- `GET /setup/requirements`

### Auth
- `POST /users/` (legacy direct signup)
- `POST /token` (legacy password login)
- `POST /auth/request-signup-otp`
- `POST /auth/verify-signup-otp`
- `POST /auth/request-login-otp`
- `POST /auth/verify-login-otp`

### Core AI
- `POST /chat/` *(JWT required)*

### Dashboard / User
- `GET /me/stats` *(JWT required)*
- `GET /me/lora` *(JWT required)*
- `POST /me/lora/schedule` *(JWT required)*
- `GET /me/auto-reply` *(JWT required)*
- `POST /me/auto-reply` *(JWT required)*
- `GET /me/memories` *(JWT required)*
- `GET /me/tasks` *(JWT required)*
- `POST /me/tasks` *(JWT required)*
- `GET /me/activities` *(JWT required)*
- `GET /me/telegram/overview` *(JWT required)*

### Ingestion / Channels
- `POST /webhook/telegram` *(requires `X-Telegram-Bot-Api-Secret-Token` header)*

### Documents
- `POST /upload-doc/` *(JWT required; async processing)*

---

## Environment Variables

Start by copying:

```bash
cp backend/.env.example backend/.env
```

### Core backend
- `SECRET_KEY`
- `DATABASE_URL` (SQLite works for local)
- `CORS_ALLOW_ORIGINS`

### LLM / extraction
- `GROQ_API_KEY`
- `REDIS_URL`
- `PINECONE_API_KEY`
- `PINECONE_INDEX`

### OTP email
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`

### Telegram / pipeline context (optional but needed for webhook flows)
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`
- `TELEGRAM_BOT_USERNAME`
- `ENABLE_TELEGRAM_POLLING`
- `DEFAULT_PIPELINE_USER_ID`
- `DEFAULT_ORGANIZATION_ID`

---

## Quick Start (Local)

### 1) Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2) Redis (for Celery)

```bash
docker run -d --name ai-twin-redis -p 6379:6379 redis:7
```

### 3) Celery worker

```bash
cd backend
source .venv/bin/activate
celery -A app.core.celery_app worker --loglevel=info
```

### 4) Frontend

```bash
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

---

## Telegram Webhook Setup

Detailed guide: `backend/docs/telegram_webhook.md`

Typical flow:
1. Run backend on port 8000.
2. Expose using ngrok or deploy behind HTTPS.
3. Register webhook URL with Telegram Bot API.
4. Send webhook secret token and ensure backend checks header.

---

## Document Ingestion Flow

1. Authenticate to obtain JWT.
2. Upload a document to `/upload-doc/`.
3. Backend queues a Celery task.
4. Worker processes extraction + embedding pipeline.

Example:

```bash
curl -X POST "http://localhost:8000/upload-doc/" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "file=@/path/to/file.pdf"
```

---

## Frontend Notes

- Frontend API client lives in: `frontend/src/lib/api.ts`
- `NEXT_PUBLIC_API_BASE_URL` defaults to `http://localhost:8000`
- OTP auth flows are already implemented in client helpers:
  - request signup/login OTP
  - verify signup/login OTP

---

## Data Model Summary

Primary SQLModel entities in `backend/app/models.py`:

- `User`
- `Memory`
- `Task`
- `DocumentLog`
- `UserLoraAdapter`
- `UserChannelConfig`
- Pipeline observability entities:
  - `InboundMessage`
  - `Commitment`
  - `DeadlineInference`
  - `ExtractedTaskRecord`
  - `PipelineRun`

---

## Development Workflow

### Useful checks

```bash
# Backend health
curl http://localhost:8000/health

# Runtime readiness
curl http://localhost:8000/setup/requirements
```

### Endpoint smoke script

```bash
cd backend
python test_endpoints.py
```

---

## Troubleshooting

- **OTP emails fail to send**
  - Verify SMTP variables.
  - If SMTP is missing/misconfigured, OTP endpoints will fail with a server-side message.

- **Upload works but processing is stuck**
  - Ensure Redis is running.
  - Ensure Celery worker is running and using the same `REDIS_URL`.

- **Telegram webhook returns unauthorized**
  - Validate `TELEGRAM_WEBHOOK_SECRET` and the incoming header value.

- **Chat/model errors**
  - Confirm `GROQ_API_KEY` is set.

---

## Roadmap Context

See `backend/docs/multi_channel_ingestion_plan.md` for the expansion plan toward:
- stronger tenant isolation patterns,
- confidence-aware pipeline stages,
- additional channels (WhatsApp Business API, Slack, Email),
- richer analytics and reminder/follow-up operations.
