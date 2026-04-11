// src/pages/Webinars.jsx
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import ProtectedLayout from '../layouts/ProtectedLayout'
import { useAuth } from '../context/AuthContext'
import { useToast, Toast } from '../components/Toast'
import { MOCK_MODE } from '../lib/mockMode'

const UPCOMING = {
  month: 'APRIL', day: '05', time: '6:00 PM IST',
  title: 'Decoding Your Psychometric Report: Turning Insights into a 10-Year Career Roadmap',
  host: 'Rohith • Founder of Svastrino',
}

const PAST_WEBINARS = [
  { month: 'MAR', day: '08', title: 'Beyond JEE & NEET: Exploring High-Growth Career Paths in 2026', host: 'Karan Verma, Independent Career Consultant & Author', status: 'attended' },
  { month: 'FEB', day: '22', title: 'Building a Standout Profile: How to Impress Top Global University Admissions', host: 'Sneha Kapoor, Senior Admissions Strategist', status: 'missed' },
  { month: 'FEB', day: '05', title: 'The Soft Skill Secret: Mastering Communication & Leadership for Gen Z', host: 'Rohan Das, Soft Skills Trainer & Leadership Coach', status: 'attended' },
]

export default function Webinars() {
  const { isPremium } = useAuth()
  const { toast, showToast } = useToast()
  const [search, setSearch] = useState('')
  const [registered, setRegistered] = useState(false)

  const handleRegister = () => {
    if (!isPremium) {
      showToast('Upgrade to Premium to join webinars.', 'error')
      return
    }
    if (MOCK_MODE) {
      setRegistered(true)
      showToast('Registered! You\'ll receive a reminder before it starts.', 'success')
      return
    }
    // Real: call Supabase insert
    setRegistered(true)
    showToast('Registered successfully!', 'success')
  }

  const filtered = PAST_WEBINARS.filter(w =>
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    w.host.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <ProtectedLayout>
      <Helmet><title>Webinars | Svastrino</title></Helmet>
      <Toast toast={toast} />

      <div className="p-6 pt-6 lg:p-10 max-w-[1240px]">
        <div className="max-w-5xl mx-auto space-y-10 lg:space-y-12">

          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-primary-container)] uppercase">Live Learning</span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-[var(--color-primary)] mt-1 tracking-tight">Webinars</h1>
            </div>
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]/50 text-sm">search</span>
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/20 rounded-full text-sm focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none w-64 text-[var(--color-on-surface)]"
                placeholder="Search sessions..."
              />
            </div>
          </header>

          {/* Upcoming Hero */}
          <section>
            <div className={`relative overflow-hidden rounded-xl p-8 lg:p-10 flex flex-col md:flex-row gap-8 items-center shadow-lg border ${!isPremium ? 'border-[var(--color-primary-container)]/20' : 'border-transparent'}`}
              style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)' }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

              {/* Date Block */}
              <div className="flex flex-col items-center justify-center bg-white/20 backdrop-blur-md rounded-xl p-6 min-w-[140px] border border-white/20 shadow-sm z-10 shrink-0">
                <span className="text-[12px] font-bold tracking-widest opacity-80 uppercase text-white">{UPCOMING.month}</span>
                <span className="text-[52px] font-black leading-none my-1 text-white">{UPCOMING.day}</span>
                <span className="text-[14px] font-semibold opacity-90 text-white">{UPCOMING.time}</span>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-4 z-10">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[var(--color-primary-container)] text-white text-[10px] font-black uppercase rounded-full tracking-wider shadow-sm">Upcoming</span>
                  <span className="text-sm font-medium text-white/90 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">timer</span> Starts in 1 day
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-white mb-2">{UPCOMING.title}</h2>
                  <p className="text-white/80 text-lg font-medium italic">Hosted by {UPCOMING.host}</p>
                </div>

                {!isPremium ? (
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl border border-white/20">
                      <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                      <div>
                        <div className="text-white font-bold text-sm">Premium Feature</div>
                        <div className="text-white/70 text-xs">Upgrade to join live webinars</div>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-white text-[var(--color-primary)] rounded-xl font-bold text-sm hover:bg-[var(--color-surface-container-lowest)] transition-colors shadow-md active:scale-95">
                      Upgrade to Premium
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <button onClick={handleRegister} disabled={registered}
                      className="px-6 py-3 bg-white text-[var(--color-primary)] rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[var(--color-surface-container-lowest)] transition-colors shadow-md active:scale-95 disabled:opacity-70">
                      <span className="material-symbols-outlined text-lg">{registered ? 'check_circle' : 'calendar_add_on'}</span>
                      {registered ? 'Registered!' : 'Add to calendar'}
                    </button>
                    <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/20 rounded-xl font-bold text-sm hover:bg-white/40 transition-colors active:scale-95">
                      Join when live
                    </button>
                    <span className="text-xs text-white/70 italic font-medium tracking-wide">Link activates 10 mins before</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Past Webinars */}
          {!isPremium && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-600" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <p className="text-amber-800 text-sm font-semibold">Upgrade to Premium to watch past webinar replays.</p>
            </div>
          )}

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[11px] font-black tracking-[0.15em] text-[var(--color-on-surface-variant)] uppercase">Past Webinars</h2>
              <div className="h-px flex-1 bg-[var(--color-outline-variant)]/30 ml-4" />
            </div>
            <div className="flex flex-col gap-4">
              {filtered.map(w => (
                <div key={w.day + w.month}
                  className="group bg-[var(--color-surface-container-lowest)] hover:bg-white transition-all duration-300 rounded-xl border border-[var(--color-outline-variant)]/20 hover:border-[var(--color-outline-variant)]/40 hover:shadow-md overflow-hidden flex flex-col md:flex-row items-stretch cursor-pointer">
                  {/* Date column */}
                  <div className="flex items-center justify-center bg-[var(--color-surface-container-low)] px-8 py-6 min-w-[130px] border-r border-[var(--color-outline-variant)]/10">
                    <div className="text-center">
                      <span className="block text-[11px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">{w.month}</span>
                      <span className="block text-3xl font-black text-[var(--color-primary)] leading-none mt-1">{w.day}</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className={`${!isPremium ? 'blur-sm select-none' : ''}`}>
                      <h3 className="font-bold text-xl text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors mb-1 leading-snug">{w.title}</h3>
                      <p className="text-sm text-[var(--color-on-surface-variant)] font-medium">{w.host}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shrink-0">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${w.status === 'attended' ? 'bg-[var(--color-primary-fixed)]/50 border border-[var(--color-primary)]/10 text-[var(--color-primary-container)]' : 'bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/10 text-[var(--color-on-surface-variant)]'}`}>
                        {w.status === 'attended' && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                        {w.status === 'attended' ? 'Attended' : 'Missed'}
                      </div>
                      <button disabled={!isPremium} className={`flex items-center gap-2 font-bold text-sm group/btn ${isPremium ? 'text-[var(--color-primary)] hover:underline decoration-2 underline-offset-4' : 'text-[var(--color-outline)] cursor-not-allowed'}`}>
                        <span className="material-symbols-outlined text-xl group-hover/btn:scale-110 transition-transform">play_circle</span>
                        Watch replay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="pt-8 pb-4 text-center">
            <p className="text-xs text-[var(--color-on-surface-variant)] font-medium tracking-wide">© 2026 Svastrino. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </ProtectedLayout>
  )
}
