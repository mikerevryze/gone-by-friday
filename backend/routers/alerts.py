from fastapi import APIRouter
from backend.db.memory_store import ALERT_SUBSCRIPTIONS
from backend.models.schemas import AlertSubscribeRequest
import uuid

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.post("/subscribe")
async def subscribe(req: AlertSubscribeRequest):
    sub = {
        "id": str(uuid.uuid4()),
        "user_id": req.user_id,
        "push_endpoint": req.push_endpoint,
        "push_keys": req.push_keys,
        "active": True,
    }
    ALERT_SUBSCRIPTIONS.append(sub)
    return {"status": "subscribed", "data": sub}


@router.post("/unsubscribe")
async def unsubscribe(user_id: str):
    for sub in ALERT_SUBSCRIPTIONS:
        if sub.get("user_id") == user_id:
            sub["active"] = False
    return {"status": "unsubscribed"}
