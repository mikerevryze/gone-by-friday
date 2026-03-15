const http = require('http');
const crypto = require('crypto');

// ── In-memory data store ──────────────────────────────────────────────

const now = new Date();
const dayOfWeek = now.getUTCDay();
const daysUntilFri = (5 - dayOfWeek + 7) % 7 || 7;
const fri = new Date(now.getTime() + daysUntilFri * 86400000);
const sun = new Date(fri.getTime() + 2 * 86400000);

function uuid() {
  return crypto.randomUUID();
}

const DEALS = [
  { id: uuid(), origin: "CLT", destination: "Knoxville, TN", destination_short: "TYS", flag: "\u{1f3d4}\ufe0f", flight_price_per_pax: 18, hotel_price_per_night: 89, airline: "Contour", seats_remaining: 8, departs_at: fri.toISOString(), returns_at: sun.toISOString(), gate: "E4", tier: "insane", interests: ["outdoors", "food", "breweries"], hilton_available: true, active: true, expires_at: null, created_at: now.toISOString() },
  { id: uuid(), origin: "CLT", destination: "Savannah, GA", destination_short: "SAV", flag: "\u{1f33f}", flight_price_per_pax: 29, hotel_price_per_night: 119, airline: "Avelo", seats_remaining: 6, departs_at: fri.toISOString(), returns_at: sun.toISOString(), gate: "B12", tier: "steal", interests: ["history", "food", "nightlife", "architecture"], hilton_available: true, active: true, expires_at: null, created_at: now.toISOString() },
  { id: uuid(), origin: "CLT", destination: "Roanoke, VA", destination_short: "ROA", flag: "\u{1f304}", flight_price_per_pax: 24, hotel_price_per_night: 79, airline: "Contour", seats_remaining: 5, departs_at: fri.toISOString(), returns_at: sun.toISOString(), gate: "E2", tier: "insane", interests: ["outdoors", "hiking", "breweries"], hilton_available: true, active: true, expires_at: null, created_at: now.toISOString() },
  { id: uuid(), origin: "CLT", destination: "Pittsburgh, PA", destination_short: "PIT", flag: "\u{1f3d7}\ufe0f", flight_price_per_pax: 39, hotel_price_per_night: 109, airline: "Breeze", seats_remaining: 12, departs_at: fri.toISOString(), returns_at: sun.toISOString(), gate: "A8", tier: "steal", interests: ["food", "sports", "museums", "nightlife"], hilton_available: true, active: true, expires_at: null, created_at: now.toISOString() },
  { id: uuid(), origin: "CLT", destination: "Lynchburg, VA", destination_short: "LYH", flag: "\u{1f342}", flight_price_per_pax: 18, hotel_price_per_night: 69, airline: "Contour", seats_remaining: 4, departs_at: fri.toISOString(), returns_at: sun.toISOString(), gate: "E1", tier: "insane", interests: ["outdoors", "history", "breweries"], hilton_available: false, active: true, expires_at: null, created_at: now.toISOString() },
  { id: uuid(), origin: "CLT", destination: "Asheville, NC", destination_short: "AVL", flag: "\u{1f3a8}", flight_price_per_pax: 31, hotel_price_per_night: 139, airline: "Contour", seats_remaining: 9, departs_at: fri.toISOString(), returns_at: sun.toISOString(), gate: "E6", tier: "steal", interests: ["food", "breweries", "art", "outdoors"], hilton_available: true, active: true, expires_at: null, created_at: now.toISOString() },
  { id: uuid(), origin: "CLT", destination: "Memphis, TN", destination_short: "MEM", flag: "\u{1f3b5}", flight_price_per_pax: 59, hotel_price_per_night: 99, airline: "Delta", seats_remaining: 15, departs_at: fri.toISOString(), returns_at: sun.toISOString(), gate: "C14", tier: "hot", interests: ["music", "food", "nightlife", "history"], hilton_available: true, active: true, expires_at: null, created_at: now.toISOString() },
  { id: uuid(), origin: "CLT", destination: "Greenville, SC", destination_short: "GSP", flag: "\u{1f333}", flight_price_per_pax: 0, hotel_price_per_night: 89, airline: "Drive", seats_remaining: null, departs_at: fri.toISOString(), returns_at: sun.toISOString(), gate: null, tier: "insane", interests: ["food", "outdoors", "breweries", "family"], hilton_available: true, active: true, expires_at: null, created_at: now.toISOString() },
  { id: uuid(), origin: "CLT", destination: "Columbus, OH", destination_short: "CMH", flag: "\u{1f3c8}", flight_price_per_pax: 44, hotel_price_per_night: 99, airline: "Breeze", seats_remaining: 10, departs_at: fri.toISOString(), returns_at: sun.toISOString(), gate: "A4", tier: "steal", interests: ["food", "sports", "nightlife", "museums"], hilton_available: true, active: true, expires_at: null, created_at: now.toISOString() },
  { id: uuid(), origin: "CLT", destination: "Richmond, VA", destination_short: "RIC", flag: "\u{1f3db}\ufe0f", flight_price_per_pax: 63, hotel_price_per_night: 109, airline: "American", seats_remaining: 7, departs_at: fri.toISOString(), returns_at: sun.toISOString(), gate: "B6", tier: "hot", interests: ["history", "food", "art", "breweries"], hilton_available: true, active: true, expires_at: null, created_at: now.toISOString() },
];

