import { useState } from 'react'
import Layout from '../components/Layout'
import AuthGuard from '../components/AuthGuard'
import { PAYMENTS } from '../lib/mockData'

export default function Payments() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredPayments = PAYMENTS.filter(p => {
    const matchQ = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.ref.toLowerCase().includes(search.toLowerCase())
    const matchS = !statusFilter || p.status === statusFilter
    return matchQ && matchS
  })

  return (
    <AuthGuard>
      <Layout title="Payments Ledger">
        <div className="table-section">
          <div className="ts-header">
            <div className="ts-search">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="#adb5bd"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.868-3.833zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/></svg>
              <input type="text" placeholder="Search student or reference..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="ts-actions">
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)} 
                style={{border:'1px solid #e8eaed',borderRadius:8,padding:'7px 12px',fontSize:12,fontFamily:"'Inter',sans-serif",outline:'none',color:'#495057',cursor:'pointer'}}
              >
                <option value="">All Statuses</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <button className="btn-outline">Export</button>
            </div>
          </div>
          <table>
            <thead><tr><th>Student</th><th>Phone</th><th>Amount</th><th>Status</th><th>Gateway Ref</th><th>Date</th></tr></thead>
            <tbody>
              {filteredPayments.map(p => (
                <tr key={p.id}>
                  <td style={{fontWeight:500}}>{p.name}</td>
                  <td style={{color:'#6c757d'}}>{p.phone}</td>
                  <td style={{fontWeight:700,color:'#0f1f3d'}}>{p.amount}</td>
                  <td><span className={`pill ${p.status==='success'?'pill-success':p.status==='pending'?'pill-pending':'pill-failed'}`}>{p.status.charAt(0).toUpperCase()+p.status.slice(1)}</span></td>
                  <td style={{fontSize:11,color:'#6c757d',fontFamily:'monospace'}}>{p.ref}</td>
                  <td style={{color:'#6c757d',fontSize:12}}>{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <span className="page-info">Showing {filteredPayments.length} of {PAYMENTS.length} entries</span>
            <div className="page-btns">
              <button className="page-btn">← Previous</button>
              <button className="page-btn">Next →</button>
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}
