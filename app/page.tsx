import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'AK with AI - Full Stack Developer & AI Automation Expert',
  description: 'N. Aakash (AK with AI) specializes in building AI-powered web applications and automation solutions. Explore my portfolio and services.',
  alternates: {
    canonical: 'https://akwithai.com',
  },
};

export default function Home() {
  return <HomeClient />;
}
