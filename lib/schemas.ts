export interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

export interface WebsiteData {
  url: string;
  searchUrl: string;
}

export interface ServiceData {
  name: string;
  url: string;
  areaServed: string[];
  inLanguage: string[];
  description: string;
  answerFirst?: string; // AI Overviews용 간결한 요약
}

export interface FAQItem {
  q: string;
  a: string;
}

export function organizationJsonLd(data: OrganizationData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${data.url}#organization`,
    name: data.name,
    url: data.url,
    logo: data.logo,
    sameAs: data.sameAs || [],
    description: 'AI-powered B2B export platform providing complete solutions for global businesses',
    foundingDate: '2024',
    industry: 'Technology',
    numberOfEmployees: '50-200',
  };
}

export function websiteJsonLd(data: WebsiteData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${data.url}#website`,
    url: data.url,
    name: 'TOTARO',
    publisher: {
      '@id': `${data.url}#organization`,
    },
    inLanguage: ['en-US', 'ko-KR', 'ja-JP'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${data.searchUrl}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function serviceJsonLd(data: ServiceData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.name,
    url: data.url,
    areaServed: data.areaServed.map(area => ({
      '@type': 'Country',
      name: area,
    })),
    inLanguage: data.inLanguage,
    description: data.description,
    provider: {
      '@id': `${data.url}#organization`,
    },
    serviceType: 'B2B Export Solutions',
    category: 'Business Services',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
    },
  };
}

export function faqJsonLd(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

// AI Overviews용 Answer-first 블록 생성 함수
export function createAnswerFirstBlock(summary: string, keyPoints: string[]) {
  return {
    '@type': 'AnswerFirst',
    summary,
    keyPoints: keyPoints.map(point => ({
      '@type': 'ListItem',
      text: point,
    })),
  };
}
