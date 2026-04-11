// src/pages/SignIn.jsx
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function SignIn() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Sign In | Svastrino</title>
      </Helmet>

      <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-[var(--color-surface)]">

        {/* ── LEFT PANEL: Brand Narrative ─────────────────────────── */}
        <section className="hidden lg:flex w-1/2 sapphire-gradient relative flex-col justify-between p-16 text-white overflow-hidden">
          {/* Decorative blob */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <img src="/logo.png" alt="Svastrino" className="h-10 w-auto" />
            <span className="text-2xl font-black tracking-tight">Svastrino</span>
          </div>

          {/* Middle content */}
          <div className="relative z-10 max-w-lg space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-xs font-bold tracking-widest uppercase">Trusted by 10,847+ Students</span>
            </div>
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight">
              You've taken the first step toward your dream career
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              Join thousands of high school students mapping their future with data-driven career insights.
            </p>

            {/* Illustration card */}
            <div className="w-full aspect-video bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
              <div className="text-center text-white/40 space-y-2">
                <span className="material-symbols-outlined text-5xl">school</span>
                <p className="text-sm font-medium">Career Discovery Platform</p>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="relative z-10 grid grid-cols-3 gap-8 pt-12 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold">10,847+</div>
              <div className="text-xs text-white/50 uppercase tracking-wider font-medium">Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold flex items-center gap-1">
                4.8/5
                <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <div className="text-xs text-white/50 uppercase tracking-wider font-medium">Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold">92%</div>
              <div className="text-xs text-white/50 uppercase tracking-wider font-medium">Results</div>
            </div>
          </div>
        </section>

        {/* ── RIGHT PANEL: Method Selection ───────────────────────── */}
        <section className="w-full lg:w-1/2 min-h-screen bg-[var(--color-surface)] flex flex-col justify-center items-center p-6 md:p-16 lg:p-20 relative">

          {/* Mobile header */}
          <div className="lg:hidden absolute top-0 left-0 w-full p-6 flex justify-between items-center bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Svastrino" className="h-8 w-auto" />
              <span className="text-xl font-black text-[var(--color-primary)]">Svastrino</span>
            </div>
          </div>

          <div className="w-full max-w-md flex flex-col gap-10">

            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-on-surface)]">Welcome back</h2>
              <p className="text-[var(--color-on-surface-variant)] font-medium">Choose how you want to sign in</p>
            </div>

            {/* Method Cards */}
            <div className="flex flex-col gap-4">

              {/* OTP Card (Recommended) */}
              <button
                onClick={() => navigate('/otp-request')}
                className="group flex items-center justify-between p-6 bg-[var(--color-primary-fixed)]/30 border-2 border-[var(--color-primary-container)] rounded-xl transition-all active:scale-[0.98] text-left hover:shadow-lg hover:shadow-[var(--color-primary)]/10"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-[var(--color-primary-container)] rounded-xl flex items-center justify-center text-white shadow-lg">
                    <span className="material-symbols-outlined text-3xl">smartphone</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-on-surface)]">Login with OTP</h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">Fastest way to get started</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[var(--color-primary-container)] group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>

              {/* Username Card */}
              <button
                onClick={() => navigate('/login-username')}
                className="group flex items-center justify-between p-6 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]/50 transition-all active:scale-[0.98] rounded-xl text-left hover:shadow-md"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-[var(--color-surface-container-high)] rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-[var(--color-on-surface-variant)]">person</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-on-surface)]">Login with username</h3>
                    <p className="text-sm text-[var(--color-on-surface-variant)]">Use your email & password</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[var(--color-outline-variant)] group-hover:translate-x-1 transition-transform group-hover:text-[var(--color-primary)]">chevron_right</span>
              </button>
            </div>

            {/* Trust strip */}
            <div className="pt-8 border-t border-[var(--color-surface-container)] flex flex-wrap justify-center gap-x-8 gap-y-4">
              {[
                { icon: 'encrypted', label: 'Secure login' },
                { icon: 'privacy_tip', label: '100% private' },
                { icon: 'block', label: 'No spam ever' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-primary)] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  <span className="text-[12px] font-bold tracking-wider uppercase text-[var(--color-on-surface-variant)]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="absolute bottom-6 w-full px-8 flex justify-center text-[var(--color-on-surface-variant)]">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">© 2026 Svastrino. All rights reserved.</span>
          </footer>
        </section>
      </main>
    </>
  )
}
