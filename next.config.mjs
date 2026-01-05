/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['@aws-amplify/ui-react'],
  compress: false,
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  reactStrictMode: false,
  swcMinify: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  poweredByHeader: false,
};

export default nextConfig;
