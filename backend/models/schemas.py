from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DealQuery(BaseModel):
    origin: str = "CLT"
    pax: int = 1
    max_budget: int = 300
    max_flight_minutes: int = 120
    interests: list[str] = []
    airlines: list[str] = []
    points_first: bool = True


class DealResponse(BaseModel):
    id: str
    origin: str
    destination: str
    destination_short: Optional[str] = None
    flag: Optional[str] = None
    flight_price_per_pax: int
    hotel_price_per_night: int
    airline: str
    seats_remaining: Optional[int] = None
    departs_at: Optional[str] = None
    returns_at: Optional[str] = None
    gate: Optional[str] = None
    tier: Optional[str] = None
    interests: list[str] = []
    hilton_available: bool = False
    active: bool = True
    expires_at: Optional[str] = None
    created_at: Optional[str] = None
    hilton_properties: Optional[list[dict]] = None


class ItineraryChoice(BaseModel):
    name: str
    type: str
    description: str
    vibe: str
    cost: str
    neighborhood: str
    proTip: str


class TimeSlot(BaseModel):
    label: str
    key: str
    choiceA: ItineraryChoice
    choiceB: ItineraryChoice


class ItineraryResponse(BaseModel):
    destination: str
    slots: list[TimeSlot]


class ItineraryRequest(BaseModel):
    deal_id: str
    pax: int = 1
    interests: list[str] = []


class AlertSubscribeRequest(BaseModel):
    user_id: str
    push_endpoint: str
    push_keys: dict


class CalendarAddRequest(BaseModel):
    trip_id: str
    google_oauth_token: str


class WalletAccountRequest(BaseModel):
    user_id: str
    program: str
    points_balance: int = 0
    tier: Optional[str] = None


class TripResponse(BaseModel):
    id: str
    user_id: str
    deal_id: str
    itinerary: Optional[dict] = None
    selections: Optional[dict] = None
    hotel_mode: Optional[str] = None
    status: str = "planned"
    calendar_synced: bool = False
    total_cash_cost: Optional[int] = None
    total_points_used: Optional[int] = None
    created_at: Optional[str] = None
