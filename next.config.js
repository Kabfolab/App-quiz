/** @type {import('next').NextConfig} */
const nextConfig = {}

const withPWA = require('next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
