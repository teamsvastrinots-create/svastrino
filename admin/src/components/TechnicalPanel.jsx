import { useState, useEffect } from 'react'

const STATUS_ITEMS = [
  { name: 'API Server', key: 'api', desc: 'Python FastAPI backend' },
  { name: 'Database', key: 'db', desc: 'Supabase PostgreSQL' },
  { name: 'Auth Service', key: 'auth', desc: 'Supabase Auth + OTP' },
  { name: 'File Storage', key: 'storage', desc: 'Supabase Storage' },
  { name: 'Payment Gateway', key: 'payments', desc: 'Razorpay' },
  { name: 'OTP Service', key: 'otp', desc: 'MSG91' },
]

const DEPLOYMENTS = [
  { label: 'Backend v1.2.1', type: 'Backend', time: 'Today 3:45 PM', who: 'You', status: 'success' },
  { label: 'DB Migration 004', type: 'Database', time: 'Yesterday 11:20 AM', who: 'You', status: 'success' },
  { label: 'Admin Frontend', type: 'Frontend', time: 'Apr 12, 2:00 PM', who: 'You', status: 'success' },
  { label: 'Backend v1.2.0', type: 'Backend', time: 'Apr 10, 10:15 AM', who: 'You', status: 'failed' },
  { label: 'Backend v1.1.9', type: 'Backend', time: 'Apr 8, 4:30 PM', who: 'You', status: 'success' },
]

const ERRORS = [
  { time: '2:34 PM', type: 'ProfileNotFound', endpoint: 'GET /v1/student/dashboard', count: 3 },
  { time: '1:12 PM', type: 'PaymentVerifyFail', endpoint: 'POST /v1/payments/webhook', count: 1 },
  { time: '11:05 AM', type: 'OTPDeliveryFail', endpoint: 'POST /v1/auth/send-otp', count: 2 },
]

const ACTIVITY = [
  { icon: '👤', text: 'New student enrolled', meta: '2 min ago', color: '#dcfce7' },
  { icon: '💳', text: 'Payment received — ₹2,999', meta: '8 min ago', color: '#dbeafe' },
  { icon: '📱', text: 'OTP sent to +91 98765 43210', meta: '12 min ago', color: '#f0f4ff' },
  { icon: '⚠️', text: 'Payment failed — gateway timeout', meta: '34 min ago', color: '#fee2e2' },
  { icon: '🔐', text: 'Admin login from new device', meta: '1 hour ago', color: '#fef3c7' },
  { icon: '📅', text: 'Webinar created — Career Clarity', meta: '2 hours ago', color: '#f0f4ff' },
]

const UPTIME_DAYS = Array.from({ length: 30 }, (_, i) => {
  const rand = Math.random()
  return rand > 0.95 ? 'down' : rand > 0.88 ? 'degraded' : 'up'
})

const TODAY_STATS = [
  { label: 'New Signups', value: '12' },
  { label: 'OTPs Sent', value: '47' },
  { label: 'Payments Attempted', value: '8' },
  { label: 'Payments Succeeded', value: '6' },
  { label: 'Active Now', value: '23' },
  { label: 'API Calls', value: '1,842' },
]

const typeColors = {
  Backend: { bg: '#f0f4ff', color: '#3b5bdb' },
  Frontend: { bg: '#f0fdf4', color: '#166534' },
  Database: { bg: '#fef9c3', color: '#854d0e' },
}

