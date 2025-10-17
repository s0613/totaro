/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 서버 런타임 배포를 위해 정적 export 비활성화
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;
