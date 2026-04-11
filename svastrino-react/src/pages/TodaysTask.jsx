// src/pages/TodaysTask.jsx
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import ProtectedLayout from '../layouts/ProtectedLayout'
import { useAuth } from '../context/AuthContext'
import { useToast, Toast } from '../components/Toast'

// ── Task Definitions ──────────────────────────────────────────
const FREE_TASKS = [
  {
    id: 1, title: 'Self Discovery - Video', type: 'Video', meta: '15 mins · Active now', icon: 'play_circle',
    desc: 'Watch the video module to discover your hidden potentials. This is the first building block of your career direction.',
    action: 'Play Video', link: '/my-course',
  },
  {
    id: 2, title: 'Write 5 things you like doing', type: 'Worksheet', meta: '15 mins · ~15 mins',
    icon: 'edit_document', desc: 'Identify fields and roles that excite you — the first building block of your career direction.', action: 'Open worksheet',
  },
  {
    id: 3, title: 'Ask 3 people: “What am I good at?”', type: 'Interviews', meta: '~15 mins · Unlocks after Task 2',
    icon: 'psychology', desc: 'Gather external perspectives on your natural talents. This helps validate your self-assessment.', action: 'Record insights',
  },
  {
    id: 4, title: '“My Top 3 Strengths + Why”', type: 'Analysis', meta: '~15 mins · Unlocks after Task 3',
    icon: 'stars', desc: 'Synthesize your self-reflection and peer feedback into a core strength profile.', action: 'Record analysis',
  },
]

const PREMIUM_TASKS = [
  {
    id: 5, title: 'Personal Brand Statement', type: 'Branding', meta: '~40 mins · Unlocks after Task 4',
    icon: 'badge', desc: 'Draft a compelling 30-word personal brand statement that highlights your core value and career goals.', action: 'Open assignment',
  },
  {
    id: 6, title: 'Weekly Milestone Recap', type: 'Review', meta: '~30 mins · Unlocks after Task 5',
    icon: 'flag', desc: "Reflect on your Week 1 achievements and insights before advancing to Week 2 content.", action: 'Start review',
  },
]

