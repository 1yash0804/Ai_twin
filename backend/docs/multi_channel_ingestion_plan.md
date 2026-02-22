# Multi-Channel Ingestion & Intelligence Expansion Plan

This document maps your requested architecture to the current `Ai_twin` codebase and gives a concrete implementation path with **tenant isolation** and **confidence-scored AI outputs** as first-class requirements.

## 1) Current State Review (What you already have)

### Strengths already in code
- FastAPI backend with auth, chat, memories, tasks, and activity feed endpoints in `backend/main.py`.
- Telegram webhook endpoint already exists (`POST /webhook/telegram`) with async background task handling.
- Core extraction pipeline already exists via `extract_and_save()` and persists tasks/memories.
- Operational storage already exists with SQLModel tables: `Task`, `Memory`, and per-channel config (`UserChannelConfig`).

### Gaps vs your target architecture
- Ingestion is currently channel-specific (Telegram only), not a generalized ingestion gateway.
- No explicit unified queue contract (Redis/Kafka/SQS abstraction) for inbound messages.
- Intelligence stages are combined and implicit; no stage-by-stage pipeline boundary.
- No explicit follow-up tracker / reminder scheduler as first-class services.
- API layer exists, but analytics endpoints are minimal and not tied to message pipeline KPIs.
- Multi-tenant boundaries are not explicit across ingestion/pipeline/storage contracts.
- Commitment/deadline/task stages do not persist confidence scores.

## 2) Non-Negotiable Production Constraints

1. **Tenant isolation from day 1**
   - Every object and event must include:
     - `organization_id` (or `tenant_id`)
     - `user_id`
   - Queue topics/streams, DB queries, cache keys, and analytics must all be tenant-scoped.

2. **Confidence tracking for non-deterministic AI outputs**
   - Persist `confidence_score: float` for:
     - commitment detection
     - deadline inference
     - task extraction
   - Never treat LLM outputs as deterministic truth.

3. **WhatsApp integration constraints**
   - Support **WhatsApp Business API only**.
   - Design around **webhook-based inbound business conversations**.
   - Do **not** design around personal WhatsApp scraping.

## 3) Target Architecture Mapping

### A. Chat Platforms Layer
Add independent adapters that convert each provider payload into a single normalized schema:
- `whatsapp_business_adapter.py` (webhook inbound only)
- `slack_adapter.py`
- `telegram_adapter.py` (refactor current logic)
- `email_adapter.py`

All adapters should output one `NormalizedMessage` object.

### B. Ingestion Gateway
Create one gateway module with:
1. Webhook receiver
2. Signature/auth verification per platform
3. Rate limiting (Redis token bucket)
4. Message normalization
5. Tenant resolution (`organization_id`, `user_id`) before enqueue

Suggested module:
- `backend/app/ingestion/gateway.py`

### C. Unified Message Queue
Introduce queue producer/consumer interfaces so you can swap Redis Streams, Kafka, or SQS without changing business logic.

**Tenant-safe queueing:**
- Include `organization_id` + `user_id` in message envelope.
- Partition key should include tenant to prevent cross-tenant mixing.

Suggested modules:
- `backend/app/queue/contracts.py`
- `backend/app/queue/redis_streams.py`

### D. Intelligence Pipeline
Make each stage explicit and composable:
1. Commitment Detection (`confidence_score` required)
2. Deadline Inference (`confidence_score` required)
3. Task Extraction (`confidence_score` required)
4. Memory Extraction
5. Context Embedding
6. RAG Retrieval

Suggested modules:
- `backend/app/pipeline/stages.py`
- `backend/app/pipeline/runner.py`

### E. Operational Engine
Persist pipeline outputs in dedicated tables and services:
- Task Store (already exists; make tenant-scoped)
- Client Memory Store (already exists; make tenant-scoped)
- Follow-up Tracker (new table/service)
- Priority Scoring (new service)
- Reminder Scheduler (new Celery task)

### F. API Layer
Keep FastAPI as control plane:
- JWT auth already present
- Add dashboard + analytics endpoints for throughput, SLA, extraction precision, reminder completion
- Enforce tenant scoping at query layer for every endpoint

### G. Frontend UI
Your existing dashboard pages are a solid base. Add sections for:
- Ingestion health (by channel, by tenant)
- Pipeline outcomes (with confidence scores)
- Reminder queue and follow-up status

## 4) Suggested Data Contracts

