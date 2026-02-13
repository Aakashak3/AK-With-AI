import { Metadata } from 'next';
import YouTubeClient from './YouTubeClient';

export const metadata: Metadata = {
  title: 'AI Tutorials & YouTube Channel',
  description: 'Watch N. Aakash (AK with AI) for fun and easy AI tutorials, tool reviews, and coding challenges on YouTube.',
  alternates: {
    canonical: 'https://akwithai.com/youtube',
  },
};

export default function YouTubePage() {
  return <YouTubeClient />;
}
