-- 1. Update Articles table
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'english' CHECK (language IN ('english', 'tanglish'));

-- 2. Update Videos table
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '0:00';

-- 3. Create Storage Bucket for Articles
-- Run this in the Supabase SQL Editor if you don't have the bucket yet
-- Note: You might need to be an admin to run these storage commands
INSERT INTO storage.buckets (id, name, public) 
VALUES ('articles', 'articles', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage Policies for 'articles' bucket
-- Allow public access to read images
DROP POLICY IF EXISTS "Articles Public Access" ON storage.objects;
CREATE POLICY "Articles Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'articles');

-- Allow authenticated users to upload images
DROP POLICY IF EXISTS "Articles Authenticated Upload" ON storage.objects;
CREATE POLICY "Articles Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'articles' AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update/delete their own images
DROP POLICY IF EXISTS "Articles Authenticated Update" ON storage.objects;
CREATE POLICY "Articles Authenticated Update" ON storage.objects FOR UPDATE WITH CHECK (
  bucket_id = 'articles' AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "Articles Authenticated Delete" ON storage.objects;
CREATE POLICY "Articles Authenticated Delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'articles' AND auth.role() = 'authenticated'
);
