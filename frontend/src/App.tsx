import { Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import AuthScreen from './components/AuthScreen'
import HomeScreen from './components/HomeScreen'
import DealFeed from './components/DealFeed'
import BuildScreen from './components/BuildScreen'
import ChoicesScreen from './components/ChoicesScreen'
import ConfirmScreen from './components/ConfirmScreen'
import WalletScreen from './components/WalletScreen'
import BottomNav from './components/BottomNav'

function AppRoutes() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <p className="text-sub">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg relative">
      {/* User header */}
      <div className="fixed top-0 left-0 right-0 bg-surface/80 backdrop-blur-sm border-b border-border z-50 max-w-md mx-auto">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs text-sub">{user.email}</span>
          <button onClick={logout} className="text-xs text-sub hover:text-text">
            Log out
          </button>
        </div>
      </div>
      <div className="pt-10">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/deals" element={<DealFeed />} />
          <Route path="/build/:dealId" element={<BuildScreen />} />
          <Route path="/choices/:tripId" element={<ChoicesScreen />} />
          <Route path="/confirm/:tripId" element={<ConfirmScreen />} />
          <Route path="/wallet" element={<WalletScreen />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
