/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  // 서버 런타임 배포를 위해 정적 export 비활성화
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.totaro.com',
          },
        ],
        destination: 'https://totaro.com/:path*',
        permanent: true,
      },
    ];
  },
  i18n: {
    locales: ['en', 'ko', 'jp'],
    defaultLocale: 'en',
    localeDetection: false,
  },
};

export default nextConfig;
