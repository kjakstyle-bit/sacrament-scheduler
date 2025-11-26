/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    clientRouterFilterAllowedRate: 0.00000001,
    // Prisma Adapterを外部パッケージとして指定
    serverComponentsExternalPackages: [' @prisma/adapter-pg'],
  }
};

module.exports = nextConfig;