// src/components/AuthGuard.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * AuthGuard — wraps protected routes.
 * Redirects to /signin if the user is not authenticated.
 */
export function AuthGuard({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--color-on-surface-variant)] font-semibold text-sm">Loading…</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  return children
}

/**
 * GuestGuard — wraps public/auth routes.
 * Redirects to /dashboard if the user is already logged in.
 */
export function GuestGuard({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

/**
 * AdminGuard — wraps admin-only routes.
 * Redirects to /dashboard if role is not 'admin'.
 */
export function AdminGuard({ children }) {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
