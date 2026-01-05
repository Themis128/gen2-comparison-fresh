/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Amplify hosting
  output: 'export',
  trailingSlash: true,

  // Transpile packages
  transpilePackages: ['ogl', '@aws-amplify/ui-react'],

  // Enable compression
  compress: true,

  // === IMAGE OPTIMIZATION ===
  images: {
    formats: ['image/webp'],
  },

  // === BUILD OPTIMIZATIONS ===
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  swcMinify: true,

  // Skip linting and type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Reduce bundle size
  poweredByHeader: false,

  // Experimental optimizations for faster builds
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', '@radix-ui/react-dialog', 'framer-motion', 'lucide-react'],
    serverMinification: false,
    turbo: {
      memoryLimit: 4096
    }
  },
};

export default nextConfig;
