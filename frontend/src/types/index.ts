export interface UserProfile {
  id: string
  email: string
  home_airport: string
  pax_default: number
  budget_max: number
  max_flight_minutes: number
  interests: string[]
  points_first: boolean
  push_token: string | null
  created_at: string
}

export interface LoyaltyAccount {
  id: string
  user_id: string
  program: string
  points_balance: number
  tier: string | null
  last_synced: string | null
}

export interface Deal {
  id: string
  origin: string
  destination: string
  destination_short: string | null
  flag: string
  flight_price_per_pax: number
  hotel_price_per_night: number
  airline: string
  seats_remaining: number | null
  departs_at: string
  returns_at: string
  gate: string | null
  tier: string
  interests: string[]
  hilton_available: boolean
  active: boolean
  expires_at: string | null
  created_at: string
  hilton_properties?: HiltonProperty[]
}

export interface HiltonProperty {
  id: string
  destination: string
  property_name: string
  stars: number
  cash_per_night: number
  points_per_night: number
  address: string
  amenities: string[]
}

export interface ItineraryChoice {
  name: string
  type: string
  description: string
  vibe: string
  cost: string
  neighborhood: string
  proTip: string
}

export interface TimeSlot {
  label: string
  key: string
  choiceA: ItineraryChoice
  choiceB: ItineraryChoice
}

export interface Itinerary {
  destination: string
  slots: TimeSlot[]
}

export interface Trip {
  id: string
  user_id: string
  deal_id: string
  itinerary: Itinerary | null
  selections: Record<string, 'A' | 'B'> | null
  hotel_mode: 'points' | 'cash'
  status: 'planned' | 'booked' | 'completed'
  calendar_synced: boolean
  total_cash_cost: number | null
  total_points_used: number | null
  created_at: string
}

export interface AlertSubscription {
  id: string
  user_id: string
  push_endpoint: string
  push_keys: Record<string, string>
  active: boolean
  created_at: string
}

export type DealTier = 'insane' | 'steal' | 'hot' | 'watch' | 'gone'
export type SortMode = 'best' | 'price' | 'seats'

export interface FilterState {
  origin: string
  pax: number
  budget_max: number
  max_flight_minutes: number
  interests: string[]
  points_first: boolean
}
