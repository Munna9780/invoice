/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Enable static exports
  trailingSlash: true,
  // Ensure sharp is included in the build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        canvas: false,
        process: false,
        net: false,
        tls: false,
        child_process: false,
        events: false,
        'node:child_process': false,
        'node:crypto': false,
        'node:events': false,
        'node:fs': false,
        'node:path': false,
        'node:process': false,
        'node:stream': false,
        'node:util': false,
        'node:url': false,
        'node:zlib': false,
        'node:http': false,
        'node:https': false,
        'node:assert': false,
        'node:os': false,
        'node:net': false,
        'node:tls': false,
      };
    }
    return config;
  },
  // Add experimental features
  experimental: {
    serverActions: true,
  },
  // Add headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
} 