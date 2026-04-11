# Supabase Phase 1 Setup Guide

This guide covers exactly how to set up your Supabase backend to handle exactly what we designed: **Phone OTP Authentication -> Database Storage -> Dashboard Rendering**.

## Step 1: Create Your Supabase Project
1. Go to [database.new](https://database.new) (Supabase's instant project creator).
2. Sign in with GitHub or Email.
3. Click **New Project**, select your organization, and name it `Svastrino-Phase-1`.
4. Create a strong database password (save this somewhere safe).
5. Choose a region closest to your users (e.g., Mumbai, India) and click **Create New Project**. It will take a minute or two to provision.

## Step 2: Enable Phone Authentication
Supabase handles passwords securely, but you need to tell it *how* to send the SMS to the user.
1. In the Supabase Dashboard, look at the left-hand menu and click **Authentication** (the padlock icon).
2. Go to **Providers** under Configuration.
3. Scroll down to **Phone** and toggle it **Enabled**.
4. **Choose an SMS Provider**: You will need a 3rd-party service to actually send the texts. (Twilio is the most popular, Msg91 is great for India).
   - *For Testing:* You can actually skip a real provider right now. Scroll to the bottom and enable **Enable Phone Confirmations**. Then, under **Test OTPs**, you can enter your own phone number and hardcode a fake OTP (like `123456`) so you can test the frontend without paying for actual text messages!

## Step 3: Create Your Database Architecture
Now we build the 7 tables we discussed.
1. In the left-hand menu, click **SQL Editor** (`</>` icon).
2. Click **New Query**.
3. Paste the following Phase 1 Setup Script and click **Run**:

```sql
-- 1. Create Profiles Extension
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  phone_number text unique not null,
  subscription_tier text default 'freemium' check (subscription_tier in ('freemium', 'premium')),
  test_language text default 'english' check (test_language in ('english', 'hindi')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Psychometric Test Results Table
create table public.psychometric_tests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  external_api_id text,
  status text default 'completed',
  raw_scores jsonb,
  top_careers jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Course Enrollments Table
create table public.course_enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  current_week integer default 1,
  progress_percentage integer default 0,
  unlocked_modules integer[] default '{1}'
);

-- Enable Row Level Security (RLS) so users can only see their own data
alter table public.profiles enable row level security;
alter table public.psychometric_tests enable row level security;
alter table public.course_enrollments enable row level security;

-- Create Policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can view own tests" on psychometric_tests for select using (auth.uid() = user_id);
create policy "Users can view own courses" on course_enrollments for select using (auth.uid() = user_id);
```

## Step 4: Connect Your Frontend HTML Pages
Now we need to link your local HTML files to this live database.
1. In Supabase, go to **Project Settings** (the gear icon at the bottom left) -> **API**.
2. Copy your **Project URL** and your **anon `public` key**.
3. Inside your `psychometric-test.html` and other files, you will add the Supabase library to the `<head>` section:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

## Step 5: Write the JavaScript Flow
At the bottom of your HTML file, you initialize the connection and write the OTP logic. Here is the exact snippet you'll use when the user clicks "Start Test" and finishes:

```javascript
// 1. Initialize Supabase
const supabaseUrl = 'YOUR_URL_HERE';
const supabaseKey = 'YOUR_ANON_KEY_HERE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. Function to Send OTP (Triggered when user enters phone in the popup)
async function sendOTP(phoneNumber) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phoneNumber,
  });
  if (error) console.error("Error sending OTP", error);
  else console.log("OTP Sent Successfully!");
}

// 3. Function to Verify OTP (Triggered when user types the 6 digits)
async function verifyOTP(phoneNumber, otpCode, testScoreJSON) {
  const { data: { session }, error } = await supabase.auth.verifyOtp({
    phone: phoneNumber,
    token: otpCode,
    type: 'sms',
  });

  if (session) {
    // 4. Success! Now instantly push their test score safely
    await supabase.from('psychometric_tests').insert([
      { 
        user_id: session.user.id, 
        raw_scores: testScoreJSON 
      }
    ]);
    
    // Redirect to Dashboard
    window.location.href = 'my-test-results.html';
  }
}
```

### What's Next?
Once you complete Steps 1 and 2 in your Supabase account, let me know! We can start actually pasting Step 4 and Step 5 directly into your `psychometric-test.html` file right now.
