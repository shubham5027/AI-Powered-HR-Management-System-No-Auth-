
-- Create an RPC function to save resume data safely
CREATE OR REPLACE FUNCTION public.save_resume_data(
  p_candidate_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_location TEXT,
  p_summary TEXT,
  p_skills TEXT[],
  p_education JSONB,
  p_work_experience JSONB,
  p_certifications TEXT[],
  p_languages TEXT[],
  p_resume_url TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First try to insert the data (will handle if table exists)
  BEGIN
    INSERT INTO public.candidate_resume_data (
      candidate_id,
      name,
      email,
      phone,
      location,
      summary,
      skills,
      education,
      work_experience,
      certifications,
      languages,
      resume_url
    ) VALUES (
      p_candidate_id,
      p_name,
      p_email,
      p_phone,
      p_location,
      p_summary,
      p_skills,
      p_education,
      p_work_experience,
      p_certifications,
      p_languages,
      p_resume_url
    );
  EXCEPTION WHEN OTHERS THEN
    -- Update candidates table as fallback
    UPDATE public.candidates
    SET
      first_name = split_part(p_name, ' ', 1),
      last_name = substring(p_name from position(' ' in p_name) + 1),
      email = p_email,
      phone = p_phone,
      skills = p_skills,
      notes = COALESCE(p_summary, ''),
      resume_url = p_resume_url
    WHERE id = p_candidate_id;
  END;
END;
$$;

-- Create an RPC function to update candidate portfolio safely
CREATE OR REPLACE FUNCTION public.update_candidate_portfolio(
  p_id UUID,
  p_github_url TEXT,
  p_linkedin_url TEXT,
  p_project_urls TEXT[]
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.candidates
  SET
    "githubUrl" = p_github_url,
    "linkedinUrl" = p_linkedin_url,
    "projectUrls" = p_project_urls
  WHERE id = p_id;
END;
$$;
