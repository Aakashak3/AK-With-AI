-- Articles Table Schema
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content TEXT, -- Rich text HTML
    image_url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    author_id UUID DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Allow public read-only access to PUBLISHED articles
CREATE POLICY "Allow public read published" ON public.articles
    FOR SELECT USING (status = 'published');

-- 2. Allow admin full access (using the same email check pattern as existing schema)
-- IMPORTANT: Update the email to match your admin email
CREATE POLICY "Allow admin full access" ON public.articles
    FOR ALL USING (auth.jwt() ->> 'email' IN ('aakashnarayanan465@gmail.com', 'admin@akwithai.blog'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