// ── Task Row Component ────────────────────────────────────────
function TaskRow({ task, state, onComplete, onNavigate }) {
  // state: 'done' | 'active' | 'locked'
  if (state === 'done') {
    return (
      <div className="border border-[#e0e3e5] bg-[#f8f9fb] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center transition-all">
        <div className="w-10 h-10 rounded-full bg-[#4a7df2] shrink-0 flex items-center justify-center text-white shadow-md">
          <span className="material-symbols-outlined text-xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
        </div>
        <div className="flex-grow pt-0.5">
          <h3 className="text-base sm:text-[17px] font-bold text-[#454652] line-through decoration-[#c5c5d4] decoration-2">{task.title}</h3>
        </div>
        <div className="bg-[#e6f0ff] text-[#1e40af] px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest shrink-0 border border-[#bfdbfe]">Done</div>
      </div>
    )
  }

  if (state === 'active') {
    return (
      <div className="border-2 border-[#93adeb] bg-[#eef3ff] rounded-2xl p-5 sm:p-7 flex flex-col gap-5 shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#4a7df2]/20 rounded-full blur-[40px] pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex gap-4 sm:gap-5 items-start z-10">
            <div className="w-10 h-10 rounded-full bg-[#1b3482] shrink-0 flex items-center justify-center text-white shadow-lg ring-4 ring-white">
              <span className="text-base font-bold">{task.id}</span>
            </div>
            <div className="pt-1">
              <h3 className="text-[#0e1d4d] text-lg sm:text-xl font-extrabold leading-tight">{task.title}</h3>
              <p className="text-[#3d70eb] text-xs font-bold mt-1.5 tracking-wide flex items-center gap-1.5">
                <span className="material-symbols-outlined text-xs">{task.icon}</span>
                {task.type} · {task.meta}
              </p>
            </div>
          </div>
          <div className="bg-[#1b3482] text-white px-4 py-1.5 rounded-full text-[11px] font-extrabold shrink-0 tracking-widest uppercase shadow-sm z-10 self-start sm:self-auto ml-14 sm:ml-0">Active</div>
        </div>
        <div className="ml-0 sm:ml-[60px] space-y-5 z-10">
          <p className="text-[#2d3133] text-sm leading-relaxed max-w-xl font-medium">{task.desc}</p>
          <div className="flex flex-wrap items-center gap-3">
            {task.link ? (
              <button onClick={() => onNavigate(task.link)} className="bg-[#1b3482] hover:bg-[#132763] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98]">
                {task.action}
              </button>
            ) : (
              <button onClick={() => onComplete(task.id)} className="bg-[#1b3482] hover:bg-[#132763] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98]">
                {task.action}
              </button>
            )}
            <button onClick={() => onComplete(task.id)} className="text-[#3d70eb] hover:text-[#1b3482] text-sm font-bold px-4 py-2 flex items-center gap-1.5 sm:ml-auto transition-colors group">
              Mark complete <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // locked
  return (
    <div className="border border-[#e0e3e5] bg-white rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5 items-center opacity-60">
      <div className="w-10 h-10 rounded-full bg-[#f2f4f6] shrink-0 flex items-center justify-center text-[#757684]">
        <span className="material-symbols-outlined text-lg">lock</span>
      </div>
      <div className="flex-grow pt-0.5">
        <h3 className="text-sm sm:text-base font-bold text-[#454652]">{task.title}</h3>
        <p className="text-xs text-[#757684] mt-0.5 font-semibold">{task.meta}</p>
      </div>
      <div className="bg-[#f2f4f6] text-[#454652] px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase shrink-0">Locked</div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function TodaysTask() {
  const { isPremium } = useAuth()
  const navigate = useNavigate()
  const { toast, showToast } = useToast()

  // Track which tasks are done: initially all locked except task 1 (active), 2 (locked)
  const [doneIds, setDoneIds] = useState([])

  const allTasks = isPremium ? [...FREE_TASKS, ...PREMIUM_TASKS] : FREE_TASKS
  const totalTasks = allTasks.length
  const doneCount = doneIds.length
  const remaining = totalTasks - doneCount

  const getState = (task) => {
    if (doneIds.includes(task.id)) return 'done'
    // First undone task after all previous done
    const firstUndone = allTasks.find(t => !doneIds.includes(t.id))
    if (firstUndone?.id === task.id) return 'active'
    return 'locked'
  }

  const handleComplete = (id) => {
    setDoneIds(prev => [...prev, id])
    showToast('Task marked complete! 🎉', 'success')
  }

  // Circular progress for SVG
  const pct = (doneCount / totalTasks) * 100
  const circum = 2 * Math.PI * 15.9
  const offset = circum - (pct / 100) * circum

  return (
    <ProtectedLayout>
      <Helmet><title>Today's Task | Svastrino</title></Helmet>
      <Toast toast={toast} />

      <div className="p-5 pt-5 lg:p-10 xl:p-12 max-w-[1540px] mx-auto flex flex-col gap-10 bg-[var(--color-surface-container-low)] min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-14">

          {/* ── Left Column ──────────────────────────────────── */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Plan indicator */}
            <span className="text-[11px] font-extrabold text-[#757684] uppercase tracking-[0.15em]">
              Week 1 — {isPremium ? 'Premium' : 'Free preview'}
            </span>

            {/* Week Progress Card */}
            <div className="bg-[#131627] text-white rounded-[24px] p-6 sm:p-7 shadow-xl flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#4a7df2] rounded-full blur-[60px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity" />
              <div className="flex items-center gap-5 z-10 w-full xl:w-auto">
                <div className="relative w-[65px] h-[65px] sm:w-[72px] sm:h-[72px] shrink-0 shadow-lg rounded-full bg-[#1e233d]">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-[#4a7df2]" style={{ strokeDasharray: `${pct}, 100` }}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm sm:text-base font-extrabold tracking-tighter">{doneCount} / {totalTasks}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">Week 1 progress</h3>
                  <p className="text-sm text-white/70 mt-1 leading-relaxed font-medium">
                    {doneCount === 0 ? 'Lecture completed. Task 1 is active and waiting for you.' : `${doneCount} task${doneCount > 1 ? 's' : ''} done. Keep it up!`}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap xl:flex-nowrap items-center gap-4 text-xs font-bold text-white/80 uppercase tracking-widest bg-white/5 px-5 py-3 rounded-xl border border-white/10 shrink-0 z-10">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#4a7df2]" /> {doneCount} done</span>
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#1b3482] border-2 border-[#4a7df2]" /> 1 active</span>
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-white/10" /> {Math.max(0, remaining - 1)} locked</span>
              </div>
            </div>

            {/* Task Container */}
            <div className="bg-[var(--color-surface-container-lowest)] rounded-[28px] border border-[var(--color-outline-variant)]/20 p-6 sm:p-8 lg:p-10 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#00105c]">Today's task</h1>
                <div className="px-3.5 py-1.5 bg-[#fff6ed] text-[#e06414] rounded-full text-[11px] font-extrabold uppercase tracking-wider border border-[#ffdcbe] flex items-center gap-1.5 shadow-sm self-start">
                  <span className="material-symbols-outlined text-sm">flag</span>
                  {remaining} of {totalTasks} remaining
                </div>
              </div>
              <div className="text-[11px] font-extrabold text-[var(--color-outline)] uppercase tracking-[0.15em] mb-7">
                CURRICULUM JOURNEY — WEEK 1
              </div>

              <div className="flex flex-col gap-2.5">
                {allTasks.map(task => (
                  <TaskRow key={task.id} task={task}
                    state={getState(task)}
                    onComplete={handleComplete}
                    onNavigate={navigate}
                  />
                ))}
              </div>

              {/* All Done Banner */}
              {doneCount === totalTasks && (
                <div className="mt-6 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-xl font-black text-emerald-800 mb-2">Week 1 Complete!</h3>
                  <p className="text-sm text-emerald-700 font-medium mb-4">You've earned your Week 1 Completion Badge. Week 2 is now unlocked.</p>
                  <button onClick={() => navigate('/my-course')} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700 transition-colors active:scale-95">
                    Start Week 2 →
                  </button>
                </div>
              )}

              {/* Upgrade teaser inline (all screen sizes) */}
              {!isPremium && doneCount < totalTasks && (
                <div className="mt-6 bg-gradient-to-r from-[#24389c] to-[#4355b9] rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">2 more tasks locked</p>
                      <h4 className="font-black text-lg leading-tight">Unlock Tasks 5 &amp; 6</h4>
                      <p className="text-white/70 text-sm mt-1">Personal Brand Statement + Weekly Recap are Premium only.</p>
                    </div>
                    <button className="shrink-0 px-6 py-2.5 bg-white text-[#24389c] font-black rounded-xl text-sm hover:shadow-xl transition-all active:scale-95">
                      Upgrade Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column ─────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Streak Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#e0e3e5] shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className="material-symbols-outlined text-amber-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                <h3 className="font-black text-[var(--color-on-surface)]">Your streak</h3>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-5xl font-black text-[#1b3482] leading-none">5</span>
                  <p className="text-[var(--color-on-surface-variant)] text-sm font-medium mt-2">days in a row 🔥</p>
                </div>
                <div className="flex gap-1.5 items-end">
                  {[0.4, 0.6, 0.8, 1.0, 1.0, 0.3].map((h, i) => (
                    <div key={i} className="w-5 rounded-t-full" style={{ height: `${h * 48}px`, background: h === 1.0 ? '#1b3482' : '#e0e3e5' }} />
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--color-outline-variant)]/20 flex justify-between text-xs font-bold text-[var(--color-outline)] uppercase tracking-widest">
                <span>Best streak: 12 days</span>
                <span className="text-emerald-500">Active</span>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl p-6 border border-[var(--color-outline-variant)]/20 shadow-sm">
              <h3 className="font-black text-[var(--color-on-surface)] mb-5">This week</h3>
              <div className="space-y-3">
                {['Video Lecture', 'Worksheet', 'Interviews', 'Analysis', ...(isPremium ? ['Branding', 'Review'] : [])].map((label, i) => {
                  const taskId = i + 1
                  const done = doneIds.includes(taskId)
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-lg ${done ? 'text-[#4a7df2]' : 'text-[#e0e3e5]'}`} style={done ? { fontVariationSettings: "'FILL' 1" } : {}}>
                        {done ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span className={`text-sm ${done ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>{label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Upgrade teaser for free users */}
            {!isPremium && (
              <div className="bg-gradient-to-br from-[#24389c] to-[#4355b9] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">2 more tasks</p>
                  <h4 className="font-black text-xl mb-2 leading-tight">Unlock Tasks 5 & 6</h4>
                  <p className="text-white/70 text-sm mb-4">Personal Brand Statement + Weekly Recap are Premium only.</p>
                  <button className="w-full py-2.5 bg-white text-[var(--color-primary)] font-bold rounded-xl text-sm hover:shadow-xl transition-all active:scale-95">
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
