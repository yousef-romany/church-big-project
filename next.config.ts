
import type {NextConfig} from 'next';
import withPWAInit from 'next-pwa';
import runtimeCaching from 'next-pwa/cache';

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
  disable: false, // Explicitly enable PWA in all environments for testing install prompt
  runtimeCaching, // Added for better caching strategies
  buildExcludes: [/middleware-manifest\.json$/], // Recommended for App Router
  // For App Router, ensure that the service worker is generated correctly.
  // Additional configurations might be needed based on specific caching requirements.
  // More info: https://www.npmjs.com/package/next-pwa
});

export default withPWA(nextConfig);

