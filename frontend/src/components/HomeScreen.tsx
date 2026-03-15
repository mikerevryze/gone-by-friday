import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchDeals } from '../lib/api'
import type { FilterState } from '../types'

const AIRPORTS = ['CLT', 'ATL', 'RDU', 'GSO']
const INTERESTS = [
  'food', 'outdoors', 'breweries', 'nightlife', 'history',
  'music', 'art', 'sports', 'museums', 'family',
]
const PROGRAMS = [
  { id: 'hilton', label: 'Hilton Honors', balance: 124000 },
  { id: 'amex_mr', label: 'Amex MR', balance: 86000 },
  { id: 'chase_ur', label: 'Chase UR', balance: 52000 },
  { id: 'delta', label: 'Delta SkyMiles', balance: 31000 },
]

export default function HomeScreen() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FilterState>({
    origin: 'CLT',
    pax: 1,
    budget_max: 300,
    max_flight_minutes: 120,
    interests: [],
    points_first: true,
  })
  const [matchCount, setMatchCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await fetchDeals({
          origin: filters.origin,
          pax: filters.pax,
          max_budget: filters.budget_max,
          interests: filters.interests,
          points_first: filters.points_first,
        })
        setMatchCount(data.count)
      } catch {
        setMatchCount(0)
      }
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [filters])

  const toggleInterest = (interest: string) => {
    setFilters((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }))
  }

  const flightTimeLabel =
    filters.max_flight_minutes >= 240 ? 'Any' : `${filters.max_flight_minutes}min`

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <h1 className="font-serif text-3xl text-text">GoneByFriday</h1>
        <p className="text-sub text-sm mt-1">Find your weekend escape</p>
      </div>

      {/* Departing from */}
      <section className="px-5 py-4 border-b border-border">
        <h3 className="text-xs font-semibold text-sub uppercase tracking-wide mb-3">
          Departing from
        </h3>
        <div className="flex gap-2">
          {AIRPORTS.map((code) => (
            <button
              key={code}
              onClick={() => setFilters((f) => ({ ...f, origin: code }))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.origin === code
                  ? 'bg-text text-white'
                  : 'bg-faint text-sub'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </section>

      {/* Travelers */}
      <section className="px-5 py-4 border-b border-border">
        <h3 className="text-xs font-semibold text-sub uppercase tracking-wide mb-3">
          Travelers
        </h3>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setFilters((f) => ({ ...f, pax: n }))}
              className={`w-12 h-12 rounded-xl text-sm font-semibold transition-colors ${
                filters.pax === n
                  ? 'bg-text text-white'
                  : 'bg-faint text-sub'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      {/* Budget */}
      <section className="px-5 py-4 border-b border-border">
        <h3 className="text-xs font-semibold text-sub uppercase tracking-wide mb-3">
          Budget per person
        </h3>
        <div className="font-serif text-4xl text-text mb-3">
          ${filters.budget_max}
        </div>
        <input
          type="range"
          min={100}
          max={600}
          step={25}
          value={filters.budget_max}
          onChange={(e) =>
            setFilters((f) => ({ ...f, budget_max: Number(e.target.value) }))
          }
          className="w-full"
        />
        <div className="flex justify-between text-xs text-sub mt-1">
          <span>$100</span>
          <span>$600</span>
        </div>
      </section>

      {/* Max flight time */}
      <section className="px-5 py-4 border-b border-border">
        <h3 className="text-xs font-semibold text-sub uppercase tracking-wide mb-3">
          Max flight time
        </h3>
        <div className="font-serif text-4xl text-text mb-3">{flightTimeLabel}</div>
        <input
          type="range"
          min={30}
          max={240}
          step={15}
          value={filters.max_flight_minutes}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              max_flight_minutes: Number(e.target.value),
            }))
          }
          className="w-full"
        />
        <div className="flex justify-between text-xs text-sub mt-1">
          <span>30min</span>
          <span>Any</span>
        </div>
      </section>

      {/* Interests */}
      <section className="px-5 py-4 border-b border-border">
        <h3 className="text-xs font-semibold text-sub uppercase tracking-wide mb-3">
          What you're into
        </h3>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const active = filters.interests.includes(interest)
            return (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active ? 'bg-text text-white' : 'bg-faint text-sub'
                }`}
              >
                {interest}
              </button>
            )
          })}
        </div>
      </section>

      {/* Points programs */}
      <section className="px-5 py-4 border-b border-border">
        <h3 className="text-xs font-semibold text-sub uppercase tracking-wide mb-3">
          Points programs
        </h3>
        <div className="space-y-3">
          {PROGRAMS.map((p) => (
            <div key={p.id} className="flex items-center justify-between">
              <span className="text-sm font-medium">{p.label}</span>
              <span className="text-sm text-sub font-serif">
                {p.balance.toLocaleString()} pts
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <span className="text-sm font-medium">Points hotels only</span>
          <button
            onClick={() =>
              setFilters((f) => ({ ...f, points_first: !f.points_first }))
            }
            className={`w-11 h-6 rounded-full transition-colors relative ${
              filters.points_first ? 'bg-green' : 'bg-border'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                filters.points_first ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Match preview */}
      <section className="px-5 py-4">
        <div className="bg-faint rounded-2xl p-4 text-center">
          {loading ? (
            <p className="text-sub text-sm">Searching...</p>
          ) : (
            <p className="text-sm">
              <span className="font-serif text-2xl text-text">{matchCount}</span>
              <span className="text-sub ml-2">
                deal{matchCount !== 1 ? 's' : ''} match your criteria
              </span>
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <div className="px-5 pb-4">
        <button
          disabled={matchCount === 0}
          onClick={() => navigate('/deals')}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-colors ${
            matchCount > 0
              ? 'bg-text text-white active:bg-text/90'
              : 'bg-faint text-sub cursor-not-allowed'
          }`}
        >
          See {matchCount} deal{matchCount !== 1 ? 's' : ''} →
        </button>
      </div>
    </div>
  )
}
