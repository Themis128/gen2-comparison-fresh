/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static site generation
  output: 'export',

  // Disable features that don't work with static export
  trailingSlash: true,

  // Transpile packages
  transpilePackages: ['ogl', '@aws-amplify/ui-react'],

  // Enable compression
  compress: true,

  // === IMAGE OPTIMIZATION ===
  images: {
    unoptimized: true, // Required for static export
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
};

export default nextConfig;
