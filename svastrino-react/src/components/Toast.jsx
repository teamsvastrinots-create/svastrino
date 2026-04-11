// src/components/Toast.jsx
import { useState, useCallback, useEffect, useRef } from 'react'

let toastDispatch = null

export function useToast() {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })
  const timerRef = useRef(null)

  const showToast = useCallback((message, type = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ visible: true, message, type })
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3200)
  }, [])

  return { toast, showToast }
}

export function Toast({ toast }) {
  const typeClass = toast.type === 'error' ? 'error' : 'success'
  return (
    <div className={`toast ${typeClass} ${toast.visible ? 'show' : ''}`}>
      {toast.message}
    </div>
  )
}
