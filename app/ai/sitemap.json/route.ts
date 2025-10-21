import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://koreanacorn.com';
  const generatedAt = new Date().toISOString();

  const data = {
    version: '1.0',
    generatedAt,
    site: {
      name: 'Korean Acorn',
      url: baseUrl,
      description: 'Premium Korean products and services',
    },
    entities: [
      {
        id: 'korean-acorn-org',
        type: 'Organization',
        name: 'Korean Acorn',
        url: baseUrl,
        description: 'Premium Korean products and services provider',
        sameAs: [
          'https://www.facebook.com/koreanacorn',
          'https://www.instagram.com/koreanacorn',
          'https://twitter.com/koreanacorn',
        ],
      },
    ],
    pages: [
      {
        url: baseUrl,
        title: 'Korean Acorn - Premium Korean Products',
        description: 'Discover premium Korean products and services. Quality guaranteed.',
        language: 'ko-KR',
        lastModified: generatedAt,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/us`,
        title: 'Korean Acorn - Premium Korean Products USA',
        description: 'Premium Korean products delivered to the USA. Fast shipping, quality guaranteed.',
        language: 'en-US',
        lastModified: generatedAt,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/ca`,
        title: 'Korean Acorn - Premium Korean Products Canada',
        description: 'Premium Korean products delivered to Canada. Fast shipping, quality guaranteed.',
        language: 'en-CA',
        lastModified: generatedAt,
        priority: 0.8,
      },
    ],
    faqs: [
      {
        question: 'What products does Korean Acorn offer?',
        answer: 'Korean Acorn offers premium Korean products including cosmetics, food items, traditional goods, and cultural products.',
        url: baseUrl,
        language: 'ko-KR',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to the United States, Canada, and other countries worldwide with fast and reliable shipping.',
        url: baseUrl,
        language: 'ko-KR',
      },
      {
        question: 'What is your quality guarantee?',
        answer: 'We guarantee 100% authentic Korean products with quality assurance and customer satisfaction guarantee.',
        url: baseUrl,
        language: 'ko-KR',
      },
      {
        question: 'How long does shipping take to the USA?',
        answer: 'Standard shipping to the USA takes 7-14 business days, with express shipping available for 3-5 business days.',
        url: `${baseUrl}/us`,
        language: 'en-US',
      },
      {
        question: 'Do you offer free shipping to the USA?',
        answer: 'Yes, we offer free shipping on orders over $75 to the USA.',
        url: `${baseUrl}/us`,
        language: 'en-US',
      },
      {
        question: 'How long does shipping take to Canada?',
        answer: 'Standard shipping to Canada takes 10-15 business days, with express shipping available for 5-7 business days.',
        url: `${baseUrl}/ca`,
        language: 'en-CA',
      },
    ],
  };

  return NextResponse.json(data, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
