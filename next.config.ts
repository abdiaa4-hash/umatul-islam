import type { NextConfig } from "next";

const securityHeaders = [
  // Force HTTPS — browsers remember this for 2 years after first visit
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Prevent clickjacking — page can't be embedded in an iframe on another site
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // Stop browsers from guessing the content type (XSS vector)
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Don't send referrer info to external sites
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Disable access to camera, mic, location, etc.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  // XSS protection for older browsers
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        // Apply to every route
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  // HTTP → HTTPS redirect handled by vercel.json in production
}

export default nextConfig;
