// src/pages/FreeTest.jsx
import { useState, useRef, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { supabase } from '../lib/supabase'
import { MOCK_MODE } from '../lib/mockMode'
import { useAuth } from '../context/AuthContext'
import { useToast, Toast } from '../components/Toast'

const QUESTIONS = [
  {
    category: "Logical Sequence",
    question: "Look at the following series: 2, 6, 12, 20, ... What number should come next in the sequence?",
    options: [
      { value: 'A', label: "24" },
      { value: 'B', label: "28" },
      { value: 'C', label: "30" },
      { value: 'D', label: "32" }
    ]
  },
  {
    category: "Deductive Reasoning",
    question: "Read the following statements:\n\nAll birds lay eggs.\nA swan is a bird.\nTherefore, a swan lays eggs.\n\nBased strictly on the statements above, this conclusion is:",
    options: [
      { value: 'A', label: "True" },
      { value: 'B', label: "False" },
      { value: 'C', label: "Only true depending on the season" },
      { value: 'D', label: "Cannot be determined" }
    ]
  },
  {
    category: "Spatial Reasoning",
    question: "If you fold a standard square piece of paper in half to make a rectangle, and then fold it in half again to make a smaller square, how many layers of paper thick is the final small square?",
    options: [
      { value: 'A', label: "2 layers" },
      { value: 'B', label: "4 layers" },
      { value: 'C', label: "6 layers" },
      { value: 'D', label: "8 layers" }
    ]
  },
  {
    category: "Word Analogies",
    question: "Hot is to Cold as Joy is to:",
    options: [
      { value: 'A', label: "Anger" },
      { value: 'B', label: "Excitement" },
      { value: 'C', label: "Sorrow" },
      { value: 'D', label: "Peace" }
    ]
  },
  {
    category: "Word Classification",
    question: "Which of the following words does not belong with the others?",
    options: [
      { value: 'A', label: "Apple" },
      { value: 'B', label: "Banana" },
      { value: 'C', label: "Carrot" },
      { value: 'D', label: "Orange" }
    ]
  },
  {
    category: "Time and Distance",
    question: "If a train travels 120 kilometers in 2 hours at a steady pace, what is its average speed per hour?",
    options: [
      { value: 'A', label: "50 km/h" },
      { value: 'B', label: "60 km/h" },
      { value: 'C', label: "100 km/h" },
      { value: 'D', label: "240 km/h" }
    ]
  },
  {
    category: "Logical Math",
    question: "A bat and a ball together cost ₹110. The bat costs exactly ₹100 more than the ball. How much does the ball cost?",
    options: [
      { value: 'A', label: "₹5" },
      { value: 'B', label: "₹10" },
      { value: 'C', label: "₹15" },
      { value: 'D', label: "₹20" }
    ]
  },
  {
    category: "Real-World Scenario",
    question: "You find a lost wallet in the school hallway. It has money and a student ID card inside. What is the most appropriate course of action?",
    options: [
      { value: 'A', label: "Keep the money and throw the wallet back on the floor." },
      { value: 'B', label: "Leave it exactly where it is so the owner can come back and find it." },
      { value: 'C', label: "Try to track down the person yourself by asking everyone walking by." },
      { value: 'D', label: "Hand it over to the school's main office or a trusted teacher immediately." }
    ]
  }
];

export default function FreeTest() {
  const navigate = useNavigate()
  const { mockLogin } = useAuth()
  const { toast, showToast } = useToast()
  
  const [testState, setTestState] = useState('idle') // 'idle' | 'in-progress'
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  
  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [modalStep, setModalStep] = useState('phone') // 'phone' | 'otp' | 'verifying'
  const [phone, setPhone] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', ''])
  const otpRefs = [useRef(), useRef(), useRef(), useRef()]

  const handleStartTest = () => {
    setTestState('in-progress')
    setCurrentQuestion(0)
    setAnswers({})
  }

  const handleAnswer = (val) => {
    const newAnswers = { ...answers, [currentQuestion]: val }
    setAnswers(newAnswers)

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(p => p + 1)
    } else {
      // Test complete
      setShowModal(true)
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#001044', '#778de1', '#ffb950']
      })
    }
  }

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      showToast('Please enter a 10-digit number', 'error')
      return
    }
    setModalStep('verifying')
    
    if (MOCK_MODE) {
      await new Promise(r => setTimeout(r, 800))
      setModalStep('otp')
      showToast('OTP sent! (Mock: use 1234)', 'success')
      return
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` })
      if (error) throw error
      setModalStep('otp')
      showToast('OTP sent to WhatsApp!', 'success')
    } catch (err) {
      showToast(err.message, 'error')
      setModalStep('phone')
    }
  }

  const handleVerifyOtp = async () => {
    const code = otpDigits.join('')
    if (code.length !== 4) return
    
    setModalStep('verifying')
    const fullPhone = `+91${phone}`

    if (MOCK_MODE) {
      if (code !== '1234') {
        showToast('Invalid OTP. Use 1234', 'error')
        setModalStep('otp')
        return
      }
      await new Promise(r => setTimeout(r, 800))
      await finalizeTest(fullPhone)
      mockLogin({ phone: fullPhone, isPremium: false })
      navigate('/dashboard')
      return
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token: code,
        type: 'sms',
      })
      if (error) throw error
      await finalizeTest(fullPhone)
      navigate('/dashboard')
    } catch (err) {
      showToast(err.message, 'error')
      setModalStep('otp')
    }
  }

  const finalizeTest = async (phoneStr) => {
    const correctAnswers = { 0:'C', 1:'A', 2:'B', 3:'C', 4:'C', 5:'B', 6:'A', 7:'D' }
    let score = 0
    Object.entries(answers).forEach(([idx, val]) => {
      if (correctAnswers[idx] === val) score++
    })
    const finalScore = Math.round((score / QUESTIONS.length) * 100)

    if (MOCK_MODE) {
      console.log('[MOCK_MODE] Skipping DB insertion for:', { phoneStr, finalScore })
      return
    }

    try {
      // 1. Save results
      await supabase.from('free_test_attempts').insert({
        phone: phoneStr,
        answers: answers,
        score: finalScore
      })
      
      // 2. Upsert user info
      await supabase.from('users').upsert({
        phone: phoneStr,
        name: 'Career Explorer',
        plan: 'free'
      }, { onConflict: 'phone' })
    } catch (err) {
      console.error('Finalize error:', err)
    }
  }

  const handleOtpChange = (index, value) => {
    const v = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...otpDigits]
    newDigits[index] = v
    setOtpDigits(newDigits)
    if (v && index < 3) otpRefs[index + 1].current?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs[index - 1].current?.focus()
    }
  }

  const q = QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex flex-col font-sans">
      <Helmet><title>Free Career Personality Test | Svastrino</title></Helmet>
      <Toast toast={toast} />

      {/* Result Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 lg:p-12 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-[var(--color-primary-fixed)] rounded-full flex items-center justify-center mx-auto shadow-inner">
                <span className="material-symbols-outlined text-[var(--color-primary)] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {modalStep === 'otp' ? 'sms' : 'celebration'}
                </span>
              </div>
              
              <div>
                <h2 className="text-3xl font-black text-[var(--color-primary)] tracking-tight mb-2">
                  {modalStep === 'otp' ? 'Verify OTP' : 'Test Complete! 🎉'}
                </h2>
                <p className="text-[var(--color-on-surface-variant)] font-medium leading-relaxed">
                  {modalStep === 'otp' 
                    ? `Enter the 4-digit code sent to +91 ${phone}`
                    : 'Enter your WhatsApp number to receive your detailed career report and personalized insights.'}
                </p>
              </div>

              {modalStep === 'phone' && (
                <div className="space-y-6 pt-4 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-2">WhatsApp Number</label>
                    <div className="relative flex items-center group">
                      <div className="absolute left-4 font-black text-[var(--color-primary)] border-r border-[var(--color-outline-variant)]/30 pr-3 h-6 flex items-center">+91</div>
                      <input 
                        type="tel" 
                        maxLength={10}
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-16 pr-6 py-4 bg-[var(--color-surface-container-low)] border-2 border-transparent focus:border-[var(--color-primary)] rounded-2xl text-lg font-bold outline-none transition-all"
                        placeholder="00000 00000"
                        onKeyPress={e => e.key === 'Enter' && handleSendOtp()}
                      />
                    </div>
                  </div>
                  <button onClick={handleSendOtp} className="w-full py-5 sapphire-gradient text-white rounded-2xl font-black text-lg shadow-xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    Get Results <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              )}

              {modalStep === 'otp' && (
                <div className="space-y-8 pt-4">
                  <div className="flex justify-center gap-3">
                    {otpDigits.map((digit, i) => (
                      <input 
                        key={i}
                        ref={otpRefs[i]}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className="w-14 h-16 bg-[var(--color-surface-container-low)] border-2 border-transparent focus:border-[var(--color-primary)] rounded-xl text-2xl font-black text-center text-[var(--color-primary)] outline-none transition-all"
                      />
                    ))}
                  </div>
                  <div className="space-y-4">
                    <button onClick={handleVerifyOtp} disabled={otpDigits.join('').length < 4} className="w-full py-5 sapphire-gradient text-white rounded-2xl font-black text-lg shadow-xl disabled:opacity-50 disabled:scale-100 hover:scale-[1.02] active:scale-95 transition-all">
                      Verify & Continue
                    </button>
                    <button onClick={() => setModalStep('phone')} className="text-sm font-bold text-[var(--color-primary)] hover:underline">
                      Change phone number
                    </button>
                  </div>
                </div>
              )}

              {modalStep === 'verifying' && (
                <div className="py-12 flex flex-col items-center gap-6">
                  <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                  <p className="font-bold text-[var(--color-primary)]">Securing your results...</p>
                </div>
              )}

              <p className="text-[10px] text-[var(--color-on-surface-variant)]/40 font-bold uppercase tracking-widest pt-4">
                100% Secure • Privacy Protected • GDPR Compliant
              </p>
            </div>
          </div>
        </div>
      )}

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

      <main className="flex-1 flex flex-col w-full">
        {testState === 'idle' ? (
          <div className="flex-1 flex flex-col">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden sapphire-gradient py-20 px-6 lg:px-12 text-white text-center">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                <div className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-2 rounded-full border border-white/20 shadow-sm backdrop-blur-md">
                   <span className="text-xs font-bold tracking-widest uppercase">Free Career Discovery Test</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
                  Discover the Career That <br className="hidden md:block" /> Truly Fits You
                </h1>
                <p className="text-white/80 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto font-medium">
                  Answer 8 carefully designed questions to uncover your strengths, thinking style, and the career paths where you’ll naturally succeed.
                </p>
                <div className="pt-6 flex flex-col items-center gap-6">
                  <button onClick={handleStartTest} className="bg-white text-[var(--color-primary)] px-12 py-5 rounded-full font-black text-lg hover:shadow-2xl hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-2 editorial-shadow">
                    Start My Free Test <span className="material-symbols-outlined text-lg">play_arrow</span>
                  </button>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <span className="font-semibold italic">No signup required • 100% private • Takes only 3 minutes</span>
                  </div>
                </div>
              </div>
            </section>

            {/* TRUST STATS */}
            <section className="bg-[var(--color-surface-container-low)] py-12 px-6">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center">
                <div>
                  <div className="text-4xl font-black text-[var(--color-primary)]">10,847+</div>
                  <div className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mt-1 opacity-60">Students Tested</div>
                </div>
                <div className="hidden md:block w-px h-12 bg-[var(--color-outline-variant)]/20 mx-auto" />
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-4xl font-black text-[var(--color-primary)]">4.8/5</span>
                  </div>
                  <div className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mt-1 opacity-60">Average Rating</div>
                </div>
                <div className="hidden md:block w-px h-12 bg-[var(--color-outline-variant)]/20 mx-auto" />
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[var(--color-primary)]">timer</span>
                    <span className="text-4xl font-black text-[var(--color-primary)]">3 Minutes</span>
                  </div>
                  <div className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mt-1 opacity-60">To Complete</div>
                </div>
              </div>
            </section>

            {/* INFO SECTION */}
            <section className="max-w-[1240px] mx-auto py-24 px-6 lg:px-12 grid md:grid-cols-2 gap-20 items-start">
              <div className="space-y-8">
                <h2 className="text-4xl font-extrabold text-[var(--color-primary)] tracking-tight">What is this psychometric test?</h2>
                <div className="w-16 h-1.5 bg-[var(--color-primary-container)] rounded-full" />
                <div className="space-y-6 text-lg leading-relaxed text-[var(--color-on-surface-variant)] font-medium">
                  <p>Unlike traditional exams, this test doesn’t measure right or wrong answers.</p>
                  <p>It is a scientifically designed assessment that evaluates how you think, make decisions, and respond to real-world situations.</p>
                  <p>By analyzing your responses, we identify your natural strengths, behavioral patterns, and cognitive style.</p>
                  <p className="font-bold text-[var(--color-primary)]">This helps you understand which careers align best with who you truly are—not just what you study.</p>
                </div>
              </div>

              <div className="bg-[var(--color-surface-container-high)] rounded-3xl p-10 lg:p-14 space-y-10">
                <h2 className="text-3xl font-extrabold text-[var(--color-primary)] tracking-tight">How it works</h2>
                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold shrink-0">1</div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-[var(--color-primary)]">Intuitive Responses</h3>
                      <p className="text-[var(--color-on-surface-variant)] font-medium">Answer simple, scenario-based questions designed to reveal your natural instincts—not memorized knowledge.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold shrink-0">2</div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-[var(--color-primary)]">Smart Analysis</h3>
                      <p className="text-[var(--color-on-surface-variant)] font-medium">Our system evaluates your responses using proven psychological frameworks and maps them to career paths.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold shrink-0">3</div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-[var(--color-primary)]">Personalized Insights</h3>
                      <p className="text-[var(--color-on-surface-variant)] font-medium">Get a clear, easy-to-understand report showing your strengths and suitable career directions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

             {/* RULES SECTION */}
             <section className="bg-[var(--color-surface-container-lowest)] py-24 px-6 border-y border-[var(--color-outline-variant)]/10">
              <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                <div className="bg-white border border-[var(--color-outline-variant)]/20 rounded-3xl p-10 shadow-sm">
                  <h2 className="text-2xl font-black text-[var(--color-primary)] mb-8 flex items-center gap-3">
                    <span className="material-symbols-outlined text-[var(--color-primary-container)]">psychology_alt</span>
                    Before you begin
                  </h2>
                  <ul className="space-y-6">
                    {[
                      "Answer honestly — there are no right or wrong answers",
                      "Choose the option that feels most natural to you",
                      "Do not overthink — your first instinct is usually the best",
                      "Complete all 8 questions in one go",
                      "Ensure a distraction-free environment for accurate results"
                    ].map(rule => (
                      <li key={rule} className="flex items-start gap-3 text-[var(--color-on-surface-variant)] font-bold">
                        <span className="material-symbols-outlined text-[var(--color-primary)] text-xl">check_circle</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[var(--color-primary-fixed)] rounded-3xl p-10 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-[var(--color-primary)] mb-8 flex items-center gap-3">
                      <span className="material-symbols-outlined text-[var(--color-primary-container)]">assignment</span>
                      What to expect
                    </h2>
                    <div className="space-y-6">
                      {[
                        { icon: 'quiz', t: '8 quick questions', d: 'Simple scenario-based choices' },
                        { icon: 'timer', t: 'Takes less than 3 minutes', d: 'Fast and efficient analysis' },
                        { icon: 'no_accounts', t: 'No login required to start', d: 'Immediate access to the test' },
                        { icon: 'smartphone', t: 'Mobile results', d: 'Verify number to see your report' }
                      ].map(item => (
                        <div key={item.t} className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[var(--color-primary-container)] shadow-sm">
                            <span className="material-symbols-outlined">{item.icon}</span>
                          </div>
                          <div>
                            <div className="font-bold text-[var(--color-primary)]">{item.t}</div>
                            <div className="text-sm text-[var(--color-on-surface-variant)] font-medium">{item.d}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={handleStartTest} className="w-full mt-10 bg-[var(--color-primary)] text-white py-5 rounded-full font-black text-lg hover:bg-[var(--color-primary-container)] shadow-xl transition-all active:scale-[0.98]">
                    Start My Free Test
                  </button>
                </div>
              </div>
            </section>

            {/* FINAL CTA */}
            <section className="max-w-[1240px] mx-auto py-24 px-6 lg:px-12 text-center">
               <div className="bg-[var(--color-primary-container)] rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-white shadow-2xl">
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #778de1 0%, transparent 50%)' }} />
                 <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                   <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight">Ready to discover your ideal career path?</h2>
                   <p className="text-white/70 text-lg lg:text-xl font-medium mb-10 text-on-primary-container">
                     Join thousands of students who have already gained clarity about their future.
                   </p>
                   <button onClick={handleStartTest} className="bg-white text-[var(--color-primary)] px-12 py-5 rounded-full font-black text-lg hover:shadow-2xl hover:scale-[1.05] active:scale-95 transition-all">
                     Start My Free Test
                   </button>
                   <p className="text-white/50 text-sm font-bold mt-8">Takes less than 3 minutes • No payment required</p>
                 </div>
               </div>
            </section>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-[1000px] mx-auto w-full justify-center">
            <section className="bg-white rounded-3xl p-8 lg:p-14 shadow-2xl border border-[var(--color-outline-variant)]/20 animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="font-black text-[var(--color-primary)] uppercase tracking-widest">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
                  <span className="font-black text-[var(--color-outline)]">{Math.round((currentQuestion / QUESTIONS.length) * 100)}% Complete</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-out" style={{ width: `${(currentQuestion / QUESTIONS.length) * 100}%` }} />
                </div>
              </div>
              
              <div className="mb-12 text-center">
                 <span className="px-4 py-1.5 rounded-full bg-[var(--color-primary-fixed)] text-[var(--color-primary)] text-xs font-black uppercase tracking-widest mb-6 inline-block">
                    {q.category}
                 </span>
                 <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--color-primary)] leading-tight max-w-3xl mx-auto whitespace-pre-wrap">
                   {q.question}
                 </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {q.options.map(opt => (
                  <button key={opt.value} onClick={() => handleAnswer(opt.value)}
                    className="flex items-center gap-5 p-6 border-2 border-[var(--color-outline-variant)]/20 rounded-2xl hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-fixed)]/10 transition-all text-left group">
                    <div className="w-12 h-12 rounded-full border-2 border-[var(--color-outline-variant)]/30 group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white flex items-center justify-center font-black transition-all shrink-0">
                      {opt.value}
                    </div>
                    <span className="text-lg font-bold text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary)]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-surface-container-low)] py-12 px-6 border-t border-[var(--color-outline-variant)]/10">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-black text-[var(--color-primary)] tracking-tighter">svastrino<span className="text-[var(--color-primary-container)]">.</span></div>
          <div className="flex gap-10 text-sm font-bold text-[var(--color-on-surface-variant)]/60">
            <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</a>
          </div>
          <div className="text-xs font-bold text-[var(--color-on-surface-variant)]/40">© 2026 Svastrino. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
