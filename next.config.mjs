import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '5mb',
      },
    },
  }

export default withPayload(nextConfig);
