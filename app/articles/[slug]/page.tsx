import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleDetailClient from './ArticleDetailClient';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: article, error } = await (supabase.from('articles') as any)
    .select('title, description, image_url')
    .ilike('slug', params.slug)
    .single();

  if (error) {
    console.error('Metadata Fetch Error for slug:', params.slug, error);
    return { title: 'Article Not Found' };
  }

  return {
    title: `${article.title} | AK with AI`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: article.image_url ? [{ url: article.image_url }] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  console.log('Fetching article for slug:', params.slug);
  
  const { data: article, error } = await (supabase.from('articles') as any)
    .select('*')
    .ilike('slug', params.slug)
    .single();

  if (error || !article) {
    console.error('Article Fetch Error:', error);
    notFound();
  }

  return <ArticleDetailClient article={article} />;
}
