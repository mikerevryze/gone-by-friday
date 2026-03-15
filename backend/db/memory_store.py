"""
In-memory data store with seed data.
Replaces Supabase for zero-config local/Replit development.
"""

import uuid
from datetime import datetime, timedelta, timezone

now = datetime.now(timezone.utc)
fri = now + timedelta(days=(4 - now.weekday()) % 7 or 7)  # Next Friday
sun = fri + timedelta(days=2)

DEALS: list[dict] = [
    {"id": str(uuid.uuid4()), "origin": "CLT", "destination": "Knoxville, TN", "destination_short": "TYS", "flag": "\U0001f3d4\ufe0f", "flight_price_per_pax": 18, "hotel_price_per_night": 89, "airline": "Contour", "seats_remaining": 8, "departs_at": fri.isoformat(), "returns_at": sun.isoformat(), "gate": "E4", "tier": "insane", "interests": ["outdoors", "food", "breweries"], "hilton_available": True, "active": True, "expires_at": None, "created_at": now.isoformat()},
    {"id": str(uuid.uuid4()), "origin": "CLT", "destination": "Savannah, GA", "destination_short": "SAV", "flag": "\U0001f33f", "flight_price_per_pax": 29, "hotel_price_per_night": 119, "airline": "Avelo", "seats_remaining": 6, "departs_at": fri.isoformat(), "returns_at": sun.isoformat(), "gate": "B12", "tier": "steal", "interests": ["history", "food", "nightlife", "architecture"], "hilton_available": True, "active": True, "expires_at": None, "created_at": now.isoformat()},
    {"id": str(uuid.uuid4()), "origin": "CLT", "destination": "Roanoke, VA", "destination_short": "ROA", "flag": "\U0001f304", "flight_price_per_pax": 24, "hotel_price_per_night": 79, "airline": "Contour", "seats_remaining": 5, "departs_at": fri.isoformat(), "returns_at": sun.isoformat(), "gate": "E2", "tier": "insane", "interests": ["outdoors", "hiking", "breweries"], "hilton_available": True, "active": True, "expires_at": None, "created_at": now.isoformat()},
    {"id": str(uuid.uuid4()), "origin": "CLT", "destination": "Pittsburgh, PA", "destination_short": "PIT", "flag": "\U0001f3d7\ufe0f", "flight_price_per_pax": 39, "hotel_price_per_night": 109, "airline": "Breeze", "seats_remaining": 12, "departs_at": fri.isoformat(), "returns_at": sun.isoformat(), "gate": "A8", "tier": "steal", "interests": ["food", "sports", "museums", "nightlife"], "hilton_available": True, "active": True, "expires_at": None, "created_at": now.isoformat()},
    {"id": str(uuid.uuid4()), "origin": "CLT", "destination": "Lynchburg, VA", "destination_short": "LYH", "flag": "\U0001f342", "flight_price_per_pax": 18, "hotel_price_per_night": 69, "airline": "Contour", "seats_remaining": 4, "departs_at": fri.isoformat(), "returns_at": sun.isoformat(), "gate": "E1", "tier": "insane", "interests": ["outdoors", "history", "breweries"], "hilton_available": False, "active": True, "expires_at": None, "created_at": now.isoformat()},
    {"id": str(uuid.uuid4()), "origin": "CLT", "destination": "Asheville, NC", "destination_short": "AVL", "flag": "\U0001f3a8", "flight_price_per_pax": 31, "hotel_price_per_night": 139, "airline": "Contour", "seats_remaining": 9, "departs_at": fri.isoformat(), "returns_at": sun.isoformat(), "gate": "E6", "tier": "steal", "interests": ["food", "breweries", "art", "outdoors"], "hilton_available": True, "active": True, "expires_at": None, "created_at": now.isoformat()},
    {"id": str(uuid.uuid4()), "origin": "CLT", "destination": "Memphis, TN", "destination_short": "MEM", "flag": "\U0001f3b5", "flight_price_per_pax": 59, "hotel_price_per_night": 99, "airline": "Delta", "seats_remaining": 15, "departs_at": fri.isoformat(), "returns_at": sun.isoformat(), "gate": "C14", "tier": "hot", "interests": ["music", "food", "nightlife", "history"], "hilton_available": True, "active": True, "expires_at": None, "created_at": now.isoformat()},
    {"id": str(uuid.uuid4()), "origin": "CLT", "destination": "Greenville, SC", "destination_short": "GSP", "flag": "\U0001f333", "flight_price_per_pax": 0, "hotel_price_per_night": 89, "airline": "Drive", "seats_remaining": None, "departs_at": fri.isoformat(), "returns_at": sun.isoformat(), "gate": None, "tier": "insane", "interests": ["food", "outdoors", "breweries", "family"], "hilton_available": True, "active": True, "expires_at": None, "created_at": now.isoformat()},
    {"id": str(uuid.uuid4()), "origin": "CLT", "destination": "Columbus, OH", "destination_short": "CMH", "flag": "\U0001f3c8", "flight_price_per_pax": 44, "hotel_price_per_night": 99, "airline": "Breeze", "seats_remaining": 10, "departs_at": fri.isoformat(), "returns_at": sun.isoformat(), "gate": "A4", "tier": "steal", "interests": ["food", "sports", "nightlife", "museums"], "hilton_available": True, "active": True, "expires_at": None, "created_at": now.isoformat()},
    {"id": str(uuid.uuid4()), "origin": "CLT", "destination": "Richmond, VA", "destination_short": "RIC", "flag": "\U0001f3db\ufe0f", "flight_price_per_pax": 63, "hotel_price_per_night": 109, "airline": "American", "seats_remaining": 7, "departs_at": fri.isoformat(), "returns_at": sun.isoformat(), "gate": "B6", "tier": "hot", "interests": ["history", "food", "art", "breweries"], "hilton_available": True, "active": True, "expires_at": None, "created_at": now.isoformat()},
]

