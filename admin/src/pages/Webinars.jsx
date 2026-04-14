import { useState } from 'react'
import Layout from '../components/Layout'
import AuthGuard from '../components/AuthGuard'
import { WEBINARS } from '../lib/mockData'
import { useToast } from '../context/ToastContext'

export default function Webinars() {
  const [modalOpen, setModalOpen] = useState(false)
  const { showToast } = useToast()
  
  const [webinars, setWebinars] = useState([...WEBINARS])

  const [form, setForm] = useState({ title: '', date: '', time: '17:00', link: '', week: '' })

  const action = {
    label: 'Add Webinar',
    onClick: () => setModalOpen(true)
  }

  function handleCreate() {
    if (!form.title || !form.date || !form.link || !form.week) {
      showToast('Please fill all fields', 'error')
      return
    }
    setWebinars([{
      id: Date.now(),
      title: form.title,
      date: `${form.date} · ${form.time}`,
      week: form.week,
      regs: 0,
      status: 'upcoming'
    }, ...webinars])
    setModalOpen(false)
    setForm({ title: '', date: '', time: '17:00', link: '', week: '' })
    showToast('Webinar created successfully!')
  }

  return (
    <AuthGuard>
      <Layout title="Webinars" action={action}>
        <div className="table-section">
          <div className="ts-header">
            <span style={{fontSize:13,fontWeight:700,color:'#0f1f3d'}}>All Webinars</span>
            <div className="ts-actions">
              <button className="btn-primary" onClick={() => setModalOpen(true)}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="white"><path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/></svg>
                Create New Webinar
              </button>
            </div>
          </div>
          <table>
            <thead><tr><th>Title</th><th>Scheduled Date</th><th>Week</th><th>Registrations</th><th>Status</th></tr></thead>
            <tbody>
              {webinars.map(w => (
                <tr key={w.id}>
                  <td style={{fontWeight:500}}>{w.title}</td>
                  <td style={{color:'#6c757d'}}>{w.date}</td>
                  <td>Week {w.week}</td>
                  <td><span className="badge-blue">{w.regs} registered</span></td>
                  <td><span className={`pill ${w.status==='upcoming'?'pill-prem':'pill-free'}`}>{w.status==='upcoming'?'Upcoming':'Completed'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`modal-overlay ${modalOpen ? 'open' : ''}`}>
          <div className="modal">
            <div className="modal-title">Create New Webinar</div>
            <div className="modal-sub">Schedule a live session for enrolled students</div>
            <div className="form-group">
              <label className="form-label">Webinar Title</label>
              <input className="form-input" type="text" placeholder="e.g. Career Clarity Session — Month 1" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input className="form-input" type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Meeting Link</label>
              <input className="form-input" type="url" placeholder="https://meet.google.com/..." value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Week Number (1–24)</label>
              <input className="form-input" type="number" min="1" max="24" placeholder="4" value={form.week} onChange={e => setForm({...form, week: e.target.value})} />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreate}>Create Webinar</button>
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}
