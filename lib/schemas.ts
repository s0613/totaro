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
  };
}

export function websiteJsonLd(data: WebsiteData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${data.url}#website`,
    url: data.url,
    name: 'Korean Acorn',
    publisher: {
      '@id': `${data.url}#organization`,
    },
    inLanguage: ['ko-KR', 'en-US', 'en-CA'],
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
