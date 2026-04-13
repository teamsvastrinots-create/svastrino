// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
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
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])
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

function ProfileCompletionModal({ onClose, onComplete }) {
  const { profile, setProfile } = useAuth()
  const [name, setName] = useState(profile?.name || '')
  const [cls, setCls] = useState(profile?.class || 'Class 11')
  const [city, setCity] = useState(profile?.city || '')

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !cls || !city) return
    setProfile(p => ({ ...p, name, class: cls, city }))
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
        <h3 className="font-black text-xl mb-2 text-[#0e1d4d] pr-8">Complete Your Profile</h3>
        <p className="text-sm text-slate-500 mb-6">We need a few details to generate your personalized sample report.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
            <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-[#4a7df2] outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Class</label>
            <select required value={cls} onChange={e => setCls(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-[#4a7df2] outline-none">
              <option>Class 10</option><option>Class 11</option><option>Class 12</option><option>Undergrad</option><option>Graduate</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">City</label>
            <input required value={city} onChange={e => setCity(e.target.value)} type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-[#4a7df2] outline-none" />
          </div>
          <button type="submit" className="w-full py-3 mt-4 bg-[#1b3482] text-white font-bold rounded-xl active:scale-95 transition-transform">
            Save & View Report
          </button>
        </form>
      </div>
    </div>
  )
}

function SampleReportModal({ onClose }) {
  const { profile } = useAuth()

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-[24px] w-full h-screen left-0 top-0 transition-opacity p-4 sm:p-8" onClick={onClose}>
      
      {/* Modal Container */}
      <div className="bg-zinc-800/60 flex flex-col w-full max-w-5xl max-h-[93vh] rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 relative" onClick={e => e.stopPropagation()}>
        
        {/* Top actions bar */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between p-4 sm:px-6 bg-zinc-900/90 gap-4 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4 text-white">
            <div className="bg-red-600 font-extrabold text-[10px] tracking-wider text-white rounded px-2 py-1.5 flex items-center justify-center select-none shadow-sm">
              PDF
            </div>
            <div>
              <h4 className="font-[600] text-[14px] tracking-wide m-0 text-white leading-tight">Psychometric_Report_Sample.pdf</h4>
              <p className="text-[11px] text-white/50 m-0 mt-0.5 tracking-wider uppercase font-bold">1 Apr 2026 &middot; Svastrino Career Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button className="bg-white/10 hover:bg-white/20 text-white/90 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">download</span> Download
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white/90 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">share</span> Share
            </button>
            <button onClick={onClose} className="text-white hover:text-white/70 transition-colors ml-4 p-2">
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>
        </div>

        {/* PDF Canvas wrapper (Scrollable area) */}
        <div className="overflow-y-auto flex-grow w-full py-6 px-4 flex justify-center items-start">
          {/* The Mock Document */}
          <div style={{ background: '#fff', width: '794px', minWidth: '794px', fontFamily: "'Inter', sans-serif", color: '#191c1e', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            
            {/* Inner content padded area */}
            <div style={{ padding: '48px 56px', display: 'flex', flexDirection: 'column', flex: 1, userSelect: 'none' }}>
            
              {/* Header */}
              <div style={{ borderLeft: '4px solid #24389c', paddingLeft: '16px', marginBottom: '28px' }}>
                <p style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em', color: '#757684', textTransform: 'uppercase', margin: '0 0 4px 0' }}>SVASTRINO CAREER INTELLIGENCE REPORT</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#191c1e', margin: 0 }}>{profile?.name || 'Sample User'} &middot; {profile?.class || 'Class 11'} &middot; {profile?.city || 'India'} &middot; Assessed: 1 Apr 2026</p>
              </div>

              {/* Profile Title & Score */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid #e8e8f0', gap: '24px' }}>
                <div style={{ maxWidth: '420px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#757684', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px 0' }}>YOUR PERSONALITY TYPE</p>
                  <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '36px', fontWeight: 800, color: '#24389c', margin: '0 0 10px 0', lineHeight: 1.15 }}>The Explorer</h1>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#191c1e', margin: '0 0 10px 0' }}>Creative Problem-Solver &middot; Right-Brain Dominant</p>
                  <p style={{ fontSize: '13px', color: '#454652', lineHeight: 1.65, margin: 0 }}>You think in big ideas, connect dots others miss, and thrive when given freedom to create. You bring originality to everything you touch.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#757684', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px 0' }}>PROFILE SCORE</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', color: '#6060c5' }}>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '56px', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1 }}>78</span>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#9a9ab0', marginLeft: '8px' }}>/ 100</span>
                  </div>
                  <div style={{ marginTop: '10px', background: '#f0f2ff', border: '1px solid rgba(36,56,156,0.2)', color: '#6060c5', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, padding: '5px 12px', borderRadius: '999px', whiteSpace: 'nowrap' }}>Top 8% of students</div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="mb-8">
                 <h6 className="text-[10px] font-bold text-[var(--color-outline-variant)] uppercase tracking-widest mb-5 border-b border-[var(--color-outline-variant)]/20 pb-2 block">PERSONALITY DIMENSIONS</h6>
                 <div className="space-y-5">
                   {[
                     { label: 'Creativity', val: 91, col: '#6060c5', colBg: '#6060c5', text: 'Ideas come naturally — you generate what others cannot imagine' },
                     { label: 'Empathy', val: 82, col: '#006471', colBg: '#008f86', text: 'You read people and situations with rare accuracy' },
                     { label: 'Resilience', val: 77, col: '#523da1', colBg: '#523da1', text: 'You recover fast and keep moving under pressure' },
                     { label: 'Logical Thinking', val: 74, col: '#2563eb', colBg: '#3b82f6', text: 'You back your instincts with structured reasoning' },
                     { label: 'Leadership', val: 68, col: '#f97316', colBg: '#f97316', text: 'You naturally step up when direction is needed' }
                   ].map(d => (
                     <div key={d.label}>
                       <div className="flex justify-between items-center mb-1">
                         <span className="font-[600] text-sm text-[var(--color-on-surface)]">{d.label}</span>
                         <span className="font-bold text-xs" style={{ color: d.col }}>{d.val}%</span>
                       </div>
                       <div className="w-full bg-[var(--color-surface-container)] rounded-full overflow-hidden mb-1" style={{ height: '10px' }}>
                         <div className="h-full rounded-full" style={{ width: `${d.val}%`, backgroundColor: d.colBg }}></div>
                       </div>
                       <p className="text-[11px] text-[var(--color-on-surface-variant)]">{d.text}</p>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Top Career Matches */}
              <div className="mb-8">
                 <h6 className="text-[10px] font-bold text-[var(--color-outline-variant)] uppercase tracking-widest border-b border-[var(--color-outline-variant)]/20 pb-2 mb-5 block">TOP CAREER MATCHES</h6>
                 <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', gap: '16px' }}>
                   {[
                     { match: '94%', title: 'Design & Creative Media', desc: 'Visual thinking and originality in top 5%', col: '#6060c5', bg: '#f0f0ff' },
                     { match: '88%', title: 'Entrepreneurship & Business', desc: 'Independence and risk appetite are exceptional', col: '#008f86', bg: '#f0fffe' },
                     { match: '81%', title: 'Psychology & Counselling', desc: 'Empathy score higher than 90% of students', col: '#2978a3', bg: '#eef5ff' }
                   ].map(m => (
                     <div key={m.title} className="bg-white border border-[var(--color-outline-variant)]/30 rounded-xl overflow-hidden shadow-sm">
                       <div style={{ height: '6px', width: '100%', backgroundColor: m.col }}></div>
                       <div style={{ padding: '14px' }}>
                         <span className="border text-[10px] px-2.5 py-1 rounded-full font-bold inline-block" style={{ marginBottom: '10px', backgroundColor: m.bg, color: m.col, borderColor: m.col + '4d' }}>{m.match} match</span>
                         <h5 className="text-sm font-[700] text-[var(--color-on-surface)]" style={{ marginBottom: '6px' }}>{m.title}</h5>
                         <p className="text-[11px] text-[var(--color-on-surface-variant)] leading-relaxed">{m.desc}</p>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Strengths */}
              <div className="mb-6">
                 <h6 className="text-[10px] font-bold text-[var(--color-outline-variant)] uppercase tracking-widest inline-block pb-1 mb-4">TOP STRENGTHS</h6>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                   {['Originality', 'Empathy', 'Pattern Recognition', 'Adaptability', 'Visual Thinking', 'Communication'].map(s => (
                     <span key={s} className="text-xs font-[600] text-[var(--color-on-surface)]">{s}</span>
                   ))}
                 </div>
              </div>

              {/* Locked Section */}
              <div className="relative overflow-hidden flex flex-col items-center justify-center bg-zinc-100 rounded-xl text-center" style={{ marginTop: '24px', padding: '48px 32px' }}>
                 <h6 className="text-[10px] font-bold text-[var(--color-outline)] uppercase tracking-widest opacity-80" style={{ position: 'absolute', top: '16px', left: '16px' }}>STREAM RECOMMENDATION & 12-WEEK ROADMAP</h6>
                 <p className="text-[14px] font-[600] text-[var(--color-on-surface)]" style={{ marginBottom: '4px', marginTop: '16px' }}>Your personalised career roadmap is locked</p>
                 <p className="text-xs text-[var(--color-on-surface-variant)]" style={{ marginBottom: '16px' }}>Available with Career Pro plan</p>
                 <button className="bg-[#5c5cce] hover:bg-[var(--color-primary)] text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-md transition-all active:scale-95">
                    Upgrade to unlock
                 </button>
              </div>

            </div>
            
             {/* Bottom Action Bar */}
             <div className="bg-[#f2efff] border-t border-[#e2dfff]" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', margin: '12px', marginTop: '0', borderRadius: '0 0 12px 12px' }}>
               <div>
                 <p className="font-bold text-[14px] text-[var(--color-on-surface)]" style={{ marginBottom: '4px' }}>Unlock your complete career report</p>
                 <p className="text-[11px] text-[#5c5cce] font-[600]">Stream guide &middot; College roadmap &middot; 12-week plan &middot; 1-on-1 session</p>
               </div>
               <button className="bg-[#5c5cce] hover:bg-[var(--color-primary)] text-white font-bold text-sm px-7 py-3 rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap">
                 Upgrade to Career Pro
               </button>
             </div>
             
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
  const [showProfilePrompt, setShowProfilePrompt] = useState(false)
  
  const handleViewReport = () => {
    if (!profile?.name || !profile?.class || !profile?.city) {
      setShowProfilePrompt(true)
    } else {
      setShowReport(true)
    }
  }


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
      {showProfilePrompt && (
        <ProfileCompletionModal 
          onClose={() => setShowProfilePrompt(false)} 
          onComplete={() => { setShowProfilePrompt(false); setShowReport(true); }} 
        />
      )}
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
            {/* Sample Report Hero (Classic HTML format) */}
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
                  <button onClick={handleViewReport} className="w-full sm:w-auto px-8 py-3.5 bg-white text-[var(--color-primary)] font-extrabold rounded-xl transition-all active:scale-95 text-sm shadow-lg hover:shadow-xl">
                    View sample report
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
