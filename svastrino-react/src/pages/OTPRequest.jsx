// src/pages/OTPRequest.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { MOCK_MODE } from '../lib/mockMode'
import { useToast, Toast } from '../components/Toast'

export default function OTPRequest() {
  const navigate = useNavigate()
  const { toast, showToast } = useToast()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error')
      return
    }

    const fullPhone = `+91${digits}`
    setLoading(true)

    if (MOCK_MODE) {
      // Fake 1-second delay, then navigate with the phone number in state
      await new Promise(r => setTimeout(r, 1000))
      setLoading(false)
      navigate('/otp-verify', { state: { phone: fullPhone } })
      return
    }

    // Real Supabase OTP (requires Twilio integration)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhone,
      })
      if (error) throw error
      navigate('/otp-verify', { state: { phone: fullPhone } })
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Enter your number | Svastrino</title>
      </Helmet>

      <Toast toast={toast} />

      <main className="flex h-screen w-full overflow-hidden bg-[var(--color-surface)]">

        {/* ── LEFT PANEL ───────────────────────────────────────────── */}
        <section className="hidden md:flex flex-col justify-between w-1/2 sapphire-gradient p-12 lg:p-20 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <img src="/logo.png" alt="Svastrino" className="h-10 w-auto" />
            <span className="text-2xl font-black tracking-tight text-white">Svastrino</span>
          </div>

          {/* Middle */}
          <div className="relative z-10 max-w-lg space-y-10">
            <div className="w-[88px] h-[88px] flex items-center justify-center rounded-full glass-panel">
              <span className="material-symbols-outlined text-[40px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
                Your OTP is just one tap away
              </h1>
              <p className="text-xl text-white/70 font-medium leading-relaxed">
                We'll send a secure one-time password directly to your WhatsApp. No app download needed.
              </p>
            </div>

            {/* Feature list */}
            <div className="glass-panel rounded-xl p-6 space-y-4 border border-white/10">
              {[
                { icon: 'schedule', text: 'OTP expires in 5 minutes' },
                { icon: 'key_off',  text: 'No password to remember' },
                { icon: 'check_circle', text: 'Works on any WhatsApp number' },
              ].map(({ icon, text }) => (
                <div key={icon} className="flex items-center gap-3 text-white/90">
                  <span className="material-symbols-outlined text-sm">{icon}</span>
                  <span className="text-sm font-semibold tracking-wide">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stats */}
          <div className="relative z-10 flex items-center gap-12 border-t border-white/10 pt-8">
            {[['10,847+', 'students'], ['4.8/5', 'rating'], ['92%', 'results']].map(([val, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold text-white">{val}</div>
                <div className="text-xs font-bold text-white/50 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
        <section className="w-full md:w-1/2 bg-[var(--color-surface-container-lowest)] flex flex-col px-6 py-8 md:px-16 md:py-12 overflow-y-auto">
          {/* Top nav */}
          <nav className="flex justify-between items-center mb-16">
            <button
              onClick={() => navigate('/signin')}
              className="flex items-center gap-2 text-[var(--color-primary)] font-bold hover:bg-[var(--color-primary-fixed)]/30 px-4 py-2 rounded-full transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              <span>Back</span>
            </button>
          </nav>

          {/* Form */}
          <div className="max-w-md mx-auto w-full flex-grow flex flex-col justify-center">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold text-[var(--color-on-surface)] tracking-tight mb-3">
                Enter your WhatsApp number
              </h2>
              <p className="text-[var(--color-on-surface-variant)] font-medium">
                We'll send a 4-digit OTP to this number to verify it's you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Phone input */}
              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-[var(--color-on-surface-variant)] tracking-[0.1em] uppercase">
                  Mobile / WhatsApp Number
                </label>
                <div className="relative flex items-center">
                  {/* Country prefix */}
                  <div className="absolute left-4 flex items-center gap-2 border-r border-[var(--color-outline-variant)] pr-3 h-8 pointer-events-none">
                    <span className="text-base">🇮🇳</span>
                    <span className="text-[var(--color-on-surface)] font-bold text-lg">+91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter your 10-digit number"
                    className="w-full pl-28 pr-6 py-5 bg-[var(--color-surface-container-low)] border-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-xl text-lg font-bold placeholder:text-[var(--color-outline)] placeholder:font-medium transition-all outline-none"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 text-[var(--color-on-surface-variant)]/70">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  <p className="text-xs font-medium italic">OTP will arrive on WhatsApp within 30 seconds</p>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 sapphire-gradient text-white font-extrabold text-lg rounded-full shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending OTP…</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-[var(--color-outline-variant)]/30" />
                <span className="flex-shrink mx-4 text-[var(--color-outline)] font-bold text-xs uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-[var(--color-outline-variant)]/30" />
              </div>

              {/* Alt login */}
              <button
                type="button"
                onClick={() => navigate('/login-username')}
                className="w-full py-4 border-2 border-[var(--color-primary)]/20 hover:border-[var(--color-primary)] text-[var(--color-primary)] font-bold text-base rounded-full hover:bg-[var(--color-primary-fixed)]/10 transition-all active:scale-[0.98]"
              >
                Login with username & password instead
              </button>
            </form>
          </div>

          {/* Footer trust strip */}
          <footer className="mt-auto pt-12">
            <div className="flex justify-between items-center py-6 border-t border-[var(--color-surface-container-high)]">
              {[
                { icon: 'verified_user', label: 'OTP via WhatsApp' },
                { icon: 'timer', label: 'Expires in 5 mins' },
                { icon: 'lock', label: 'Encrypted' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-primary-container)] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  <span className="text-[10px] font-extrabold text-[var(--color-on-surface-variant)] uppercase tracking-tighter">{label}</span>
                </div>
              ))}
            </div>
          </footer>
        </section>
      </main>
    </>
  )
}
