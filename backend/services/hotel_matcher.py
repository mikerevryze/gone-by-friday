from backend.db.supabase_client import get_supabase


async def match_hilton_properties(destination: str) -> list[dict]:
    """Find Hilton properties for a given destination."""
    sb = get_supabase()
    result = (
        sb.table("hilton_properties")
        .select("*")
        .eq("destination", destination)
        .execute()
    )
    return result.data or []


def calculate_points_value(cash_per_night: int, points_per_night: int) -> float:
    """Calculate cents per point value for a Hilton redemption."""
    if points_per_night == 0:
        return 0.0
    return (cash_per_night * 100) / points_per_night


def recommend_hotel_mode(
    cash_per_night: int,
    points_per_night: int,
    points_balance: int,
    nights: int = 2,
) -> str:
    """Recommend whether to use points or cash for hotel booking."""
    cpp = calculate_points_value(cash_per_night, points_per_night)
    total_points_needed = points_per_night * nights

    # If user has enough points and value is good (>0.5 cpp), use points
    if points_balance >= total_points_needed and cpp >= 0.5:
        return "points"
    return "cash"
