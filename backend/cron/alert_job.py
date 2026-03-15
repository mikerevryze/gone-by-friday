from backend.db.supabase_client import get_supabase
from backend.services.deal_scraper import scrape_all
from backend.services.deal_scorer import score_deal
from backend.services.push_service import send_deal_alert


async def run_friday_alert() -> dict:
    """
    Friday alert job — runs at 5:00 AM Friday.
    Scrapes deals, scores them, saves to DB, and sends push notifications.
    """
    sb = get_supabase()

    # 1. Scrape all airlines from CLT
    new_deals = await scrape_all("CLT")

    # 2. If scrapers returned results, save to DB
    if new_deals:
        # Deactivate old deals
        sb.table("deals").update({"active": False}).eq("origin", "CLT").execute()

        # Insert new deals
        for deal in new_deals:
            sb.table("deals").insert(deal).execute()

    # 3. Get all active deals
    deals_result = sb.table("deals").select("*").eq("active", True).execute()
    active_deals = deals_result.data or []

    # 4. Get all active subscriptions
    subs_result = (
        sb.table("alert_subscriptions")
        .select("*")
        .eq("active", True)
        .execute()
    )
    subscriptions = subs_result.data or []

    # 5. Send notifications
    sent = 0
    if subscriptions and active_deals:
        sent = await send_deal_alert(subscriptions, active_deals)

    return {
        "deals_found": len(active_deals),
        "notifications_sent": sent,
    }
