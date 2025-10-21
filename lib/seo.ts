import { Metadata } from 'next';

export type Locale = 'en' | 'ko' | 'jp';

export interface SEOConfig {
  basePath: string;
  locale: Locale;
  title?: string;
  description?: string;
  keywords?: string[];
}

export function buildSEO(
  basePath: string,
  locale: Locale,
  options?: Partial<SEOConfig>
): Metadata {
  const metadataBase = new URL('https://totaro.com');
  
  // Locale-specific configurations
  const localeConfig = {
    en: {
      title: 'TOTARO - Complete B2B Export Solutions',
      description: 'AI-powered B2B export platform: websites, AEO/SEO/GEO, targeted marketing, and buyer management. Transform your global business.',
      keywords: ['B2B export', 'AI export platform', 'global marketing', 'buyer management', 'AEO', 'SEO', 'GEO'],
      hreflang: 'en-US',
      path: '/',
    },
    ko: {
      title: 'TOTARO - 완전한 B2B 수출 솔루션',
      description: 'AI 기반 B2B 수출 플랫폼: 웹사이트, AEO/SEO/GEO, 타겟 마케팅, 바이어 관리. 글로벌 비즈니스를 혁신하세요.',
      keywords: ['B2B 수출', 'AI 수출 플랫폼', '글로벌 마케팅', '바이어 관리', 'AEO', 'SEO', 'GEO'],
      hreflang: 'ko-KR',
      path: '/ko',
    },
    jp: {
      title: 'TOTARO - 完全なB2B輸出ソリューション',
      description: 'AI搭載B2B輸出プラットフォーム：ウェブサイト、AEO/SEO/GEO、ターゲットマーケティング、バイヤー管理。グローバルビジネスを変革。',
      keywords: ['B2B輸出', 'AI輸出プラットフォーム', 'グローバルマーケティング', 'バイヤー管理', 'AEO', 'SEO', 'GEO'],
      hreflang: 'ja-JP',
      path: '/jp',
    },
  };

  const config = localeConfig[locale];
  const fullPath = `${metadataBase.origin}${config.path}`;

  return {
    metadataBase,
    title: options?.title || config.title,
    description: options?.description || config.description,
    keywords: options?.keywords || config.keywords,
    authors: [{ name: 'TOTARO' }],
    alternates: {
      canonical: fullPath,
      languages: {
        'en': '/',
        'ko': '/ko',
        'ja': '/jp',
        'x-default': '/',
      },
    },
    openGraph: {
      type: 'website',
      locale: config.hreflang,
      url: fullPath,
      siteName: 'TOTARO',
      title: options?.title || config.title,
      description: options?.description || config.description,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'TOTARO - Complete B2B Export Solutions',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: options?.title || config.title,
      description: options?.description || config.description,
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
