/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Add these settings to ignore ESLint during build
  eslint: {
    // Warning: This ignores all ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
