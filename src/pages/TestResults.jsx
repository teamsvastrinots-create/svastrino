// src/pages/TestResults.jsx
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import ProtectedLayout from '../layouts/ProtectedLayout'
import { useAuth } from '../context/AuthContext'

// ── Trait SVG ring ────────────────────────────────────────────
function TraitRing({ pct, icon, color, label, level }) {
  const circ = 2 * Math.PI * 16
  const offset = circ - (pct / 100) * circ
  return (
    <div className="bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/20 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <span className="text-[var(--color-on-surface)] text-sm font-extrabold">{label}</span>
        <span className="text-lg font-extrabold" style={{ color }}>{pct}%</span>
      </div>
      <div className="relative w-28 h-28 mb-5 group cursor-pointer">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path className="text-[var(--color-outline-variant)]/20" d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" fill="none" stroke="currentColor" strokeWidth="3" />
          <path style={{ color, strokeDasharray: `${pct}, 100` }} d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="group-hover:opacity-70 transition-opacity" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-3xl drop-shadow-sm" style={{ color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
      </div>
      <div className="text-[13px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest" style={{ color, background: `${color}18` }}>{level}</div>
    </div>
  )
}

export default function TestResults() {
  const { isPremium } = useAuth()
  const navigate = useNavigate()

  const traits = [
    { label: 'Analytical', pct: 88, icon: 'psychology_alt', color: '#24389c', level: 'Very High' },
    { label: 'Creative', pct: 64, icon: 'palette', color: '#006471', level: 'High' },
    { label: 'Social', pct: 42, icon: 'group', color: '#757684', level: 'Moderate' },
    { label: 'Leadership', pct: 76, icon: 'military_tech', color: '#24389c', level: 'High' },
  ]

  const careerMatches = [
    { icon: 'computer', label: 'Software Architect', match: 98, highlight: true },
    { icon: 'analytics', label: 'Data Scientist', match: 94, highlight: true },
    { icon: 'account_balance', label: 'Strategic Planner', match: 89, highlight: false },
    { icon: 'biotech', label: 'Systems Engineer', match: 86, highlight: false },
  ]

  const strengths = [
    { title: 'Strategic Foresight', desc: 'Ability to predict long-term outcomes and plan accordingly.' },
    { title: 'Complex Problem Solving', desc: 'High proficiency in deconstructing multi-layered technical challenges.' },
    { title: 'Objective Logic', desc: 'Decisions are driven by data and rational frameworks.' },
    { title: 'Independent Drive', desc: 'Strong self-motivation with minimal need for external supervision.' },
  ]

  return (
    <ProtectedLayout>
      <Helmet><title>My Test Results | Svastrino</title></Helmet>

      <div className={`p-6 pt-6 lg:p-10 xl:p-12 max-w-[1240px] ${!isPremium ? 'relative' : ''}`}>
        {/* Premium Lock Overlay */}
        {!isPremium && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' }}>
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-[var(--color-outline-variant)]/20 text-center max-w-sm w-[90%]">
              <div className="w-16 h-16 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center mb-5 mx-auto">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-[var(--color-on-surface)] tracking-tight">Premium Feature</h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mb-8 leading-relaxed">Upgrade to Svastrino Premium to unlock the advanced psychometric testing portal and personalized insights.</p>
              <button className="w-full py-3.5 sapphire-gradient text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 active:scale-95">
                Unlock Premium <span className="material-symbols-outlined text-lg">workspace_premium</span>
              </button>
              <button onClick={() => navigate('/psychometric-test')} className="mt-3 w-full py-2.5 text-[var(--color-primary)] font-bold text-sm hover:underline underline-offset-4">
                Take the test first →
              </button>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto space-y-10 lg:space-y-12">

          {/* Header */}
          <header>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[var(--color-on-surface)] tracking-tight mb-2">My Test Results</h1>
            <p className="text-[var(--color-on-surface-variant)] text-sm font-medium">Last updated: April 11, 2026</p>
          </header>

          {/* Personality Hero */}
          <section>
            <div className="bg-[#00105c] border border-[var(--color-primary-container)] rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-start md:items-end justify-between text-white overflow-hidden relative shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-10 z-10 w-full mb-6 md:mb-0">
                {/* INTJ card */}
                <div className="flex flex-col items-center justify-center bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20 shrink-0">
                  <div className="w-[72px] h-[72px] bg-white/25 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <div className="text-[28px] font-extrabold leading-none mb-1 tracking-tight">INTJ</div>
                  <div className="text-[13px] font-bold text-[var(--color-tertiary-fixed)] uppercase tracking-wider">The Architect</div>
                </div>
                <div className="max-w-2xl">
                  <h2 className="text-lg lg:text-xl font-extrabold mb-3 text-white tracking-tight">Your personality type</h2>
                  <p className="text-sm lg:text-base font-medium leading-relaxed text-white/90">
                    You are a strategic and independent thinker. You have a natural ability to analyze complex problems and design efficient systems to solve them. Your drive for excellence and objectivity makes you a valuable asset in technical and innovative fields.
                  </p>
                </div>
              </div>
              <button className="bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] px-8 py-4 rounded-xl text-sm font-extrabold z-10 hover:shadow-xl hover:bg-white transition-all active:scale-95 w-full md:w-auto mt-4 md:mt-0 md:ml-8 shrink-0 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">download</span>
                Download full report (PDF)
              </button>
              {/* Background decoration */}
              <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>architecture</span>
              </div>
            </div>
          </section>

          {/* Trait Scores */}
          <section>
            <div className="text-[11px] font-bold text-[var(--color-on-surface-variant)] tracking-[0.15em] uppercase mb-4 px-1">Your Trait Scores</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {traits.map(t => <TraitRing key={t.label} {...t} />)}
            </div>
          </section>

          {/* Career + Strengths */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Career Matches */}
            <div className="bg-[#fffcf4] border-2 border-[#ffe4cc] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-[var(--color-on-surface)] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">work</span>
                Top career matches
              </h3>
              <div className="flex flex-col gap-2 flex-grow">
                {careerMatches.map(c => (
                  <div key={c.label} className="flex items-center justify-between p-3 lg:p-4 hover:bg-[var(--color-surface-container-low)] rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-[var(--color-outline-variant)]/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)]/10 transition-colors">
                        <span className="material-symbols-outlined">{c.icon}</span>
                      </div>
                      <span className="text-[15px] font-semibold text-[var(--color-on-surface)]">{c.label}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wide ${c.highlight ? 'bg-[var(--color-secondary-fixed)] text-[var(--color-on-secondary-container)]' : 'bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)]'}`}>
                      {c.match}% Match
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Strengths */}
            <div className="bg-[#fffcf4] border-2 border-[#ffe4cc] rounded-2xl p-6 md:p-8 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-[var(--color-on-surface)] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[var(--color-tertiary)] text-xl">insights</span>
                Your top strengths
              </h3>
              <div className="flex flex-col gap-5 flex-grow justify-center">
                {strengths.map(s => (
                  <div key={s.title} className="flex items-start gap-4">
                    <div className="bg-[var(--color-primary-container)]/10 p-2 rounded-full shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[var(--color-primary-container)] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--color-on-surface)] mb-1">{s.title}</div>
                      <p className="text-xs font-medium text-[var(--color-on-surface-variant)] leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-4 flex justify-center">
            <button onClick={() => navigate('/psychometric-test')} className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm px-6 py-3 rounded-full hover:bg-[var(--color-primary)]/5 transition-all active:scale-95 group">
              <span>Retake Psychometric Test</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </section>

        </div>
      </div>
    </ProtectedLayout>
  )
}
