from fastapi import APIRouter
from backend.db.supabase_client import get_supabase
from backend.models.schemas import WalletAccountRequest

router = APIRouter(prefix="/wallet", tags=["wallet"])


@router.get("/{user_id}")
async def get_wallet(user_id: str):
    sb = get_supabase()
    result = (
        sb.table("loyalty_accounts")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    return {"accounts": result.data or []}


@router.post("")
async def add_account(req: WalletAccountRequest):
    sb = get_supabase()
    result = sb.table("loyalty_accounts").upsert({
        "user_id": req.user_id,
        "program": req.program,
        "points_balance": req.points_balance,
        "tier": req.tier,
    }).execute()
    return {"account": result.data[0] if result.data else None}


@router.put("/{account_id}")
async def update_balance(account_id: str, points_balance: int):
    sb = get_supabase()
    result = (
        sb.table("loyalty_accounts")
        .update({"points_balance": points_balance})
        .eq("id", account_id)
        .execute()
    )
    return {"account": result.data[0] if result.data else None}