const HILTON_PROPERTIES = [
  { id: uuid(), destination: "Knoxville, TN", property_name: "Hilton Knoxville", stars: 4, cash_per_night: 129, points_per_night: 32000, address: "501 W Church Ave, Knoxville, TN", amenities: ["pool", "fitness", "restaurant"] },
  { id: uuid(), destination: "Knoxville, TN", property_name: "Hampton Inn Downtown Knoxville", stars: 3, cash_per_night: 89, points_per_night: 22000, address: "618 W Main St, Knoxville, TN", amenities: ["breakfast", "fitness", "wifi"] },
  { id: uuid(), destination: "Savannah, GA", property_name: "Hilton Savannah DeSoto", stars: 4, cash_per_night: 179, points_per_night: 44000, address: "15 E Liberty St, Savannah, GA", amenities: ["pool", "rooftop bar", "restaurant", "spa"] },
  { id: uuid(), destination: "Savannah, GA", property_name: "Hampton Inn Savannah Historic", stars: 3, cash_per_night: 119, points_per_night: 28000, address: "201 E Bay St, Savannah, GA", amenities: ["breakfast", "fitness", "wifi"] },
  { id: uuid(), destination: "Roanoke, VA", property_name: "Hampton Inn Roanoke Downtown", stars: 3, cash_per_night: 99, points_per_night: 24000, address: "527 Williamson Rd, Roanoke, VA", amenities: ["breakfast", "fitness", "wifi"] },
  { id: uuid(), destination: "Pittsburgh, PA", property_name: "Hilton Garden Inn Pittsburgh", stars: 3, cash_per_night: 139, points_per_night: 34000, address: "250 Forbes Ave, Pittsburgh, PA", amenities: ["restaurant", "fitness", "wifi"] },
  { id: uuid(), destination: "Pittsburgh, PA", property_name: "DoubleTree by Hilton Pittsburgh", stars: 4, cash_per_night: 159, points_per_night: 38000, address: "1 Bigelow Square, Pittsburgh, PA", amenities: ["restaurant", "pool", "fitness", "cookies"] },
  { id: uuid(), destination: "Asheville, NC", property_name: "Hilton Asheville Biltmore Park", stars: 4, cash_per_night: 189, points_per_night: 46000, address: "43 Town Square Blvd, Asheville, NC", amenities: ["pool", "spa", "restaurant", "fitness"] },
  { id: uuid(), destination: "Asheville, NC", property_name: "Home2 Suites Asheville Downtown", stars: 3, cash_per_night: 139, points_per_night: 30000, address: "50 N Spruce St, Asheville, NC", amenities: ["kitchen", "fitness", "wifi", "laundry"] },
  { id: uuid(), destination: "Memphis, TN", property_name: "Hilton Memphis", stars: 4, cash_per_night: 149, points_per_night: 36000, address: "939 Ridge Lake Blvd, Memphis, TN", amenities: ["pool", "restaurant", "fitness"] },
  { id: uuid(), destination: "Greenville, SC", property_name: "Hilton Greenville", stars: 4, cash_per_night: 139, points_per_night: 34000, address: "45 W Orchard Park Dr, Greenville, SC", amenities: ["pool", "restaurant", "fitness"] },
  { id: uuid(), destination: "Columbus, OH", property_name: "Hilton Columbus Downtown", stars: 4, cash_per_night: 159, points_per_night: 38000, address: "401 N High St, Columbus, OH", amenities: ["pool", "restaurant", "fitness", "skywalk"] },
  { id: uuid(), destination: "Richmond, VA", property_name: "Hilton Richmond Downtown", stars: 4, cash_per_night: 149, points_per_night: 36000, address: "501 E Broad St, Richmond, VA", amenities: ["restaurant", "fitness", "rooftop"] },
];

