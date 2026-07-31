-- Migration: Create job_postings and attachment_applications tables

CREATE TABLE IF NOT EXISTS public.job_postings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT DEFAULT 'Nairobi, Kenya',
  duration TEXT DEFAULT '3 Months',
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  responsibilities TEXT[] DEFAULT '{}',
  slots INT DEFAULT 1,
  deadline TEXT NOT NULL,
  is_open BOOLEAN DEFAULT true,
  posted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attachment_applications (
  id TEXT PRIMARY KEY,
  reference_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  institution TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  qualification_level TEXT NOT NULL,
  position_id TEXT NOT NULL,
  position_title TEXT NOT NULL,
  type TEXT NOT NULL,
  preferred_start_date TEXT,
  duration_months INT DEFAULT 3,
  resume_url TEXT NOT NULL,
  recommendation_letter_url TEXT,
  portfolio_url TEXT,
  cover_note TEXT,
  status TEXT DEFAULT 'Received',
  admin_notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachment_applications ENABLE ROW LEVEL SECURITY;

-- Job Postings RLS Policies
CREATE POLICY "Public read job postings" ON public.job_postings
  FOR SELECT USING (true);

CREATE POLICY "Admin insert job postings" ON public.job_postings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update job postings" ON public.job_postings
  FOR UPDATE USING (true);

CREATE POLICY "Admin delete job postings" ON public.job_postings
  FOR DELETE USING (true);

-- Applications RLS Policies
CREATE POLICY "Public read attachment applications" ON public.attachment_applications
  FOR SELECT USING (true);

CREATE POLICY "Public insert attachment applications" ON public.attachment_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update attachment applications" ON public.attachment_applications
  FOR UPDATE USING (true);

CREATE POLICY "Admin delete attachment applications" ON public.attachment_applications
  FOR DELETE USING (true);
