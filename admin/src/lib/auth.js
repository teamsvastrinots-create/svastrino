import { supabase } from './supabase'

export async function adminLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profileError || !profile) throw new Error('Profile not found')
  if (profile.role !== 'admin') throw new Error('Access denied. Not an admin account.')

  localStorage.setItem('admin_session', JSON.stringify(data.session))
  localStorage.setItem('admin_user', JSON.stringify({ ...data.user, role: profile.role }))
  return data
}

export function adminLogout() {
  localStorage.removeItem('admin_session')
  localStorage.removeItem('admin_user')
  supabase.auth.signOut()
}

export function getAdminUser() {
  try {
    return JSON.parse(localStorage.getItem('admin_user'))
  } catch {
    return null
  }
}

export function isAuthenticated() {
  const session = localStorage.getItem('admin_session')
  if (!session) return false
  try {
    const parsed = JSON.parse(session)
    const expiry = parsed.expires_at * 1000
    return Date.now() < expiry
  } catch {
    return false
  }
}
