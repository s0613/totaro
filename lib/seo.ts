import { Metadata } from 'next';

export type Locale = 'default' | 'us' | 'ca';

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
  const metadataBase = new URL('https://koreanacorn.com');
  
  // Locale-specific configurations
  const localeConfig = {
    default: {
      title: 'Korean Acorn - Premium Korean Products',
      description: 'Discover premium Korean products and services. Quality guaranteed.',
      keywords: ['Korean products', 'premium', 'quality', 'Korea'],
      hreflang: 'ko-KR',
      path: '/',
    },
    us: {
      title: 'Korean Acorn - Premium Korean Products USA',
      description: 'Premium Korean products delivered to the USA. Fast shipping, quality guaranteed.',
      keywords: ['Korean products USA', 'Korean goods', 'USA shipping', 'Korean culture'],
      hreflang: 'en-US',
      path: '/us',
    },
    ca: {
      title: 'Korean Acorn - Premium Korean Products Canada',
      description: 'Premium Korean products delivered to Canada. Fast shipping, quality guaranteed.',
      keywords: ['Korean products Canada', 'Korean goods', 'Canada shipping', 'Korean culture'],
      hreflang: 'en-CA',
      path: '/ca',
    },
  };

  const config = localeConfig[locale];
  const fullPath = `${metadataBase.origin}${config.path}`;

  return {
    metadataBase,
    title: options?.title || config.title,
    description: options?.description || config.description,
    keywords: options?.keywords || config.keywords,
    authors: [{ name: 'Korean Acorn' }],
    alternates: {
      canonical: fullPath,
      languages: {
        'ko-KR': '/',
        'en-US': '/us',
        'en-CA': '/ca',
        'x-default': '/',
      },
    },
    openGraph: {
      type: 'website',
      locale: config.hreflang,
      url: fullPath,
      siteName: 'Korean Acorn',
      title: options?.title || config.title,
      description: options?.description || config.description,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Korean Acorn',
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
