/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable caching for development
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
}

export default nextConfig
