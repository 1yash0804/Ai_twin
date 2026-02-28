from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from sqlmodel import Session, select
from app.database import engine
from app.models import InboundMessage

scheduler = BackgroundScheduler()

def purge_raw_payloads():
    """Wipe raw_payload for messages older than 24 hours."""
    cutoff = datetime.utcnow() - timedelta(hours=24)

    with Session(engine) as session:
        messages = session.exec(
            select(InboundMessage).where(
                InboundMessage.created_at < cutoff,
                InboundMessage.raw_payload_purged == False,
            )
        ).all()

        count = 0
        for msg in messages:
            msg.raw_payload = "[purged]"
            msg.raw_payload_purged = True
            msg.purged_at = datetime.utcnow()
            session.add(msg)
            count += 1

        session.commit()
        if count:
            print(f"[purge] Cleared {count} raw payloads")

def start_purge_scheduler():
    scheduler.add_job(
        purge_raw_payloads,
        trigger="interval",
        hours=1,
        id="purge_raw_payloads",
        replace_existing=True,
    )
    scheduler.start()
    print("[purge] Scheduler started")