const TRIPS = [];
const USERS = [];
const LOYALTY_ACCOUNTS = [];
const ALERT_SUBSCRIPTIONS = [];
const SESSIONS = {}; // token -> user_id

// ── Helpers ───────────────────────────────────────────────────────────

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function parseUrl(req) {
  const url = new URL(req.url, 'http://localhost');
  return { pathname: url.pathname, params: url.searchParams };
}

function json(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(data));
}

function getUser(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  const userId = SESSIONS[token];
  if (!userId) return null;
  return USERS.find(u => u.id === userId) || null;
}

function safeUser(u) {
  const { password_hash, ...rest } = u;
  return rest;
}

// ── Fallback itinerary ────────────────────────────────────────────────

const FALLBACK_ITINERARY = {
  destination: "Unknown",
  slots: [
    { label: "Friday Evening", key: "fri_evening",
      choiceA: { name: "Welcome Dinner at Local Favorite", type: "dining", description: "Start your trip with a meal at the top-rated local spot. Fresh ingredients, warm atmosphere, and a taste of what this city does best.", vibe: "cozy authentic", cost: "$$", neighborhood: "Downtown", proTip: "Ask for the chef's special — it's never on the menu." },
      choiceB: { name: "Sunset Walking Tour", type: "activity", description: "Explore the historic district as golden hour lights up the architecture. A self-guided walk hitting the major landmarks and hidden alleys.", vibe: "scenic relaxed", cost: "$", neighborhood: "Historic District", proTip: "Download the free audio guide before you go." } },
    { label: "Saturday Morning", key: "sat_morning",
      choiceA: { name: "Farmers Market & Coffee", type: "food", description: "Browse the weekend market for local bites and artisan goods. Grab a pourover from the roaster everyone's talking about.", vibe: "chill vibrant", cost: "$", neighborhood: "Market District", proTip: "Get there before 10 AM for the best pastry selection." },
      choiceB: { name: "Morning Hike with Views", type: "outdoors", description: "A moderate trail that rewards you with panoramic views of the city. Pack water and wear layers — the morning air is crisp.", vibe: "energizing scenic", cost: "$", neighborhood: "Outskirts", proTip: "The trailhead parking fills up fast on weekends." } },
    { label: "Saturday Afternoon", key: "sat_afternoon",
      choiceA: { name: "Local Museum Deep Dive", type: "culture", description: "A thoughtfully curated collection that tells this city's story. Plan for 2 hours, but you'll want to stay longer.", vibe: "thoughtful inspiring", cost: "$$", neighborhood: "Arts District", proTip: "The rooftop terrace has the best free view in the city." },
      choiceB: { name: "Brewery Crawl", type: "drinks", description: "Three walkable taprooms, each with a completely different vibe. Start light and work your way to the IPAs.", vibe: "social fun", cost: "$$", neighborhood: "Brewery Row", proTip: "Most places offer a flight sampler — great way to try everything." } },
    { label: "Saturday Evening", key: "sat_evening",
      choiceA: { name: "Chef's Table Experience", type: "dining", description: "A prix fixe dinner at the city's most talked-about restaurant. Seasonal menu, natural wines, and impeccable service.", vibe: "elevated memorable", cost: "$$$", neighborhood: "Waterfront", proTip: "Book the 7:30 seating for the best kitchen view." },
      choiceB: { name: "Street Food & Live Music", type: "nightlife", description: "An open-air food hall with rotating vendors and a stage that always has someone playing. Low-key, high-flavor.", vibe: "lively casual", cost: "$", neighborhood: "South End", proTip: "The BBQ truck has a cult following — get in line early." } },
    { label: "Saturday Night", key: "sat_night",
      choiceA: { name: "Rooftop Cocktail Bar", type: "nightlife", description: "Craft cocktails with a skyline backdrop. The kind of place where you end up staying way later than planned.", vibe: "sleek chill", cost: "$$", neighborhood: "Downtown", proTip: "The signature old fashioned is worth the $16." },
      choiceB: { name: "Late-Night Comedy Show", type: "entertainment", description: "A small-room comedy club with both touring headliners and sharp local talent. BYOB-friendly if you ask nicely.", vibe: "hilarious intimate", cost: "$$", neighborhood: "Midtown", proTip: "Sit in the third row — close enough to feel it, far enough to avoid being picked on." } },
    { label: "Sunday Morning", key: "sun_morning",
      choiceA: { name: "Brunch at the Iconic Spot", type: "dining", description: "The brunch place that started the trend. Expect a short wait, but the biscuits and gravy are a religious experience.", vibe: "indulgent classic", cost: "$$", neighborhood: "Main Street", proTip: "Order one sweet and one savory — you won't regret it." },
      choiceB: { name: "Sunrise Yoga in the Park", type: "wellness", description: "A free community yoga class in the main park. Bring your own mat. The perfect way to close out a weekend before heading to the airport.", vibe: "peaceful grounding", cost: "$", neighborhood: "Central Park", proTip: "They usually wrap up with free cold brew from a local sponsor." } },
  ],
};

