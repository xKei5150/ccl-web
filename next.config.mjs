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
  }

export default withPayload(nextConfig);
