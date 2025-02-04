import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      reactCompiler: false
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }

export default withPayload(nextConfig);
