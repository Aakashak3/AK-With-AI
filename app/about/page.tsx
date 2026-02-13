import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About N. Aakash | Full Stack Developer & AI Expert',
  description: 'Learn about N. Aakash (AK with AI), a passionate Full Stack Developer and AI Automation Expert dedicated to building innovative digital solutions.',
  alternates: {
    canonical: 'https://akwithai.com/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
