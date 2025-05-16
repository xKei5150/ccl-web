import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '25mb',
      },
    },
    turbopack:{
      
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
          hostname: '**.vercel.app',
          pathname: '/api/media/file/**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '3000',
          pathname: '/api/supporting-documents/file/**',
        },
        {
          protocol: 'https',
          hostname: '**.vercel.app',
          pathname: '/api/supporting-documents/file/**',
        },
      ],
    },
    
  }

export default withPayload(nextConfig);
