-- Updated Supabase RLS Policies for Admin Access
-- Run this SQL in your Supabase SQL Editor to replace the existing policies

-- Drop existing admin policies
DROP POLICY IF EXISTS "Allow admin write" ON public.prompts;
DROP POLICY IF EXISTS "Allow admin write" ON public.prompt_categories;
DROP POLICY IF EXISTS "Allow admin write" ON public.videos;
DROP POLICY IF EXISTS "Allow admin write" ON public.services;

-- Admin Auth Function (checks if user is admin by email)
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.jwt() ->> 'email' = ANY(ARRAY['admin@devai.com', 'test@devai.com']);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Prompts Policies
-- Allow anyone to read
CREATE POLICY "Allow public read on prompts" ON public.prompts 
  FOR SELECT USING (true);

-- Allow only admin to INSERT
CREATE POLICY "Allow admin insert prompts" ON public.prompts 
  FOR INSERT WITH CHECK (is_admin());

-- Allow only admin to UPDATE
CREATE POLICY "Allow admin update prompts" ON public.prompts 
  FOR UPDATE USING (is_admin()) 
  WITH CHECK (is_admin());

-- Allow only admin to DELETE
CREATE POLICY "Allow admin delete prompts" ON public.prompts 
  FOR DELETE USING (is_admin());

-- Prompt Categories Policies
-- Allow anyone to read
CREATE POLICY "Allow public read on categories" ON public.prompt_categories 
  FOR SELECT USING (true);

-- Allow only admin to INSERT
CREATE POLICY "Allow admin insert categories" ON public.prompt_categories 
  FOR INSERT WITH CHECK (is_admin());

-- Allow only admin to UPDATE
CREATE POLICY "Allow admin update categories" ON public.prompt_categories 
  FOR UPDATE USING (is_admin()) 
  WITH CHECK (is_admin());

-- Allow only admin to DELETE
CREATE POLICY "Allow admin delete categories" ON public.prompt_categories 
  FOR DELETE USING (is_admin());

-- Videos Policies
-- Allow anyone to read
CREATE POLICY "Allow public read on videos" ON public.videos 
  FOR SELECT USING (true);

-- Allow only admin to INSERT
CREATE POLICY "Allow admin insert videos" ON public.videos 
  FOR INSERT WITH CHECK (is_admin());

-- Allow only admin to UPDATE
CREATE POLICY "Allow admin update videos" ON public.videos 
  FOR UPDATE USING (is_admin()) 
  WITH CHECK (is_admin());

-- Allow only admin to DELETE
CREATE POLICY "Allow admin delete videos" ON public.videos 
  FOR DELETE USING (is_admin());

-- Services Policies
-- Allow anyone to read
CREATE POLICY "Allow public read on services" ON public.services 
  FOR SELECT USING (true);

-- Allow only admin to INSERT
CREATE POLICY "Allow admin insert services" ON public.services 
  FOR INSERT WITH CHECK (is_admin());

-- Allow only admin to UPDATE
CREATE POLICY "Allow admin update services" ON public.services 
  FOR UPDATE USING (is_admin()) 
  WITH CHECK (is_admin());

-- Allow only admin to DELETE
CREATE POLICY "Allow admin delete services" ON public.services 
  FOR DELETE USING (is_admin());

-- Messages Policies
-- Allow messages to be sent by anonymous users
ALTER TABLE public.messages ALTER COLUMN user_id DROP NOT NULL;

-- Allow anyone to INSERT messages (from contact form)
CREATE POLICY "Allow anyone to insert messages" ON public.messages 
  FOR INSERT WITH CHECK (true);

-- Allow only admin to read messages
CREATE POLICY "Allow admin read messages" ON public.messages 
  FOR SELECT USING (is_admin());

-- Allow only admin to delete messages
CREATE POLICY "Allow admin delete messages" ON public.messages 
  FOR DELETE USING (is_admin());

-- Create indexes for better performance
CREATE INDEX idx_auth_jwt_email ON public.prompts USING HASH ((auth.jwt() ->> 'email'));
