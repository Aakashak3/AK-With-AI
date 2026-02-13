import { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
    title: 'Terms of Service | AK with AI',
    description: 'Terms and conditions for using the AK with AI website and its resources.',
    alternates: {
        canonical: 'https://akwithai.com/terms',
    },
};

export default function TermsPage() {
    return <TermsClient />;
}
