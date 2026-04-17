// src/pages/MyCourse.jsx
import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import ProtectedLayout from '../layouts/ProtectedLayout'
import { useAuth } from '../context/AuthContext'
import { useToast, Toast } from '../components/Toast'

// ── Data ────────────────────────────────────────────────────
const TASK_DATA = {
  2: { type: 'Interactive', title: 'Career Interests Map', desc: 'Identify fields and roles that excite you — the first building block of your career direction.', duration: '45 mins', steps: ['Read the framework doc on communication archetypes.', 'Complete the 10-question self-assessment.', 'Identify your top 3 soft skills.', 'Write a 100-word reflection.'] },
  3: { type: 'Worksheet', title: "Write 5 things you like doing", desc: 'No overthinking — jot down the first 5 activities that come to mind when you feel energised.', duration: '15 mins', steps: ['Think of moments you\'ve felt truly absorbed.', 'Write without judgment.', 'Highlight the top 2 patterns you notice.'] },
  4: { type: 'Interviews', title: 'Ask 3 people: "What am I good at?"', desc: 'Gather external perspectives on your natural talents from parents, friends, or teachers.', duration: '15 mins', steps: ['Choose 3 trusted people.', 'Ask them the same question.', 'Note any recurring theme across all answers.'] },
  5: { type: 'Analysis', title: '"My Top 3 Strengths + Why"', desc: 'Synthesize your self-reflection and peer feedback into a core strength profile.', duration: '30 mins', steps: ['Review your previous worksheets.', 'Identify 3 strengths mentioned more than once.', 'Write one sentence for each: WHY it\'s a strength.'] },
  6: { type: 'Module', title: 'Soft Skill Identification', desc: 'Analyze your communication patterns to identify native soft skills and professional strengths.', duration: '45 mins', steps: ['Read the framework doc on communication archetypes.', 'Complete the 10-question self-assessment worksheet.', 'Identify your top 3 soft skills from the results.', 'Write a 100-word reflection on how they show up in your work.'] },
  7: { type: 'Assignment', title: 'Personal Brand Statement', desc: 'Draft a compelling 30-word personal brand statement that highlights your core value.', duration: '40 mins', steps: ['Combine your strengths into one idea.', 'Write a 30-word statement.', 'Read it aloud and refine.'] },
}

// ── Week Journey Bar ─────────────────────────────────────────
function WeekChip({ week, activeWeek, ongoingWeek, onClick }) {
  const isCompleted = week < ongoingWeek
  const isOngoing = week === ongoingWeek
  const isActive = week === activeWeek
  const canClick = isCompleted || isOngoing

  let dotBg = 'bg-white border-2 border-[var(--color-outline-variant)] text-[var(--color-outline)]'
  if (isCompleted) dotBg = 'bg-green-500 text-white border-2 border-green-600'
  else if (isOngoing) dotBg = 'bg-amber-400 text-gray-900 border-2 border-amber-500'

  return (
    <div
      onClick={canClick ? () => onClick(week) : undefined}
      className={`flex flex-col items-center gap-1.5 shrink-0 px-3 py-2.5 rounded-xl transition-all ${isActive ? 'bg-[var(--color-surface-container)]' : ''} ${canClick ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-not-allowed opacity-60'}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-extrabold shadow-sm transition-transform ${dotBg} ${isActive ? 'scale-110 shadow-md' : ''}`}>
        {isCompleted ? '✓' : week}
      </div>
      <span className={`text-[10px] font-bold ${isActive ? 'text-[var(--color-primary)]' : isCompleted ? 'text-green-600' : isOngoing ? 'text-amber-600' : 'text-[var(--color-outline)]'}`}>W{week}</span>
    </div>
  )
}

