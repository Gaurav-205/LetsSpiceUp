import type { NextConfig } from "next";
import crypto from "crypto";

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
    optimizePackageImports: ['axios', 'three', 'gsap'],
    // Enable modern JavaScript output
    esmExternals: true,
  },

  // Production optimizations
  // Disable source maps in production to reduce bundle size (enable only for debugging)
  productionBrowserSourceMaps: false,

  // Compiler options for modern browsers
  compiler: {
    // Remove console.log in production to reduce bundle size
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size for client-side only
    if (!dev && !isServer) {
      
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Separate vendor chunks
            framework: {
              name: 'framework',
              chunks: 'all',
              // Simplified regex for better compatibility
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test(module: { size: () => number; identifier: () => string }) {
                return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier());
              },
              name(module: { identifier: () => string }) {
                const hash = crypto.createHash('sha1');
                hash.update(module.identifier());
                return hash.digest('hex').substring(0, 8);
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            shared: {
              name(_module: unknown, chunks: Array<{ name: string }>) {
                const hash = crypto.createHash('sha1');
                hash.update(chunks.reduce((acc: string, chunk: { name: string }) => acc + chunk.name, ''));
                return hash.digest('hex').substring(0, 8);
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  turbopack: {
    // Empty config to use Turbopack with default settings
    // Browserslist and TypeScript target will handle modern browser targeting
  },
};

export default nextConfig;
