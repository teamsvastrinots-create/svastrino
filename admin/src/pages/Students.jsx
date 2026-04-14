import { useState } from 'react'
import Layout from '../components/Layout'
import AuthGuard from '../components/AuthGuard'
import { STUDENTS, getInitials, avColor } from '../lib/mockData'
import { useToast } from '../context/ToastContext'

export default function Students() {
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const PER_PAGE = 6

  const [selectedStudent, setSelectedStudent] = useState(null)
  const [premiumReason, setPremiumReason] = useState('')

  const filteredStudents = STUDENTS.filter(s => {
    const matchQ = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search)
    const matchS = !statusFilter || s.status === statusFilter
    return matchQ && matchS
  })

  const start = currentPage * PER_PAGE
  const paginated = filteredStudents.slice(start, start + PER_PAGE)

  const handlePrev = () => { if (currentPage > 0) setCurrentPage(p => p - 1) }
  const handleNext = () => { if ((currentPage + 1) * PER_PAGE < filteredStudents.length) setCurrentPage(p => p + 1) }

  function handleSetPremium(val) {
    if (!premiumReason) {
      showToast('Please enter a reason first', 'error')
      return
    }
    showToast(val ? 'Student upgraded to Premium!' : 'Premium removed from student')
    setSelectedStudent(null)
    setPremiumReason('')
  }

  return (
    <AuthGuard>
      <Layout title="Students">
        <div className="table-section">
          <div className="ts-header">
            <div className="ts-search">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="#adb5bd"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.868-3.833zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/></svg>
              <input 
                type="text" 
                placeholder="Search name or phone..." 
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(0); }}
              />
            </div>
            <div className="ts-actions">
              <select 
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setCurrentPage(0); }}
                style={{border:'1px solid #e8eaed',borderRadius:8,padding:'7px 12px',fontSize:12,fontFamily:"'Inter',sans-serif",outline:'none',color:'#495057',cursor:'pointer'}}
              >
                <option value="">All Status</option>
                <option value="Premium">Premium</option>
                <option value="Free">Free</option>
              </select>
              <button className="btn-outline">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
                Export
              </button>
            </div>
          </div>
          <table>
            <thead><tr><th>Student Name</th><th>Phone</th><th>Class</th><th>Status</th><th>Week Progress</th><th>Tasks Done</th><th>Enrolled Date</th></tr></thead>
            <tbody>
              {paginated.map((s, idx) => (
                <tr key={s.id} onClick={() => setSelectedStudent(s)}>
                  <td><div className="cell-av"><div className="av-c" style={avColor(idx)}>{getInitials(s.name)}</div>{s.name}</div></td>
                  <td style={{color:'#6c757d'}}>{s.phone}</td>
                  <td>{s.cls}</td>
                  <td><span className={`pill ${s.status==='Premium'?'pill-prem':'pill-free'}`}>{s.status}</span></td>
                  <td><div className="wk-cell"><div className="wk-track"><div className="wk-fill" style={{width:`${s.pct}%`}}></div></div><span className="wk-txt">{s.week}</span></div></td>
                  <td style={{color:'#6c757d'}}>{s.tasks}</td>
                  <td style={{color:'#6c757d',fontSize:12}}>{s.enrolled}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <span className="page-info">Showing {Math.min(start + PER_PAGE, filteredStudents.length)} of {filteredStudents.length} students</span>
            <div className="page-btns">
              <button className="page-btn" onClick={handlePrev} disabled={currentPage === 0}>← Previous</button>
              <button className="page-btn" onClick={handleNext} disabled={(currentPage + 1) * PER_PAGE >= filteredStudents.length}>Next →</button>
            </div>
          </div>
        </div>

        <div className={`side-panel ${selectedStudent ? 'open' : ''}`}>
          <div className="sp-header">
            <span className="sp-title">Student Profile</span>
            <button className="sp-close" onClick={() => setSelectedStudent(null)}>✕</button>
          </div>
          {selectedStudent && (
            <div className="sp-body">
              <div className="sp-section">
                <div className="sp-section-title">Profile</div>
                <div className="sp-field"><span className="sp-field-label">Name</span><span className="sp-field-val">{selectedStudent.name}</span></div>
                <div className="sp-field"><span className="sp-field-label">Class</span><span className="sp-field-val">{selectedStudent.cls}</span></div>
                <div className="sp-field"><span className="sp-field-label">Status</span><span className="sp-field-val"><span className={`pill ${selectedStudent.status==='Premium'?'pill-prem':'pill-free'}`}>{selectedStudent.status}</span></span></div>
                <div className="sp-field"><span className="sp-field-label">Enrolled</span><span className="sp-field-val">{selectedStudent.enrolled}</span></div>
              </div>
              <div className="sp-section">
                <div className="sp-section-title">Course Progress</div>
                <div className="sp-field"><span className="sp-field-label">Current Week</span><span className="sp-field-val">{selectedStudent.week}</span></div>
                <div className="sp-progress">
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                    <span style={{fontSize:11,color:'#6c757d'}}>Overall completion</span>
                    <span style={{fontSize:11,fontWeight:600,color:'#0f1f3d'}}>{selectedStudent.pct}%</span>
                  </div>
                  <div className="sp-prog-bar"><div className="sp-prog-fill" style={{width: `${selectedStudent.pct}%`}}></div></div>
                </div>
              </div>
              <div className="sp-section">
                <div className="sp-section-title">Premium Management</div>
                <div style={{marginBottom:10}}>
                  <label className="form-label">Reason for change</label>
                  <input 
                    className="form-input" 
                    type="text" 
                    placeholder="e.g. Scholarship, Manual upgrade..." 
                    value={premiumReason}
                    onChange={e => setPremiumReason(e.target.value)}
                  />
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn-primary" style={{flex:1,justifyContent:'center'}} onClick={() => handleSetPremium(true)}>Set Premium</button>
                  <button className="btn-outline" style={{flex:1,justifyContent:'center'}} onClick={() => handleSetPremium(false)}>Remove Premium</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  )
}
