// src/lib/mockMode.js
// ─────────────────────────────────────────────────────────────────
// MOCK MODE — set to true during local development.
// When true:
//   - OTP send is faked (no real Twilio/WhatsApp call)
//   - Any 4-digit code is accepted as valid
//   - A fake session is set in AuthContext
//   - Supabase inserts (tasks, test results, etc.) are skipped
//   - A floating toggle button appears on protected pages to
//     switch isPremium on/off instantly
//
// To go live: set MOCK_MODE = false here — nothing else changes.
// ─────────────────────────────────────────────────────────────────
export const MOCK_MODE = true
