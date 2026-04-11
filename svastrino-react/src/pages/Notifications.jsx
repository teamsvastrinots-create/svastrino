// src/pages/Notifications.jsx
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import ProtectedLayout from '../layouts/ProtectedLayout'
import { useAuth } from '../context/AuthContext'

const INITIAL_NOTIFS = [
  {
    id: 1, group: 'Today',
    icon: 'psychology', iconBg: 'bg-[var(--color-secondary-fixed)]', iconColor: 'text-[var(--color-primary-container)]',
    title: 'Psychometric Profile Ready!',
    desc: 'Discover your top 3 career archetypes now. Your detailed analysis is waiting!',
    time: '2h ago', unread: true, premium: false,
  },
  {
    id: 2, group: 'Today',
    icon: 'stars', iconBg: 'bg-[var(--color-tertiary-fixed)]', iconColor: 'text-[var(--color-tertiary)]',
    title: 'Unit 1 Mastered!',
    desc: "You've finished 'Career Fundamentals'. You earned a Fast Starter badge!",
    time: '5h ago', unread: true, premium: false,
  },
  {
    id: 3, group: 'Today',
    icon: 'live_tv', iconBg: 'bg-[var(--color-primary-fixed)]', iconColor: 'text-[var(--color-primary)]',
    title: 'Webinar Starting Soon',
    desc: "Join Rohith for 'Decoding Your Psychometric Report' starting in 15 minutes.",
    time: '15m from now', unread: true, premium: false,
  },
  {
    id: 4, group: 'Yesterday',
    icon: 'workspace_premium', iconBg: 'bg-[var(--color-surface-container-low)]', iconColor: 'text-[var(--color-primary)]',
    title: '10-Year Career Roadmap Generated',
    desc: 'Your personalized long-term success path based on your archetype is now available for review.',
    time: '1d ago', unread: false, premium: true,
  },
  {
    id: 5, group: 'Yesterday',
    icon: 'person_pin', iconBg: 'bg-[var(--color-surface-container-low)]', iconColor: 'text-[var(--color-outline)]',
    title: 'New Mentor Match',
    desc: 'We\'ve found 3 new mentors from Top Indian Universities who align with your interest in Law & Tech.',
    time: '1d ago', unread: false, premium: false,
  },
]

export default function Notifications() {
  const { isPremium } = useAuth()
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS)

  const markAllRead = () => setNotifs(n => n.map(item => ({ ...item, unread: false })))
  const markRead = (id) => setNotifs(n => n.map(item => item.id === id ? { ...item, unread: false } : item))

  const groups = ['Today', 'Yesterday']

  return (
    <ProtectedLayout>
      <Helmet><title>Notifications | Svastrino</title></Helmet>
      <div className="p-6 pt-6 lg:p-10 max-w-[1240px]">
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-10">

          {/* Header Card */}
          <section className="bg-[var(--color-surface-container-lowest)] rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-end relative overflow-hidden group border border-[var(--color-outline-variant)]/10 shadow-sm gap-4">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-[var(--color-primary-fixed)]/30 rounded-full blur-3xl group-hover:bg-[var(--color-primary-fixed)]/40 transition-colors pointer-events-none" />
            <div className="relative z-10">
              <span className="text-[11px] font-extrabold text-[var(--color-primary)] tracking-[0.2em] uppercase mb-2 block">Student Portal</span>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-on-surface)] leading-none">Notifications</h1>
            </div>
            <button onClick={markAllRead} className="relative z-10 flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm hover:underline decoration-2 underline-offset-4 transition-all active:scale-95">
              <span className="material-symbols-outlined text-lg">done_all</span>
              Mark all as read
            </button>
          </section>

          {/* Notification List */}
          <div className="bg-[var(--color-surface-container-lowest)] rounded-xl overflow-hidden border border-[var(--color-outline-variant)]/10 shadow-sm">
            {groups.map(group => {
              const items = notifs.filter(n => n.group === group && (!n.premium || isPremium))
              if (!items.length) return null
              return (
                <div key={group} className="p-6 md:p-8 pb-4">
                  <h2 className="text-xs font-bold text-[var(--color-outline)] tracking-widest uppercase mb-6 flex items-center gap-3">
                    {group}
                    <span className="h-px flex-1 bg-[var(--color-outline-variant)]/30" />
                  </h2>
                  <div className="space-y-4">
                    {items.map(notif => (
                      <div key={notif.id}
                        onClick={() => markRead(notif.id)}
                        className={[
                          'flex gap-4 md:gap-5 p-5 md:p-6 rounded-xl cursor-pointer relative group transition-all',
                          notif.unread
                            ? 'bg-[var(--color-primary-fixed)]/10 border border-[var(--color-primary-fixed)]/20 hover:bg-[var(--color-primary-fixed)]/30'
                            : 'bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/15 hover:border-[var(--color-outline-variant)]/40 opacity-80 hover:opacity-100 shadow-sm',
                          notif.premium ? 'overflow-hidden' : '',
                        ].join(' ')}>

                        {notif.premium && (
                          <div className="absolute top-0 right-0 px-2 py-1 bg-[var(--color-primary-container)] text-white text-[10px] font-bold uppercase rounded-bl-lg tracking-wider">Premium</div>
                        )}
                        {notif.unread && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-[var(--color-primary)] rounded-full shadow-[0_0_8px_rgba(36,56,156,0.5)]" />
                        )}

                        <div className={`w-12 h-12 rounded-full ${notif.iconBg} flex items-center justify-center ${notif.iconColor} shrink-0 shadow-sm`}>
                          <span className="material-symbols-outlined">{notif.icon}</span>
                        </div>
                        <div className="flex-1 pr-6">
                          <div className="flex justify-between items-start mb-1.5">
                            <h3 className={`font-bold text-base ${notif.premium ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]'} group-hover:text-[var(--color-primary)] transition-colors`}>{notif.title}</h3>
                            <span className="text-[11px] text-[var(--color-outline)] font-semibold tracking-wide shrink-0 ml-2">{notif.time}</span>
                          </div>
                          <p className="text-xs md:text-sm text-[var(--color-on-surface-variant)] leading-relaxed font-medium">{notif.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Load more */}
            <div className="p-6 bg-[var(--color-surface-container-low)]/50 border-t border-[var(--color-outline-variant)]/10 flex justify-center mt-2">
              <button className="text-xs font-bold text-[var(--color-primary)] px-8 py-3 rounded-full bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-colors uppercase tracking-widest active:scale-95">
                Load Older Notifications
              </button>
            </div>
          </div>

          <footer className="pt-8 pb-4 text-center">
            <p className="text-xs text-[var(--color-on-surface-variant)] font-medium tracking-wide">© 2026 Svastrino. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </ProtectedLayout>
  )
}
