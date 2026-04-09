import { Metadata } from 'next';
import ArticlesClient from './ArticlesClient';

export const metadata: Metadata = {
  title: 'Latest Articles | AK with AI',
  description: 'Read the latest insights on AI automation, web development, and prompt engineering.',
  alternates: {
    canonical: 'https://akwithai.blog/articles',
  },
};

export default function ArticlesPage() {
  return <ArticlesClient />;
}