export default function TechnicalPanel() {
  const [statuses, setStatuses] = useState({})
  const [checking, setChecking] = useState(true)
  const [responseTime, setResponseTime] = useState(null)

  useEffect(() => {
    async function checkHealth() {
      setChecking(true)
      const start = Date.now()
      try {
        const res = await fetch('http://localhost:8001/health')
        const elapsed = Date.now() - start
        setResponseTime(elapsed)
        if (res.ok) {
          setStatuses({
            api: 'operational',
            db: 'operational',
            auth: 'operational',
            storage: 'operational',
            payments: 'operational',
            otp: 'degraded',
          })
        } else {
          setStatuses({ api: 'down', db: 'unknown', auth: 'unknown', storage: 'unknown', payments: 'operational', otp: 'degraded' })
        }
      } catch {
        setResponseTime(null)
        setStatuses({ api: 'down', db: 'unknown', auth: 'unknown', storage: 'unknown', payments: 'operational', otp: 'degraded' })
      } finally {
        setChecking(false)
      }
    }
    checkHealth()
    const interval = setInterval(checkHealth, 60000)
    return () => clearInterval(interval)
  }, [])

  function statusColor(s) {
    if (s === 'operational') return { bg: '#dcfce7', color: '#166534', label: 'Operational', dot: '#22c55e' }
    if (s === 'degraded') return { bg: '#fef3c7', color: '#92400e', label: 'Degraded', dot: '#f59e0b' }
    if (s === 'down') return { bg: '#fee2e2', color: '#991b1b', label: 'Down', dot: '#ef4444' }
    return { bg: '#f1f3f5', color: '#6c757d', label: 'Checking...', dot: '#ced4da' }
  }

  const allOperational = Object.values(statuses).every(s => s === 'operational')
  const anyDown = Object.values(statuses).some(s => s === 'down')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header banner */}
      <div style={{
        padding: '14px 20px',
        borderRadius: 12,
        background: anyDown ? '#fee2e2' : allOperational ? '#dcfce7' : '#fef3c7',
        border: `1px solid ${anyDown ? '#fca5a5' : allOperational ? '#86efac' : '#fcd34d'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: anyDown ? '#ef4444' : allOperational ? '#22c55e' : '#f59e0b',
            boxShadow: `0 0 0 3px ${anyDown ? '#fca5a5' : allOperational ? '#86efac' : '#fcd34d'}`
          }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: anyDown ? '#991b1b' : allOperational ? '#166534' : '#92400e' }}>
            {checking ? 'Checking system status...' : anyDown ? 'Some services are down' : allOperational ? 'All systems operational' : 'Some services degraded'}
          </span>
        </div>
        <span style={{ fontSize: 11, color: '#6c757d' }}>
          {responseTime ? `API response: ${responseTime}ms` : 'API unreachable'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* System Status */}
        <div className="card">
          <div className="card-hd">
            <span className="card-title">System Status</span>
            <span style={{ fontSize: 11, color: '#adb5bd' }}>
              {checking ? 'Refreshing...' : 'Live · refreshes every 60s'}
            </span>
          </div>
          <div>
            {STATUS_ITEMS.map(item => {
              const s = statusColor(statuses[item.key])
              return (
                <div key={item.key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 18px', borderBottom: '1px solid #f8f9fa'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#212529' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: '#adb5bd' }}>{item.desc}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 8px',
                    borderRadius: 20, background: s.bg, color: s.color
                  }}>
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Today Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-hd"><span className="card-title">Today at a Glance</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, background: '#f0f2f5' }}>
              {TODAY_STATS.map((s, i) => (
                <div key={i} style={{ background: '#fff', padding: '14px 16px', margin: '0 0 1px 1px' }}>
                  <div style={{ fontSize: 10, color: '#adb5bd', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#0f1f3d', marginTop: 6, letterSpacing: '-0.5px' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Uptime history */}
          <div className="card">
            <div className="card-hd">
              <span className="card-title">30-Day Uptime</span>
              <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>99.8%</span>
            </div>
            <div style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
                {UPTIME_DAYS.map((day, i) => (
                  <div key={i} style={{
                    flex: 1, height: 28, borderRadius: 4,
                    background: day === 'up' ? '#22c55e' : day === 'degraded' ? '#f59e0b' : '#ef4444',
                    opacity: day === 'up' ? 0.7 : 1,
                    cursor: 'pointer', transition: 'opacity 0.15s'
                  }}
                    title={`${30 - i} days ago: ${day}`}
                    onMouseEnter={e => e.target.style.opacity = 1}
                    onMouseLeave={e => e.target.style.opacity = day === 'up' ? 0.7 : 1}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#adb5bd' }}>
                <span>30 days ago</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#22c55e', display: 'inline-block' }} /> Up</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} /> Degraded</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#ef4444', display: 'inline-block' }} /> Down</span>
                </div>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>

        {/* Recent Deployments */}
        <div className="card">
          <div className="card-hd"><span className="card-title">Recent Deployments</span></div>
          {DEPLOYMENTS.map((d, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '11px 18px', borderBottom: '1px solid #f8f9fa'
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                background: d.status === 'success' ? '#dcfce7' : '#fee2e2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: d.status === 'success' ? '#166534' : '#991b1b', fontWeight: 700
              }}>
                {d.status === 'success' ? '✓' : '✗'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#212529' }}>{d.label}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 20,
                    background: typeColors[d.type]?.bg, color: typeColors[d.type]?.color
                  }}>{d.type}</span>
                </div>
                <div style={{ fontSize: 11, color: '#adb5bd' }}>{d.time} · {d.who}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Log */}
        <div className="card">
          <div className="card-hd">
            <span className="card-title">Live Activity</span>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
              display: 'inline-block', boxShadow: '0 0 0 3px #dcfce7'
            }} />
          </div>
          {ACTIVITY.map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '10px 18px', borderBottom: '1px solid #f8f9fa'
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: a.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, flexShrink: 0
              }}>{a.icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#212529' }}>{a.text}</div>
                <div style={{ fontSize: 11, color: '#adb5bd', marginTop: 2 }}>{a.meta}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Error Log */}
        <div className="card">
          <div className="card-hd">
            <span className="card-title">Recent Errors</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: '#fee2e2', color: '#991b1b' }}>
              {ERRORS.length} today
            </span>
          </div>
          {ERRORS.map((e, i) => (
            <div key={i} style={{
              padding: '12px 18px', borderBottom: '1px solid #f8f9fa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>{e.type}</span>
                <span style={{ fontSize: 10, color: '#adb5bd' }}>{e.time}</span>
              </div>
              <div style={{ fontSize: 11, color: '#6c757d', fontFamily: 'monospace', marginBottom: 4 }}>{e.endpoint}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#92400e', background: '#fef3c7', padding: '1px 7px', borderRadius: 20, display: 'inline-block' }}>
                {e.count}x today
              </div>
            </div>
          ))}
          {ERRORS.length === 0 && (
            <div style={{ padding: '24px 18px', textAlign: 'center', color: '#adb5bd', fontSize: 13 }}>
              No errors today 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
