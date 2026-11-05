/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@synergy/types', '@synergy/shared', '@synergy/validation'],
  experimental: {
    serverComponentsExternalPackages: ['playwright', 'playwright-core'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'playwright', 'playwright-core'];
    }
    return config;
  },
};

export default nextConfig;

