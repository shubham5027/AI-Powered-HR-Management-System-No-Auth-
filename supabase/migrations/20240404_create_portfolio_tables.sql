
-- Table for storing candidate certifications
CREATE TABLE IF NOT EXISTS public.candidate_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  cert_name TEXT NOT NULL,
  issuer TEXT,
  issue_date DATE,
  cert_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add portfolio-related columns to candidates table
ALTER TABLE public.candidates 
ADD COLUMN IF NOT EXISTS githubUrl TEXT,
ADD COLUMN IF NOT EXISTS linkedinUrl TEXT,
ADD COLUMN IF NOT EXISTS projectUrls TEXT[],
ADD COLUMN IF NOT EXISTS portfolio_score INTEGER,
ADD COLUMN IF NOT EXISTS github_score INTEGER,
ADD COLUMN IF NOT EXISTS linkedin_score INTEGER,
ADD COLUMN IF NOT EXISTS cert_score INTEGER,
ADD COLUMN IF NOT EXISTS project_score INTEGER;

-- Create table for project evaluations
CREATE TABLE IF NOT EXISTS public.candidate_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  project_url TEXT NOT NULL,
  name TEXT,
  description TEXT,
  technologies TEXT[],
  relevance_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.candidate_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for certifications
CREATE POLICY "Anyone can view certifications" 
  ON public.candidate_certifications FOR SELECT 
  USING (true);
  
CREATE POLICY "Anyone can insert certifications" 
  ON public.candidate_certifications FOR INSERT 
  WITH CHECK (true);
  
CREATE POLICY "Anyone can update certifications" 
  ON public.candidate_certifications FOR UPDATE 
  USING (true);

-- Create RLS policies for projects
CREATE POLICY "Anyone can view projects" 
  ON public.candidate_projects FOR SELECT 
  USING (true);
  
CREATE POLICY "Anyone can insert projects" 
  ON public.candidate_projects FOR INSERT 
  WITH CHECK (true);
  
CREATE POLICY "Anyone can update projects" 
  ON public.candidate_projects FOR UPDATE 
  USING (true);

-- Create storage bucket for certifications
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certifications', 'certifications', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy for certifications
CREATE POLICY "Certification files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certifications');
  
CREATE POLICY "Anyone can upload certification files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'certifications');
