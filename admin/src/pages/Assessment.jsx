import Layout from '../components/Layout'
import AuthGuard from '../components/AuthGuard'
import { QUESTIONS, TRAITS } from '../lib/mockData'

export default function Assessment() {
  return (
    <AuthGuard>
      <Layout title="Assessment">
        <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16}}>
          <div className="table-section">
            <div className="ts-header">
              <span style={{fontSize:13,fontWeight:700,color:'#0f1f3d'}}>Questions Bank</span>
              <span className="badge-blue">{QUESTIONS.length} Questions</span>
            </div>
            <table>
              <thead><tr><th>#</th><th>Question</th><th>Trait</th><th>Correct</th></tr></thead>
              <tbody>
                {QUESTIONS.map((q, i) => (
                  <tr key={q.id}>
                    <td style={{color:'#adb5bd',fontWeight:600}}>{String(i+1).padStart(2,'0')}</td>
                    <td style={{maxWidth:300,fontSize:12}}>{q.q}</td>
                    <td><span className="badge-blue">{q.trait}</span></td>
                    <td style={{fontWeight:700,color:'#166534',textTransform:'uppercase'}}>{q.correct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <div className="card-hd"><span className="card-title">Average Trait Scores</span></div>
            <div style={{padding:16}}>
              {TRAITS.map((t, idx) => (
                <div key={idx} className="trait-bar">
                  <span className="trait-name" style={{fontSize:11}}>{t.name}</span>
                  <div className="trait-track"><div className="trait-fill" style={{width: `${t.score}%`, background: t.color}}></div></div>
                  <span className="trait-val" style={{color: t.color}}>{t.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}