// ── Route handlers ────────────────────────────────────────────────────

async function handleAuth(method, path, req, res) {
  if (path === '/auth/signup' && method === 'POST') {
    const body = await parseBody(req);
    const { email, password, home_airport = 'CLT' } = body;

    if (USERS.find(u => u.email === email)) {
      return json(res, { detail: 'Email already registered' }, 400);
    }

    const user = {
      id: uuid(), email, password_hash: hashPassword(password),
      home_airport, pax_default: 1, budget_max: 300,
      max_flight_minutes: 120, interests: [], points_first: true,
    };
    USERS.push(user);

    for (const [program, balance] of [['Hilton Honors', 0], ['Amex MR', 0], ['Chase UR', 0]]) {
      LOYALTY_ACCOUNTS.push({ id: uuid(), user_id: user.id, program, points_balance: balance, tier: null });
    }

    const token = crypto.randomBytes(32).toString('base64url');
    SESSIONS[token] = user.id;
    return json(res, { user: safeUser(user), token });
  }

  if (path === '/auth/login' && method === 'POST') {
    const body = await parseBody(req);
    const { email, password } = body;
    const hash = hashPassword(password);
    const user = USERS.find(u => u.email === email && u.password_hash === hash);
    if (!user) return json(res, { detail: 'Invalid email or password' }, 401);

    const token = crypto.randomBytes(32).toString('base64url');
    SESSIONS[token] = user.id;
    return json(res, { user: safeUser(user), token });
  }

  if (path === '/auth/me' && method === 'GET') {
    const user = getUser(req);
    if (!user) return json(res, { detail: 'Not authenticated' }, 401);
    return json(res, { user: safeUser(user) });
  }

  if (path === '/auth/logout' && method === 'POST') {
    const user = getUser(req);
    if (!user) return json(res, { detail: 'Not authenticated' }, 401);
    for (const [t, uid] of Object.entries(SESSIONS)) {
      if (uid === user.id) delete SESSIONS[t];
    }
    return json(res, { status: 'logged out' });
  }

  if (path === '/auth/profile' && method === 'PUT') {
    const user = getUser(req);
    if (!user) return json(res, { detail: 'Not authenticated' }, 401);
    const body = await parseBody(req);
    for (const key of ['home_airport', 'pax_default', 'budget_max', 'max_flight_minutes', 'interests', 'points_first']) {
      if (body[key] !== undefined) user[key] = body[key];
    }
    return json(res, { user: safeUser(user) });
  }

  return null; // not handled
}