// ── Notes Modal ───────────────────────────────────────────────
function NotesModal({ onClose }) {
  const [notes, setNotes] = useState('')
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--color-primary)]">edit_note</span>
            <h3 className="font-bold text-on-surface">My Notes — Week 1</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><span className="material-symbols-outlined text-xl">close</span></button>
        </div>
        <div className="p-6">
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Write your reflections, key takeaways, or questions here…"
            className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" />
          <div className="flex gap-3 mt-4">
            <button onClick={onClose} className="flex-1 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm hover:opacity-90 transition-opacity active:scale-95">Save Notes</button>
            <button onClick={onClose} className="px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export default function MyCourse() {
  const { isPremium } = useAuth()
  const navigate = useNavigate()
  const { toast, showToast } = useToast()
  const scrollRef = useRef(null)
  const fileRef = useRef(null)

  const [activeWeek, setActiveWeek] = useState(1)
  const [activeDay, setActiveDay] = useState(2)
  const [unlockedDays, setUnlockedDays] = useState([2])
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [showNotes, setShowNotes] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [submitted, setSubmitted] = useState({})
  const [lockedModal, setLockedModal] = useState(null)
  const [expandedWeekDrawer, setExpandedWeekDrawer] = useState(null)

  const ongoingWeek = 2 // Hardcode to 2 so Week 1 is past, and Week 2 is ongoing for testing the drawer!
  const TOTAL_DAYS = isPremium ? 7 : 2
  const task = TASK_DATA[activeDay] || TASK_DATA[2]
  const weekProgress = Math.round((unlockedDays.length / 6) * 100)

  // Simulated video play: after 3s unlock day 3
  const handlePlayPause = () => {
    setIsPlaying(p => !p)
    if (!isPlaying) {
      let prog = videoProgress
      const interval = setInterval(() => {
        prog += 3
        setVideoProgress(Math.min(prog, 100))
        if (prog >= 20 && !unlockedDays.includes(3)) {
          setUnlockedDays(d => [...d, 3])
          showToast('Day 3 unlocked! Keep going 🎉', 'success')
        }
        if (prog >= 100) { clearInterval(interval); setIsPlaying(false) }
      }, 400)
    }
  }

  const handleSelectDay = (day) => {
    if (!unlockedDays.includes(day) && day !== 2) {
      setLockedModal(day); return
    }
    setActiveDay(day)
  }

  const handleViewAssignment = () => {
    showToast('Assignment opened!', 'success')
    if (!unlockedDays.includes(activeDay + 1)) {
      setUnlockedDays(d => [...d, activeDay + 1])
    }
  }

  const handleSubmit = () => {
    setSubmitted(s => ({ ...s, [activeDay]: true }))
    showToast('Assignment submitted! ✅', 'success')
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      showToast(`"${file.name}" selected!`, 'success')
    }
  }

  const scrollJourney = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 160, behavior: 'smooth' })
  }

  const dayTabs = [2, 3, 4, 5, 6, 7]

  return (
    <ProtectedLayout>
      <Helmet><title>My Course | Svastrino</title></Helmet>
      <Toast toast={toast} />
      {showNotes && <NotesModal onClose={() => setShowNotes(false)} />}
      {lockedModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setLockedModal(null)}>
          <div className="bg-white rounded-xl p-8 max-w-xs w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-[var(--color-primary)]">lock</span>
            </div>
            <h3 className="font-bold text-lg text-[var(--color-on-surface)] mb-2">Content Locked</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-6">Complete Day {lockedModal - 1} to unlock this task.</p>
            <button onClick={() => setLockedModal(null)} className="w-full py-3 sapphire-gradient text-white font-bold rounded-xl text-sm active:scale-95">Got it</button>
          </div>
        </div>
      )}

      <div className="p-5 pt-5 lg:p-8 max-w-[1240px] bg-[var(--color-surface-container-low)] min-h-screen">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ── Journey Bar ─────────────────────────────────── */}
          <div className="bg-[var(--color-surface-container-lowest)] rounded-xl p-5 md:p-6 shadow-sm border border-[var(--color-outline-variant)]/20">
            <div className="flex flex-row items-center justify-between mb-5 gap-4">
              <div>
                <p className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-widest mb-1">24-Week Journey</p>
                <h1 className="text-lg md:text-2xl font-bold text-[var(--color-on-surface)]">Week {activeWeek} — {activeWeek === 1 ? 'Self Discovery' : 'Values & Strengths'}</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 bg-[var(--color-surface-container)] px-4 py-2 rounded-full border border-[var(--color-outline-variant)]/20">
                  <span className="text-[var(--color-primary)] font-bold text-xs">{weekProgress}% complete</span>
                </div>
                <button onClick={() => scrollJourney(-1)} className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:bg-slate-50 shadow-sm">
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <button onClick={() => scrollJourney(1)} className="w-8 h-8 rounded-full border border-[var(--color-outline-variant)]/20 bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] shadow-sm">
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            </div>
            <div ref={scrollRef} className="flex gap-0 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {Array.from({ length: 24 }, (_, i) => i + 1).map(w => (
                <WeekChip key={w} week={w} activeWeek={activeWeek} ongoingWeek={ongoingWeek} onClick={(w) => {
                  if (w < ongoingWeek) {
                    setExpandedWeekDrawer(expandedWeekDrawer === w ? null : w)
                  } else {
                    setActiveWeek(w)
                    setExpandedWeekDrawer(null)
                  }
                }} />
              ))}
            </div>

            {/* Inline Drawer for Past Weeks */}
            {expandedWeekDrawer && (
              <div className="mt-4 p-5 bg-amber-50 border border-amber-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center font-black">W{expandedWeekDrawer}</div>
                  <div>
                    <h4 className="font-bold text-amber-900 leading-tight">Week {expandedWeekDrawer} Completed</h4>
                    <p className="text-amber-700 text-sm mt-0.5">You've successfully completed this module. Need a refresher?</p>
                  </div>
                </div>
                <button onClick={() => { setActiveWeek(expandedWeekDrawer); setExpandedWeekDrawer(null) }} className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-sm transition-colors w-full md:w-auto">
                  Review Week {expandedWeekDrawer}
                </button>
              </div>
            )}
          </div>

          {/* Amber Reviewing Banner */}
          {activeWeek < ongoingWeek && (
            <div className="bg-amber-100 border border-amber-300 text-amber-800 px-5 py-3 rounded-xl flex items-center gap-3 font-medium text-sm shadow-sm">
              <span className="material-symbols-outlined text-amber-600" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
              You are currently reviewing a past week. Return to <button onClick={() => setActiveWeek(ongoingWeek)} className="font-bold underline underline-offset-2 ml-1">Week {ongoingWeek}</button> to continue your progress.
            </div>
          )}

          {/* ── Row 1: Video + Need Help ─────────────────────── */}
          <div className="grid grid-cols-12 gap-6">
            {/* Video Player */}
            <div className="col-span-12 xl:col-span-8 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-xs flex items-center justify-center shadow-sm">D1</span>
                <span className="text-[17px] font-bold text-[var(--color-on-surface)] tracking-tight">Week {activeWeek} – Video Lecture</span>
              </div>
              <div className="bg-[var(--color-surface-container-lowest)] rounded-xl overflow-hidden shadow-sm border border-[var(--color-outline-variant)]/20 group">
                <div className="relative aspect-video w-full bg-[#3c3f44] cursor-pointer" onClick={handlePlayPause}>
                  {/* Play / Pause button */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-20 h-20 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center p-2 backdrop-blur-sm group-hover:scale-105 transition-transform shadow-2xl">
                      <div className="w-full h-full bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-4xl ml-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Control bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#282a2e] flex items-center px-5 gap-4 z-20">
                    <div className="flex-grow h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full transition-all ease-linear" style={{ width: `${videoProgress}%` }} />
                    </div>
                    <span className="text-[11px] text-white/80 font-mono font-bold" style={{ minWidth: 72 }}>
                      {String(Math.floor(34 * videoProgress / 100)).padStart(2, '0')}:{String(Math.floor(60 * (videoProgress % 1))).padStart(2, '0')} / 34:00
                    </span>
                    <button className="text-white/60 hover:text-white transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>fullscreen</span>
                    </button>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between gap-4 border-t border-[var(--color-outline-variant)]/10">
                  <div>
                    <p className="text-[10px] font-black text-[var(--color-primary)]/60 uppercase tracking-widest">Currently Watching</p>
                    <h3 className="text-base font-black text-[var(--color-on-surface)] mt-0.5">Week {activeWeek} — Foundations of Self Discovery</h3>
                  </div>
                  <button onClick={() => setShowNotes(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/20 rounded-xl transition-all text-sm font-bold text-[var(--color-on-surface-variant)] shrink-0">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit_note</span> Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="hidden lg:flex col-span-12 xl:col-span-4 flex-col pt-[36px]">
              <div className="bg-[var(--color-surface-container-lowest)] rounded-xl shadow-sm border border-[var(--color-outline-variant)]/20 pt-14 px-6 pb-6 flex flex-col h-full">
                <div className="w-20 h-20 mx-auto rounded-[1.75rem] bg-orange-200/70 flex items-center justify-center text-amber-700 mb-5">
                  <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
                </div>
                <h4 className="font-black text-[var(--color-on-surface)] text-xl text-center">Need help?</h4>
                <p className="text-[14px] text-[var(--color-on-surface-variant)] mt-3 leading-relaxed flex-grow text-center px-2">Our mentors and community are here to help you bridge the gap in course.</p>
                <div className="mt-5 space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 py-3 sapphire-gradient text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg">
                    <span className="material-symbols-outlined text-lg">question_answer</span> Ask a Question
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--color-surface)] hover:bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/20 text-[var(--color-on-surface-variant)] rounded-xl font-bold text-sm transition-all">
                    <span className="material-symbols-outlined text-lg">groups</span> Join Community
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 2: Day Tasks + Overview/Milestone ────────── */}
          <div className="grid grid-cols-12 gap-6">
            {/* Task Card */}
            <div className="col-span-12 xl:col-span-8 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="min-w-8 h-8 px-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-xs flex items-center justify-center shadow-sm">D2–D7</span>
                <span className="text-[17px] font-bold text-[var(--color-on-surface)] tracking-tight">Week {activeWeek} – Weekly Tasks</span>
              </div>
              <div className="bg-[var(--color-surface-container-lowest)] rounded-xl shadow-sm border border-[var(--color-outline-variant)]/20 overflow-hidden">
                {/* Day Tabs */}
                <div className="flex border-b border-[var(--color-outline-variant)]/20 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                  {dayTabs.map(day => {
                    const isUnlocked = unlockedDays.includes(day)
                    const isActive = activeDay === day
                    const isPremiumDay = day > 4 && !isPremium
                    return (
                      <button key={day}
                        onClick={() => isPremiumDay ? showToast('Upgrade to Premium for more tasks!', 'error') : handleSelectDay(day)}
                        className={`flex-1 min-w-[70px] py-3.5 text-sm font-black tracking-wide border-b-2 relative transition-all ${isActive ? 'text-[var(--color-primary)] border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'text-[var(--color-outline)] border-transparent hover:text-[var(--color-primary)]'}`}>
                        Day {day}
                        {!isUnlocked && !isPremiumDay && <span className="absolute top-1.5 right-1.5 material-symbols-outlined text-[12px] text-[var(--color-outline)]">lock</span>}
                        {isPremiumDay && <span className="absolute top-1.5 right-1.5 material-symbols-outlined text-[12px] text-amber-500">stars</span>}
                      </button>
                    )
                  })}
                </div>

                {/* Task Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/8 px-2.5 py-1 rounded-full border border-[var(--color-primary)]/15">{task.type}</span>
                      <h4 className="text-xl font-black text-[var(--color-on-surface)] mt-2">{task.title}</h4>
                      <p className="text-sm text-[var(--color-on-surface-variant)] mt-1.5 leading-relaxed">{task.desc}</p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <span className="text-[10px] font-black text-[var(--color-outline)] uppercase tracking-wider">Est. Time</span>
                      <p className="text-sm font-black text-[var(--color-on-surface)]">{task.duration}</p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="mb-5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-outline)] mb-3">Task Steps</p>
                    <div className="space-y-0 divide-y divide-[var(--color-outline-variant)]/10">
                      {task.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3 py-3">
                          <div className="min-w-[26px] h-[26px] rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[11px] font-black flex items-center justify-center">{i + 1}</div>
                          <p className="text-sm text-[var(--color-on-surface-variant)] leading-snug">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row gap-3 mb-4">
                    <div className="flex-1 flex items-stretch border border-[var(--color-outline-variant)]/30 rounded-xl shadow-sm overflow-hidden">
                      <button onClick={handleViewAssignment} className="flex-1 py-3 px-3 bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-[var(--color-surface-container-low)] transition-colors">
                        <span className="material-symbols-outlined text-base text-[var(--color-outline)]">visibility</span> View Assignment
                      </button>
                      <div className="w-px bg-[var(--color-outline-variant)]/20" />
                      <button className="px-3 bg-[var(--color-surface-container-low)] flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-surface-container)] transition-colors">
                        <span className="material-symbols-outlined text-base">download</span>
                      </button>
                    </div>
                    <button onClick={handleSubmit} disabled={!uploadedFile || submitted[activeDay]}
                      className={`flex-1 py-3 px-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm ${uploadedFile && !submitted[activeDay] ? 'bg-[var(--color-primary)] text-white hover:opacity-90' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                      <span className="material-symbols-outlined text-base">{submitted[activeDay] ? 'check_circle' : 'check_circle'}</span>
                      {submitted[activeDay] ? 'Submitted!' : 'Submit'}
                    </button>
                  </div>

                  {/* Upload Zone */}
                  <input type="file" ref={fileRef} className="hidden" accept=".pdf,.doc,.docx,.zip" onChange={handleFileChange} />
                  {!uploadedFile ? (
                    <div onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-[var(--color-outline-variant)]/40 bg-[var(--color-surface-container-low)] hover:bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)]/30 transition-colors rounded-xl p-4 flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/20 rounded-full shadow-sm flex items-center justify-center text-[var(--color-outline)] group-hover:text-[var(--color-primary)]">
                          <span className="material-symbols-outlined text-xl">description</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-on-surface)]">Drop file or click to upload</p>
                          <p className="text-xs text-[var(--color-outline)] hidden sm:block">PDF, DOCX up to 10MB</p>
                        </div>
                      </div>
                      <div className="px-3 py-2 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/20 text-[var(--color-on-surface)] rounded-lg flex items-center gap-2 shrink-0">
                        <span className="material-symbols-outlined text-base">upload</span>
                        <span className="text-sm font-semibold">Upload</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 border border-[var(--color-outline-variant)]/20 bg-[var(--color-surface-container-lowest)] rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                          <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">{uploadedFile.name}</p>
                          <p className="text-xs text-[var(--color-on-surface-variant)]">{(uploadedFile.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <button onClick={() => setUploadedFile(null)} className="w-8 h-8 flex items-center justify-center text-[var(--color-outline)] hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar: Overview + Milestone */}
            <div className="col-span-12 xl:col-span-4 flex flex-col gap-6 pt-[36px]">
              {/* Week Overview Ring */}
              <div className="hidden lg:block bg-[var(--color-surface-container-lowest)] rounded-xl shadow-sm border border-[var(--color-outline-variant)]/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-outline)]">Week 1 Overview</p>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">In Progress</span>
                </div>
                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-24 shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#f0f0f8" strokeWidth="7" fill="transparent" />
                      <circle cx="48" cy="48" r="40" stroke="#24389c" strokeWidth="7" fill="transparent"
                        strokeDasharray="251" strokeDashoffset={251 - (251 * weekProgress / 100)} className="transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-slate-800">{weekProgress}%</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="font-black text-[var(--color-on-surface)] text-base">Good momentum! 🚀</p>
                    <p className="text-sm text-[var(--color-on-surface-variant)] mt-1.5 leading-relaxed">{unlockedDays.length - 1} of 6 tasks done. Finish all to earn your Week 1 badge.</p>
                  </div>
                </div>
              </div>

              {/* Milestone Card */}
              <div className="bg-gradient-to-br from-[#24389c] to-[#4355b9] rounded-xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full" />
                <div className="relative z-10">
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Next Milestone</p>
                  <h4 className="text-white text-lg font-black mt-1.5">Complete all 6 tasks</h4>
                  <p className="text-white/60 text-xs mt-2 leading-relaxed">Finish Week 1 to unlock Week 2 content and your first certificate.</p>
                  <div className="mt-4 flex items-center gap-2 text-amber-300 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    Week 1 Completion Badge
                  </div>
                  <button disabled className="w-full py-3 mt-5 bg-white hover:bg-slate-50 text-[var(--color-primary)] rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg opacity-60 cursor-not-allowed">
                    <span className="material-symbols-outlined text-base">lock</span> Access Week 2
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Upgrade Banner (free plan) ─────────────────── */}
          {!isPremium && (
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 rounded-xl shadow-xl relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-56 h-56 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
                <div className="text-center sm:text-left">
                  <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">Level up your career</span>
                  <h2 className="text-3xl font-black text-white mt-1">Upgrade to Premium 🚀</h2>
                  <p className="text-white/80 font-medium mt-2">Unlock all 24 weeks, assignments & mentorship instantly.</p>
                </div>
                <button className="px-8 py-4 bg-white text-orange-600 font-black text-base rounded-xl shadow-xl hover:shadow-2xl transition-all active:scale-95 whitespace-nowrap">
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  )
}
