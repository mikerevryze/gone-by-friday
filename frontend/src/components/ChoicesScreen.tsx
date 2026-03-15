import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import type { Itinerary, ItineraryChoice } from '../types'

function ChoiceCard({
  choice,
  selected,
  onSelect,
}: {
  choice: ItineraryChoice
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
        selected
          ? 'border-text bg-faint'
          : 'border-border bg-surface hover:border-sub'
      }`}
    >
      <h3 className="font-semibold text-base">{choice.name}</h3>
      <div className="flex gap-2 mt-2 flex-wrap">
        <span className="px-2 py-0.5 bg-faint rounded-full text-[11px] text-sub font-medium">
          {choice.cost}
        </span>
        <span className="px-2 py-0.5 bg-faint rounded-full text-[11px] text-sub font-medium">
          {choice.neighborhood}
        </span>
        <span className="px-2 py-0.5 bg-faint rounded-full text-[11px] text-sub font-medium italic">
          {choice.vibe}
        </span>
      </div>
      <p className="text-sm text-sub mt-2 leading-relaxed">
        {choice.description}
      </p>
      <div className="mt-2 bg-gold-bg text-gold text-xs px-3 py-1.5 rounded-lg">
        {choice.proTip}
      </div>
    </button>
  )
}

export default function ChoicesScreen() {
  const { tripId } = useParams<{ tripId: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const { itinerary, deal } = (location.state || {}) as {
    itinerary?: Itinerary
    deal?: any
  }

  const slots = itinerary?.slots || []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selections, setSelections] = useState<Record<string, 'A' | 'B'>>({})

  if (!itinerary || slots.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-sub">No itinerary data found</p>
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

  const slot = slots[currentIndex]
  const isLast = currentIndex === slots.length - 1
  const progress = ((currentIndex + 1) / slots.length) * 100

  const handleSelect = (choice: 'A' | 'B') => {
    setSelections((s) => ({ ...s, [slot.key]: choice }))
    // Auto-advance after 200ms
    setTimeout(() => {
      if (!isLast) {
        setCurrentIndex((i) => i + 1)
      }
    }, 200)
  }

  return (
    <div className="pb-24">
      {/* Progress bar */}
      <div className="h-1 bg-faint">
        <div
          className="h-full bg-text transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <p className="text-xs text-sub uppercase tracking-wide font-semibold">
          {currentIndex + 1} of {slots.length}
        </p>
        <h1 className="font-serif text-2xl mt-1">{slot.label}</h1>
      </div>

      {/* Choices */}
      <div className="px-5 space-y-3 mt-4">
        <ChoiceCard
          choice={slot.choiceA}
          selected={selections[slot.key] === 'A'}
          onSelect={() => handleSelect('A')}
        />
        <ChoiceCard
          choice={slot.choiceB}
          selected={selections[slot.key] === 'B'}
          onSelect={() => handleSelect('B')}
        />
      </div>

      {/* Navigation */}
      <div className="px-5 mt-6 flex gap-3">
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold"
          >
            Back
          </button>
        )}
        {isLast && Object.keys(selections).length === slots.length ? (
          <button
            onClick={() =>
              navigate(`/confirm/${tripId}`, {
                state: { itinerary, deal, selections },
              })
            }
            className="flex-1 py-3 rounded-xl bg-text text-white text-sm font-semibold"
          >
            Lock in my weekend →
          </button>
        ) : (
          <button
            onClick={() => !isLast && setCurrentIndex((i) => i + 1)}
            disabled={!selections[slot.key]}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold ${
              selections[slot.key]
                ? 'bg-text text-white'
                : 'bg-faint text-sub cursor-not-allowed'
            }`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
