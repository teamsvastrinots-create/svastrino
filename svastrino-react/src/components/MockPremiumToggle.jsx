// src/components/MockPremiumToggle.jsx
// Floating button visible only in MOCK_MODE — lets you toggle isPremium
// on any protected page without needing a real paid account.
import { MOCK_MODE } from '../lib/mockMode'
import { useAuth } from '../context/AuthContext'

export default function MockPremiumToggle() {
  const { isPremium, toggleMockPremium } = useAuth()

  if (!MOCK_MODE) return null

  return (
    <button
      onClick={toggleMockPremium}
      title="Toggle Premium (MOCK MODE only)"
      style={{ zIndex: 9998 }}
      className={[
        'fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full shadow-2xl text-sm font-bold transition-all',
        'border-2',
        isPremium
          ? 'bg-amber-400 text-amber-900 border-amber-500 hover:bg-amber-300'
          : 'bg-[var(--color-primary)] text-white border-[var(--color-primary-container)] hover:bg-[var(--color-primary-container)]',
      ].join(' ')}
    >
      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
        {isPremium ? 'star' : 'star_outline'}
      </span>
      {isPremium ? 'Premium ON' : 'Free Plan'}
      <span className="text-[9px] opacity-70 uppercase tracking-widest">MOCK</span>
    </button>
  )
}
