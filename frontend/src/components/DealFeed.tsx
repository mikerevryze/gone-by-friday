import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchDeals } from '../lib/api'
import type { Deal, SortMode } from '../types'

const MOCK_DEALS: Deal[] = [
  { id: '1', origin: 'CLT', destination: 'Knoxville, TN', destination_short: 'TYS', flag: '🏔️', flight_price_per_pax: 18, hotel_price_per_night: 89, airline: 'Contour', seats_remaining: 8, departs_at: '', returns_at: '', gate: 'E4', tier: 'insane', interests: ['outdoors','food','breweries'], hilton_available: true, active: true, expires_at: null, created_at: '' },
  { id: '2', origin: 'CLT', destination: 'Savannah, GA', destination_short: 'SAV', flag: '🌿', flight_price_per_pax: 29, hotel_price_per_night: 119, airline: 'Avelo', seats_remaining: 6, departs_at: '', returns_at: '', gate: 'B12', tier: 'steal', interests: ['history','food','nightlife'], hilton_available: true, active: true, expires_at: null, created_at: '' },
  { id: '3', origin: 'CLT', destination: 'Roanoke, VA', destination_short: 'ROA', flag: '🌄', flight_price_per_pax: 24, hotel_price_per_night: 79, airline: 'Contour', seats_remaining: 5, departs_at: '', returns_at: '', gate: 'E2', tier: 'insane', interests: ['outdoors','hiking','breweries'], hilton_available: true, active: true, expires_at: null, created_at: '' },
  { id: '4', origin: 'CLT', destination: 'Pittsburgh, PA', destination_short: 'PIT', flag: '🏗️', flight_price_per_pax: 39, hotel_price_per_night: 109, airline: 'Breeze', seats_remaining: 12, departs_at: '', returns_at: '', gate: 'A8', tier: 'steal', interests: ['food','sports','museums'], hilton_available: true, active: true, expires_at: null, created_at: '' },
  { id: '5', origin: 'CLT', destination: 'Lynchburg, VA', destination_short: 'LYH', flag: '🍂', flight_price_per_pax: 18, hotel_price_per_night: 69, airline: 'Contour', seats_remaining: 4, departs_at: '', returns_at: '', gate: 'E1', tier: 'insane', interests: ['outdoors','history','breweries'], hilton_available: false, active: true, expires_at: null, created_at: '' },
  { id: '6', origin: 'CLT', destination: 'Asheville, NC', destination_short: 'AVL', flag: '🎨', flight_price_per_pax: 31, hotel_price_per_night: 139, airline: 'Contour', seats_remaining: 9, departs_at: '', returns_at: '', gate: 'E6', tier: 'steal', interests: ['food','breweries','art'], hilton_available: true, active: true, expires_at: null, created_at: '' },
  { id: '7', origin: 'CLT', destination: 'Memphis, TN', destination_short: 'MEM', flag: '🎵', flight_price_per_pax: 59, hotel_price_per_night: 99, airline: 'Delta', seats_remaining: 15, departs_at: '', returns_at: '', gate: 'C14', tier: 'hot', interests: ['music','food','nightlife'], hilton_available: true, active: true, expires_at: null, created_at: '' },
  { id: '8', origin: 'CLT', destination: 'Greenville, SC', destination_short: 'GSP', flag: '🌳', flight_price_per_pax: 0, hotel_price_per_night: 89, airline: 'Drive', seats_remaining: null, departs_at: '', returns_at: '', gate: null, tier: 'insane', interests: ['food','outdoors','breweries'], hilton_available: true, active: true, expires_at: null, created_at: '' },
  { id: '9', origin: 'CLT', destination: 'Columbus, OH', destination_short: 'CMH', flag: '🏈', flight_price_per_pax: 44, hotel_price_per_night: 99, airline: 'Breeze', seats_remaining: 10, departs_at: '', returns_at: '', gate: 'A4', tier: 'steal', interests: ['food','sports','nightlife'], hilton_available: true, active: true, expires_at: null, created_at: '' },
  { id: '10', origin: 'CLT', destination: 'Richmond, VA', destination_short: 'RIC', flag: '🏛️', flight_price_per_pax: 63, hotel_price_per_night: 109, airline: 'American', seats_remaining: 7, departs_at: '', returns_at: '', gate: 'B6', tier: 'hot', interests: ['history','food','art'], hilton_available: true, active: true, expires_at: null, created_at: '' },
]

