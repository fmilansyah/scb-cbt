const runtimeCaching = require("next-pwa/cache");

const withPWA = require('next-pwa')({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/manifest.json$/]
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
