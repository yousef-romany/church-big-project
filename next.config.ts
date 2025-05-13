
import type {NextConfig} from 'next';
import withPWAInit from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
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
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  // For App Router, ensure that the service worker is generated correctly.
  // Additional configurations might be needed based on specific caching requirements.
  // More info: https://www.npmjs.com/package/next-pwa
});

export default withPWA(nextConfig);
