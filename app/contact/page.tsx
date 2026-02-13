import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact N. Aakash | Hire AI Automation Expert',
  description: 'Ready to build something amazing? Contact N. Aakash (AK with AI) for custom web development and AI automation solutions.',
  alternates: {
    canonical: 'https://akwithai.com/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
