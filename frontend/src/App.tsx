import { Routes, Route } from 'react-router-dom'
import HomeScreen from './components/HomeScreen'
import DealFeed from './components/DealFeed'
import BuildScreen from './components/BuildScreen'
import ChoicesScreen from './components/ChoicesScreen'
import ConfirmScreen from './components/ConfirmScreen'
import WalletScreen from './components/WalletScreen'
import BottomNav from './components/BottomNav'

export default function App() {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg relative">
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/deals" element={<DealFeed />} />
        <Route path="/build/:dealId" element={<BuildScreen />} />
        <Route path="/choices/:tripId" element={<ChoicesScreen />} />
        <Route path="/confirm/:tripId" element={<ConfirmScreen />} />
        <Route path="/wallet" element={<WalletScreen />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
