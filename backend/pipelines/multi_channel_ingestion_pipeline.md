# Multi-Channel Ingestion Pipeline (Execution Blueprint)

This is a **pipeline-oriented companion** to `backend/docs/multi_channel_ingestion_plan.md`.
It translates the architecture plan into runnable stages with contracts, checkpoints, and failure handling.

## 0. Scope & Guardrails

- Tenant-safe by default: every stage requires `organization_id` (or `tenant_id`) + `user_id`.
- Confidence-aware AI by default: store `confidence_score: float` for commitment, deadline, and task extraction.
- Channel scope includes:
  - Telegram Bot API
  - Slack Events API
  - WhatsApp **Business API inbound webhook** (no personal WhatsApp scraping)
  - Email webhook/IMAP connector

---

## 1. Pipeline Stages

## Stage A — Inbound Receive
**Input:** raw provider webhook payload  
**Output:** `InboundEnvelope`

Required fields:
- `organization_id`
- `user_id`
- `source`
- `received_at`
- `raw_payload`

Checks:
- Verify source signature/token.
- Resolve tenant/user mapping before processing.
- Reject if tenant context missing.

Failure route:
- `invalid_signature`
- `tenant_resolution_failed`

---

## Stage B — Normalize
**Input:** `InboundEnvelope`  
**Output:** `NormalizedMessage`

```python
class NormalizedMessage:
    organization_id: str
    user_id: str
    source: str  # telegram | slack | whatsapp_business | email
    external_message_id: str
    external_user_id: str
    external_chat_id: str | None
    text: str
    timestamp: str
    metadata: dict
```

Checks:
- Required text/content exists.
- Create idempotency key: `organization_id:source:external_message_id`.
- Drop duplicates.

Failure route:
- `normalization_error`
- `duplicate_message`

---

## Stage C — Queue Publish
**Input:** `NormalizedMessage`  
**Output:** queued event id

Queue rules:
- Partition key includes `organization_id`.
- Event payload includes tenant fields in root object.
- Retry with backoff for transient broker failures.

Failure route:
- `queue_publish_failed` -> dead-letter queue

---

## Stage D — Intelligence Pipeline Worker
**Input:** queued `NormalizedMessage`  
**Output:** `PipelineResult`

Sub-stages:
1. Commitment Detection
2. Deadline Inference
3. Task Extraction
4. Memory Extraction
5. Context Embedding
6. RAG Retrieval (optional for response generation)

```python
class PipelineResult:
    organization_id: str
    user_id: str
    message_id: str

    commitment_detected: bool
    commitment_confidence_score: float

    inferred_deadline: str | None
    deadline_confidence_score: float | None

    extracted_tasks: list[dict]
    task_extraction_confidence_score: float

    extracted_memories: list[dict]
    score_priority: float
```

Checks:
- Confidence scores must be in `[0.0, 1.0]`.
- If confidence below threshold, mark as `needs_review` instead of auto-commit.

Failure route:
- `llm_timeout`
- `stage_parse_error`

---

## Stage E — Operational Persistence
**Input:** `PipelineResult`  
**Output:** persisted DB rows

Persist (tenant-scoped):
- `InboundMessage`
- `Commitment` (`confidence_score`)
- `DeadlineInference` (`confidence_score`)
- `ExtractedTask` (`confidence_score`)
- `Memory`
- `PipelineRun`

Checks:
- Row-level tenant isolation on read/write.
- Never write rows missing `organization_id` and `user_id`.

Failure route:
- `db_write_failed`

---

## Stage F — Follow-up & Reminder Scheduling
**Input:** persisted extracted tasks + deadlines  
**Output:** reminder jobs

Rules:
- Create `FollowUp` and `Reminder` rows tenant-scoped.
- Schedule via Celery Beat / queue scheduler.
- Respect channel opt-in and tenant/channel rate limits.

Failure route:
- `scheduler_error`

---

## 2. Observability / Analytics

Track per tenant:
- Ingestion volume by source
- p95 stage latency
- Error rate by stage
- Confidence distribution (commitment/deadline/task)
- Reminder sent/completed conversion

Recommended endpoints:
- `GET /analytics/ingestion`
- `GET /analytics/pipeline`
- `GET /analytics/reminders`
- `GET /analytics/tasks`

---

## 3. Rollout Sequence (Practical)

1. Telegram -> normalize -> queue -> worker (first production path)
2. Add confidence persistence fields + dashboards
3. Add follow-up/reminder scheduling
4. Add Slack
5. Add WhatsApp Business webhook inbound
6. Add Email connector

---

## 4. Definition of Done

A message is considered “done” only when:
1. It has tenant context,
2. It passed idempotency checks,
3. It has pipeline outputs with confidence scores,
4. It is persisted to tenant-scoped tables,
5. Reminders/follow-ups are scheduled when applicable.
