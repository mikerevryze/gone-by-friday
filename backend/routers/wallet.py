from fastapi import APIRouter
from backend.db.memory_store import LOYALTY_ACCOUNTS
from backend.models.schemas import WalletAccountRequest
import uuid

router = APIRouter(prefix="/wallet", tags=["wallet"])


@router.get("/{user_id}")
async def get_wallet(user_id: str):
    accounts = [a for a in LOYALTY_ACCOUNTS if a.get("user_id") == user_id]
    return {"accounts": accounts}


@router.post("")
async def add_account(req: WalletAccountRequest):
    account = {
        "id": str(uuid.uuid4()),
        "user_id": req.user_id,
        "program": req.program,
        "points_balance": req.points_balance,
        "tier": req.tier,
    }
    LOYALTY_ACCOUNTS.append(account)
    return {"account": account}
