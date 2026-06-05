-- ==========================================
-- AK-With-AI UNIFIED DATABASE & STORAGE SETUP
-- ==========================================
-- Copy and paste this script into your Supabase SQL Editor (https://supabase.com)
-- to set up all tables, columns, constraints, RLS policies, functions, and storage.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create helper admin check function
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  -- Centralized list of admin emails.
  -- Change/add emails here as needed.
  RETURN auth.jwt() ->> 'email' IN ('aakashnarayanan465@gmail.com', 'admin@akwithai.blog', 'admin@devai.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Create Tables
-- A. Prompt Categories
CREATE TABLE IF NOT EXISTS public.prompt_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- B. Prompts
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    category_id UUID REFERENCES public.prompt_categories(id) ON DELETE CASCADE,
    is_featured BOOLEAN DEFAULT false,
    image_url TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- C. Videos
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    youtube_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration TEXT DEFAULT '0:00',
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- D. Services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2),
    image_url TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E. Messages (Contact form)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- F. Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    demo_url TEXT,
    tags TEXT[] DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- G. Articles
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT, -- Rich text HTML
    image_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    language TEXT DEFAULT 'english' CHECK (language IN ('english', 'tanglish')),
    author_id UUID DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- H. Ads
CREATE TABLE IF NOT EXISTS public.ads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT,
    location TEXT NOT NULL, -- 'youtube_top', 'youtube_bottom', 'prompts_bottom'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 4. Apply Schema Alterations (ensure missing columns exist on existing tables)
DO $$
BEGIN
    -- Prompts table alterations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prompts' AND column_name = 'image_url') THEN
        ALTER TABLE public.prompts ADD COLUMN image_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prompts' AND column_name = 'user_id') THEN
        ALTER TABLE public.prompts ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;

    -- Videos table alterations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'videos' AND column_name = 'user_id') THEN
        ALTER TABLE public.videos ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'videos' AND column_name = 'duration') THEN
        ALTER TABLE public.videos ADD COLUMN duration TEXT DEFAULT '0:00';
    END IF;

    -- Services table alterations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'user_id') THEN
        ALTER TABLE public.services ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'image_url') THEN
        ALTER TABLE public.services ADD COLUMN image_url TEXT;
    END IF;

    -- Messages table alterations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'user_id') THEN
        ALTER TABLE public.messages ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
    -- Ensure user_id is nullable for messages so anyone can fill contact form
    ALTER TABLE public.messages ALTER COLUMN user_id DROP NOT NULL;
END $$;


-- 5. Set up trigger for Articles updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- 6. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;


-- 7. RLS Policies
-- Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "Allow public read" ON public.prompt_categories;
DROP POLICY IF EXISTS "Allow admin write" ON public.prompt_categories;
DROP POLICY IF EXISTS "Allow public read" ON public.prompts;
DROP POLICY IF EXISTS "Allow admin write" ON public.prompts;
DROP POLICY IF EXISTS "Allow public read" ON public.videos;
DROP POLICY IF EXISTS "Allow admin write" ON public.videos;
DROP POLICY IF EXISTS "Allow public read" ON public.services;
DROP POLICY IF EXISTS "Allow admin write" ON public.services;
DROP POLICY IF EXISTS "Allow public read on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow admin manage projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public read published" ON public.articles;
DROP POLICY IF EXISTS "Allow admin full access" ON public.articles;
DROP POLICY IF EXISTS "Allow public read ads" ON public.ads;
DROP POLICY IF EXISTS "Allow admin manage ads" ON public.ads;
DROP POLICY IF EXISTS "Allow anyone to insert messages" ON public.messages;
DROP POLICY IF EXISTS "Allow admin read messages" ON public.messages;
DROP POLICY IF EXISTS "Allow admin delete messages" ON public.messages;

-- A. Prompt Categories Policies
CREATE POLICY "Allow public read" ON public.prompt_categories FOR SELECT USING (true);
CREATE POLICY "Allow admin write" ON public.prompt_categories FOR ALL USING (is_admin());

-- B. Prompts Policies
CREATE POLICY "Allow public read" ON public.prompts FOR SELECT USING (true);
CREATE POLICY "Allow admin write" ON public.prompts FOR ALL USING (is_admin());

-- C. Videos Policies
CREATE POLICY "Allow public read" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Allow admin write" ON public.videos FOR ALL USING (is_admin());

-- D. Services Policies
CREATE POLICY "Allow public read" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow admin write" ON public.services FOR ALL USING (is_admin());

-- E. Projects Policies
CREATE POLICY "Allow public read on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow admin manage projects" ON public.projects FOR ALL USING (is_admin());

-- F. Articles Policies
CREATE POLICY "Allow public read published" ON public.articles FOR SELECT USING (status = 'published');
CREATE POLICY "Allow admin full access" ON public.articles FOR ALL USING (is_admin());

-- G. Ads Policies
CREATE POLICY "Allow public read ads" ON public.ads FOR SELECT USING (true);
CREATE POLICY "Allow admin manage ads" ON public.ads FOR ALL USING (is_admin());

-- H. Messages Policies
CREATE POLICY "Allow anyone to insert messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read messages" ON public.messages FOR SELECT USING (is_admin());
CREATE POLICY "Allow admin delete messages" ON public.messages FOR DELETE USING (is_admin());


-- 8. Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_prompts_category_id ON public.prompts(category_id);
CREATE INDEX IF NOT EXISTS idx_prompts_is_featured ON public.prompts(is_featured);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON public.prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);


-- 9. Setup Storage Buckets and Storage Policies
-- Create 'uploads' and 'articles' buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('uploads', 'uploads', true),
  ('articles', 'articles', true)
ON CONFLICT (id) DO NOTHING;

-- A. 'uploads' bucket policies
DROP POLICY IF EXISTS "Public Access uploads" ON storage.objects;
CREATE POLICY "Public Access uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');

DROP POLICY IF EXISTS "Authenticated upload uploads" ON storage.objects;
CREATE POLICY "Authenticated upload uploads" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'uploads' AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Authenticated update uploads" ON storage.objects;
CREATE POLICY "Authenticated update uploads" ON storage.objects FOR UPDATE WITH CHECK (
  bucket_id = 'uploads' AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Authenticated delete uploads" ON storage.objects;
CREATE POLICY "Authenticated delete uploads" ON storage.objects FOR DELETE USING (
  bucket_id = 'uploads' AND auth.role() = 'authenticated'
);

-- B. 'articles' bucket policies
DROP POLICY IF EXISTS "Public Access articles" ON storage.objects;
CREATE POLICY "Public Access articles" ON storage.objects FOR SELECT USING (bucket_id = 'articles');

DROP POLICY IF EXISTS "Authenticated upload articles" ON storage.objects;
CREATE POLICY "Authenticated upload articles" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'articles' AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Authenticated update articles" ON storage.objects;
CREATE POLICY "Authenticated update articles" ON storage.objects FOR UPDATE WITH CHECK (
  bucket_id = 'articles' AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Authenticated delete articles" ON storage.objects;
CREATE POLICY "Authenticated delete articles" ON storage.objects FOR DELETE USING (
  bucket_id = 'articles' AND auth.role() = 'authenticated'
);

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
