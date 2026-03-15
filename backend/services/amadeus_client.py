"""
Amadeus API client for real flight search data.
Sign up free at https://developers.amadeus.com
Uses Flight Offers Search API for real pricing.
"""

import os
import httpx
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

_token: str | None = None
_token_expiry: datetime | None = None

BASE_URL = "https://api.amadeus.com"  # Production
TEST_URL = "https://test.api.amadeus.com"  # Sandbox (free, test data)


def _get_base_url() -> str:
    """Use test URL unless AMADEUS_PRODUCTION=true."""
    if os.getenv("AMADEUS_PRODUCTION", "").lower() == "true":
        return BASE_URL
    return TEST_URL


async def _get_token() -> str:
    """Get or refresh OAuth2 token from Amadeus."""
    global _token, _token_expiry

    if _token and _token_expiry and datetime.now() < _token_expiry:
        return _token

    client_id = os.getenv("AMADEUS_API_KEY", "")
    client_secret = os.getenv("AMADEUS_API_SECRET", "")

    if not client_id or not client_secret:
        raise ValueError("AMADEUS_API_KEY and AMADEUS_API_SECRET must be set")

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{_get_base_url()}/v1/security/oauth2/token",
            data={
                "grant_type": "client_credentials",
                "client_id": client_id,
                "client_secret": client_secret,
            },
        )
        resp.raise_for_status()
        data = resp.json()
        _token = data["access_token"]
        _token_expiry = datetime.now() + timedelta(seconds=data.get("expires_in", 1799) - 60)
        return _token


async def search_flights(
    origin: str,
    destination: str,
    departure_date: str,
    return_date: str,
    adults: int = 1,
    max_results: int = 5,
) -> list[dict]:
    """
    Search for real flight offers via Amadeus.
    Returns list of flight offers with pricing.
    """
    token = await _get_token()

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{_get_base_url()}/v2/shopping/flight-offers",
            headers={"Authorization": f"Bearer {token}"},
            params={
                "originLocationCode": origin,
                "destinationLocationCode": destination,
                "departureDate": departure_date,
                "returnDate": return_date,
                "adults": adults,
                "max": max_results,
                "currencyCode": "USD",
                "nonStop": "true",
            },
            timeout=15.0,
        )
        if resp.status_code != 200:
            return []

        data = resp.json()
        return data.get("data", [])


def parse_amadeus_offer(offer: dict, destination_city: str, destination_code: str) -> dict | None:
    """Convert an Amadeus flight offer into our Deal format."""
    try:
        price = float(offer["price"]["total"])
        price_per_pax = int(price / int(offer.get("travelerPricings", [{}])[0].get("travelerType", "ADULT") and len(offer.get("travelerPricings", [])) or 1))

        # Get first segment for departure info
        segments = offer.get("itineraries", [{}])[0].get("segments", [])
        if not segments:
            return None

        first_seg = segments[0]
        airline_code = first_seg.get("carrierCode", "")
        departure_time = first_seg.get("departure", {}).get("at", "")
        seats = offer.get("numberOfBookableSeats", None)

        # Map airline codes to names
        airline_names = {
            "AA": "American", "DL": "Delta", "UA": "United", "WN": "Southwest",
            "B6": "JetBlue", "NK": "Spirit", "F9": "Frontier", "MX": "Breeze",
            "VXP": "Avelo", "LF": "Contour",
        }
        airline = airline_names.get(airline_code, airline_code)

        return {
            "origin": first_seg.get("departure", {}).get("iataCode", ""),
            "destination": destination_city,
            "destination_short": destination_code,
            "airline": airline,
            "flight_price_per_pax": price_per_pax,
            "departs_at": departure_time,
            "seats_remaining": seats,
            "carrier_code": airline_code,
        }
    except (KeyError, IndexError, ValueError):
        return None
