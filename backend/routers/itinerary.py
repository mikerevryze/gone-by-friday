from fastapi import APIRouter
from backend.db.supabase_client import get_supabase
from backend.models.schemas import ItineraryRequest
from backend.services.itinerary_generator import generate_itinerary

router = APIRouter(prefix="/itinerary", tags=["itinerary"])


@router.post("/generate")
async def generate(req: ItineraryRequest):
    sb = get_supabase()

    # Fetch the deal
    deal_result = sb.table("deals").select("*").eq("id", req.deal_id).single().execute()
    deal = deal_result.data

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

    # Cache in trips table (create a new trip record)
    trip_data = {
        "deal_id": req.deal_id,
        "itinerary": itinerary,
        "status": "planned",
        "total_cash_cost": (deal["flight_price_per_pax"] * req.pax) + (deal["hotel_price_per_night"] * 2),
    }

    # Only add user_id if we have auth context (skip for anonymous)
    trip_result = sb.table("trips").insert(trip_data).execute()
    trip = trip_result.data[0] if trip_result.data else None

    return {
        "itinerary": itinerary,
        "trip_id": trip["id"] if trip else None,
        "deal": deal,
    }
