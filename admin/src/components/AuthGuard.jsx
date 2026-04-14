import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../lib/auth'

export default function AuthGuard({ children }) {
  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuthenticated()) navigate('/', { replace: true })
  }, [navigate])
  if (!isAuthenticated()) return null
  return children
}
