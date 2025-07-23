/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ static export

  swcMinify: false, // ✅ prevent memory spikes from aggressive minification

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    // ✅ disable type-checking to reduce memory usage in Amplify
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
