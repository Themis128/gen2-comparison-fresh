import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SSR mode for Amplify Gen 2 full-stack deployment
  // Note: Remove 'output: export' to enable SSR with backend integration
  trailingSlash: true,
  reactStrictMode: true,
  // AWS Amplify specific optimizations
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable Next.js compression for 40-60% faster load times
  generateEtags: true, // Enable etags for better caching control

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@aws-amplify/ui-react', 'lucide-react', '@radix-ui/react-*'], // Optimize Amplify and icon imports
    scrollRestoration: true,
    // Enable modern optimizations
    optimizeCss: true,
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  // Enhanced security headers with performance optimizations
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: *.google-analytics.com *.googletagmanager.com *.googletagmanager.com/gtag/js; style-src 'self' 'unsafe-inline' fonts.googleapis.com rsms.me data:; font-src 'self' fonts.gstatic.com data: https:; img-src 'self' data: https: blob:; connect-src 'self' *.amazonaws.com *.amplifyapp.com ws://localhost:5747 localhost:5746 localhost:5747 localhost:5748 localhost:5749 localhost:5750 region1.google-analytics.com *.google-analytics.com; media-src 'self' data: https: blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Performance headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Accel-Buffering',
            value: 'no'
          }
        ]
      },
      // Static assets caching
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // API routes caching (short-lived for dynamic content)
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600'
          }
        ]
      },
      // Public assets caching
      {
        source: '/public/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=604800'
          }
        ]
      }
    ];
  },

  // Enhanced image optimization for SSR mode
  images: {
    formats: ['image/webp', 'image/avif'], // Modern formats for smaller file sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Component sizes
    minimumCacheTTL: 86400, // 24 hours cache for optimized images
    dangerouslyAllowSVG: false, // Security: disable SVG optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'baltzakisthemis.com',
        port: '',
        pathname: '/**',
      },
      // Allow images from your domain
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_DOMAIN || 'dcwmv1pw85f0j.amplifyapp.com',
        port: '',
        pathname: '/**',
      },
      // Allow AWS S3 and CloudFront
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
        pathname: '/**',
      }
    ],
  },

  // Environment variables that should be available at build time
  env: {
    NEXT_PUBLIC_AMPLIFY_ENV: process.env.AMPLIFY_ENV || 'dev',
    NEXT_PUBLIC_DOMAIN: process.env.AMPLIFY_APP_DOMAIN || 'baltzakisthemis.com',
  },

  // Webpack optimizations for better performance
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Enable webpack optimizations
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic', // Better long-term caching
        chunkIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            amplify: {
              test: /[\\/]node_modules[\\/]@aws-amplify[\\/]/,
              name: 'amplify',
              chunks: 'all',
              priority: 20,
            },
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              chunks: 'all',
              priority: 15,
            },
          },
        },
      };

      // Add compression plugin for better performance
      if (!isServer) {
        config.plugins.push(
          new config.webpack.optimize.ModuleConcatenationPlugin()
        );
      }
    }

    // Development optimizations
    if (dev) {
      // Disable Turbopack in development for stability
      config.experiments = { ...config.experiments, topLevelAwait: false };
    }

    return config;
  },

  // Turbopack config: disabled for stability (using webpack instead)
  // Note: Keeping webpack for better control over optimizations
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
