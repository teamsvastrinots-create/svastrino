// src/pages/FreeTest.jsx
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

const QUESTIONS = [
  "I enjoy solving complex logical puzzles over creative writing.",
  "I prefer working in a team environment rather than independently.",
  "I am comfortable taking charge and leading a group project.",
  "I pay close attention to details and prefer structured routines.",
  "I adapt quickly to unexpected changes in my schedule or tasks.",
  "I enjoy listening to people's problems and helping them find solutions.",
  "I prefer building or fixing physical things over analyzing abstract theories.",
  "I am driven by seeing measurable, quantitative results in my work."
]

const OPTIONS = [
  { value: 1, label: 'Strongly Disagree', color: '#ba1a1a' },
  { value: 2, label: 'Disagree', color: '#ff7b7b' },
  { value: 3, label: 'Neutral', color: '#757684' },
  { value: 4, label: 'Agree', color: '#4caf50' },
  { value: 5, label: 'Strongly Agree', color: '#2e7d32' },
]

export default function FreeTest() {
  const navigate = useNavigate()
  const [testState, setTestState] = useState('idle') // 'idle' | 'in-progress'
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const handleStartTest = () => {
    setTestState('in-progress')
    setCurrentQuestion(0)
  }

  const handleAnswer = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(p => p + 1)
    } else {
      // Free test completed -> Prompt signup
      navigate('/signin')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col font-sans">
      <Helmet><title>Free Career Personality Test | Svastrino</title></Helmet>

      {/* Header */}
      <header className="h-[72px] bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-outline-variant)]/20 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/signin')}>
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-black shadow-sm">S</div>
          <span className="text-xl font-black text-[var(--color-on-surface)] tracking-tight">svastrino<span className="text-[var(--color-primary)]">.</span></span>
        </div>
        <button onClick={() => navigate('/signin')} className="text-sm font-bold text-[var(--color-primary)] hover:underline underline-offset-4 decoration-2">
          Sign In
        </button>
      </header>

      <main className="flex-1 flex flex-col p-6 lg:p-10 max-w-[1240px] mx-auto w-full justify-center">
        {testState === 'idle' ? (
          <section className="relative overflow-hidden rounded-xl p-8 lg:p-12 text-white flex flex-col md:flex-row justify-between items-center shadow-2xl transition-all duration-500 border border-[var(--color-primary-container)]/20"
            style={{ background: 'linear-gradient(135deg, #00105c 0%, var(--color-primary) 100%)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-5 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="text-[11px] font-bold tracking-widest uppercase">Takes 5 mins</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
                Discover your cognitive strengths for free
              </h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Take our abbreviated psychometric assessment to get a sneak peek at your personality type before creating an account.
              </p>
              <div className="pt-4">
                <button onClick={handleStartTest} className="bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-xl hover:bg-white active:scale-95 transition-all flex items-center justify-center gap-2">
                  Start Free Test <span className="material-symbols-outlined text-sm">play_arrow</span>
                </button>
              </div>
            </div>
            <div className="hidden md:block relative z-10 w-48 h-48 lg:w-64 lg:h-64 shrink-0 mt-8 md:mt-0">
              <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl" />
              <div className="relative w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
                <span className="material-symbols-outlined text-7xl lg:text-8xl text-white opacity-90" style={{ fontVariationSettings: "'FILL' 1" }}>
                  psychology
                </span>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-xl p-8 lg:p-12 shadow-2xl border border-[var(--color-outline-variant)]/20 animate-in fade-in zoom-in-95 duration-300">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="font-black text-[#1b3482] uppercase tracking-widest">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
                <span className="font-bold text-[var(--color-outline-variant)]">{Math.round((currentQuestion / QUESTIONS.length) * 100)}% Complete</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#3d70eb] transition-all duration-300" style={{ width: `${(currentQuestion / QUESTIONS.length) * 100}%` }} />
              </div>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0e1d4d] leading-tight mb-10 text-center max-w-3xl mx-auto">
              {QUESTIONS[currentQuestion]}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
              {OPTIONS.map(opt => (
                <button key={opt.value} onClick={handleAnswer}
                  className="flex flex-col items-center justify-center p-4 border border-[var(--color-outline-variant)]/20 rounded-xl hover:border-[#3d70eb] hover:bg-[#eef3ff] hover:shadow-md transition-all group col-span-1"
                  style={{ '--hover-color': opt.color }}>
                  <div className="w-12 h-12 rounded-full border-2 border-[var(--color-outline-variant)]/30 mb-3 flex items-center justify-center transition-all group-hover:border-[var(--hover-color)] group-hover:bg-[var(--hover-color)]/10">
                    <div className="w-4 h-4 rounded-full bg-[var(--hover-color)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs font-bold text-center text-[#454652]">{opt.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
