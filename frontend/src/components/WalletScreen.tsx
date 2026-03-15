import { useState } from 'react'

const MOCK_ACCOUNTS = [
  { id: '1', program: 'Hilton Honors', points_balance: 124000, tier: 'Gold' },
  { id: '2', program: 'Amex MR', points_balance: 86000, tier: null },
  { id: '3', program: 'Chase UR', points_balance: 52000, tier: null },
  { id: '4', program: 'Delta SkyMiles', points_balance: 31000, tier: 'Silver' },
]

const PROGRAM_ICONS: Record<string, string> = {
  'Hilton Honors': '🏨',
  'Amex MR': '💳',
  'Chase UR': '💎',
  'Delta SkyMiles': '✈️',
  'Marriott Bonvoy': '🏨',
}

export default function WalletScreen() {
  const [accounts] = useState(MOCK_ACCOUNTS)

  const totalPoints = accounts.reduce((sum, a) => sum + a.points_balance, 0)

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-5 pt-8 pb-4">
        <h1 className="font-serif text-2xl">Points Wallet</h1>
        <p className="text-sub text-sm mt-1">
          {totalPoints.toLocaleString()} total points across {accounts.length}{' '}
          programs
        </p>
      </div>

      {/* Accounts */}
      <div className="px-5 space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-surface rounded-2xl border border-border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {PROGRAM_ICONS[account.program] || '💳'}
                </span>
                <div>
                  <h3 className="font-semibold text-sm">{account.program}</h3>
                  {account.tier && (
                    <span className="text-xs text-gold font-medium">
                      {account.tier}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-serif text-xl">
                  {account.points_balance.toLocaleString()}
                </div>
                <div className="text-[10px] text-sub">points</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transfer tip */}
      <div className="px-5 mt-6">
        <div className="bg-gold-bg rounded-2xl p-4">
          <h3 className="font-semibold text-sm text-gold">Transfer Tip</h3>
          <p className="text-sm text-text mt-1.5 leading-relaxed">
            Amex MR transfers to Hilton at 1:2 ratio. Your 86,000 MR = 172,000
            Hilton points — enough for 4+ free nights at most properties.
          </p>
        </div>
      </div>

      {/* Add program */}
      <div className="px-5 mt-4">
        <button className="w-full py-3 rounded-xl border-2 border-dashed border-border text-sub text-sm font-medium">
          + Connect another program
        </button>
      </div>
    </div>
  )
}
