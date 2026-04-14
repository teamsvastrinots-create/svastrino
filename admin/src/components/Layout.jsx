import { NavLink, useNavigate } from 'react-router-dom'
import { adminLogout, getAdminUser } from '../lib/auth'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg> },
  { label: 'Students', path: '/students', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6a5 5 0 0 1 10 0H3z"/></svg> },
  { label: 'Content', path: '/content', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M4 1h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm1 3v1h6V4H5zm0 2v1h6V6H5zm0 2v1h4V8H5z"/></svg> },
  { label: 'Webinars', path: '/webinars', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm6.5 7.5v-7l5 3.5-5 3.5z"/></svg> },
  { label: 'Assessment', path: '/assessment', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M1 11a1 1 0 0 1 1-1h2v3H2a1 1 0 0 1-1-1v-2zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h-4V2z"/></svg> },
]

const bottomItems = [
  { label: 'System', path: '/system', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M8 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> },
  { label: 'Payments', path: '/payments', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2H0V4zm0 3h16v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V7zm3 2v1h1V9H3zm2 0v1h1V9H5z"/></svg> },
  { label: 'Settings', path: '/settings', icon: <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311a1.464 1.464 0 0 1-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/></svg> },
]

export default function Layout({ children, title, action }) {
  const navigate = useNavigate()
  const user = getAdminUser()

  function handleLogout() {
    adminLogout()
    navigate('/login')
  }

  return (
    <div className="shell">
      <div className="sidebar">
        <div className="sb-top">
          <div className="sb-logo">S</div>
          <div>
            <div className="sb-brand">Svastrino</div>
            <div className="sb-sub">Admin Panel</div>
          </div>
        </div>
        <div className="sb-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sb-item${isActive ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          <div className="sb-divider" />
          {bottomItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sb-item${isActive ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="sb-footer">
          <div className="sb-av">{user?.email?.slice(0,2).toUpperCase() || 'AD'}</div>
          <div>
            <div className="sb-uname">Admin</div>
            <div className="sb-email">{user?.email || 'admin@svastrino.com'}</div>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="topbar">
          <div className="tb-title">{title}</div>
          <div className="tb-right">
            <div className="tb-search">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="#adb5bd"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.868-3.833zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/></svg>
              Search something
            </div>
            <div className="icon-btn">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="#6c757d"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/></svg>
            </div>
            {action && (
              <button className="btn-primary" onClick={action.onClick}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="white"><path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/></svg>
                {action.label}
              </button>
            )}
            <button className="btn-outline" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  )
}