## 4.1 Normalized Message
```python
from pydantic import BaseModel
from datetime import datetime
from typing import Any

class NormalizedMessage(BaseModel):
    organization_id: str
    user_id: str
    source: str  # telegram | whatsapp_business | slack | email
    external_message_id: str
    external_user_id: str
    external_chat_id: str | None = None
    text: str
    timestamp: datetime
    metadata: dict[str, Any] = {}
```

## 4.2 Pipeline Output
```python
class PipelineResult(BaseModel):
    organization_id: str
    user_id: str
    message_id: str

    commitment_detected: bool
    commitment_confidence_score: float

    inferred_deadline: str | None = None
    deadline_confidence_score: float | None = None

    extracted_tasks: list[dict] = []
    task_extraction_confidence_score: float

    extracted_memories: list[dict] = []
    embedding_refs: list[str] = []
    rag_context_refs: list[str] = []
    score_priority: float = 0.0
```

## 5) Concrete Implementation Plan (Phased)

### Phase 1 (Low risk, immediate)
1. Refactor current Telegram webhook into adapter + gateway flow.
2. Introduce `NormalizedMessage` contract and route Telegram through it.
3. Enforce `organization_id` + `user_id` in normalized payload before enqueue.
4. Add queue producer interface and push normalized messages to Redis Streams.
5. Add a queue worker to call existing extractor logic.

### Phase 2 (Intelligence decomposition)
1. Split extractor logic into explicit pipeline stages.
2. Add commitment/deadline stage before task extraction.
3. Persist `confidence_score` for commitment, deadline, and task extraction.
4. Store stage outputs for observability and debugging.

### Phase 3 (Operations)
1. Add FollowUp table and Reminder table.
2. Add Celery beat schedule for reminders.
3. Add priority scoring service.
4. Add tenant-scoped dashboards and analytics.

### Phase 4 (Channel expansion)
1. Add Slack adapter.
2. Add **WhatsApp Business API webhook adapter** (inbound business conversations only).
3. Add Email adapter (IMAP poller or webhook receiver).

## 6) Minimal Refactor You Should Do First

In `POST /webhook/telegram`, stop doing business logic directly in the route. Instead:
1. Parse and verify request.
2. Resolve tenant/user context.
3. Normalize payload.
4. Publish to queue.
5. Return 200 quickly.

Then queue workers perform AI + extraction + persistence.

This isolates provider instability from your core intelligence code.

## 7) Security, Reliability, and SaaS Isolation Checklist

- Verify provider signatures (Slack signing secret, WhatsApp X-Hub-Signature, Telegram token strategy).
- Idempotency key per inbound message (`organization_id + source + external_message_id`).
- Dead-letter queue for failed messages.
- Structured logs with trace IDs and tenant IDs.
- Rate limits per tenant/channel.
- Retry policy with exponential backoff.
- Row-level tenant filtering for every read/write path.
- Cache keys prefixed by tenant (`tenant:{organization_id}:...`).

## 8) DB Additions Recommended

Add these SQLModel tables (tenant-scoped):
- `InboundMessage` (`organization_id`, `user_id`, raw payload, normalized payload, status)
- `Commitment` (`organization_id`, `user_id`, `message_id`, `commitment_detected`, `confidence_score`, `subject`)
- `DeadlineInference` (`organization_id`, `user_id`, `message_id`, `inferred_deadline`, `confidence_score`)
- `ExtractedTask` (`organization_id`, `user_id`, `message_id`, task fields, `confidence_score`)
- `FollowUp` (`organization_id`, `user_id`, `task_id`, `next_follow_up_at`, `status`)
- `Reminder` (`organization_id`, `user_id`, `task_id`, `remind_at`, `channel`, `sent_at`)
- `PipelineRun` (`organization_id`, `user_id`, `message_id`, stage_durations, outcome)

These give you analytics and operational observability with minimal ambiguity.

## 9) KPI Endpoints to Add

- `GET /analytics/ingestion`: count by source, error rate, p95 latency (tenant-scoped)
- `GET /analytics/pipeline`: commitment/deadline/task confidence distributions and extraction yield
- `GET /analytics/reminders`: sent, snoozed, completed after reminder
- `GET /analytics/tasks`: overdue, due-soon, completion trend

## 10) Why this fits your existing codebase

- Reuses FastAPI + SQLModel + Celery stack already present.
- Keeps current `Memory`, `Task`, and dashboard endpoints usable during migration.
- Lets you add new channels without touching extraction/persistence internals.
- Supports both local and cloud LLM routing while scaling ingestion independently.
- Adds essential SaaS safeguards early: tenant isolation + confidence-aware AI output handling.
