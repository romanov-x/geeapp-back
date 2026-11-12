/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  distDir: process.env.GEEAPP_NEXT_DIST || ".next",
};

export default nextConfig;
