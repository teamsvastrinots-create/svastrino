// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard, GuestGuard } from './components/AuthGuard'

// ── Auth pages (Flow 2) ──────────────────────────────────────
import SignIn           from './pages/SignIn'
import OTPRequest       from './pages/OTPRequest'
import OTPVerify        from './pages/OTPVerify'
import LoginUsername    from './pages/LoginUsername'

// ── Protected pages (Flows 3 & 4) ───────────────────────────
import Dashboard        from './pages/Dashboard'
import Profile          from './pages/Profile'
import Notifications    from './pages/Notifications'
import Webinars         from './pages/Webinars'
import MyCourse         from './pages/MyCourse'
import TodaysTask       from './pages/TodaysTask'
import PsychometricTest from './pages/PsychometricTest'
import TestResults      from './pages/TestResults'

export default function App() {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<Navigate to="/signin" replace />} />

      {/* ── Guest-only routes ────────────────────────────── */}
      <Route path="/signin"         element={<GuestGuard><SignIn /></GuestGuard>} />
      <Route path="/otp-request"    element={<GuestGuard><OTPRequest /></GuestGuard>} />
      <Route path="/otp-verify"     element={<GuestGuard><OTPVerify /></GuestGuard>} />
      <Route path="/login-username" element={<GuestGuard><LoginUsername /></GuestGuard>} />

      {/* ── Protected routes (Flow 3) ────────────────────── */}
      <Route path="/dashboard"         element={<AuthGuard><Dashboard /></AuthGuard>} />
      <Route path="/profile"           element={<AuthGuard><Profile /></AuthGuard>} />
      <Route path="/notifications"     element={<AuthGuard><Notifications /></AuthGuard>} />
      <Route path="/webinars"          element={<AuthGuard><Webinars /></AuthGuard>} />

      {/* ── Protected routes (Flow 4) ────────────────────── */}
      <Route path="/my-course"         element={<AuthGuard><MyCourse /></AuthGuard>} />
      <Route path="/todays-task"       element={<AuthGuard><TodaysTask /></AuthGuard>} />
      <Route path="/psychometric-test" element={<AuthGuard><PsychometricTest /></AuthGuard>} />
      <Route path="/test-results"      element={<AuthGuard><TestResults /></AuthGuard>} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  )
}
