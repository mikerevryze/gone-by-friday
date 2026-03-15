import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { path: '/', label: 'Explore', icon: '🔍' },
  { path: '/deals', label: 'Deals', icon: '🔥' },
  { path: '/wallet', label: 'Wallet', icon: '💳' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around items-center h-16 max-w-md mx-auto z-50">
      {tabs.map((tab) => {
        const active = location.pathname === tab.path
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-colors ${
              active ? 'text-text' : 'text-sub'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[11px] font-medium">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
