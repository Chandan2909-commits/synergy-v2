/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@synergy/types', '@synergy/shared', '@synergy/validation'],
};

export default nextConfig;

