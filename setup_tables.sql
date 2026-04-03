-- Copy and run this script in the Supabase Dashboard SQL Editor

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    plan VARCHAR(10) NOT NULL DEFAULT 'free' CHECK (plan IN ('free','paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE psychometric_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trait_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    career_matches JSONB NOT NULL DEFAULT '[]'::jsonb,
    strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
    personality_type TEXT,
    personality_label TEXT,
    overall_score SMALLINT CHECK (overall_score BETWEEN 0 AND 100),
    is_sample BOOLEAN NOT NULL DEFAULT TRUE,
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    total_weeks SMALLINT NOT NULL DEFAULT 6,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    progress_pct SMALLINT NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    last_active_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

CREATE TABLE weeks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    week_number SMALLINT NOT NULL,
    title TEXT NOT NULL,
    is_premium BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(course_id, week_number)
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
    day_number SMALLINT NOT NULL CHECK (day_number BETWEEN 1 AND 7),
    title TEXT NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL DEFAULT 'worksheet' CHECK (type IN ('video','worksheet','pdf','link')),
    resource_url TEXT,
    duration_mins SMALLINT,
    UNIQUE(week_id, day_number)
);

CREATE TABLE task_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(user_id, task_id)
);

CREATE TABLE webinars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    host_name TEXT,
    host_title TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_mins SMALLINT,
    is_premium BOOLEAN NOT NULL DEFAULT TRUE,
    meet_url TEXT
);

CREATE TABLE webinar_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    webinar_id UUID NOT NULL REFERENCES webinars(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(user_id, webinar_id)
);

-- --- ROW LEVEL SECURITY POLICIES ---
-- These policies allow our frontend (client) to select and insert data.

-- 1. Users table (Allow finding by phone and creating new profiles)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert on users" ON users FOR INSERT WITH CHECK (true);

-- 2. Psychometric Results (Allow viewing and saving results)
ALTER TABLE psychometric_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access to results" ON psychometric_results FOR ALL USING (true);

-- 3. Courses, Weeks, Tasks (Public viewing)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public view courses" ON courses FOR SELECT USING (true);

ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public view weeks" ON weeks FOR SELECT USING (true);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public view tasks" ON tasks FOR SELECT USING (true);

-- 4. Enrollments & Completions
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public manage enrollments" ON course_enrollments FOR ALL USING (true);

ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public manage completions" ON task_completions FOR ALL USING (true);

-- 5. Webinars
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public view webinars" ON webinars FOR SELECT USING (true);

ALTER TABLE webinar_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public manage webinar registrations" ON webinar_registrations FOR ALL USING (true);

