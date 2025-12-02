import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Security headers
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://letsspiceup.onrender.com';
    
    // Content Security Policy
    const csp = isProduction ? [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // 'unsafe-eval' needed for Next.js, 'unsafe-inline' for inline scripts
      "style-src 'self' 'unsafe-inline'", // 'unsafe-inline' needed for Tailwind CSS
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' " + apiUrl,
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; ') : '';

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          // Content Security Policy
          ...(isProduction && csp ? [{
            key: 'Content-Security-Policy',
            value: csp
          }] : []),
          // Cross-Origin-Opener-Policy
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          // Cross-Origin-Embedder-Policy (relaxed for compatibility)
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none'
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // React strict mode for better development experience
  reactStrictMode: true,

  // Environment variables validation
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['axios', 'three'],
  },

  // Production optimizations
  productionBrowserSourceMaps: true, // Enable source maps for better debugging in production

  // Compiler options for modern browsers
  compiler: {
    // Remove console.log in production (optional, can help reduce bundle size)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  turbopack: {
    // Empty config to use Turbopack with default settings
    // Browserslist and TypeScript target will handle modern browser targeting
  },
};

export default nextConfig;
