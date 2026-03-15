from fastapi import APIRouter
from backend.db.memory_store import get_trip_by_id
from backend.models.schemas import CalendarAddRequest

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.post("/add-events")
async def add_events(req: CalendarAddRequest):
    trip = get_trip_by_id(req.trip_id)
    if not trip:
        return {"error": "Trip not found"}

    itinerary = trip.get("itinerary")
    if not itinerary:
        return {"error": "No itinerary found for this trip"}

    slots = itinerary.get("slots", [])
    trip["calendar_synced"] = True

    return {"events_added": len(slots)}
