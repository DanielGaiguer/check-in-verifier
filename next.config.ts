/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qzexzngnxpjpervyodzq.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development',
  skipWaiting: true,
})

module.exports = withPWA(nextConfig)