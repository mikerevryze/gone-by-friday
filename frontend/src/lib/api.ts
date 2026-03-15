const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function fetchDeals(params: {
  origin?: string
  pax?: number
  max_budget?: number
  interests?: string[]
  points_first?: boolean
}) {
  const query = new URLSearchParams()
  if (params.origin) query.set('origin', params.origin)
  if (params.pax) query.set('pax', String(params.pax))
  if (params.max_budget) query.set('max_budget', String(params.max_budget))
  if (params.interests?.length) query.set('interests', params.interests.join(','))
  if (params.points_first !== undefined) query.set('points_first', String(params.points_first))

  return request<{ deals: any[]; count: number }>(`/deals?${query}`)
}

export async function fetchDeal(dealId: string) {
  return request<any>(`/deals/${dealId}`)
}

export async function generateItinerary(dealId: string, pax: number, interests: string[]) {
  return request<{ itinerary: any; trip_id: string; deal: any }>('/itinerary/generate', {
    method: 'POST',
    body: JSON.stringify({ deal_id: dealId, pax, interests }),
  })
}

export async function addToCalendar(tripId: string, googleOauthToken: string) {
  return request<{ events_added: number }>('/calendar/add-events', {
    method: 'POST',
    body: JSON.stringify({ trip_id: tripId, google_oauth_token: googleOauthToken }),
  })
}

export async function subscribeAlerts(userId: string, pushEndpoint: string, pushKeys: object) {
  return request('/alerts/subscribe', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, push_endpoint: pushEndpoint, push_keys: pushKeys }),
  })
}

export async function fetchWallet(userId: string) {
  return request<{ accounts: any[] }>(`/wallet/${userId}`)
}

export async function addWalletAccount(userId: string, program: string, pointsBalance: number) {
  return request('/wallet', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, program, points_balance: pointsBalance }),
  })
}