function handleDeals(method, path, params, req, res) {
  if (path === '/deals/scan' && method === 'POST') {
    const origin = params.get('origin') || 'CLT';
    return json(res, {
      status: 'no_new_deals', source: 'none', deals_found: 0, origin,
      message: 'Using existing seed deals.',
    });
  }

  if (path === '/deals' && method === 'GET') {
    const origin = params.get('origin') || 'CLT';
    const pax = parseInt(params.get('pax') || '1');
    const maxBudget = parseInt(params.get('max_budget') || '600');
    const interests = params.get('interests');
    const airlines = params.get('airlines');
    const pointsFirst = params.get('points_first') !== 'false';

    let filtered = DEALS.filter(d => d.origin === origin && d.active);

    // Budget filter
    filtered = filtered.filter(d => {
      const total = (d.flight_price_per_pax * pax) + (d.hotel_price_per_night * 2);
      return total <= maxBudget * pax || maxBudget >= 600;
    });

    // Interests filter
    if (interests) {
      const interestList = interests.split(',').map(s => s.trim());
      filtered = filtered.filter(d =>
        interestList.some(i => (d.interests || []).includes(i))
      );
    }

    // Airlines filter
    if (airlines) {
      const airlineList = airlines.split(',').map(s => s.trim());
      filtered = filtered.filter(d => airlineList.includes(d.airline));
    }

    // Sort
    const tierOrder = { insane: 0, steal: 1, hot: 2, watch: 3, gone: 4 };
    if (pointsFirst) {
      filtered.sort((a, b) =>
        (a.hilton_available ? 0 : 1) - (b.hilton_available ? 0 : 1) ||
        (tierOrder[a.tier] || 3) - (tierOrder[b.tier] || 3) ||
        a.flight_price_per_pax - b.flight_price_per_pax
      );
    } else {
      filtered.sort((a, b) =>
        (tierOrder[a.tier] || 3) - (tierOrder[b.tier] || 3) ||
        a.flight_price_per_pax - b.flight_price_per_pax
      );
    }

    return json(res, { deals: filtered, count: filtered.length });
  }

  // GET /deals/:id
  const dealMatch = path.match(/^\/deals\/([^/]+)$/);
  if (dealMatch && method === 'GET') {
    const deal = DEALS.find(d => d.id === dealMatch[1]);
    if (!deal) return json(res, { error: 'Deal not found' }, 404);
    const hiltonProps = HILTON_PROPERTIES.filter(h => h.destination === deal.destination);
    return json(res, { ...deal, hilton_properties: hiltonProps });
  }

  return null;
}

async function handleItinerary(method, path, req, res) {
  if (path === '/itinerary/generate' && method === 'POST') {
    const body = await parseBody(req);
    const { deal_id, pax = 1, interests = [] } = body;

    const deal = DEALS.find(d => d.id === deal_id);
    if (!deal) return json(res, { error: 'Deal not found' }, 404);

    // Use fallback itinerary (Claude API integration would go here)
    const itinerary = { ...FALLBACK_ITINERARY, destination: deal.destination };

    const trip = {
      id: uuid(), deal_id, user_id: null, itinerary,
      status: 'planned', selections: null, hotel_mode: null,
      calendar_synced: false,
      total_cash_cost: (deal.flight_price_per_pax * pax) + (deal.hotel_price_per_night * 2),
      total_points_used: null,
      created_at: new Date().toISOString(),
    };
    TRIPS.push(trip);

    return json(res, { itinerary, trip_id: trip.id, deal });
  }
  return null;
}

