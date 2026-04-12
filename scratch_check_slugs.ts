import { supabase } from './lib/supabase';

async function checkArticles() {
  const { data, error } = await (supabase.from('articles') as any).select('id, title, slug, status');
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Articles:', JSON.stringify(data, null, 2));
}

checkArticles();
