-- MASTER REPAIR SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR TO FIX ALL ISSUES

-- 1. Enable RLS on all tables
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 2. Create Admin Check Function (if not exists)
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user email is in the admin list
  -- You can update the email list here if needed
  RETURN auth.jwt() ->> 'email' IN ('admin@devai.com', 'test@devai.com', 'aakashnarayanan465@gmail.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. PROMPTS POLICIES
DROP POLICY IF EXISTS "Public Read Prompts" ON public.prompts;
CREATE POLICY "Public Read Prompts" ON public.prompts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Prompts" ON public.prompts;
CREATE POLICY "Admin All Prompts" ON public.prompts FOR ALL USING (is_admin());

-- 4. CATEGORIES POLICIES
DROP POLICY IF EXISTS "Public Read Categories" ON public.prompt_categories;
CREATE POLICY "Public Read Categories" ON public.prompt_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Categories" ON public.prompt_categories;
CREATE POLICY "Admin All Categories" ON public.prompt_categories FOR ALL USING (is_admin());

-- 5. VIDEOS POLICIES
DROP POLICY IF EXISTS "Public Read Videos" ON public.videos;
CREATE POLICY "Public Read Videos" ON public.videos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Videos" ON public.videos;
CREATE POLICY "Admin All Videos" ON public.videos FOR ALL USING (is_admin());

-- 6. SERVICES POLICIES
DROP POLICY IF EXISTS "Public Read Services" ON public.services;
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Services" ON public.services;
CREATE POLICY "Admin All Services" ON public.services FOR ALL USING (is_admin());

-- 7. MESSAGES POLICIES
-- Allow anonymous inserts (for Contact Form)
DROP POLICY IF EXISTS "Public Insert Messages" ON public.messages;
CREATE POLICY "Public Insert Messages" ON public.messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Read Messages" ON public.messages;
CREATE POLICY "Admin Read Messages" ON public.messages FOR ALL USING (is_admin());

-- Fixed: Make user_id optional for anonymous messages
ALTER TABLE public.messages ALTER COLUMN user_id DROP NOT NULL;

-- 8. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
