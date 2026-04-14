export default function StatCard({ title, value, color = '#1e3a5f', subtitle }) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, padding: '20px 24px', borderTop: `4px solid ${color}`, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', margin: '8px 0 4px' }}>{value ?? '—'}</div>
      {subtitle && <div style={{ fontSize: 12, color: '#94a3b8' }}>{subtitle}</div>}
    </div>
  )
}