function handleCalendar(method, path, req, res) {
  if (path === '/calendar/add-events' && method === 'POST') {
    return parseBody(req).then(body => {
      const trip = TRIPS.find(t => t.id === body.trip_id);
      if (!trip) return json(res, { error: 'Trip not found' }, 404);
      const slots = trip.itinerary ? trip.itinerary.slots || [] : [];
      trip.calendar_synced = true;
      return json(res, { events_added: slots.length });
    });
  }
  return null;
}

function handleWallet(method, path, req, res) {
  const walletMatch = path.match(/^\/wallet\/([^/]+)$/);
  if (walletMatch && method === 'GET') {
    const accounts = LOYALTY_ACCOUNTS.filter(a => a.user_id === walletMatch[1]);
    return json(res, { accounts });
  }
  if (path === '/wallet' && method === 'POST') {
    return parseBody(req).then(body => {
      const account = {
        id: uuid(), user_id: body.user_id, program: body.program,
        points_balance: body.points_balance || 0, tier: body.tier || null,
      };
      LOYALTY_ACCOUNTS.push(account);
      return json(res, { account });
    });
  }
  return null;
}

function handleAlerts(method, path, req, res) {
  if (path === '/alerts/subscribe' && method === 'POST') {
    return parseBody(req).then(body => {
      const sub = {
        id: uuid(), user_id: body.user_id, push_endpoint: body.push_endpoint,
        push_keys: body.push_keys, active: true,
      };
      ALERT_SUBSCRIPTIONS.push(sub);
      return json(res, { status: 'subscribed', data: sub });
    });
  }
  if (path === '/alerts/unsubscribe' && method === 'POST') {
    return parseBody(req).then(body => {
      ALERT_SUBSCRIPTIONS.forEach(sub => {
        if (sub.user_id === body.user_id) sub.active = false;
      });
      return json(res, { status: 'unsubscribed' });
    });
  }
  return null;
}

// ── Server ────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const { pathname, params } = parseUrl(req);
  const method = req.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    return res.end();
  }

  try {
    // Root
    if (pathname === '/' && method === 'GET') {
      return json(res, { app: 'GoneByFriday', version: '1.0.0', status: 'running' });
    }
    if (pathname === '/health' && method === 'GET') {
      return json(res, { status: 'ok' });
    }

    // Auth
    if (pathname.startsWith('/auth')) {
      const result = await handleAuth(method, pathname, req, res);
      if (result !== null) return;
    }

    // Deals
    if (pathname.startsWith('/deals')) {
      const result = handleDeals(method, pathname, params, req, res);
      if (result !== null) return;
    }

    // Itinerary
    if (pathname.startsWith('/itinerary')) {
      const result = await handleItinerary(method, pathname, req, res);
      if (result !== null) return;
    }

    // Calendar
    if (pathname.startsWith('/calendar')) {
      const result = await handleCalendar(method, pathname, req, res);
      if (result !== null) return;
    }

    // Wallet
    if (pathname.startsWith('/wallet')) {
      const result = await handleWallet(method, pathname, req, res);
      if (result !== null) return;
    }

    // Alerts
    if (pathname.startsWith('/alerts')) {
      const result = await handleAlerts(method, pathname, req, res);
      if (result !== null) return;
    }

    json(res, { error: 'Not found' }, 404);
  } catch (err) {
    console.error('Server error:', err);
    json(res, { error: 'Internal server error' }, 500);
  }
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`GoneByFriday API running on http://0.0.0.0:${PORT}`);
});
