from fastapi import APIRouter
from backend.db.memory_store import get_deal_by_id, save_trip
from backend.models.schemas import ItineraryRequest
from backend.services.itinerary_generator import generate_itinerary

router = APIRouter(prefix="/itinerary", tags=["itinerary"])


@router.post("/generate")
async def generate(req: ItineraryRequest):
    deal = get_deal_by_id(req.deal_id)
    if not deal:
        return {"error": "Deal not found"}

    # Generate itinerary via Claude
    itinerary = await generate_itinerary(
        destination=deal["destination"],
        pax=req.pax,
        interests=req.interests if req.interests else deal.get("interests", []),
        airline=deal["airline"],
        flight_price=deal["flight_price_per_pax"],
    )

    # Save trip
    trip = save_trip({
        "deal_id": req.deal_id,
        "itinerary": itinerary,
        "status": "planned",
        "total_cash_cost": (deal["flight_price_per_pax"] * req.pax) + (deal["hotel_price_per_night"] * 2),
        "selections": None,
        "hotel_mode": None,
        "calendar_synced": False,
        "total_points_used": None,
        "user_id": None,
    })

    return {
        "itinerary": itinerary,
        "trip_id": trip["id"],
        "deal": deal,
    }
