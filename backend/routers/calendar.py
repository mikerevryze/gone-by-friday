from fastapi import APIRouter
from backend.db.supabase_client import get_supabase
from backend.models.schemas import CalendarAddRequest
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.post("/add-events")
async def add_events(req: CalendarAddRequest):
    sb = get_supabase()

    # Fetch trip with itinerary
    trip_result = sb.table("trips").select("*").eq("id", req.trip_id).single().execute()
    trip = trip_result.data
    if not trip:
        return {"error": "Trip not found"}

    itinerary = trip.get("itinerary")
    selections = trip.get("selections") or {}
    if not itinerary:
        return {"error": "No itinerary found for this trip"}

    # Fetch deal for timing info
    deal_result = sb.table("deals").select("*").eq("id", trip["deal_id"]).single().execute()
    deal = deal_result.data

    # Build Google Calendar service
    creds = Credentials(token=req.google_oauth_token)
    service = build("calendar", "v3", credentials=creds)

    # Time slot to approximate datetime mapping
    slot_times = {
        "fri_evening": ("18:00", "21:00"),
        "sat_morning": ("09:00", "12:00"),
        "sat_afternoon": ("13:00", "16:00"),
        "sat_evening": ("18:00", "21:00"),
        "sat_night": ("21:00", "23:59"),
        "sun_morning": ("09:00", "12:00"),
    }

    events_added = 0
    slots = itinerary.get("slots", [])

    for slot in slots:
        key = slot["key"]
        selection = selections.get(key, "A")
        choice = slot["choiceA"] if selection == "A" else slot["choiceB"]
        times = slot_times.get(key, ("12:00", "14:00"))

        # Use deal departure date as base
        departs = deal.get("departs_at", "") if deal else ""
        date_str = departs[:10] if departs else "2025-01-01"

        # Adjust date for Saturday/Sunday slots
        if key.startswith("sat"):
            # Add 1 day
            from datetime import datetime, timedelta
            base = datetime.fromisoformat(date_str)
            date_str = (base + timedelta(days=1)).strftime("%Y-%m-%d")
        elif key.startswith("sun"):
            from datetime import datetime, timedelta
            base = datetime.fromisoformat(date_str)
            date_str = (base + timedelta(days=2)).strftime("%Y-%m-%d")

        event = {
            "summary": f"GBF: {choice['name']}",
            "description": f"{choice['description']}\n\nVibe: {choice['vibe']}\nNeighborhood: {choice['neighborhood']}\nPro tip: {choice['proTip']}",
            "start": {
                "dateTime": f"{date_str}T{times[0]}:00",
                "timeZone": "America/New_York",
            },
            "end": {
                "dateTime": f"{date_str}T{times[1]}:00",
                "timeZone": "America/New_York",
            },
        }

        service.events().insert(calendarId="primary", body=event).execute()
        events_added += 1

    # Mark trip as calendar synced
    sb.table("trips").update({"calendar_synced": True}).eq("id", req.trip_id).execute()

    return {"events_added": events_added}
