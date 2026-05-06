/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp']
  },
  async redirects() {
    return [
      // Old per-funnel routes → new consolidated /lifeforce/* paths.
      { source: '/trt', destination: '/lifeforce/trt', permanent: true },
      { source: '/trt/:path*', destination: '/lifeforce/trt/:path*', permanent: true },
      { source: '/menopause', destination: '/lifeforce/menopause', permanent: true },
      { source: '/menopause/:path*', destination: '/lifeforce/menopause/:path*', permanent: true }
    ];
  }
};

module.exports = nextConfig;
