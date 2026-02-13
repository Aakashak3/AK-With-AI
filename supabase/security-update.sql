-- Security Update Script for Supabase
-- Run this in your Supabase SQL Editor to secure your database tables

-- 1. Correct the Admin Auth Function
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  -- Centralized admin email list
  RETURN auth.jwt() ->> 'email' = ANY(ARRAY['aakashnarayanan465@gmail.com']);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Secure the Projects Table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to prevent duplicates)
DROP POLICY IF EXISTS "Allow public read on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow admin manage projects" ON public.projects;

-- Allow public to read projects
CREATE POLICY "Allow public read on projects" ON public.projects 
  FOR SELECT USING (true);

-- Allow admin to manage projects (ALL actions)
CREATE POLICY "Allow admin manage projects" ON public.projects 
  FOR ALL USING (is_admin());

-- 3. Verify Other Tables have correct Admin checks
-- Prompts
DROP POLICY IF EXISTS "Allow admin insert prompts" ON public.prompts;
CREATE POLICY "Allow admin insert prompts" ON public.prompts FOR INSERT WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Allow admin update prompts" ON public.prompts;
CREATE POLICY "Allow admin update prompts" ON public.prompts FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Allow admin delete prompts" ON public.prompts;
CREATE POLICY "Allow admin delete prompts" ON public.prompts FOR DELETE USING (is_admin());

-- Services
DROP POLICY IF EXISTS "Allow admin insert services" ON public.services;
CREATE POLICY "Allow admin insert services" ON public.services FOR INSERT WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Allow admin update services" ON public.services;
CREATE POLICY "Allow admin update services" ON public.services FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Allow admin delete services" ON public.services;
CREATE POLICY "Allow admin delete services" ON public.services FOR DELETE USING (is_admin());

-- Videos
DROP POLICY IF EXISTS "Allow admin insert videos" ON public.videos;
CREATE POLICY "Allow admin insert videos" ON public.videos FOR INSERT WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Allow admin update videos" ON public.videos;
CREATE POLICY "Allow admin update videos" ON public.videos FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Allow admin delete videos" ON public.videos;
CREATE POLICY "Allow admin delete videos" ON public.videos FOR DELETE USING (is_admin());

-- Ads (Aligning with new function)
DROP POLICY IF EXISTS "Allow admin manage ads" ON public.ads;
CREATE POLICY "Allow admin manage ads" ON public.ads FOR ALL USING (is_admin());

-- Messages
DROP POLICY IF EXISTS "Allow admin read messages" ON public.messages;
CREATE POLICY "Allow admin read messages" ON public.messages FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Allow admin delete messages" ON public.messages;
CREATE POLICY "Allow admin delete messages" ON public.messages FOR DELETE USING (is_admin());

-- 4. Final Verification
-- Ensure RLS is enabled on all critical tables
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
