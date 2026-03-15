-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  home_airport text default 'CLT',
  pax_default int default 1,
  budget_max int default 300,
  max_flight_minutes int default 120,
  interests text[] default '{}',
  points_first bool default true,
  push_token text,
  created_at timestamptz default now()
);

-- Loyalty programs per user
create table loyalty_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  program text not null,
  points_balance int default 0,
  tier text,
  last_synced timestamptz
);

-- Live deals (refreshed by scraper cron)
create table deals (
  id uuid primary key default gen_random_uuid(),
  origin text not null,
  destination text not null,
  destination_short text,
  flag text,
  flight_price_per_pax int not null,
  hotel_price_per_night int not null,
  airline text not null,
  seats_remaining int,
  departs_at timestamptz,
  returns_at timestamptz,
  gate text,
  tier text,
  interests text[] default '{}',
  hilton_available bool default false,
  active bool default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Hilton properties per destination
create table hilton_properties (
  id uuid primary key default gen_random_uuid(),
  destination text not null,
  property_name text,
  stars int,
  cash_per_night int,
  points_per_night int,
  address text,
  amenities text[] default '{}'
);

-- Booked / planned trips per user
create table trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  deal_id uuid references deals(id),
  itinerary jsonb,
  selections jsonb,
  hotel_mode text,
  status text default 'planned',
  calendar_synced bool default false,
  total_cash_cost int,
  total_points_used int,
  created_at timestamptz default now()
);

-- Alert subscriptions
create table alert_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  push_endpoint text,
  push_keys jsonb,
  active bool default true,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index idx_deals_origin on deals(origin);
create index idx_deals_active on deals(active);
create index idx_deals_tier on deals(tier);
create index idx_trips_user_id on trips(user_id);
create index idx_loyalty_user_id on loyalty_accounts(user_id);
create index idx_hilton_destination on hilton_properties(destination);

-- Seed deals (CLT departures, next Friday)
insert into deals (origin, destination, destination_short, flag, flight_price_per_pax, hotel_price_per_night, airline, seats_remaining, departs_at, returns_at, gate, tier, interests, hilton_available) values
  ('CLT', 'Knoxville, TN', 'TYS', '🏔️', 18, 89, 'Contour', 8, now() + interval '5 days', now() + interval '7 days', 'E4', 'insane', '{"outdoors","food","breweries"}', true),
  ('CLT', 'Savannah, GA', 'SAV', '🌿', 29, 119, 'Avelo', 6, now() + interval '5 days', now() + interval '7 days', 'B12', 'steal', '{"history","food","nightlife","architecture"}', true),
  ('CLT', 'Roanoke, VA', 'ROA', '🌄', 24, 79, 'Contour', 5, now() + interval '5 days', now() + interval '7 days', 'E2', 'insane', '{"outdoors","hiking","breweries"}', true),
  ('CLT', 'Pittsburgh, PA', 'PIT', '🏗️', 39, 109, 'Breeze', 12, now() + interval '5 days', now() + interval '7 days', 'A8', 'steal', '{"food","sports","museums","nightlife"}', true),
  ('CLT', 'Lynchburg, VA', 'LYH', '🍂', 18, 69, 'Contour', 4, now() + interval '5 days', now() + interval '7 days', 'E1', 'insane', '{"outdoors","history","breweries"}', false),
  ('CLT', 'Asheville, NC', 'AVL', '🎨', 31, 139, 'Contour', 9, now() + interval '5 days', now() + interval '7 days', 'E6', 'steal', '{"food","breweries","art","outdoors"}', true),
  ('CLT', 'Memphis, TN', 'MEM', '🎵', 59, 99, 'Delta', 15, now() + interval '5 days', now() + interval '7 days', 'C14', 'hot', '{"music","food","nightlife","history"}', true),
  ('CLT', 'Greenville, SC', 'GSP', '🌳', 0, 89, 'Drive', null, now() + interval '5 days', now() + interval '7 days', null, 'insane', '{"food","outdoors","breweries","family"}', true),
  ('CLT', 'Columbus, OH', 'CMH', '🏈', 44, 99, 'Breeze', 10, now() + interval '5 days', now() + interval '7 days', 'A4', 'steal', '{"food","sports","nightlife","museums"}', true),
  ('CLT', 'Richmond, VA', 'RIC', '🏛️', 63, 109, 'American', 7, now() + interval '5 days', now() + interval '7 days', 'B6', 'hot', '{"history","food","art","breweries"}', true);

-- Seed Hilton properties
insert into hilton_properties (destination, property_name, stars, cash_per_night, points_per_night, address, amenities) values
  ('Knoxville, TN', 'Hilton Knoxville', 4, 129, 32000, '501 W Church Ave, Knoxville, TN', '{"pool","fitness","restaurant"}'),
  ('Knoxville, TN', 'Hampton Inn Downtown Knoxville', 3, 89, 22000, '618 W Main St, Knoxville, TN', '{"breakfast","fitness","wifi"}'),
  ('Savannah, GA', 'Hilton Savannah DeSoto', 4, 179, 44000, '15 E Liberty St, Savannah, GA', '{"pool","rooftop bar","restaurant","spa"}'),
  ('Savannah, GA', 'Hampton Inn Savannah Historic', 3, 119, 28000, '201 E Bay St, Savannah, GA', '{"breakfast","fitness","wifi"}'),
  ('Roanoke, VA', 'Hampton Inn Roanoke Downtown', 3, 99, 24000, '527 Williamson Rd, Roanoke, VA', '{"breakfast","fitness","wifi"}'),
  ('Pittsburgh, PA', 'Hilton Garden Inn Pittsburgh', 3, 139, 34000, '250 Forbes Ave, Pittsburgh, PA', '{"restaurant","fitness","wifi"}'),
  ('Pittsburgh, PA', 'DoubleTree by Hilton Pittsburgh', 4, 159, 38000, '1 Bigelow Square, Pittsburgh, PA', '{"restaurant","pool","fitness","cookies"}'),
  ('Asheville, NC', 'Hilton Asheville Biltmore Park', 4, 189, 46000, '43 Town Square Blvd, Asheville, NC', '{"pool","spa","restaurant","fitness"}'),
  ('Asheville, NC', 'Home2 Suites Asheville Downtown', 3, 139, 30000, '50 N Spruce St, Asheville, NC', '{"kitchen","fitness","wifi","laundry"}'),
  ('Memphis, TN', 'Hilton Memphis', 4, 149, 36000, '939 Ridge Lake Blvd, Memphis, TN', '{"pool","restaurant","fitness"}'),
  ('Greenville, SC', 'Hilton Greenville', 4, 139, 34000, '45 W Orchard Park Dr, Greenville, SC', '{"pool","restaurant","fitness"}'),
  ('Columbus, OH', 'Hilton Columbus Downtown', 4, 159, 38000, '401 N High St, Columbus, OH', '{"pool","restaurant","fitness","skywalk"}'),
  ('Richmond, VA', 'Hilton Richmond Downtown', 4, 149, 36000, '501 E Broad St, Richmond, VA', '{"restaurant","fitness","rooftop"}');
