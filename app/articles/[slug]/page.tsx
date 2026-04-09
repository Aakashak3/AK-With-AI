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
  const { data: article } = await supabase
    .from('articles')
    .select('title, description, image_url')
    .eq('slug', params.slug)
    .single();

  if (!article) return { title: 'Article Not Found' };

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
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!article) {
    notFound();
  }

  return <ArticleDetailClient article={article} />;
}
