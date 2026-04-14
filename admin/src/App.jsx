import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Content from './pages/Content'
import Webinars from './pages/Webinars'
import Assessment from './pages/Assessment'
import Payments from './pages/Payments'
import System from './pages/System'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/content" element={<Content />} />
        <Route path="/webinars" element={<Webinars />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/system" element={<System />} />
      </Routes>
    </BrowserRouter>
  )
}
