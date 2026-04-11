// src/layouts/ProtectedLayout.jsx
// Shared layout for all protected (post-login) pages.
// Renders the Sidebar + content area, with
// the MockPremiumToggle floating button in MOCK_MODE.
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import MockPremiumToggle from '../components/MockPremiumToggle'

export default function ProtectedLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-[var(--color-background)]">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]/20 sticky top-0 z-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-all"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <img src="/logo.png" alt="Svastrino" className="h-8 w-auto" />
          <div className="w-10" /> {/* spacer */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mock Premium Toggle (MOCK_MODE only) */}
      <MockPremiumToggle />
    </div>
  )
}
