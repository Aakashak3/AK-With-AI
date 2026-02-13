-- Run this in your Supabase SQL Editor to set up the Ads Management System

-- 1. Create the ads table
CREATE TABLE IF NOT EXISTS public.ads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT,
    location TEXT NOT NULL, -- 'youtube_top', 'youtube_bottom', 'prompts_bottom'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- 3. Create public read policy
CREATE POLICY "Allow public read ads" ON public.ads 
FOR SELECT USING (true);

-- 4. Create admin manage policy
-- Replace 'your-admin@email.com' with your actual admin email
CREATE POLICY "Allow admin manage ads" ON public.ads 
FOR ALL USING (auth.jwt() ->> 'email' = 'aakashnarayanan465@gmail.com');

-- 5. Add image_url to Services table (if not already there)
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS image_url TEXT;
