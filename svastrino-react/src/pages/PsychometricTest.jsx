// src/pages/PsychometricTest.jsx
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import ProtectedLayout from '../layouts/ProtectedLayout'
import { useAuth } from '../context/AuthContext'

// ── Congratulations Modal ─────────────────────────────────────
function CongratsModal({ onClose, onViewResults }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-[var(--color-outline-variant)]/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 pt-8 pb-6 text-white text-center relative overflow-hidden">
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          <div className="text-6xl mb-3 relative z-10">🎉</div>
          <h2 className="text-2xl font-black text-white mb-1 relative z-10">Test Complete!</h2>
          <p className="text-white/80 text-sm relative z-10">You've unlocked your psychometric profile.</p>
        </div>
        {/* Score preview */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Score</p>
              <p className="text-4xl font-black text-[var(--color-primary)] leading-none">78<span className="text-lg text-slate-400 font-semibold">/100</span></p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1.5 rounded-full mb-1">Top 8%</span>
              <p className="text-xs text-slate-400 font-medium">of students</p>
            </div>
          </div>
          <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 rounded-xl px-4 py-3 mb-5">
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-[var(--color-primary)]">Personality Type:</span> The Explorer — Creative Problem-Solver with a right-brain dominant profile.
            </p>
          </div>
          <button onClick={onViewResults} className="w-full py-3.5 sapphire-gradient text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mb-3">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            View Results
          </button>
          <p className="text-center text-xs text-slate-400 pb-4">Your detailed report is now available in Test Results.</p>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export default function PsychometricTest() {
  const { isPremium } = useAuth()
  const navigate = useNavigate()
  const [testDone, setTestDone] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)

  const handleStartTest = () => {
    if (!isPremium) return
    // Simulate test completion
    setTestDone(true)
    setShowCongrats(true)
  }

  const handleViewResults = () => {
    setShowCongrats(false)
    navigate('/test-results')
  }

  return (
    <ProtectedLayout>
      <Helmet><title>Psychometric Test | Svastrino</title></Helmet>
      {showCongrats && <CongratsModal onClose={() => setShowCongrats(false)} onViewResults={handleViewResults} />}

      <div className="p-6 pt-6 lg:p-10 max-w-[1240px]">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-primary-container)] uppercase">Assessment Hub</span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-[var(--color-primary)] mt-1 tracking-tight">Psychometric Journey</h1>
            </div>
            <div className="flex gap-3">
              <div className="h-1.5 w-12 bg-[var(--color-primary)] rounded-full" />
              <div className="h-1.5 w-6 bg-[var(--color-outline-variant)]/50 rounded-full" />
              <div className="h-1.5 w-6 bg-[var(--color-outline-variant)]/50 rounded-full" />
            </div>
          </header>

          {/* Dynamic Hero */}
          <section className={`relative overflow-hidden rounded-xl p-8 lg:p-12 text-white flex flex-col md:flex-row justify-between items-center shadow-2xl transition-all duration-500 border ${testDone ? 'border-[var(--color-primary-container)]/50' : 'border-[var(--color-primary-container)]/20'}`}
            style={{ background: testDone ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)' : 'linear-gradient(135deg, #00105c 0%, var(--color-primary) 100%)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5 max-w-xl">
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                <span className="material-symbols-outlined text-sm" style={testDone ? { fontVariationSettings: "'FILL' 1" } : {}}>{testDone ? 'check_circle' : 'schedule'}</span>
                <span className="text-[11px] font-bold tracking-widest uppercase">{testDone ? 'Status: Achievement Unlocked' : 'Status: Pending Assessment'}</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-white">
                {testDone ? 'Psychometric test completed' : 'Ready to discover your potential?'}
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                {testDone ? `Your cognitive and behavioral assessment was processed on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.` : 'Take our comprehensive cognitive and behavioral assessment to uncover your core strengths, personality type, and ideal career paths.'}
              </p>

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                {!testDone ? (
                  isPremium ? (
                    <button onClick={handleStartTest} className="bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-xl hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-2">
                      Start Test Now <span className="material-symbols-outlined text-sm">play_arrow</span>
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl border border-white/20">
                        <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                        <div>
                          <div className="text-white font-bold text-sm">Premium Feature</div>
                          <div className="text-white/70 text-xs">Upgrade to unlock the full psychometric assessment</div>
                        </div>
                      </div>
                      <button className="bg-white text-[var(--color-primary)] px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-xl active:scale-95 transition-all w-fit">
                        Unlock Premium <span className="material-symbols-outlined text-sm align-middle">workspace_premium</span>
                      </button>
                    </div>
                  )
                ) : (
                  <>
                    <button onClick={() => navigate('/test-results')} className="bg-white text-[var(--color-primary)] px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-black/10">
                      View results <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    <button onClick={() => setTestDone(false)} className="bg-transparent border-[1.5px] border-white/30 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center">
                      Retake Test
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Icon */}
            <div className="hidden md:block relative z-10 w-48 h-48 lg:w-64 lg:h-64 shrink-0 mt-8 md:mt-0">
              <div className="absolute inset-0 bg-[var(--color-secondary-fixed)]/20 rounded-full blur-2xl" />
              <div className={`relative w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl transition-all duration-500 ${testDone ? 'bg-green-500/10' : ''}`}>
                <span className="material-symbols-outlined text-7xl lg:text-8xl text-white opacity-90" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {testDone ? 'verified' : 'psychology'}
                </span>
              </div>
            </div>
          </section>

          {/* What you get */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: 'fingerprint', bg: 'bg-[var(--color-primary)]/10', color: 'text-[var(--color-primary)]', title: 'Personality type', desc: 'Discover your core traits and how you interact with the professional world around you.' },
              { icon: 'work_outline', bg: 'bg-[var(--color-secondary-fixed)]', color: 'text-[var(--color-primary-container)]', title: 'Career fit', desc: 'Map your unique psychological profile to over 500+ modern career paths and industries.' },
              { icon: 'insights', bg: 'bg-[var(--color-tertiary-fixed)]', color: 'text-[var(--color-tertiary)]', title: 'Strengths & gaps', desc: 'A detailed breakdown of your natural talents and specific areas identified for growth.' },
            ].map(item => (
              <div key={item.title} className="bg-[var(--color-surface-container-lowest)] p-8 rounded-xl flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform shadow-sm border border-[var(--color-outline-variant)]/10">
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                  <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-[var(--color-on-surface)]">{item.title}</h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Details + Checklist */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-stretch pt-2">
            {/* Test Details */}
            <div className="bg-[var(--color-surface-container-lowest)] rounded-xl flex flex-col border border-[var(--color-outline-variant)]/10 shadow-sm">
              <div className="p-6 lg:p-8 border-b border-[var(--color-surface-container)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-[var(--color-on-surface-variant)]">Core Information</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-on-surface)]">Test details</h3>
              </div>
              <div className="p-6 lg:p-8 space-y-5 flex-grow flex flex-col justify-center">
                {[
                  { icon: 'timer', label: 'Duration', value: '45 Minutes' },
                  { icon: 'quiz', label: 'Question Format', value: 'Multiple Choice' },
                  { icon: 'translate', label: 'Language', value: 'English (India)' },
                  { icon: 'history_edu', label: 'Difficulty', value: 'Adaptive' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-container-low)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <span className="font-medium text-[var(--color-on-surface-variant)]">{item.label}</span>
                    </div>
                    <span className="font-bold text-[var(--color-on-surface)]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Before you start */}
            <div className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-outline-variant)]/10 p-6 lg:p-10 flex flex-col justify-center shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary-fixed)]/5 to-transparent pointer-events-none" />
              <div className="relative z-10 mb-8">
                <h3 className="text-2xl font-bold mb-2 text-[var(--color-on-surface)]">Before you start</h3>
                <p className="text-[var(--color-on-surface-variant)] text-sm">Essential checklist to ensure maximum accuracy and zero interruptions.</p>
              </div>
              <ul className="relative z-10 space-y-5 lg:space-y-6">
                {[
                  { title: 'Quiet Environment', desc: 'Find a space free of noise or potential distractions for 45 mins.' },
                  { title: 'Stable Connection', desc: 'Ensure your internet speed is reliable to avoid losing progress.' },
                  { title: 'Honest Responses', desc: 'There are no right or wrong answers. Authenticity is key for fit.' },
                ].map(item => (
                  <li key={item.title} className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-[var(--color-secondary-fixed)] flex items-center justify-center shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-[14px] font-bold text-[var(--color-on-secondary-container)]">check</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm lg:text-base text-[var(--color-on-surface)]">{item.title}</p>
                      <p className="text-xs lg:text-sm text-[var(--color-on-surface-variant)] mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <footer className="pt-8 pb-4 text-center">
            <p className="text-xs text-[var(--color-on-surface-variant)] font-medium tracking-wide">© 2026 Svastrino. All rights reserved. Data privacy compliant.</p>
          </footer>
        </div>
      </div>
    </ProtectedLayout>
  )
}
