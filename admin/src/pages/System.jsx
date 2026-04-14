import Layout from '../components/Layout'
import AuthGuard from '../components/AuthGuard'
import TechnicalPanel from '../components/TechnicalPanel'

export default function System() {
  return (
    <AuthGuard>
      <Layout title="System Status">
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f1f3d', letterSpacing: '-0.3px' }}>Technical Overview</h2>
          <p style={{ fontSize: 13, color: '#adb5bd', marginTop: 2 }}>Live system health, deployments, and error tracking</p>
        </div>
        <TechnicalPanel />
      </Layout>
    </AuthGuard>
  )
}
