-- Supabase Database Schema
-- Copy and paste this into your Supabase SQL Editor to set up tables and Row Level Security (RLS)

-- Create Tables

CREATE TABLE public.prompt_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.prompts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    category_id UUID REFERENCES prompt_categories(id) ON DELETE CASCADE,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    youtube_url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)

ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Public Read-Only Policies

CREATE POLICY "Allow public read" ON public.prompts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.prompt_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.services FOR SELECT USING (true);

-- Admin Write Policies
-- IMPORTANT: Replace 'your-admin@email.com' with your actual admin email

CREATE POLICY "Allow admin write" ON public.prompts FOR ALL 
USING (auth.jwt() ->> 'email' = 'your-admin@email.com');

CREATE POLICY "Allow admin write" ON public.prompt_categories FOR ALL 
USING (auth.jwt() ->> 'email' = 'your-admin@email.com');

CREATE POLICY "Allow admin write" ON public.videos FOR ALL 
USING (auth.jwt() ->> 'email' = 'your-admin@email.com');

CREATE POLICY "Allow admin write" ON public.services FOR ALL 
USING (auth.jwt() ->> 'email' = 'your-admin@email.com');

CREATE POLICY "Allow anyone to insert messages" ON public.messages FOR INSERT 
WITH CHECK (true);

-- Create Indexes for Performance

CREATE INDEX idx_prompts_category_id ON public.prompts(category_id);
CREATE INDEX idx_prompts_is_featured ON public.prompts(is_featured);
CREATE INDEX idx_prompts_created_at ON public.prompts(created_at DESC);

--
