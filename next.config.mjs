/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile packages
  transpilePackages: ['ogl', '@aws-amplify/ui-react'],

  // Enable compression
  compress: true,

  // === IMAGE OPTIMIZATION ===
  images: {
    formats: ['image/webp'],
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // === BUILD OPTIMIZATIONS ===
  productionBrowserSourceMaps: false,
  reactStrictMode: true,

  // Skip linting and type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Reduce bundle size
  poweredByHeader: false,

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
