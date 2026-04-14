import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const bg = type === 'success' ? '#dcfce7' : '#fee2e2'
  const color = type === 'success' ? '#16a34a' : '#dc2626'

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, background: bg, color, padding: '12px 20px', borderRadius: 8, fontWeight: 500, fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000 }}>
      {message}
    </div>
  )
}
