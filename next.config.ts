import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow 127.0.0.1 for local dev (needed for Spotify OAuth local testing)
  // @ts-ignore - The type definition in some Next.js versions might lag behind the actual feature
  allowedDevOrigins: ['127.0.0.1'],
  
  // Allow external images from YouTube and Spotify
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co',
      }
    ],
  },
};

export default nextConfig;
