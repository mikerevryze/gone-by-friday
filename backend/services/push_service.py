import os
import json
from dotenv import load_dotenv

load_dotenv()


async def send_deal_alert(subscriptions: list[dict], deals: list[dict]) -> int:
    """Send push notifications about new deals to subscribed users."""
    vapid_private_key = os.getenv("VAPID_PRIVATE_KEY")
    vapid_email = os.getenv("VAPID_EMAIL")

    if not vapid_private_key or not vapid_email:
        return 0

    from pywebpush import webpush, WebPushException

    # Build notification payload
    steal_count = sum(1 for d in deals if d.get("tier") in ("insane", "steal"))
    top_deals = sorted(deals, key=lambda d: d.get("flight_price_per_pax", 999))[:3]

    body_parts = []
    for d in top_deals:
        body_parts.append(f"{d['destination_short'] or d['destination']} ${d['flight_price_per_pax']}")

    payload = json.dumps({
        "title": f"{steal_count} steal{'s' if steal_count != 1 else ''} from CLT",
        "body": " · ".join(body_parts),
        "url": "/deals",
    })

    sent = 0
    for sub in subscriptions:
        try:
            webpush(
                subscription_info={
                    "endpoint": sub["push_endpoint"],
                    "keys": sub["push_keys"],
                },
                data=payload,
                vapid_private_key=vapid_private_key,
                vapid_claims={"sub": f"mailto:{vapid_email}"},
            )
            sent += 1
        except WebPushException:
            continue

    return sent
