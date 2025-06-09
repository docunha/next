import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  //   experimental: {
  //   ppr: 'incremental'
  // }
  images: {
    remotePatterns: [
      {
        // hostname: '*.ufs.sh',
        protocol: 'https',
        // hostname: '**.ufs.sh',
        hostname: '*.ufs.sh',
        port: '',
        // pathname: '/my-bucket/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
