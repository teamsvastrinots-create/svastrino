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
