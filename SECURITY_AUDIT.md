# Security Audit (Pre-Deployment)

Date: 2026-02-27  
Scope: `backend/` + `frontend/` repository review

## Critical

1. **Hardcoded JWT signing secret**
   - **Where:** `backend/app/core/security.py`
   - **Evidence:** `SECRET_KEY` is hardcoded to a known placeholder value.
   - **Risk:** Anyone with source access can forge valid JWTs and impersonate users.
   - **Fix:** Read `SECRET_KEY` from environment only; fail startup if missing; rotate existing tokens.

2. **Password hash exposed in API responses**
   - **Where:** `backend/app/models.py`, `backend/main.py`
   - **Evidence:** `User` model includes `hashed_password`, and endpoints return `response_model=User`.
   - **Risk:** Password hashes are sensitive secrets; exposure increases offline cracking risk.
   - **Fix:** Introduce safe response DTO (e.g., `UserPublic`) without `hashed_password`; use it for all responses.

3. **Outbound TLS verification disabled**
   - **Where:** `backend/main.py`
   - **Evidence:** `httpx.AsyncClient(verify=False)` in Telegram send helper.
   - **Risk:** MITM attacks can intercept/modify Telegram-bound traffic.
   - **Fix:** Remove `verify=False`; optionally pin CA/cert if you need custom trust.

## High

4. **Insecure OTP generation and missing brute-force protections**
   - **Where:** `backend/main.py`
   - **Evidence:** OTP uses `random.randint(...)`; verification endpoints have no attempt limit/lockout/rate limit.
   - **Risk:** Predictable OTP generation + unlimited attempts can enable account takeover.
   - **Fix:** Use `secrets.randbelow(1_000_000)` or TOTP; store attempt counters; add IP/user/email rate limits and temporary lockouts.

5. **Plaintext password stored in server memory during signup OTP flow**
   - **Where:** `backend/main.py`
   - **Evidence:** `pending_signup_otps[payload.email]` stores `"password": payload.password`.
   - **Risk:** Memory inspection, debug dumps, or accidental logs can leak raw credentials.
   - **Fix:** Hash immediately before temporary storage, or store encrypted temporary payload with short TTL in Redis.

6. **Unbounded file upload can cause DoS / parser abuse**
   - **Where:** `backend/main.py`, `backend/app/core/ingestion.py`
   - **Evidence:** Upload endpoint writes arbitrary file with no size/type checks; PDF parser processes attacker-controlled bytes.
   - **Risk:** Memory/CPU exhaustion, decompression bombs, parser-triggered vulnerabilities.
   - **Fix:** Enforce max file size, strict MIME/extension allowlist, antivirus scanning, timeout/resource caps, and queue backpressure.

## Medium

7. **Sensitive runtime configuration exposure endpoint**
   - **Where:** `backend/main.py`
   - **Evidence:** `/setup/requirements` reveals config readiness and internal Redis URL.
   - **Risk:** Helps attackers map infrastructure and target weak services.
   - **Fix:** Remove in production or protect behind admin auth + environment guard.

8. **Access token stored in `localStorage`**
   - **Where:** `frontend/src/lib/auth.ts`
   - **Evidence:** JWT is stored/retrieved via `window.localStorage`.
   - **Risk:** Any successful XSS can steal long-lived bearer tokens.
   - **Fix:** Move auth to `HttpOnly`, `Secure`, `SameSite` cookies and deploy strict CSP.

9. **Broad CORS policy with credentials enabled**
   - **Where:** `backend/main.py`
   - **Evidence:** `allow_credentials=True`, plus wildcard methods/headers.
   - **Risk:** If origins are misconfigured, cross-site authenticated requests become easier.
   - **Fix:** Use strict explicit origin allowlist per environment; limit methods/headers to required set.

10. **In-memory OTP state is not durable or centralized**
   - **Where:** `backend/main.py`
   - **Evidence:** `pending_signup_otps` / `pending_login_otps` are process-local dictionaries.
   - **Risk:** Multi-worker inconsistency, restart bypasses, weak operational security controls.
   - **Fix:** Store OTP state in Redis with TTL + atomic attempt counters.

## Lower-priority hardening

11. **MD5 used in cache key generation**
   - **Where:** `backend/app/core/cache.py`
   - **Evidence:** `hashlib.md5(...)` for key derivation.
   - **Risk:** Low in this context (non-cryptographic keying), but avoid weak primitives by default.
   - **Fix:** Replace with SHA-256 for consistency/security hygiene.

12. **Development server settings present in runtime path**
   - **Where:** `backend/main.py`
   - **Evidence:** `uvicorn.run(..., host="0.0.0.0", reload=True)`.
   - **Risk:** If used in production accidentally, increases attack surface and instability.
   - **Fix:** Separate production entrypoint (gunicorn/uvicorn workers) and disable `reload`.

---

## Recommended Remediation Order

1. JWT secret management + rotation.
2. Stop returning `hashed_password` in any API response.
3. Re-enable TLS verification for outbound HTTP.
4. OTP hardening (secure RNG, rate limiting, attempt lockout, Redis-backed state).
5. Upload constraints and resource limits.
6. Frontend token storage migration to HttpOnly cookies.

## Quick win checklist

- [ ] Replace hardcoded `SECRET_KEY` with env var and startup validation.
- [ ] Add `UserPublic` response model and update auth/user endpoints.
- [ ] Remove `verify=False` from `httpx.AsyncClient`.
- [ ] Add per-route rate limiter for OTP endpoints.
- [ ] Add max upload size + content-type checks.
- [ ] Disable `/setup/requirements` outside non-prod.
