from fastapi import APIRouter
from typing import Optional
from backend.db.memory_store import get_deals, get_deal_by_id, get_hilton_for_destination
from backend.services.deal_scanner import scan_deals

router = APIRouter(prefix="/deals", tags=["deals"])


@router.post("/scan")
async def scan(origin: str = "CLT"):
    """Scan for fresh deals from airlines. Uses Amadeus API if configured."""
    result = await scan_deals(origin)
    return result


@router.get("")
async def list_deals(
    origin: str = "CLT",
    pax: int = 1,
    max_budget: int = 600,
    max_flight_minutes: int = 999,
    interests: Optional[str] = None,
    airlines: Optional[str] = None,
    points_first: bool = True,
):
    deals = get_deals(origin=origin)

    # Filter by budget
    filtered = []
    for d in deals:
        total = (d["flight_price_per_pax"] * pax) + (d["hotel_price_per_night"] * 2)
        if total <= max_budget * pax or max_budget >= 600:
            filtered.append(d)

    # Filter by interests
    if interests:
        interest_list = [i.strip() for i in interests.split(",")]
        if interest_list:
            filtered = [
                d for d in filtered
                if any(i in (d.get("interests") or []) for i in interest_list)
            ]

    # Filter by airlines
    if airlines:
        airline_list = [a.strip() for a in airlines.split(",")]
        if airline_list:
            filtered = [
                d for d in filtered
                if d.get("airline") in airline_list
            ]

    # Score and sort
    tier_order = {"insane": 0, "steal": 1, "hot": 2, "watch": 3, "gone": 4}
    if points_first:
        filtered.sort(key=lambda d: (
            0 if d.get("hilton_available") else 1,
            tier_order.get(d.get("tier", "watch"), 3),
            d["flight_price_per_pax"],
        ))
    else:
        filtered.sort(key=lambda d: (
            tier_order.get(d.get("tier", "watch"), 3),
            d["flight_price_per_pax"],
        ))

    return {"deals": filtered, "count": len(filtered)}


@router.get("/{deal_id}")
async def get_deal(deal_id: str):
    deal = get_deal_by_id(deal_id)
    if not deal:
        return {"error": "Deal not found"}

    deal = {**deal}
    deal["hilton_properties"] = get_hilton_for_destination(deal["destination"])
    return deal
