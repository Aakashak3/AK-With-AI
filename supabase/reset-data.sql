-- DATA RESET SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Clear existing prompts (to start fresh)
DELETE FROM public.prompts;

-- 2. Reset Categories
-- First, remove existing reference if needed (optional, but safe)
-- Then delete old categories
DELETE FROM public.prompt_categories;

-- 3. Insert New Categories (with slugs)
INSERT INTO public.prompt_categories (name, slug) VALUES 
('Image', 'image'),
('Video', 'video'),
('Coding', 'coding');

-- 4. Verify
SELECT * FROM public.prompt_categories;
