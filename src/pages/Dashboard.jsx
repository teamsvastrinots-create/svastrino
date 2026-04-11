// src/pages/Dashboard.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ProtectedLayout from '../layouts/ProtectedLayout'
import { useAuth } from '../context/AuthContext'

// --- Radial Progress Ring ---
function RadialRing({ pct, color, size = 80, label }) {
  const r = 32; const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox="0 0 80 80" className="-rotate-90">
        <circle cx="40" cy="40" r={r} stroke="#eceef0" strokeWidth="6" fill="none" />
        <circle cx="40" cy="40" r={r} stroke={color} strokeWidth="6" fill="none"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      {label && <span className="text-xs font-bold text-[var(--color-on-surface-variant)]">{label}</span>}
    </div>
  )
}

// --- Streak Modal ---
function StreakModal({ onClose }) {
  const today = new Date()
  const month = today.getMonth(); const year = today.getFullYear()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const curDay = today.getDate()
  const streakDays = Array.from({ length: 5 }, (_, i) => curDay - i).filter(d => d > 0)
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[var(--color-surface-container-lowest)] w-full max-w-sm rounded-3xl shadow-2xl border border-[var(--color-outline-variant)]/20 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sapphire-gradient px-6 py-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30 text-white">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">Your Streak</h3>
              <p className="text-white/80 text-xs font-medium">Keep the fire burning!</p>
            </div>
          </div>
          <button onClick={onClose} className="relative z-10 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        {/* Calendar */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <button className="text-[var(--color-outline-variant)] hover:text-[var(--color-on-surface)] transition-colors p-1">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <h4 className="font-bold text-[var(--color-on-surface)]">{monthNames[month]} {year}</h4>
            <button className="text-[var(--color-outline-variant)] hover:text-[var(--color-on-surface)] transition-colors p-1">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-[var(--color-outline)] uppercase tracking-wider">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const isStreak = streakDays.includes(day)
              const isToday = day === curDay
              return (
                <div key={day} className={[
                  'flex items-center justify-center h-9 rounded-xl text-sm font-semibold',
                  isStreak ? 'bg-orange-200 text-orange-800 border border-orange-400' :
                  isToday ? 'sapphire-gradient text-white shadow-md' :
                  day > curDay ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] opacity-40' :
                  'bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)]',
                ].join(' ')}>
                  {isStreak ? '🔥' : day}
                </div>
              )
            })}
          </div>
          <div className="mt-6 pt-5 border-t border-[var(--color-outline-variant)]/10 flex justify-around">
            <div className="text-center">
              <div className="text-2xl font-black text-[var(--color-primary)] flex items-center justify-center gap-1">5
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1", color: '#3f51b5' }}>local_fire_department</span>
              </div>
              <div className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mt-1">Current</div>
            </div>
            <div className="w-px bg-[var(--color-outline-variant)]/20" />
            <div className="text-center">
              <div className="text-2xl font-black text-[var(--color-on-surface)]">12</div>
              <div className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mt-1">Longest</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Sample Report Modal (free plan) ---
