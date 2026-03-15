import os
import json
import anthropic
from dotenv import load_dotenv

load_dotenv()

FALLBACK_ITINERARY = {
    "destination": "Unknown",
    "slots": [
        {
            "label": "Friday Evening",
            "key": "fri_evening",
            "choiceA": {
                "name": "Welcome Dinner at Local Favorite",
                "type": "dining",
                "description": "Start your trip with a meal at the top-rated local spot. Fresh ingredients, warm atmosphere, and a taste of what this city does best.",
                "vibe": "cozy authentic",
                "cost": "$$",
                "neighborhood": "Downtown",
                "proTip": "Ask for the chef's special — it's never on the menu.",
            },
            "choiceB": {
                "name": "Sunset Walking Tour",
                "type": "activity",
                "description": "Explore the historic district as golden hour lights up the architecture. A self-guided walk hitting the major landmarks and hidden alleys.",
                "vibe": "scenic relaxed",
                "cost": "$",
                "neighborhood": "Historic District",
                "proTip": "Download the free audio guide before you go.",
            },
        },
        {
            "label": "Saturday Morning",
            "key": "sat_morning",
            "choiceA": {
                "name": "Farmers Market & Coffee",
                "type": "food",
                "description": "Browse the weekend market for local bites and artisan goods. Grab a pourover from the roaster everyone's talking about.",
                "vibe": "chill vibrant",
                "cost": "$",
                "neighborhood": "Market District",
                "proTip": "Get there before 10 AM for the best pastry selection.",
            },
            "choiceB": {
                "name": "Morning Hike with Views",
                "type": "outdoors",
                "description": "A moderate trail that rewards you with panoramic views of the city. Pack water and wear layers — the morning air is crisp.",
                "vibe": "energizing scenic",
                "cost": "$",
                "neighborhood": "Outskirts",
                "proTip": "The trailhead parking fills up fast on weekends.",
            },
        },
        {
            "label": "Saturday Afternoon",
            "key": "sat_afternoon",
            "choiceA": {
                "name": "Local Museum Deep Dive",
                "type": "culture",
                "description": "A thoughtfully curated collection that tells this city's story. Plan for 2 hours, but you'll want to stay longer.",
                "vibe": "thoughtful inspiring",
                "cost": "$$",
                "neighborhood": "Arts District",
                "proTip": "The rooftop terrace has the best free view in the city.",
            },
            "choiceB": {
                "name": "Brewery Crawl",
                "type": "drinks",
                "description": "Three walkable taprooms, each with a completely different vibe. Start light and work your way to the IPAs.",
                "vibe": "social fun",
                "cost": "$$",
                "neighborhood": "Brewery Row",
                "proTip": "Most places offer a flight sampler — great way to try everything.",
            },
        },
        {
            "label": "Saturday Evening",
            "key": "sat_evening",
            "choiceA": {
                "name": "Chef's Table Experience",
                "type": "dining",
                "description": "A prix fixe dinner at the city's most talked-about restaurant. Seasonal menu, natural wines, and impeccable service.",
                "vibe": "elevated memorable",
                "cost": "$$$",
                "neighborhood": "Waterfront",
                "proTip": "Book the 7:30 seating for the best kitchen view.",
            },
            "choiceB": {
                "name": "Street Food & Live Music",
                "type": "nightlife",
                "description": "An open-air food hall with rotating vendors and a stage that always has someone playing. Low-key, high-flavor.",
                "vibe": "lively casual",
                "cost": "$",
                "neighborhood": "South End",
                "proTip": "The BBQ truck has a cult following — get in line early.",
            },
        },
        {
            "label": "Saturday Night",
            "key": "sat_night",
            "choiceA": {
                "name": "Rooftop Cocktail Bar",
                "type": "nightlife",
                "description": "Craft cocktails with a skyline backdrop. The kind of place where you end up staying way later than planned.",
                "vibe": "sleek chill",
                "cost": "$$",
                "neighborhood": "Downtown",
                "proTip": "The signature old fashioned is worth the $16.",
            },
            "choiceB": {
                "name": "Late-Night Comedy Show",
                "type": "entertainment",
                "description": "A small-room comedy club with both touring headliners and sharp local talent. BYOB-friendly if you ask nicely.",
                "vibe": "hilarious intimate",
                "cost": "$$",
                "neighborhood": "Midtown",
                "proTip": "Sit in the third row — close enough to feel it, far enough to avoid being picked on.",
            },
        },
        {
            "label": "Sunday Morning",
            "key": "sun_morning",
            "choiceA": {
                "name": "Brunch at the Iconic Spot",
                "type": "dining",
                "description": "The brunch place that started the trend. Expect a short wait, but the biscuits and gravy are a religious experience.",
                "vibe": "indulgent classic",
                "cost": "$$",
                "neighborhood": "Main Street",
                "proTip": "Order one sweet and one savory — you won't regret it.",
            },
            "choiceB": {
                "name": "Sunrise Yoga in the Park",
                "type": "wellness",
                "description": "A free community yoga class in the main park. Bring your own mat. The perfect way to close out a weekend before heading to the airport.",
                "vibe": "peaceful grounding",
                "cost": "$",
                "neighborhood": "Central Park",
                "proTip": "They usually wrap up with free cold brew from a local sponsor.",
            },
        },
    ],
}


async def generate_itinerary(
    destination: str,
    pax: int,
    interests: list[str],
    airline: str,
    flight_price: int,
) -> dict:
    """Generate a weekend itinerary using Claude API."""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        # Return fallback with destination patched in
        fallback = {**FALLBACK_ITINERARY, "destination": destination}
        return fallback

    client = anthropic.Anthropic(api_key=api_key)

    interests_str = ", ".join(interests) if interests else "general sightseeing"

    prompt = f"""Generate a weekend trip itinerary for {destination} for {pax} traveler(s).

Their interests: {interests_str}
Flying {airline} for ${flight_price}/person.

Create exactly 6 time slots:
1. fri_evening (Friday Evening)
2. sat_morning (Saturday Morning)
3. sat_afternoon (Saturday Afternoon)
4. sat_evening (Saturday Evening)
5. sat_night (Saturday Night)
6. sun_morning (Sunday Morning)

For each time slot, provide TWO choices (A and B). Each choice must have:
- name: catchy activity name (3-5 words)
- type: one of [dining, activity, outdoors, culture, drinks, nightlife, entertainment, wellness, food, shopping]
- description: exactly 2 sentences describing the experience
- vibe: exactly 2 words capturing the mood
- cost: one of [$, $$, $$$]
- neighborhood: area of the city
- proTip: one practical insider tip sentence

Return ONLY valid JSON matching this exact structure:
{{
  "destination": "{destination}",
  "slots": [
    {{
      "label": "Friday Evening",
      "key": "fri_evening",
      "choiceA": {{ "name": "...", "type": "...", "description": "...", "vibe": "...", "cost": "...", "neighborhood": "...", "proTip": "..." }},
      "choiceB": {{ "name": "...", "type": "...", "description": "...", "vibe": "...", "cost": "...", "neighborhood": "...", "proTip": "..." }}
    }}
  ]
}}

Make it specific to {destination} — real neighborhoods, real types of places, local flavor. No generic suggestions."""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-5-20250514",
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}],
        )

        response_text = message.content[0].text

        # Parse JSON from response (handle markdown code blocks)
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0]
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0]

        itinerary = json.loads(response_text.strip())
        return itinerary

    except Exception:
        # Return fallback itinerary on any error
        fallback = {**FALLBACK_ITINERARY, "destination": destination}
        return fallback
