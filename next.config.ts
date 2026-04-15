import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.trycloudflare.com'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Allow Cloudinary images/videos
      },
    ],
  },

  experimental: {
    // Increase the request body size limit (e.g., 100MB)
    middlewareClientMaxBodySize: 100 * 1024 * 1024,
  },
};

export default nextConfig;
