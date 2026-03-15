import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { generateItinerary, fetchDeal } from '../lib/api'
import type { Deal } from '../types'

const STEPS = [
  'Finding local gems...',
  'Mapping neighborhoods...',
  'Curating restaurants...',
  'Planning activities...',
  'Adding pro tips...',
  'Finalizing your weekend...',
]

export default function BuildScreen() {
  const { dealId } = useParams<{ dealId: string }>()
  const navigate = useNavigate()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!dealId) return

    fetchDeal(dealId).then(setDeal).catch(() => {})

    // Animate progress steps
    const interval = setInterval(() => {
      setStep((s) => {
        if (s < STEPS.length - 1) return s + 1
        clearInterval(interval)
        return s
      })
    }, 800)

    // Generate itinerary
    generateItinerary(dealId, 1, [])
      .then((data) => {
        // Navigate to choices screen with data
        navigate(`/choices/${data.trip_id}`, {
          state: { itinerary: data.itinerary, deal: data.deal },
        })
      })
      .catch((err) => {
        setError(err.message)
      })

    return () => clearInterval(interval)
  }, [dealId, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      {deal && (
        <div className="text-center mb-8">
          <span className="text-5xl">{deal.flag}</span>
          <h1 className="font-serif text-2xl mt-3">{deal.destination}</h1>
        </div>
      )}

      {error ? (
        <div className="text-center">
          <p className="text-amber mb-4">Something went wrong</p>
          <p className="text-sub text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate('/deals')}
            className="px-6 py-3 rounded-xl bg-text text-white font-semibold text-sm"
          >
            Back to deals
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xs space-y-3">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-3 transition-opacity duration-300 ${
                i <= step ? 'opacity-100' : 'opacity-20'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < step
                    ? 'bg-green text-white'
                    : i === step
                    ? 'bg-text text-white'
                    : 'bg-faint text-sub'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span
                className={`text-sm ${
                  i <= step ? 'text-text' : 'text-sub'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