HILTON_PROPERTIES: list[dict] = [
    {"id": str(uuid.uuid4()), "destination": "Knoxville, TN", "property_name": "Hilton Knoxville", "stars": 4, "cash_per_night": 129, "points_per_night": 32000, "address": "501 W Church Ave, Knoxville, TN", "amenities": ["pool", "fitness", "restaurant"]},
    {"id": str(uuid.uuid4()), "destination": "Knoxville, TN", "property_name": "Hampton Inn Downtown Knoxville", "stars": 3, "cash_per_night": 89, "points_per_night": 22000, "address": "618 W Main St, Knoxville, TN", "amenities": ["breakfast", "fitness", "wifi"]},
    {"id": str(uuid.uuid4()), "destination": "Savannah, GA", "property_name": "Hilton Savannah DeSoto", "stars": 4, "cash_per_night": 179, "points_per_night": 44000, "address": "15 E Liberty St, Savannah, GA", "amenities": ["pool", "rooftop bar", "restaurant", "spa"]},
    {"id": str(uuid.uuid4()), "destination": "Savannah, GA", "property_name": "Hampton Inn Savannah Historic", "stars": 3, "cash_per_night": 119, "points_per_night": 28000, "address": "201 E Bay St, Savannah, GA", "amenities": ["breakfast", "fitness", "wifi"]},
    {"id": str(uuid.uuid4()), "destination": "Roanoke, VA", "property_name": "Hampton Inn Roanoke Downtown", "stars": 3, "cash_per_night": 99, "points_per_night": 24000, "address": "527 Williamson Rd, Roanoke, VA", "amenities": ["breakfast", "fitness", "wifi"]},
    {"id": str(uuid.uuid4()), "destination": "Pittsburgh, PA", "property_name": "Hilton Garden Inn Pittsburgh", "stars": 3, "cash_per_night": 139, "points_per_night": 34000, "address": "250 Forbes Ave, Pittsburgh, PA", "amenities": ["restaurant", "fitness", "wifi"]},
    {"id": str(uuid.uuid4()), "destination": "Pittsburgh, PA", "property_name": "DoubleTree by Hilton Pittsburgh", "stars": 4, "cash_per_night": 159, "points_per_night": 38000, "address": "1 Bigelow Square, Pittsburgh, PA", "amenities": ["restaurant", "pool", "fitness", "cookies"]},
    {"id": str(uuid.uuid4()), "destination": "Asheville, NC", "property_name": "Hilton Asheville Biltmore Park", "stars": 4, "cash_per_night": 189, "points_per_night": 46000, "address": "43 Town Square Blvd, Asheville, NC", "amenities": ["pool", "spa", "restaurant", "fitness"]},
    {"id": str(uuid.uuid4()), "destination": "Asheville, NC", "property_name": "Home2 Suites Asheville Downtown", "stars": 3, "cash_per_night": 139, "points_per_night": 30000, "address": "50 N Spruce St, Asheville, NC", "amenities": ["kitchen", "fitness", "wifi", "laundry"]},
    {"id": str(uuid.uuid4()), "destination": "Memphis, TN", "property_name": "Hilton Memphis", "stars": 4, "cash_per_night": 149, "points_per_night": 36000, "address": "939 Ridge Lake Blvd, Memphis, TN", "amenities": ["pool", "restaurant", "fitness"]},
    {"id": str(uuid.uuid4()), "destination": "Greenville, SC", "property_name": "Hilton Greenville", "stars": 4, "cash_per_night": 139, "points_per_night": 34000, "address": "45 W Orchard Park Dr, Greenville, SC", "amenities": ["pool", "restaurant", "fitness"]},
    {"id": str(uuid.uuid4()), "destination": "Columbus, OH", "property_name": "Hilton Columbus Downtown", "stars": 4, "cash_per_night": 159, "points_per_night": 38000, "address": "401 N High St, Columbus, OH", "amenities": ["pool", "restaurant", "fitness", "skywalk"]},
    {"id": str(uuid.uuid4()), "destination": "Richmond, VA", "property_name": "Hilton Richmond Downtown", "stars": 4, "cash_per_night": 149, "points_per_night": 36000, "address": "501 E Broad St, Richmond, VA", "amenities": ["restaurant", "fitness", "rooftop"]},
]

TRIPS: list[dict] = []
USERS: list[dict] = []
LOYALTY_ACCOUNTS: list[dict] = []
ALERT_SUBSCRIPTIONS: list[dict] = []


def get_deals(origin: str = "CLT", active: bool = True) -> list[dict]:
    return [d for d in DEALS if d["origin"] == origin and d["active"] == active]


def get_deal_by_id(deal_id: str) -> dict | None:
    for d in DEALS:
        if d["id"] == deal_id:
            return d
    return None


def get_hilton_for_destination(destination: str) -> list[dict]:
    return [h for h in HILTON_PROPERTIES if h["destination"] == destination]


def save_trip(trip: dict) -> dict:
    trip["id"] = str(uuid.uuid4())
    trip["created_at"] = datetime.now(timezone.utc).isoformat()
    TRIPS.append(trip)
    return trip


def get_trip_by_id(trip_id: str) -> dict | None:
    for t in TRIPS:
        if t["id"] == trip_id:
            return t
    return None
