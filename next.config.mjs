/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
