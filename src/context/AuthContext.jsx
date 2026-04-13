// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { MOCK_MODE } from '../lib/mockMode'

const AuthContext = createContext(null)

/** Mock session used when MOCK_MODE = true */
const MOCK_SESSION = {
  user: {
    id: 'mock-user',
    phone: '+919999999999',
    email: null,
  },
}

const MOCK_PROFILE = {
  id: 'mock-user',
  name: '',
  class: '',
  city: '',
  role: 'student',
  plan: 'free',
  phone: '+919999999999',
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  // ── Fetch profile from Supabase ──────────────────────────────
  const fetchProfile = useCallback(async (userId) => {
    if (MOCK_MODE) {
      setProfile(MOCK_PROFILE)
      setIsPremium(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
      setIsPremium(data?.plan === 'paid')
    } catch (err) {
      console.error('[AuthContext] fetchProfile error:', err.message)
    }
  }, [])

  // ── Bootstrap on mount ───────────────────────────────────────
  useEffect(() => {
    if (MOCK_MODE) {
      // Check if a mock session was previously stored
      const storedMock = localStorage.getItem('svastrino_mock_session')
      if (storedMock) {
        const parsed = JSON.parse(storedMock)
        setSession(parsed.session)
        setUser(parsed.user)
        setProfile(parsed.profile)
        setIsPremium(parsed.isPremium ?? false)
      }
      setLoading(false)
      return
    }

    // Real Supabase session bootstrap
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) fetchProfile(s.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s)
        setUser(s?.user ?? null)
        if (s?.user) fetchProfile(s.user.id)
        else { setProfile(null); setIsPremium(false) }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  // ── Mock login (called by OTPVerify in MOCK_MODE) ────────────
  const mockLogin = useCallback((overrides = {}) => {
    const mockUser = { ...MOCK_SESSION.user, ...overrides }
    const mockProf = { ...MOCK_PROFILE, ...overrides }
    const premium = overrides.isPremium ?? false

    setSession(MOCK_SESSION)
    setUser(mockUser)
    setProfile(mockProf)
    setIsPremium(premium)

    localStorage.setItem('svastrino_mock_session', JSON.stringify({
      session: MOCK_SESSION,
      user: mockUser,
      profile: mockProf,
      isPremium: premium,
    }))
  }, [])

  // ── Mock premium toggle (floating button on protected pages) ─
  const toggleMockPremium = useCallback(() => {
    setIsPremium(prev => {
      const next = !prev
      const stored = localStorage.getItem('svastrino_mock_session')
      if (stored) {
        const parsed = JSON.parse(stored)
        parsed.isPremium = next
        localStorage.setItem('svastrino_mock_session', JSON.stringify(parsed))
      }
      return next
    })
  }, [])

  // ── Sign out ─────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    if (MOCK_MODE) {
      localStorage.removeItem('svastrino_mock_session')
      setSession(null); setUser(null); setProfile(null); setIsPremium(false)
      return
    }
    await supabase.auth.signOut()
  }, [])

  const value = {
    session,
    user,
    profile,
    isPremium,
    loading,
    mockLogin,
    toggleMockPremium,
    signOut,
    setProfile,
    setIsPremium,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
