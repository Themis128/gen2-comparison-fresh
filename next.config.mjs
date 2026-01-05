/** @type {import('next').NextConfig} */
const nextConfig = {
  // === CRITICAL: Standalone output for Amplify SSR ===
  output: 'standalone',

  // === TURBOPACK OPTIMIZATIONS ===
  // === TURBOPACK CONFIG (moved from experimental.turbo) ===
  turbopack: {
    resolveAlias: {
      '@': './src',
      '@/components': './src/components',
      '@/lib': './src/lib',
      '@/hooks': './src/hooks',
      '@/styles': './src/styles',
    },
  },

  experimental: {
    // Faster CSS processing
    optimizeCss: true,
    // Optimistic client cache
    optimisticClientCache: true,
    // Server actions optimization
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Reduce trace size for faster builds
    outputFileTracingRoot: process.cwd(),
    outputFileTracingIncludes: {
      '/': ['./amplify_outputs.json'],
    },
  },

  // Transpile packages
  transpilePackages: ['ogl', '@aws-amplify/ui-react'],

  // Enable compression
  compress: true,

  // === IMAGE OPTIMIZATION ===
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    // Disable image optimization in dev for speed
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // === BUILD OPTIMIZATIONS ===
  productionBrowserSourceMaps: false,
  reactStrictMode: true,

  // Optimize build speed
  swcMinify: true,

  // Faster builds - skip type checking (do it separately)
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // Run lint separately for speed
  },

  // Reduce bundle size
  poweredByHeader: false,
  generateEtags: false,

  // === WEBPACK OPTIMIZATIONS (for non-turbo builds) ===
  webpack: (config, { dev, isServer }) => {
    // Faster rebuilds in development
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next', '**/.amplify'],
      };
    }

    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            amplify: {
              test: /[\\/]node_modules[\\/](@aws-amplify|aws-amplify)[\\/]/,
              name: 'amplify',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };
    }

    return config;
  },

  // === CACHING HEADERS ===
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif|woff|woff2)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
