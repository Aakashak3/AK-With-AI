import { Metadata } from 'next';
import PromptsClient from './PromptsClient';

export const metadata: Metadata = {
  title: 'AI Prompts Library | ChatGPT, Claude & Midjourney',
  description: 'Explore a professional collection of AI prompts for ChatGPT, Claude, and Midjourney. Boost your productivity with custom-engineered prompts.',
  alternates: {
    canonical: 'https://akwithai.com/prompts',
  },
};

export default function PromptsPage() {
  return <PromptsClient />;
}
