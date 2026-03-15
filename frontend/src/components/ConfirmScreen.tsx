import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import type { Itinerary, Deal } from '../types'

export default function ConfirmScreen() {
  const { tripId } = useParams<{ tripId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [calendarAdded, setCalendarAdded] = useState(false)

  const { itinerary, deal, selections } = (location.state || {}) as {
    itinerary?: Itinerary
    deal?: Deal
    selections?: Record<string, 'A' | 'B'>
  }

  if (!itinerary || !deal) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-sub">No trip data found</p>
          <button
            onClick={() => navigate('/deals')}
            className="mt-4 px-6 py-3 rounded-xl bg-text text-white font-semibold text-sm"
          >
            Back to deals
          </button>
        </div>
      </div>
    )
  }

  const slots = itinerary.slots || []
  const totalCost =
    deal.flight_price_per_pax + deal.hotel_price_per_night * 2

  const handleAddCalendar = async () => {
    // In production, this would trigger Google OAuth flow
    // For now, show success state
    setCalendarAdded(true)
  }

  if (calendarAdded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <span className="text-6xl mb-4">✓</span>
        <h1 className="font-serif text-3xl text-center">All set.</h1>
        <p className="text-sub text-lg mt-2">Pack tonight.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 px-8 py-3 rounded-xl bg-text text-white font-semibold text-sm"
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-5 pt-8 pb-4 text-center">
        <span className="text-5xl">{deal.flag}</span>
        <h1 className="font-serif text-2xl mt-3">{deal.destination}</h1>
        <div className="flex gap-2 justify-center mt-3">
          <span className="px-3 py-1 bg-green-bg text-green rounded-full text-xs font-semibold">
            {deal.tier}
          </span>
          <span className="px-3 py-1 bg-faint text-sub rounded-full text-xs font-semibold">
            ${totalCost} total
          </span>
          <span className="px-3 py-1 bg-faint text-sub rounded-full text-xs font-semibold">
            {deal.airline}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 mt-4">
        <div className="border-l-2 border-border ml-3 space-y-0">
          {/* Departure */}
          <div className="relative pl-6 pb-4">
            <div className="absolute -left-[5px] top-1 w-3 h-3 rounded-full bg-text" />
            <p className="text-xs text-sub">Depart {deal.destination_short}</p>
            <p className="font-semibold text-sm">
              {deal.airline} · Gate {deal.gate}
            </p>
          </div>

          {/* Itinerary stops */}
          {slots.map((slot) => {
            const sel = selections?.[slot.key] || 'A'
            const choice = sel === 'A' ? slot.choiceA : slot.choiceB
            return (
              <div key={slot.key} className="relative pl-6 pb-4">
                <div className="absolute -left-[4px] top-1.5 w-2.5 h-2.5 rounded-full bg-border" />
                <p className="text-xs text-sub">{slot.label}</p>
                <p className="font-semibold text-sm">{choice.name}</p>
                <p className="text-xs text-sub mt-0.5">
                  {choice.neighborhood} · {choice.cost}
                </p>
              </div>
            )
          })}

          {/* Return */}
          <div className="relative pl-6">
            <div className="absolute -left-[5px] top-1 w-3 h-3 rounded-full bg-text" />
            <p className="text-xs text-sub">Return home</p>
            <p className="font-semibold text-sm">Sunday afternoon</p>
          </div>
        </div>
      </div>

      {/* Calendar CTA */}
      <div className="px-5 mt-8">
        <button
          onClick={handleAddCalendar}
          className="w-full py-4 rounded-2xl bg-text text-white font-semibold text-base"
        >
          Add all to Google Calendar
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 mt-2 text-sub text-sm font-medium"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