const TIER_COLORS: Record<string, string> = {
  insane: 'bg-green-bg text-green',
  steal: 'bg-green-bg text-green',
  hot: 'bg-amber-bg text-amber',
  watch: 'bg-faint text-sub',
  gone: 'bg-faint text-sub line-through',
}

export default function DealFeed() {
  const navigate = useNavigate()
  const [deals, setDeals] = useState<Deal[]>([])
  const [sort, setSort] = useState<SortMode>('best')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeals({ origin: 'CLT' })
      .then((data) => setDeals(data.deals))
      .catch(() => setDeals(MOCK_DEALS))
      .finally(() => setLoading(false))
  }, [])

  const sorted = [...deals].sort((a, b) => {
    if (sort === 'price') return a.flight_price_per_pax - b.flight_price_per_pax
    if (sort === 'seats')
      return (a.seats_remaining ?? 99) - (b.seats_remaining ?? 99)
    // 'best' — tier order
    const order: Record<string, number> = { insane: 0, steal: 1, hot: 2, watch: 3, gone: 4 }
    return (order[a.tier] ?? 3) - (order[b.tier] ?? 3)
  })

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-5 pt-8 pb-2 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-2xl">Weekend Deals</h1>
          <p className="text-sub text-sm mt-0.5">From CLT · This Friday</p>
        </div>
        <span className="text-xs text-sub">{deals.length} deals</span>
      </div>

      {/* Sort */}
      <div className="px-5 py-3 flex gap-2">
        {(['best', 'price', 'seats'] as SortMode[]).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              sort === s ? 'bg-text text-white' : 'bg-faint text-sub'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Deal cards */}
      {loading ? (
        <div className="px-5 py-12 text-center text-sub">Loading deals...</div>
      ) : (
        <div className="px-5 space-y-3">
          {sorted.map((deal) => {
            const isExpanded = expanded === deal.id
            return (
              <div
                key={deal.id}
                className="bg-surface rounded-2xl border border-border overflow-hidden"
              >
                {/* Card header */}
                <button
                  onClick={() =>
                    setExpanded(isExpanded ? null : deal.id)
                  }
                  className="w-full p-4 flex items-center gap-3 text-left"
                >
                  <span className="text-2xl">{deal.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">
                        {deal.destination}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          TIER_COLORS[deal.tier] || TIER_COLORS.watch
                        }`}
                      >
                        {deal.tier}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-sub mt-0.5">
                      <span>{deal.airline}</span>
                      <span>·</span>
                      <span>{deal.destination_short}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-2xl">${deal.flight_price_per_pax}</div>
                    <div className="text-[10px] text-sub">/person</div>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-xs text-sub">Flight</div>
                        <div className="font-serif text-lg">
                          ${deal.flight_price_per_pax}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-sub">Hotel/night</div>
                        <div className="font-serif text-lg">
                          ${deal.hotel_price_per_night}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-sub">Total (2 nights)</div>
                        <div className="font-serif text-lg">
                          $
                          {deal.flight_price_per_pax +
                            deal.hotel_price_per_night * 2}
                        </div>
                      </div>
                    </div>

                    {deal.hilton_available && (
                      <div className="bg-gold-bg text-gold text-xs font-medium px-3 py-2 rounded-xl">
                        Hilton available — use points for hotel
                      </div>
                    )}

                    {deal.seats_remaining !== null &&
                      deal.seats_remaining <= 4 && (
                        <div className="bg-amber-bg text-amber text-xs font-medium px-3 py-1.5 rounded-full inline-block">
                          {deal.seats_remaining} seats left
                        </div>
                      )}

                    <button
                      onClick={() => navigate(`/build/${deal.id}`)}
                      className="w-full py-3 rounded-xl bg-text text-white font-semibold text-sm"
                    >
                      Build my weekend →
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
