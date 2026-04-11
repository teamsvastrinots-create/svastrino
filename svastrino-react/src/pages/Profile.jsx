// src/pages/Profile.jsx
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import ProtectedLayout from '../layouts/ProtectedLayout'
import { useAuth } from '../context/AuthContext'
import { useToast, Toast } from '../components/Toast'
import { supabase } from '../lib/supabase'
import { MOCK_MODE } from '../lib/mockMode'

const CLASS_OPTIONS = ['Class 10', 'Class 11', 'Class 12', 'Undergrad', 'Graduate']

function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-[var(--color-outline-variant)]/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--color-outline-variant)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]" />
    </label>
  )
}

export default function Profile() {
  const { profile, user, setProfile, isPremium } = useAuth()
  const { toast, showToast } = useToast()

  const [name, setName] = useState(profile?.name ?? '')
  const [cls, setCls] = useState(profile?.class ?? 'Class 11')
  const [city, setCity] = useState(profile?.city ?? '')
  const [saving, setSaving] = useState(false)

  const [notifWhatsApp, setNotifWhatsApp] = useState(true)
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(false)

  const [aspirations, setAspirations] = useState([
    { name: 'Design', icon: 'architecture' },
    { name: 'Tech', icon: 'code' },
    { name: 'Psychology', icon: 'psychology' },
  ])
  const [editingAsp, setEditingAsp] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '')
      setCls(profile.class ?? 'Class 11')
      setCity(profile.city ?? '')
      if (profile.aspirations?.length) setAspirations(profile.aspirations)
    }
  }, [profile])

  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'S'

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    if (MOCK_MODE) {
      await new Promise(r => setTimeout(r, 600))
      setProfile(prev => ({ ...prev, name, class: cls, city, aspirations }))
      showToast('Profile updated successfully!', 'success')
      setSaving(false)
      return
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ name, class: cls, city, aspirations })
        .eq('id', user.id)
      if (error) throw error
      setProfile(prev => ({ ...prev, name, class: cls, city, aspirations }))
      showToast('Profile updated successfully!', 'success')
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  const removeAspiration = (i) => setAspirations(prev => prev.filter((_, idx) => idx !== i))
  const addAspiration = () => {
    const val = window.prompt('Enter career interest (e.g. Finance, Biology):')
    if (val?.trim()) setAspirations(prev => [...prev, { name: val.trim(), icon: 'stars' }])
  }

  return (
    <ProtectedLayout>
      <Helmet><title>Profile | Svastrino</title></Helmet>
      <Toast toast={toast} />

      <div className="p-6 pt-6 lg:p-10 max-w-[1240px]">
        <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8">

          {/* ── Hero Card ──────────────────────────────────── */}
          <section className="bg-[var(--color-surface-container-lowest)] rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 overflow-hidden relative border border-[var(--color-outline-variant)]/10 shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-full opacity-5 pointer-events-none">
              <svg className="w-full h-full text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 100 100">
                <circle cx="80" cy="20" r="15" />
                <rect height="2" transform="rotate(-45 10 60)" width="40" x="10" y="60" />
              </svg>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10 w-full md:w-auto">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] flex items-center justify-center text-white text-4xl font-extrabold tracking-tighter shadow-lg ring-4 ring-[var(--color-surface-container-low)] shrink-0">
                {initials}
              </div>
              <div className="text-center md:text-left mt-2">
                <h1 className="text-3xl font-bold text-[var(--color-on-surface)] tracking-tight">{name || 'Career Explorer'}</h1>
                <p className="text-[var(--color-on-surface-variant)] font-medium mt-1">{profile?.phone ?? user?.phone ?? 'Add your number'}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary-container)] font-bold text-xs border border-[var(--color-primary)]/20">
                    <span className="material-symbols-outlined text-base mr-1.5" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    {isPremium ? 'Premium Plan' : 'Free Plan'}
                  </span>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--color-primary-fixed)]/50 text-[var(--color-on-primary-fixed-variant)] font-bold text-xs border border-[var(--color-primary-fixed)]">
                    <span className="material-symbols-outlined text-base mr-1.5">school</span>
                    {cls}
                  </span>
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] font-semibold text-xs border border-[var(--color-outline-variant)]/10">
                    Joined April 2026
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end relative z-10">
              <span className="block text-[11px] font-bold text-[var(--color-outline)] uppercase tracking-[0.1em] mb-1">Current Momentum</span>
              <div className="text-2xl font-black text-[var(--color-primary)]">Advanced Explorer</div>
            </div>
          </section>

          {/* ── Settings Grid ──────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Personal Details Form */}
            <div className="bg-[var(--color-surface-container-lowest)] rounded-xl p-6 md:p-8 flex flex-col gap-8 border border-[var(--color-outline-variant)]/10 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--color-outline-variant)]/10">
                <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Personal details</h2>
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-primary)]">
                  <span className="material-symbols-outlined text-xl">manage_accounts</span>
                </div>
              </div>
              <form onSubmit={handleSave} className="flex flex-col gap-6">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Your full name"
                    className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/20 focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 rounded-xl p-3.5 text-[var(--color-on-surface)] font-medium transition-all outline-none" />
                </div>
                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Phone Number (Read-only)</label>
                  <input value={profile?.phone ?? user?.phone ?? ''} type="tel" readOnly
                    className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/20 rounded-xl p-3.5 text-[var(--color-on-surface-variant)] font-medium opacity-70 cursor-not-allowed outline-none" />
                </div>
                {/* Class + City */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Class</label>
                    <div className="relative">
                      <select value={cls} onChange={e => setCls(e.target.value)}
                        className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/20 focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 rounded-xl p-3.5 text-[var(--color-on-surface)] font-medium transition-all appearance-none outline-none">
                        {CLASS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">City</label>
                    <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="Your city"
                      className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/20 focus:bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 rounded-xl p-3.5 text-[var(--color-on-surface)] font-medium transition-all outline-none" />
                  </div>
                </div>
                <div className="pt-4 mt-2 border-t border-[var(--color-outline-variant)]/10">
                  <button type="submit" disabled={saving}
                    className="w-full bg-[var(--color-primary)] text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {/* Aspiration Chips */}
              <div className="bg-[var(--color-surface-container-lowest)] rounded-xl p-6 md:p-8 flex flex-col gap-6 border border-[var(--color-outline-variant)]/10 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--color-outline-variant)]/10">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-1">Aspiration chips</h2>
                    <p className="text-xs text-[var(--color-on-surface-variant)] font-medium">Personalize feed based on interests</p>
                  </div>
                  <button onClick={() => setEditingAsp(p => !p)}
                    className="text-[var(--color-primary)] font-bold text-sm flex items-center gap-1 hover:underline underline-offset-4 decoration-2">
                    {editingAsp ? 'Done' : 'Edit'} <span className="material-symbols-outlined text-sm">{editingAsp ? 'check' : 'edit'}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {aspirations.map((asp, i) => (
                    <div key={i} className="relative bg-[var(--color-secondary-fixed)]/50 border border-[var(--color-primary)]/20 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm transition-transform hover:scale-105 cursor-pointer">
                      <span className="material-symbols-outlined text-base">{asp.icon || 'star'}</span>
                      <span className="font-bold text-[11px] uppercase tracking-wide">{asp.name}</span>
                      {editingAsp && (
                        <button onClick={() => removeAspiration(i)} className="absolute -top-1 -right-1 bg-[var(--color-error)] text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] shadow-lg">✕</button>
                      )}
                    </div>
                  ))}
                  <button onClick={addAspiration} className="bg-[var(--color-surface-container)] border border-dashed border-[var(--color-outline-variant)]/40 text-[var(--color-on-surface-variant)] px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[var(--color-surface-container-high)] transition-all">
                    <span className="material-symbols-outlined text-base">add</span>
                    <span className="font-bold text-[11px] uppercase tracking-wide">Add More</span>
                  </button>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-[var(--color-surface-container-lowest)] rounded-xl p-6 md:p-8 flex flex-col gap-6 border border-[var(--color-outline-variant)]/10 shadow-sm flex-1">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--color-outline-variant)]/10">
                  <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Notifications</h2>
                  <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-[var(--color-primary)]">
                    <span className="material-symbols-outlined text-xl">notifications_active</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: 'chat', bg: 'bg-green-100', iconColor: 'text-green-700', label: 'WhatsApp', sub: 'Instant alerts for results', checked: notifWhatsApp, set: setNotifWhatsApp },
                    { icon: 'mail', bg: 'bg-[var(--color-primary)]/10', iconColor: 'text-[var(--color-primary)]', label: 'Email Digest', sub: 'Weekly performance summary', checked: notifEmail, set: setNotifEmail },
                    { icon: 'smart_button', bg: 'bg-amber-100', iconColor: 'text-amber-700', label: 'Push Alerts', sub: 'Daily task reminders', checked: notifPush, set: setNotifPush },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-[var(--color-surface-container)]/50 border border-[var(--color-outline-variant)]/10 rounded-xl hover:bg-[var(--color-surface-container)] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center ${item.iconColor}`}>
                          <span className="material-symbols-outlined text-xl">{item.icon}</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[var(--color-on-surface)]">{item.label}</p>
                          <p className="text-xs text-[var(--color-on-surface-variant)] font-medium mt-0.5">{item.sub}</p>
                        </div>
                      </div>
                      <Toggle checked={item.checked} onChange={() => item.set(p => !p)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <footer className="pt-6 pb-4 text-center">
            <p className="text-xs text-[var(--color-on-surface-variant)] font-medium tracking-wide">© 2026 Svastrino. All rights reserved. Data privacy compliant.</p>
          </footer>
        </div>
      </div>
    </ProtectedLayout>
  )
}
