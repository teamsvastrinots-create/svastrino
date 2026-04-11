// src/pages/OTPVerify.jsx
import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { MOCK_MODE } from '../lib/mockMode'
import { useAuth } from '../context/AuthContext'
import { useToast, Toast } from '../components/Toast'

const RESEND_COUNTDOWN = 30

export default function OTPVerify() {
  const navigate = useNavigate()
  const location = useLocation()
  const { mockLogin } = useAuth()
  const { toast, showToast } = useToast()

  const phone = location.state?.phone ?? '+91XXXXXXXXXX'

  const [digits, setDigits] = useState(['', '', '', ''])
  const [isShaking, setIsShaking] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [resendTimer, setResendTimer] = useState(RESEND_COUNTDOWN)
  const [canResend, setCanResend] = useState(false)

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) { setCanResend(true); return }
    const id = setTimeout(() => setResendTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [resendTimer])

  // Focus first input on mount
  useEffect(() => { inputRefs[0].current?.focus() }, [])

  // Handle digit input with auto-advance
  const handleInput = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)

    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs[index - 1].current?.focus()
    if (e.key === 'ArrowRight' && index < 3) inputRefs[index + 1].current?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    const newDigits = [...digits]
    for (let i = 0; i < 4; i++) newDigits[i] = pasted[i] ?? ''
    setDigits(newDigits)
    inputRefs[Math.min(pasted.length, 3)].current?.focus()
  }

  const triggerShake = useCallback(() => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 600)
  }, [])

  const handleVerify = async () => {
    const code = digits.join('')
    if (code.length !== 4) {
      showToast('Please enter all 4 digits', 'error')
      return
    }

    setVerifying(true)

    if (MOCK_MODE) {
      await new Promise(r => setTimeout(r, 800))

      if (code !== '1234') {
        setVerifying(false)
        triggerShake()
        setDigits(['', '', '', ''])
        inputRefs[0].current?.focus()
        showToast('Wrong OTP. In mock mode, use 1234', 'error')
        return
      }

      // Mock success
      mockLogin({ phone, isPremium: false })
      setVerifying(false)
      setShowSuccess(true)
      setTimeout(() => navigate('/dashboard', { replace: true }), 1800)
      return
    }

    // Real Supabase verificaition
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: 'sms',
      })
      if (error) throw error
      setShowSuccess(true)
      setTimeout(() => navigate('/dashboard', { replace: true }), 1800)
    } catch (err) {
      triggerShake()
      setDigits(['', '', '', ''])
      inputRefs[0].current?.focus()
      showToast(err.message || 'Invalid OTP. Please try again.', 'error')
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    setCanResend(false)
    setResendTimer(RESEND_COUNTDOWN)

    if (MOCK_MODE) {
      showToast('OTP resent! (MOCK: use 1234)', 'success')
      return
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({ phone })
      if (error) throw error
      showToast('OTP sent to your WhatsApp!', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const isComplete = digits.every(d => d !== '')

  return (
    <>
      <Helmet>
        <title>Verify OTP | Svastrino</title>
      </Helmet>

      <Toast toast={toast} />

      {/* ── Success overlay ───────────────────────────────────────── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-4 shadow-2xl">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[var(--color-on-surface)]">Verified!</h2>
            <p className="text-[var(--color-on-surface-variant)] text-center">Taking you to your dashboard…</p>
          </div>
        </div>
      )}

      <main className="flex h-screen w-full overflow-hidden bg-[var(--color-surface)]">

        {/* ── LEFT PANEL ───────────────────────────────────────────── */}
        <section className="hidden md:flex flex-col justify-between w-1/2 h-full sapphire-gradient p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <img src="/logo.png" alt="Svastrino" className="h-10 w-auto brightness-0 invert" />
            <span className="text-[28px] font-black tracking-tight text-white">Svastrino</span>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-lg space-y-8">
            <div className="w-[88px] h-[88px] rounded-full bg-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[40px]">mail</span>
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
              Almost there — verify your number
            </h1>
            <p className="text-lg text-white/70 font-medium leading-relaxed">
              Enter the 4-digit OTP we sent to your WhatsApp. It expires in 5 minutes.
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 space-y-4 border border-white/10">
              {[
                "Can't find it? Check your WhatsApp notifications",
                "Wrong number? Go back and re-enter",
                "OTP not arrived in 30s? Use Resend OTP",
              ].map(text => (
                <div key={text} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-white/80 mt-1">check_circle</span>
                  <p className="text-white/90 text-sm font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 flex items-center gap-12 border-t border-white/10 pt-8">
            {[['10,847+', 'Students'], ['4.8/5', 'Rating'], ['92%', 'Results']].map(([val, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold text-white tracking-tight">{val}</div>
                <div className="text-xs font-semibold text-white/60 uppercase tracking-widest mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── RIGHT PANEL ──────────────────────────────────────────── */}
        <section className="w-full md:w-1/2 h-full bg-[var(--color-surface)] flex flex-col px-6 py-8 md:px-16 md:py-12 overflow-y-auto relative">

          {/* Top nav */}
          <nav className="flex justify-between items-center mb-8 w-full shrink-0">
            <button
              onClick={() => navigate('/otp-request')}
              className="flex items-center gap-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] font-semibold transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
              Back
            </button>
          </nav>

          <div className="w-full max-w-md mx-auto flex-grow flex flex-col justify-center gap-10">

            {/* Heading */}
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-extrabold text-[var(--color-primary)] tracking-tight mb-3">
                Check your WhatsApp
              </h2>
              <p className="text-[var(--color-on-surface-variant)] font-medium text-lg leading-relaxed">
                Enter the 4-digit code we sent to your number.
              </p>
            </div>

            {/* Phone chip */}
            <div className="bg-[var(--color-surface-container-low)] rounded-full px-6 py-3 flex items-center justify-between self-center md:self-start border border-[var(--color-primary)]/10">
              <span className="text-[var(--color-on-primary-fixed-variant)] font-bold tracking-wide">{phone}</span>
              <button
                onClick={() => navigate('/otp-request')}
                className="ml-4 text-[var(--color-primary)] font-bold text-sm hover:underline"
              >
                Change number
              </button>
            </div>

            {/* OTP input boxes */}
            <div className="space-y-6">
              <label className="block text-center text-[12px] font-extrabold tracking-[0.2em] text-[var(--color-on-surface-variant)] uppercase">
                Enter 4-digit OTP
                {MOCK_MODE && <span className="ml-2 text-amber-500 normal-case tracking-normal font-bold">(Mock: use 1234)</span>}
              </label>
              <div className={`flex justify-center gap-4 ${isShaking ? 'shake' : ''}`}>
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={inputRefs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleInput(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className={[
                      'w-[72px] h-[80px] rounded-xl border-2 bg-[var(--color-surface-container-lowest)] text-center text-3xl font-bold text-[var(--color-primary)] focus:outline-none transition-all',
                      digit
                        ? 'border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/10'
                        : 'border-[var(--color-outline-variant)]',
                      'focus:border-[var(--color-primary)]',
                    ].join(' ')}
                    style={{ caretColor: 'transparent' }}
                  />
                ))}
              </div>
            </div>

            {/* Resend + CTA */}
            <div className="space-y-8">
              <div className="text-center text-[var(--color-on-surface-variant)] font-medium">
                Didn't receive it?{' '}
                <button
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`font-bold ${canResend ? 'text-[var(--color-primary)] hover:underline' : 'text-[var(--color-outline)] cursor-not-allowed'}`}
                >
                  {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
                </button>
              </div>

              <button
                onClick={handleVerify}
                disabled={!isComplete || verifying}
                className={[
                  'w-full py-5 px-8 rounded-full font-extrabold text-lg flex items-center justify-center gap-3 transition-all',
                  isComplete && !verifying
                    ? 'sapphire-gradient text-white shadow-xl hover:shadow-2xl active:scale-[0.98]'
                    : 'bg-[var(--color-surface-container-high)] text-[var(--color-outline)] cursor-not-allowed',
                ].join(' ')}
              >
                {verifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying…</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={() => navigate('/login-username')}
                  className="text-[var(--color-on-surface-variant)] font-semibold hover:text-[var(--color-primary)] transition-colors text-sm"
                >
                  Login with password instead
                </button>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-auto pt-8 pb-4 w-full flex justify-center shrink-0">
            <div className="flex items-center gap-8 text-[var(--color-on-surface-variant)]/60 font-semibold text-[11px] uppercase tracking-widest">
              {[
                { icon: 'timer', label: 'OTP valid 5 mins' },
                { icon: 'verified_user', label: 'Secure' },
                { icon: 'lock', label: 'Encrypted' },
              ].map(({ icon, label }, i) => (
                <div key={label} className="flex items-center gap-2">
                  {i > 0 && <div className="w-1 h-1 bg-[var(--color-outline-variant)] rounded-full" />}
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
