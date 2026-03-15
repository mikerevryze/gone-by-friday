import { useState } from 'react'
import { useAuth } from '../lib/auth'

export default function AuthScreen() {
  const { login, signup } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [airport, setAirport] = useState('CLT')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await signup(email, password, airport)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-bg">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-4xl text-center mb-2">GoneByFriday</h1>
        <p className="text-sub text-sm text-center mb-8">
          Weekend trips at steal prices
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-sub uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:border-text"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-sub uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-border bg-surface text-text text-sm focus:outline-none focus:border-text"
              placeholder="Min 6 characters"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="text-xs font-semibold text-sub uppercase tracking-wide">
                Home Airport
              </label>
              <div className="flex gap-2 mt-1">
                {['CLT', 'ATL', 'RDU', 'GSO'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setAirport(code)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      airport === code
                        ? 'bg-text text-white'
                        : 'bg-faint text-sub'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-amber text-sm bg-amber-bg px-3 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-text text-white font-semibold text-sm disabled:opacity-50"
          >
            {loading ? 'Loading...' : isLogin ? 'Log in' : 'Create account'}
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin)
            setError('')
          }}
          className="w-full mt-4 text-center text-sm text-sub"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  )
}
