import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '10mb',
      },
    },
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '3000',
          pathname: '/api/media/file/**',
        },
        {
          protocol: 'https',
          hostname: 'ccl-web-theta.vercel.app',
          pathname: '/api/media/file/**',
        },
        {
          protocol: 'https',
          hostname: '**.vercel.app',
          pathname: '/api/media/file/**',
        },
      ],
    },
    
  }

export default withPayload(nextConfig);
