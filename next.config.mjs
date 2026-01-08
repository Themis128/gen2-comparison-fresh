// import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // Transpile AWS Amplify packages for compatibility
  transpilePackages: [
    '@aws-amplify/core',
    '@aws-amplify/api',
    '@aws-amplify/auth',
    '@aws-amplify/datastore',
    'aws-amplify',
    '@tanstack/react-query',
    '@tanstack/query-core',
    'lucide-react',
    'date-fns',
    'clsx',
    'tailwind-merge',
    'class-variance-authority',
    'next',
    'react',
    'react-dom',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-select',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-badge',
    '@radix-ui/react-button',
    '@radix-ui/react-card',
    '@radix-ui/react-input',
    '@radix-ui/react-label',
    '@radix-ui/react-select',
    '@radix-ui/react-textarea',
    '@radix-ui/react-tabs',
  ],

  // Image optimization settings
  images: {
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
  },

  // Environment variables
  env: {
    PORTFOLIO_ENV: 'production',
  },

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // React strict mode for better development experience
  reactStrictMode: true,

  // Bundle analyzer configuration
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Add bundle analyzer for both client and server
      if (!dev) {
        const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: isServer ? './analyze/server.html' : './analyze/client.html',
            openAnalyzer: false,
          })
        );
      }

      return config;
    },
  }),

  // Turbopack configuration - disabled due to build issues
  // turbopack: {
  //   root: '/home/tbaltzakis/gen2-comparison-fresh',
  // },

  // Experimental features
  experimental: {
    webpackBuildWorker: true,
  },
};

export default withNextIntl(nextConfig);
