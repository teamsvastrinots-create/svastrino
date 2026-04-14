import { useState } from 'react'
import Layout from '../components/Layout'
import AuthGuard from '../components/AuthGuard'
import { WEEKS } from '../lib/mockData'
import { useToast } from '../context/ToastContext'

export default function Content() {
  const [activeWeekIndex, setActiveWeekIndex] = useState(0)
  const { showToast } = useToast()
  
  const w = WEEKS[activeWeekIndex]

  return (
    <AuthGuard>
      <Layout title="Course Content">
        <div className="content-grid">
          <div className="week-list">
            {WEEKS.map((week, idx) => (
              <div 
                key={week.n} 
                className={`week-item ${idx === activeWeekIndex ? 'active' : ''}`}
                onClick={() => setActiveWeekIndex(idx)}
              >
                <div className="week-num">Week {week.n}</div>
                <div className="week-title-text">{week.title}</div>
              </div>
            ))}
          </div>
          
          <div className="week-detail">
            {w ? (
              <>
                <div className="wd-header">
                  <div className="wd-title">{w.title}</div>
                  <div className="wd-meta">
                    Week {w.n} · {w.tasks.length} tasks · {' '}
                    <span style={{color:'#4a90d9',cursor:'pointer'}} onClick={() => showToast('Video URL copied!')}>
                      📹 {w.video}
                    </span>
                  </div>
                </div>
                {w.tasks.map((t, j) => (
                  <div key={j} className="task-item">
                    <div className="task-day">D{j+2}</div>
                    <div>
                      <div className="task-name">{t}</div>
                      <div className="task-type">Text task · Day {j+2}</div>
                    </div>
                    <button className="btn-outline" style={{marginLeft:'auto',fontSize:11,padding:'5px 10px'}} onClick={() => showToast('Edit mode coming soon')}>Edit</button>
                  </div>
                ))}
              </>
            ) : (
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:200,color:'#adb5bd',fontSize:13}}>
                Select a week from the left panel
              </div>
            )}
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}
