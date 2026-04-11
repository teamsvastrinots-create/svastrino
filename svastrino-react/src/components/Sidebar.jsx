// src/components/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  { label: 'Dashboard',          icon: 'dashboard',        path: '/dashboard',          protected: false },
  { label: 'My Course',          icon: 'menu_book',         path: '/my-course',          protected: false },
  { label: "Today's Task",       icon: 'task_alt',          path: '/todays-task',        protected: false },
  { label: 'Psychometric Test',  icon: 'psychology',        path: '/psychometric-test',  protected: false },
  { label: 'Test Results',       icon: 'bar_chart',         path: '/test-results',       protected: true  },
  { label: 'Webinars',           icon: 'video_call',        path: '/webinars',           protected: true  },
  { label: 'Career Tools',       icon: 'work',              path: '#',                   protected: true  },
]

const BOTTOM_ITEMS = [
  { label: 'Notifications', icon: 'notifications', path: '/notifications' },
  { label: 'Profile',       icon: 'person',         path: '/profile'       },
]

export default function Sidebar({ mobileOpen, onClose }) {
  const { profile, isPremium, signOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/signin', { replace: true })
  }

  const navLinkClass = ({ isActive }) =>
    [
      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
      isActive
        ? 'bg-[var(--color-primary)] text-white shadow-md'
        : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-on-surface)]',
    ].join(' ')

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={[
          'fixed top-0 left-0 h-full w-64 z-40 flex flex-col',
          'bg-[var(--color-surface-container-low)] border-r border-[var(--color-outline-variant)]/30',
          'transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--color-outline-variant)]/20">
          <img src="/logo.png" alt="Svastrino" className="h-8 w-auto" />
          <span className="text-lg font-black text-[var(--color-primary)] tracking-tight">Svastrino</span>
        </div>

        {/* User Card */}
        {profile && (
          <div className="mx-4 my-4 p-4 rounded-xl bg-[var(--color-surface-container)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
              {profile.name?.[0]?.toUpperCase() ?? 'S'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-[var(--color-on-surface)] truncate">{profile.name ?? 'Student'}</p>
              <span className={[
                'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full',
                isPremium
                  ? 'bg-amber-400/20 text-amber-600'
                  : 'bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed-variant)]',
              ].join(' ')}>
                {isPremium ? '⭐ Premium' : 'Free Plan'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {NAV_ITEMS.map(item => {
            const isLocked = item.protected && !isPremium
            if (isLocked) {
              return (
                <div
                  key={item.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[var(--color-outline)] cursor-not-allowed select-none"
                  title="Upgrade to Premium to access"
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  <span className="material-symbols-outlined text-base text-[var(--color-outline)]">lock</span>
                </div>
              )
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={navLinkClass}
                onClick={onClose}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-[var(--color-outline-variant)]/30" />

        {/* Bottom Items */}
        <div className="px-3 py-2 space-y-1">
          {BOTTOM_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkClass}
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-all"
          >
            <span className="material-symbols-outlined text-xl">{isDark ? 'light_mode' : 'dark_mode'}</span>
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[var(--color-error)] hover:bg-[var(--color-error-container)]/30 transition-all"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
