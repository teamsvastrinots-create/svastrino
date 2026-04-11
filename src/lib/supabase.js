// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yrwpvekpafzkqowrtloi.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyd3B2ZWtwYWZ6a3Fvd3J0bG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4ODY3MDEsImV4cCI6MjA5MDQ2MjcwMX0.XjantcbriIik1OCzikksTjOfTlIzqodoD4zA85Fw-gY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
