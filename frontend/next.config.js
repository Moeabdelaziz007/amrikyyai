/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // GitHub Pages configuration
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/amrikyyai' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/amrikyyai/' : '',
}

module.exports = nextConfig
