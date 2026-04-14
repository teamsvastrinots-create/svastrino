import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import AuthGuard from '../components/AuthGuard'
import { STUDENTS } from '../lib/mockData'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <AuthGuard>
      <Layout title="Dashboard">
        <div className="toolbar">
          <div className="toolbar-left">
            <button className="btn-outline">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
              Customize Widget
            </button>
          </div>
          <div className="toolbar-right">
            <span className="meta-text">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>
              Last updated 5 min ago
            </span>
            <button className="btn-primary">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="white"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
              Export
            </button>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-box">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <span className="stat-name">Total Students</span>
              <div className="stat-dots"><span></span><span></span><span></span></div>
            </div>
            <div className="stat-num">1,284</div>
            <div className="stat-bottom"><span className="stat-compare">Than last week</span><span className="badge-up">▲ 3.2%</span></div>
          </div>
          <div className="stat-box">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <span className="stat-name">Premium Students</span>
              <div className="stat-dots"><span></span><span></span><span></span></div>
            </div>
            <div className="stat-num">347</div>
            <div className="stat-bottom"><span className="stat-compare">Than last week</span><span className="badge-up">▲ 2.4%</span></div>
          </div>
          <div className="stat-box">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <span className="stat-name">Active This Week</span>
              <div className="stat-dots"><span></span><span></span><span></span></div>
            </div>
            <div className="stat-num">892</div>
            <div className="stat-bottom"><span className="stat-compare">Than last week</span><span className="badge-down">▼ 1.1%</span></div>
          </div>
          <div className="stat-box">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <span className="stat-name">Total Revenue</span>
              <div className="stat-dots"><span></span><span></span><span></span></div>
            </div>
            <div className="stat-num">₹4.2L</div>
            <div className="stat-bottom"><span className="stat-compare">Than last week</span><span className="badge-up">▲ 5.8%</span></div>
          </div>
        </div>

        <div className="mid-grid">
          <div className="card">
            <div className="card-hd">
              <span className="card-title">Enrollments & Premium Upgrades</span>
              <select style={{border:'1px solid #e8eaed',borderRadius:7,padding:'4px 10px',fontSize:11,color:'#495057',fontFamily:"'Inter',sans-serif",outline:'none',cursor:'pointer'}}>
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            <div className="chart-wrap">
              <div className="chart-legend">
                <div className="leg">
                  <div className="leg-label"><div className="leg-dot" style={{background:'#4a90d9'}}></div>Enrollments</div>
                  <div className="leg-val">142 <span className="leg-badge badge-up">▲ 3.4%</span></div>
                </div>
                <div className="leg">
                  <div className="leg-label"><div className="leg-dot" style={{background:'#f472b6'}}></div>Upgrades</div>
                  <div className="leg-val">38 <span className="leg-badge badge-up">▲ 1.2%</span></div>
                </div>
              </div>
              <div className="bars">
                <div className="bg"><div className="b b-blue" style={{height:35}}></div><div className="b b-pink" style={{height:14}}></div></div>
                <div className="bg"><div className="b b-blue" style={{height:52}}></div><div className="b b-pink" style={{height:20}}></div></div>
                <div className="bg"><div className="b b-blue" style={{height:44}}></div><div className="b b-pink" style={{height:22}}></div></div>
                <div className="bg"><div className="b b-blue" style={{height:62}}></div><div className="b b-pink" style={{height:28}}></div></div>
                <div className="bg"><div className="b b-blue" style={{height:38}}></div><div className="b b-pink" style={{height:16}}></div></div>
                <div className="bg"><div className="b b-blue" style={{height:55}}></div><div className="b b-pink" style={{height:24}}></div></div>
                <div className="bg"><div className="b b-blue" style={{height:48}}></div><div className="b b-pink" style={{height:20}}></div></div>
                <div className="bg"><div className="b b-blue hi" style={{height:95}}></div><div className="b b-pink hi" style={{height:44}}></div></div>
                <div className="bg"><div className="b b-blue" style={{height:70}}></div><div className="b b-pink" style={{height:32}}></div></div>
                <div className="bg"><div className="b b-blue" style={{height:75}}></div><div className="b b-pink" style={{height:36}}></div></div>
                <div className="bg"><div className="b b-blue" style={{height:82}}></div><div className="b b-pink" style={{height:40}}></div></div>
                <div className="bg"><div className="b b-blue" style={{height:65}}></div><div className="b b-pink" style={{height:30}}></div></div>
              </div>
              <div className="xlabels">
                <div className="xl">Jan</div><div className="xl">Feb</div><div className="xl">Mar</div><div className="xl">Apr</div>
                <div className="xl">May</div><div className="xl">Jun</div><div className="xl">Jul</div><div className="xl">Aug</div>
                <div className="xl">Sep</div><div className="xl">Oct</div><div className="xl">Nov</div><div className="xl">Dec</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><span className="card-title">Course Performance</span></div>
            <div className="perf-item">
              <div className="perf-top"><div className="perf-icon">📚</div><div className="perf-name">Week Completion Rate</div></div>
              <div className="perf-row"><span className="perf-sub">Monthly target achieved</span><span className="perf-pct">78%</span></div>
              <div className="track"><div className="fill" style={{width:'78%',background:'#4a90d9'}}></div></div>
            </div>
            <div className="perf-item">
              <div className="perf-top"><div className="perf-icon">⭐</div><div className="perf-name">Premium Conversion</div></div>
              <div className="perf-row"><span className="perf-sub">Monthly target</span><span className="perf-pct">64%</span></div>
              <div className="track"><div className="fill" style={{width:'64%',background:'#f472b6'}}></div></div>
            </div>
            <div className="perf-item">
              <div className="perf-top"><div className="perf-icon">🎯</div><div className="perf-name">Webinar Attendance</div></div>
              <div className="perf-row"><span className="perf-sub">Avg session attendance</span><span className="perf-pct">89%</span></div>
              <div className="track"><div className="fill" style={{width:'89%',background:'#34d399'}}></div></div>
            </div>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div className="card">
            <div className="card-hd">
              <span className="card-title">Recent Students</span>
              <button className="card-link" onClick={() => navigate('/students')}>View all →</button>
            </div>
            <table>
              <thead><tr><th>Student</th><th>Status</th><th>Week</th><th>Enrolled</th></tr></thead>
              <tbody>
                <tr onClick={() => navigate('/students')}><td><div className="cell-av"><div className="av-c" style={{background:'#dbeafe',color:'#1e40af'}}>RK</div>Rohan Kumar</div></td><td><span className="pill pill-prem">Premium</span></td><td><div className="wk-cell"><div className="wk-track"><div className="wk-fill" style={{width:'33%'}}></div></div><span className="wk-txt">8/24</span></div></td><td style={{color:'#6c757d',fontSize:12}}>Apr 10</td></tr>
                <tr onClick={() => navigate('/students')}><td><div className="cell-av"><div className="av-c" style={{background:'#dcfce7',color:'#166534'}}>PS</div>Priya Sharma</div></td><td><span className="pill pill-free">Free</span></td><td><div className="wk-cell"><div className="wk-track"><div className="wk-fill" style={{width:'8%'}}></div></div><span className="wk-txt">2/24</span></div></td><td style={{color:'#6c757d',fontSize:12}}>Apr 12</td></tr>
                <tr onClick={() => navigate('/students')}><td><div className="cell-av"><div className="av-c" style={{background:'#fef3c7',color:'#92400e'}}>AV</div>Arjun Verma</div></td><td><span className="pill pill-prem">Premium</span></td><td><div className="wk-cell"><div className="wk-track"><div className="wk-fill" style={{width:'58%'}}></div></div><span className="wk-txt">14/24</span></div></td><td style={{color:'#6c757d',fontSize:12}}>Mar 28</td></tr>
                <tr onClick={() => navigate('/students')}><td><div className="cell-av"><div className="av-c" style={{background:'#ede9fe',color:'#5b21b6'}}>ND</div>Neha Das</div></td><td><span className="pill pill-free">Free</span></td><td><div className="wk-cell"><div className="wk-track"><div className="wk-fill" style={{width:'4%'}}></div></div><span className="wk-txt">1/24</span></div></td><td style={{color:'#6c757d',fontSize:12}}>Apr 13</td></tr>
              </tbody>
            </table>
          </div>
          <div className="card">
            <div className="card-hd"><span className="card-title">Week Drop-off Rate</span></div>
            <div className="prog-item"><span className="prog-label">Week 1</span><div className="prog-track"><div style={{height:6,borderRadius:3,background:'#f59e0b',width:'92%'}}></div></div><span className="prog-val">92%</span></div>
            <div className="prog-item"><span className="prog-label">Week 2</span><div className="prog-track"><div style={{height:6,borderRadius:3,background:'#f59e0b',width:'78%'}}></div></div><span className="prog-val">78%</span></div>
            <div className="prog-item"><span className="prog-label">Week 3</span><div className="prog-track"><div style={{height:6,borderRadius:3,background:'#ef9f27',width:'61%'}}></div></div><span className="prog-val">61%</span></div>
            <div className="prog-item"><span className="prog-label">Week 4</span><div className="prog-track"><div style={{height:6,borderRadius:3,background:'#ba7517',width:'44%'}}></div></div><span className="prog-val">44%</span></div>
            <div className="prog-item"><span className="prog-label">Week 5+</span><div className="prog-track"><div style={{height:6,borderRadius:3,background:'#4a90d9',width:'22%'}}></div></div><span className="prog-val">22%</span></div>
          </div>
        </div>

      </Layout>
    </AuthGuard>
  )
}
