/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['picsum.photos'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qzexzngnxpjpervyodzq.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig