def score_deal(flight_price_per_pax: int, seats_remaining: int | None = None) -> str:
    """Score a deal into a tier based on price and seat availability."""
    if seats_remaining is not None and seats_remaining <= 2:
        return "gone"
    if flight_price_per_pax <= 25:
        return "insane"
    if flight_price_per_pax <= 50:
        return "steal"
    if flight_price_per_pax <= 80:
        return "hot"
    return "watch"
