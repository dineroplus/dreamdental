import type { NextConfig } from 'next'
import { PRIMARY_DOMAIN, REDIRECT_DOMAINS } from './src/lib/site'
import { defaultLocale } from './src/i18n/config'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      ...(process.env.NEXT_PUBLIC_S3_PUBLIC_URL
        ? [{ protocol: 'https' as const, hostname: new URL(process.env.NEXT_PUBLIC_S3_PUBLIC_URL).hostname }]
        : []),
    ],
  },

  async redirects() {
    return [
      // Root goes to the main language. Georgian is prefixed like every other
      // locale so there is exactly one canonical URL per page.
      { source: '/', destination: `/${defaultLocale}`, permanent: false },

      // Old Studio URL from the Payload coexistence period.
      { source: '/studio', destination: '/admin', permanent: false },
      { source: '/studio/:path*', destination: '/admin/:path*', permanent: false },

      // Secondary domains 301 to the canonical host, preserving the path.
      ...REDIRECT_DOMAINS.map((domain) => ({
        source: '/:path*',
        has: [{ type: 'host' as const, value: domain }],
        destination: `https://${PRIMARY_DOMAIN}/:path*`,
        permanent: true,
      })),
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
