import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Script from 'next/script';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/lib/auth-context';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://akwithai.blog'),
  title: {
    default: 'AK with AI - Full Stack Developer & AI Automation Expert',
    template: '%s | AK with AI'
  },
  description: 'Aakash - Full Stack Developer & AI Automation Expert. Crafting cutting-edge web applications powered by AI. Specializing in automation, prompt engineering, and full-stack development.',
  keywords: ['Aakash', 'AK with AI', 'web development', 'AI automation', 'prompt engineering', 'Next.js', 'full-stack', 'freelance developer'],
  authors: [{ name: 'Aakash' }],
  creator: 'Aakash',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://akwithai.blog',
    siteName: 'AK with AI - Full Stack & AI Automation',
    title: 'AK with AI - Full Stack Developer & AI Automation Expert',
    description: 'Aakash - Full Stack Developer & AI Automation Expert. Crafting cutting-edge web applications powered by AI.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AK with AI - Full Stack, AI Automation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AK with AI - Full Stack Developer & AI Automation Expert',
    description: 'Aakash - Crafting cutting-edge web applications powered by AI.',
    images: ['/og-image.png'],
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
    name: 'Aakash',
    url: 'https://akwithai.blog',
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

  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-W13PBC2WRG';

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
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${gaId}');
          `}
        </Script>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
