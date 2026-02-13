import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/lib/auth-context';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://akwithai.com'),
  title: {
    default: 'AK with AI - Full Stack Developer & AI Automation Expert',
    template: '%s | AK with AI'
  },
  description: 'N. Aakash - Crafting cutting-edge web applications powered by AI. Specializing in automation, prompt engineering, and full-stack development.',
  keywords: ['N. Aakash', 'AK with AI', 'web development', 'AI automation', 'prompt engineering', 'Next.js', 'full-stack', 'freelance developer'],
  authors: [{ name: 'N. Aakash' }],
  creator: 'N. Aakash',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://akwithai.com',
    siteName: 'AK with AI Portfolio',
    title: 'AK with AI - Full Stack Developer & AI Automation Expert',
    description: 'N. Aakash - Crafting cutting-edge web applications powered by AI.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AK with AI Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AK with AI - Full Stack Developer & AI Automation Expert',
    description: 'N. Aakash - Crafting cutting-edge web applications powered by AI.',
    creator: '@akwithai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'N. Aakash',
    url: 'https://akwithai.com',
    jobTitle: 'Full Stack Developer & AI Automation Expert',
    sameAs: [
      'https://youtube.com/@akwithai',
      'https://github.com/akwithai',
      // Add other social links here
    ],
    knowsAbout: [
      'Web Development',
      'Artificial Intelligence',
      'Prompt Engineering',
      'Automation',
      'React',
      'Next.js'
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#09090b" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
