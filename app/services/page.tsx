import { Metadata } from 'next';
import ServicesClient from './ServicesClient';

export const metadata: Metadata = {
  title: 'AI Automation & Full Stack Services',
  description: 'Scalable web applications, AI-powered automation, and custom prompt engineering services by N. Aakash (AK with AI).',
  alternates: {
    canonical: 'https://akwithai.com/services',
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
