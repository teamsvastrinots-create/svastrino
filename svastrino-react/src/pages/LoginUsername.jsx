// src/pages/LoginUsername.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { MOCK_MODE } from '../lib/mockMode'
import { useAuth } from '../context/AuthContext'
import { useToast, Toast } from '../components/Toast'

export default function LoginUsername() {
  const navigate = useNavigate()
  const { mockLogin } = useAuth()
  const { toast, showToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      showToast('Please fill in all fields.', 'error')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error')
      return
    }

    setLoading(true)

    if (MOCK_MODE) {
      await new Promise(r => setTimeout(r, 800))
      mockLogin({ email, isPremium: false })
      setLoading(false)
      navigate('/dashboard', { replace: true })
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/dashboard', { replace: true })
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Login | Svastrino</title>
      </Helmet>

      <Toast toast={toast} />

      <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-[var(--color-surface)]">

        {/* ── LEFT PANEL ───────────────────────────────────────────── */}
        <section className="hidden lg:flex w-1/2 sapphire-gradient relative flex-col justify-between p-16 text-white overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3">
            <img src="/logo.png" alt="Svastrino" className="h-10 w-auto" />
            <span className="text-2xl font-black tracking-tight">Svastrino</span>
          </div>

          <div className="relative z-10 max-w-lg space-y-6">
            <div className="w-[72px] h-[72px] rounded-full bg-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl">person</span>
            </div>
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight">
              Sign in to your Svastrino account
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Access your career roadmap, daily tasks, and psychometric insights.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-8 pt-12 border-t border-white/10">
            {[['10,847+', 'Students'], ['4.8/5', 'Rating'], ['92%', 'Results']].map(([val, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold">{val}</div>
                <div className="text-xs text-white/50 uppercase tracking-wider font-medium">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
        <section className="w-full lg:w-1/2 min-h-screen bg-[var(--color-surface-container-lowest)] flex flex-col justify-center items-center p-6 md:p-16 lg:p-20">
          <div className="w-full max-w-md">
            <button
              onClick={() => navigate('/signin')}
              className="flex items-center gap-2 text-[var(--color-primary)] font-bold hover:bg-[var(--color-primary-fixed)]/30 px-4 py-2 rounded-full transition-all mb-10 -ml-2"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              Back
            </button>

            <div className="mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-on-surface)] mb-2">Sign in</h2>
              <p className="text-[var(--color-on-surface-variant)]">Enter your email and password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-[var(--color-on-surface-variant)] tracking-[0.1em] uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 bg-[var(--color-surface-container-low)] rounded-xl border-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-on-surface)] font-medium placeholder:text-[var(--color-outline)] outline-none transition-all"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-[var(--color-on-surface-variant)] tracking-[0.1em] uppercase">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 pr-14 bg-[var(--color-surface-container-low)] rounded-xl border-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-on-surface)] font-medium placeholder:text-[var(--color-outline)] outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 sapphire-gradient text-white font-extrabold text-lg rounded-full shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : 'Sign In'}
              </button>

              {/* OTP alt */}
              <div className="relative py-2 flex items-center">
                <div className="flex-grow border-t border-[var(--color-outline-variant)]/30" />
                <span className="flex-shrink mx-4 text-[var(--color-outline)] font-bold text-xs uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-[var(--color-outline-variant)]/30" />
              </div>

              <button
                type="button"
                onClick={() => navigate('/otp-request')}
                className="w-full py-4 border-2 border-[var(--color-primary)]/20 hover:border-[var(--color-primary)] text-[var(--color-primary)] font-bold text-base rounded-full hover:bg-[var(--color-primary-fixed)]/10 transition-all"
              >
                Login with OTP instead
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}
