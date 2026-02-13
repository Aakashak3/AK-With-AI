import { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
    title: 'Privacy Policy | AK with AI',
    description: 'Read our privacy policy to understand how AK with AI collects and protects your data.',
    alternates: {
        canonical: 'https://akwithai.com/privacy',
    },
};

export default function PrivacyPage() {
    return <PrivacyClient />;
}
