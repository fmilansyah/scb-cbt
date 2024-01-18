const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    APP_NAME: process.env.APP_NAME,
    SOCKET_URL: process.env.SOCKET_URL,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  },
})

module.exports = nextConfig
