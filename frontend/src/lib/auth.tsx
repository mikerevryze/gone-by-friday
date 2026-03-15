import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  home_airport: string
  pax_default: number
  budget_max: number
  max_flight_minutes: number
  interests: string[]
  points_first: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, airport?: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const API_BASE = import.meta.env.VITE_API_URL || ''

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('gbf_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => setUser(data.user))
        .catch(() => {
          setToken(null)
          localStorage.removeItem('gbf_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const text = await res.text()
      const err = text ? JSON.parse(text) : {}
      throw new Error(err.detail || 'Login failed')
    }
    const data = await res.json()
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('gbf_token', data.token)
  }

  const signup = async (email: string, password: string, airport = 'CLT') => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, home_airport: airport }),
    })
    if (!res.ok) {
      const text = await res.text()
      const err = text ? JSON.parse(text) : {}
      throw new Error(err.detail || 'Signup failed')
    }
    const data = await res.json()
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('gbf_token', data.token)
  }

  const logout = () => {
    if (token) {
      fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    setUser(null)
    setToken(null)
    localStorage.removeItem('gbf_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