function SampleReportModal({ onClose }) {
  const traits = [
    { name: 'Analytical', pct: 88, color: '#24389c', icon: 'psychology_alt', level: 'Very High' },
    { name: 'Creative',   pct: 64, color: '#006471', icon: 'palette',        level: 'High' },
    { name: 'Social',     pct: 42, color: '#757684', icon: 'group',          level: 'Moderate' },
    { name: 'Leadership', pct: 76, color: '#24389c', icon: 'military_tech',  level: 'High' },
  ]
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[var(--color-surface-container-lowest)] w-full max-w-lg rounded-3xl shadow-2xl border border-[var(--color-outline-variant)]/20 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sapphire-gradient px-6 py-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
          <div className="relative z-10">
            <span className="text-white/70 text-[10px] font-black uppercase tracking-widest">Sample Report</span>
            <h3 className="text-white font-black text-xl leading-tight">Analytical Leader</h3>
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-3xl font-black text-white">72<span className="text-base">%</span></span>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>
        {/* Summary */}
        <div className="px-6 py-4 bg-[var(--color-primary)]/5 border-b border-[var(--color-outline-variant)]/10">
          <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
            You show strong logical reasoning and a natural drive to structure and lead. You thrive in goal-oriented environments that reward clarity of thought.
          </p>
        </div>
        {/* Traits */}
        <div className="p-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-outline)] mb-4">Your Trait Scores</p>
          <div className="grid grid-cols-2 gap-3">
            {traits.map(t => (
              <div key={t.name} className="flex flex-col items-center bg-[var(--color-surface-container-low)] rounded-2xl p-4">
                <div className="flex justify-between w-full mb-3">
                  <span className="text-xs font-bold text-[var(--color-on-surface)]">{t.name}</span>
                  <span className="text-xs font-extrabold" style={{ color: t.color }}>{t.pct}%</span>
                </div>
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" fill="none" stroke="currentColor" strokeWidth="3" className="text-[var(--color-outline-variant)]/20" />
                    <path d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32" fill="none" stroke={t.color} strokeWidth="3" strokeLinecap="round" style={{ strokeDasharray: `${t.pct}, 100` }} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl" style={{ color: t.color, fontVariationSettings: "'FILL' 1" }}>{t.icon}</span>
                  </div>
                </div>
                <div className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full mt-3 uppercase tracking-widest" style={{ color: t.color, background: t.color + '18' }}>{t.level}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Upgrade CTA */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-container)] p-5 rounded-2xl text-white text-center">
            <p className="text-sm font-black mb-1">🔒 This is just a preview</p>
            <p className="text-white/70 text-xs mb-4">Upgrade to Premium to get your full psychometric analysis, career matches, and personalized growth plan.</p>
            <button onClick={onClose} className="px-8 py-2.5 bg-white text-[var(--color-primary)] font-black rounded-xl text-sm hover:shadow-xl transition-all active:scale-95">
              Upgrade to Unlock
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function Dashboard() {
  const { profile, isPremium } = useAuth()
  const navigate = useNavigate()
  const [showStreak, setShowStreak] = useState(false)
  const [showReport, setShowReport] = useState(false)


  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile?.name?.split(' ')[0] ?? 'Student'

  const TRAITS = [
    { label: 'Curiosity', level: 'Medium', color: '#ff9800' },
    { label: 'Confidence', level: 'High', color: '#4caf50' },
    { label: 'Clarity', level: 'Low', color: '#ba1a1a' },
    { label: 'Resilience', level: 'High', color: '#24389c' },
    { label: 'Adaptability', level: 'Medium', color: '#44d8f1' },
  ]

  return (
    <ProtectedLayout>
      <Helmet><title>Dashboard | Svastrino</title></Helmet>
      {showStreak && <StreakModal onClose={() => setShowStreak(false)} />}
      {showReport && <SampleReportModal onClose={() => setShowReport(false)} />}

      <div className="p-6 pt-6 lg:p-10 max-w-[1240px]">
        {/* ── Header ─────────────────────────────────────── */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-primary)]">
              {greeting}, {firstName}
            </h1>
          </div>
          {isPremium ? (
            <button onClick={() => setShowStreak(true)}
              className="flex items-center gap-3 px-5 py-2.5 lg:px-6 lg:py-3 bg-amber-50 rounded-xl shadow-sm border border-amber-200 hover:shadow-md transition-all active:scale-95 cursor-pointer">
              <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <span className="font-bold text-amber-800 text-sm">5 day streak</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 bg-[var(--color-surface-container-lowest)] rounded-xl shadow-sm border border-[var(--color-outline-variant)]/10">
              <span className="material-symbols-outlined text-[var(--color-outline)]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              <span className="font-bold text-[var(--color-on-surface-variant)] text-sm">Free Plan</span>
            </div>
          )}
        </header>

        {/* ── FREE PLAN VIEW ──────────────────────────────── */}
        {!isPremium && (
          <div className="space-y-10">
            {/* Sample Report Hero */}
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-white rounded-xl p-6 lg:p-8 relative overflow-hidden shadow-xl">
              <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase mb-5 border border-white/10">Your sample report</div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                <div className="flex-1 max-w-2xl">
                  <h2 className="text-3xl lg:text-4xl font-extrabold mb-3 tracking-tight">Analytical Leader</h2>
                  <p className="text-white/80 text-sm lg:text-base leading-relaxed mb-6">
                    You show strong logical reasoning and a natural drive to structure and lead. You thrive in goal-oriented environments that reward clarity of thought.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {TRAITS.map(t => (
                      <span key={t.label} className="inline-flex items-center px-3 py-1.5 bg-[var(--color-surface-container-lowest)] rounded-full text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wide shadow-sm">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ background: t.color }} />
                        {t.label} <span className="text-[var(--color-outline)] ml-1.5 font-semibold">{t.level}</span>
                      </span>
                    ))}
                  </div>
                  <button onClick={() => setShowReport(true)} className="w-full sm:w-auto px-8 py-3.5 bg-white text-[var(--color-primary)] font-extrabold rounded-xl transition-all active:scale-95 text-sm shadow-lg hover:shadow-xl">
                    Unlock full report
                  </button>
                </div>
                {/* Score ring */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-full border border-white/20 bg-white/10 flex items-center justify-center relative">
                    <span className="text-4xl lg:text-5xl font-black text-white">72<span className="text-2xl font-bold opacity-80">%</span></span>
                  </div>
                  <span className="text-[10px] tracking-widest uppercase opacity-70 font-black mt-4 text-center leading-tight">You<br />scored</span>
                </div>
              </div>
            </div>

            {/* Week 1 + Free Plan includes */}
            <div className="grid grid-cols-12 gap-5 lg:gap-8">
              {/* Week 1 Preview */}
              <div className="col-span-12 lg:col-span-7 bg-[var(--color-surface-container-lowest)] rounded-xl p-6 lg:p-8 border border-[var(--color-outline-variant)]/10 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold mb-1 text-[var(--color-on-surface)]">Week 1 — Self Awareness</h2>
                    <p className="text-[var(--color-on-surface-variant)] text-sm">Free preview · Start anytime</p>
                  </div>
                  <span className="px-3 py-1.5 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-200">Free</span>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    { icon: 'play_arrow', name: 'Self Awareness Intro', meta: '15 mins · Video lecture', available: true, filled: true },
                    { icon: 'task_alt', name: '3 Daily Tasks', meta: 'Worksheets · PDFs · ~15 mins each', available: true, filled: false },
                    { icon: 'lock', name: 'Weeks 2–24 Content', meta: '23 more weeks · Upgrade to unlock', available: false, filled: false },
                  ].map(item => (
                    <div key={item.name} className={`flex items-center justify-between p-3 lg:p-4 rounded-lg border ${item.available ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]/10' : 'bg-[var(--color-surface)]/50 border-[var(--color-outline-variant)]/10 opacity-60'}`}>
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm border border-[var(--color-outline-variant)]/10 ${item.available ? 'bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)]' : 'bg-[var(--color-surface-container)] text-[var(--color-outline)]'}`}>
                          <span className="material-symbols-outlined text-base" style={item.filled ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                        </div>
                        <div>
                          <span className={`font-bold text-sm block ${item.available ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]'}`}>{item.name}</span>
                          <span className="text-[11px] text-[var(--color-on-surface-variant)] font-medium">{item.meta}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] lg:text-xs font-bold uppercase px-2 py-1 rounded ${item.available ? 'text-[var(--color-primary)] bg-[var(--color-primary-fixed)]' : 'text-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)]'}`}>{item.available ? 'Available' : 'Locked'}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/my-course')} className="w-full py-3.5 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-all active:scale-[0.99] text-sm shadow-sm flex items-center justify-center gap-2">
                  Start Week 1 Preview <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>

              {/* Free Plan Includes */}
              <div className="col-span-12 lg:col-span-5 bg-[var(--color-surface-container-lowest)] rounded-xl p-6 lg:p-8 border border-[var(--color-outline-variant)]/10 shadow-sm hover:shadow-lg transition-shadow">
                <h2 className="text-xl lg:text-2xl font-bold mb-1 text-[var(--color-on-surface)]">Free Plan Includes</h2>
                <p className="text-[var(--color-on-surface-variant)] text-sm mb-6">What you can access now</p>
                <div className="space-y-4 lg:space-y-5">
                  {[
                    { text: 'Sample Psychometric Report', sub: 'See your personality type preview', ok: true },
                    { text: 'Week 1 Video Lecture', sub: 'Self awareness intro · 15 mins', ok: true },
                    { text: '3 Daily Tasks', sub: 'Interactive worksheets & PDFs', ok: true },
                    { text: 'Full Psychometric Report', sub: 'Premium only', ok: false },
                    { text: 'Weeks 2–24 Content', sub: 'Premium only', ok: false },
                    { text: 'Monthly Career Webinars', sub: 'Premium only', ok: false },
                  ].map(item => (
                    <div key={item.text} className={`flex items-start gap-4 ${!item.ok ? 'opacity-50' : ''}`}>
                      <span className={`material-symbols-outlined text-xl mt-0.5 ${item.ok ? 'text-green-500' : 'text-[var(--color-outline)]'}`} style={item.ok ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.ok ? 'check_circle' : 'cancel'}</span>
                      <div>
                        <span className="text-sm font-bold text-[var(--color-on-surface)] block">{item.text}</span>
                        <span className="text-xs text-[var(--color-on-surface-variant)] font-medium">{item.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="grid grid-cols-12 gap-5 lg:gap-8">
              <div className="col-span-12 md:col-span-6 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-white p-6 lg:p-8 rounded-xl relative overflow-hidden group cursor-pointer shadow-xl">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/10">Recommended</span>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-2">Upgrade to Premium</h3>
                  <p className="text-white/80 mb-4 text-sm lg:text-base leading-relaxed">Get the full psychometric report, all 24 weeks, daily tasks, monthly webinars & WhatsApp reminders.</p>
                  <ul className="space-y-2.5 mb-6 lg:mb-8 text-sm text-white/90 font-medium">
                    {['Detailed AI soft-skill progression','1-on-1 mentorship interactions','Weekly downloadable resources'].map(f => (
                      <li key={f} className="flex items-start gap-2"><span className="material-symbols-outlined text-lg">check_circle</span>{f}</li>
                    ))}
                  </ul>
                  <button className="flex items-center gap-2 bg-white text-[var(--color-primary)] px-6 py-3 rounded-xl font-bold text-sm hover:shadow-xl transition-all active:scale-95">
                    See Plans <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Comparison */}
              <div className="col-span-12 md:col-span-6 bg-[var(--color-surface-container-lowest)] p-6 lg:p-8 rounded-xl border border-[var(--color-outline-variant)]/10 shadow-sm flex flex-col gap-6">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-on-surface)] mb-1">Free vs Premium</h3>
                </div>
                <div className="grid grid-cols-[1fr_80px_24px_80px] items-center gap-x-2 pb-3 border-b border-[var(--color-outline-variant)]/20">
                  {['Feature','Free','','Premium'].map((h, i) => (
                    <span key={i} className={`text-[11px] font-bold uppercase tracking-widest text-center ${i === 3 ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)]'} ${i === 0 ? 'text-left' : ''}`}>{h}</span>
                  ))}
                </div>
                {[['Video lectures','1','24'],['Daily tasks','3','144'],['Psychometric report','Sample','Full'],['Career webinars','✕','Monthly']].map(([label, free, prem]) => (
                  <div key={label} className="grid grid-cols-[1fr_80px_24px_80px] items-center gap-x-2 py-2 border-b border-[var(--color-outline-variant)]/10 last:border-0">
                    <span className="text-sm text-[var(--color-on-surface-variant)] font-medium">{label}</span>
                    <span className={`text-sm font-bold text-center ${free === '✕' ? 'text-[var(--color-error)]' : 'text-[var(--color-on-surface)]'}`}>{free}</span>
                    <span className="text-[var(--color-outline-variant)]/40 text-center text-xs">→</span>
                    <span className="text-sm font-bold text-[var(--color-primary)] text-center">{prem}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PREMIUM VIEW ────────────────────────────────── */}
        {isPremium && (
          <div className="space-y-10">
            <div className="grid grid-cols-12 gap-5 lg:gap-8">
              {/* Course Progress */}
              <div className="col-span-12 lg:col-span-7 bg-[var(--color-surface-container-lowest)] rounded-xl p-6 lg:p-8 hover:shadow-lg transition-shadow border border-[var(--color-outline-variant)]/10 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold mb-1 text-[var(--color-on-surface)]">Course Progress</h2>
                    <p className="text-[var(--color-on-surface-variant)] text-sm">24-Week Career Transformation</p>
                  </div>
                  <RadialRing pct={33} color="#24389c" size={80} />
                </div>
                {[
                  { label: 'Week 1 · Self Awareness', status: 'In Progress', active: true },
                  { label: 'Week 2 · Values & Strengths', status: 'Locked', active: false },
                ].map(item => (
                  <div key={item.label} className={`flex items-center justify-between p-3 lg:p-4 rounded-lg mb-3 ${item.active ? 'bg-[var(--color-surface)]' : 'bg-[var(--color-surface)]/50 opacity-60'}`}>
                    <div className="flex items-center gap-3 lg:gap-4">
                      <span className={`w-2 h-2 rounded-full ${item.active ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-outline-variant)]'}`} />
                      <span className="font-medium text-sm lg:text-base text-[var(--color-on-surface)]">{item.label}</span>
                    </div>
                    <span className={`text-[10px] lg:text-xs font-bold uppercase px-2 py-1 rounded ${item.active ? 'text-[var(--color-primary)] bg-[var(--color-primary-fixed)]' : 'text-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)]'}`}>{item.status}</span>
                  </div>
                ))}
                <button onClick={() => navigate('/my-course')} className="mt-4 w-full py-3 border border-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold rounded-xl hover:bg-[var(--color-primary-fixed)]/10 transition-colors text-sm">
                  View All 24 Weeks
                </button>
              </div>

              {/* Tasks This Week */}
              <div className="col-span-12 lg:col-span-5 bg-[var(--color-surface-container-lowest)] rounded-xl p-6 lg:p-8 hover:shadow-lg transition-shadow border border-[var(--color-outline-variant)]/10 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold mb-1 text-[var(--color-on-surface)]">Tasks This Week</h2>
                    <p className="text-[var(--color-on-surface-variant)] text-sm">2 of 7 completed</p>
                  </div>
                  <RadialRing pct={28} color="#8b5000" size={80} />
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Profile Setup', done: true },
                    { label: 'Skill Assessment', done: true },
                    { label: 'Values Worksheet', done: false },
                    { label: 'Connect with Mentor', done: false },
                  ].map(task => (
                    <div key={task.label} className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${task.done ? 'text-[var(--color-primary-container)]' : 'text-[var(--color-outline-variant)]'}`} style={task.done ? { fontVariationSettings: "'FILL' 1" } : {}}>{task.done ? 'check_circle' : 'radio_button_unchecked'}</span>
                      <span className={`text-sm ${task.done ? 'line-through text-[var(--color-on-surface-variant)]' : 'text-[var(--color-on-surface)]'}`}>{task.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-12 gap-5 lg:gap-8">
              {/* Pending Task */}
              <button onClick={() => navigate('/todays-task')} className="col-span-12 md:col-span-6 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-white p-6 lg:p-8 rounded-xl relative overflow-hidden group cursor-pointer text-left">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">Priority High</span>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-2">Today's Pending Task</h3>
                  <p className="text-white/80 mb-6 lg:mb-8 text-base lg:text-lg">Values Worksheet: Discover your core professional drivers.</p>
                  <span className="flex items-center gap-2 font-bold group-hover:gap-4 transition-all">
                    Complete Task <span className="material-symbols-outlined">arrow_forward</span>
                  </span>
                </div>
              </button>

              {/* Upcoming Webinar */}
              <div className="col-span-12 md:col-span-6 bg-[var(--color-surface-container-low)] p-6 lg:p-8 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-8 group border border-[var(--color-outline-variant)]/10 shadow-sm">
                <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-[var(--color-primary-fixed)] to-[var(--color-secondary-container)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-[var(--color-primary)]">video_camera_front</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[var(--color-primary-container)] text-sm">video_camera_front</span>
                    <span className="font-label text-xs font-bold text-[var(--color-primary-container)] uppercase tracking-tight">Live Webinar</span>
                  </div>
                  <h3 className="font-bold text-xl text-[var(--color-on-surface)] mb-1">Career Mapping</h3>
                  <p className="text-[var(--color-on-surface-variant)] text-sm mb-4">With Rohith — Founder, Svastrino</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[var(--color-primary)] text-sm">Starts in 45m</span>
                    <button className="text-[var(--color-primary)] font-bold text-sm hover:underline underline-offset-4">Remind Me</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}
