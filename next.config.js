const withPWA = require('next-pwa')({
  dest: "public",
  register: true,
  skipWaiting: true,
})

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    APP_NAME: process.env.APP_NAME,
  },
})

module.exports = nextConfig
