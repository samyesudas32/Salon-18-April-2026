
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://9000-firebase-orginal-backup-1-1776339999573.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev',
      'https://6000-firebase-orginal-backup-1-1776339999573.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev',
    ],
  }
};

export default nextConfig;
