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
    serverActions: {
      allowedOrigins: [
        '6000-firebase-orginal-backup-d-1-1776419707065.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev',
        '9002-firebase-orginal-backup-d-1-1776419707065.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev',
        '1776419707065.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev',
      ],
    },
  },
};

export default nextConfig;
