"""
Deal scraper stubs for airline websites.

In production, these would use httpx to scrape actual airline booking pages.
For now, they return empty lists — the app uses seeded deal data from Supabase.
"""

import httpx
from backend.services.deal_scorer import score_deal


async def scrape_contour_air(origin: str) -> list[dict]:
    """
    Scrape contourairlines.com for routes from origin.
    Parses available dates, prices, seat counts.
    Filters for Friday departures within next 7 days.
    """
    # Production implementation would:
    # 1. POST to contourairlines.com search API
    # 2. Parse JSON response for available flights
    # 3. Filter for Friday departures in next 7 days
    # 4. Return list of Deal dicts
    return []


async def scrape_avelo(origin: str) -> list[dict]:
    """
    Scrape aveloair.com for routes from origin.
    Same pattern as Contour scraper.
    """
    return []


async def scrape_breeze(origin: str) -> list[dict]:
    """
    Scrape flybreeze.com for routes from origin.
    Same pattern as Contour scraper.
    """
    return []


async def scrape_all(origin: str) -> list[dict]:
    """Run all scrapers and merge results."""
    contour = await scrape_contour_air(origin)
    avelo = await scrape_avelo(origin)
    breeze = await scrape_breeze(origin)

    all_deals = contour + avelo + breeze

    # Score each deal
    for deal in all_deals:
        deal["tier"] = score_deal(
            deal.get("flight_price_per_pax", 999),
            deal.get("seats_remaining"),
        )

    return all_deals
