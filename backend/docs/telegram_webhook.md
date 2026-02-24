# Telegram Webhook Setup

## Required environment variables

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`
- `DEFAULT_PIPELINE_USER_ID` (maps incoming Telegram messages to an existing app user)
- `DEFAULT_ORGANIZATION_ID`

## Local development with ngrok

1. Start backend:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. Expose port 8000:
   ```bash
   ngrok http 8000
   ```
3. Register webhook (replace placeholders):
   ```bash
   curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
     -d "url=https://<your-ngrok-subdomain>.ngrok.io/webhook/telegram" \
     -d "secret_token=${TELEGRAM_WEBHOOK_SECRET}"
   ```
4. Verify:
   ```bash
   curl "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo"
   ```

## Production setup

1. Deploy backend behind HTTPS.
2. Set environment variables in the deployment platform.
3. Register webhook:
   ```bash
   curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
     -d "url=https://<your-domain>/webhook/telegram" \
     -d "secret_token=${TELEGRAM_WEBHOOK_SECRET}"
   ```
4. Optional rollback:
   ```bash
   curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook"
   ```

## Notes

- Webhook auth is validated through the `X-Telegram-Bot-Api-Secret-Token` header.
- Polling is disabled by default; enable only for fallback by setting `ENABLE_TELEGRAM_POLLING=true`.


## Schema compatibility

- On startup, the backend now applies backward-compatible SQLite `ALTER TABLE` patches for:
  - `memory.source`
  - `tasks.title`
  - `tasks.priority`
  - `tasks.confidence_score`
- This prevents runtime failures when running against older `database.db` files created before Telegram integration.
