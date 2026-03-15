from fastapi import APIRouter
from backend.db.supabase_client import get_supabase
from backend.models.schemas import AlertSubscribeRequest

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.post("/subscribe")
async def subscribe(req: AlertSubscribeRequest):
    sb = get_supabase()

    # Upsert subscription
    result = sb.table("alert_subscriptions").upsert({
        "user_id": req.user_id,
        "push_endpoint": req.push_endpoint,
        "push_keys": req.push_keys,
        "active": True,
    }).execute()

    return {"status": "subscribed", "data": result.data}


@router.post("/unsubscribe")
async def unsubscribe(user_id: str):
    sb = get_supabase()
    result = (
        sb.table("alert_subscriptions")
        .update({"active": False})
        .eq("user_id", user_id)
        .execute()
    )
    return {"status": "unsubscribed"}


@router.post("/trigger")
async def trigger_alerts():
    """Manually trigger deal alerts (for testing)."""
    from backend.cron.alert_job import run_friday_alert
    result = await run_friday_alert()
    return {"status": "triggered", "result": result}
