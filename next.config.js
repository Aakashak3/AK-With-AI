/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    domains: ['uonhtwihplrrkczjtbmj.supabase.co'],
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            // Removed 'unsafe-eval' for better security. Using 'unsafe-inline' for Next.js compatibility.
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: wss://uonhtwihplrrkczjtbmj.supabase.co uonhtwihplrrkczjtbmj.supabase.co; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;