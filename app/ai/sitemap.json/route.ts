import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://totaro.com';
  const generatedAt = new Date().toISOString();

  const data = {
    version: '1.0',
    generatedAt,
    site: {
      name: 'TOTARO',
      url: baseUrl,
      description: 'AI-powered B2B export platform providing complete solutions for global businesses',
    },
    entities: [
      {
        id: 'totaro-org',
        type: 'Organization',
        name: 'TOTARO',
        url: baseUrl,
        description: 'AI-powered B2B export platform providing complete solutions for global businesses',
        sameAs: [
          'https://www.linkedin.com/company/totaro',
          'https://twitter.com/totaro_ai',
          'https://github.com/totaro-ai',
        ],
        industry: 'Technology',
        foundingDate: '2024',
        numberOfEmployees: '50-200',
      },
    ],
    pages: [
      {
        url: baseUrl,
        title: 'TOTARO - Complete B2B Export Solutions',
        description: 'AI-powered B2B export platform: websites, AEO/SEO/GEO, targeted marketing, and buyer management. Transform your global business.',
        language: 'en-US',
        lastModified: generatedAt,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/solutions`,
        title: 'TOTARO Solutions - AI-Powered B2B Export Platform',
        description: 'Discover TOTARO\'s comprehensive B2B export solutions: AI-powered websites, SEO optimization, targeted marketing, and buyer management for global success.',
        language: 'en-US',
        lastModified: generatedAt,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/products`,
        title: 'TOTARO Products - AI Export Platform Tools',
        description: 'Explore TOTARO\'s AI-powered export platform products: website builder, SEO optimizer, marketing automation, and buyer management tools.',
        language: 'en-US',
        lastModified: generatedAt,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        title: 'Contact TOTARO - Get Started with B2B Export Solutions',
        description: 'Contact TOTARO to learn more about our AI-powered B2B export solutions. Get expert consultation for your global business expansion.',
        language: 'en-US',
        lastModified: generatedAt,
        priority: 0.7,
      },
    ],
    faqs: [
      {
        question: 'What is TOTARO\'s complete B2B export solution?',
        answer: 'TOTARO provides AI-powered B2B export solutions including professional websites, AEO/SEO/GEO optimization, targeted marketing campaigns, and comprehensive buyer management tools.',
        url: baseUrl,
        language: 'en-US',
      },
      {
        question: 'How does TOTARO help with global market expansion?',
        answer: 'TOTARO uses AI to optimize your online presence, identify target markets, create localized content, and manage buyer relationships across multiple countries and languages.',
        url: baseUrl,
        language: 'en-US',
      },
      {
        question: 'What makes TOTARO different from other export platforms?',
        answer: 'TOTARO combines website development, SEO optimization, targeted marketing, and buyer management in one integrated platform powered by AI for maximum efficiency and results.',
        url: baseUrl,
        language: 'en-US',
      },
      {
        question: 'What solutions does TOTARO offer for B2B export businesses?',
        answer: 'TOTARO offers AI-powered website development, AEO/SEO/GEO optimization, targeted marketing campaigns, buyer management tools, and comprehensive export strategy consulting.',
        url: `${baseUrl}/solutions`,
        language: 'en-US',
      },
      {
        question: 'How does TOTARO\'s AI technology improve export success?',
        answer: 'TOTARO\'s AI analyzes market trends, optimizes content for different regions, identifies potential buyers, and automates marketing processes to maximize export opportunities.',
        url: `${baseUrl}/solutions`,
        language: 'en-US',
      },
      {
        question: 'What products does TOTARO offer for export businesses?',
        answer: 'TOTARO offers AI-powered website builder, SEO optimization tools, marketing automation platform, buyer management system, and analytics dashboard for comprehensive export management.',
        url: `${baseUrl}/products`,
        language: 'en-US',
      },
      {
        question: 'How can I contact TOTARO for consultation?',
        answer: 'You can contact TOTARO through our contact form, email, phone, or schedule a consultation call. We provide expert guidance on B2B export solutions and platform implementation.',
        url: `${baseUrl}/contact`,
        language: 'en-US',
      },
      {
        question: 'Does TOTARO offer free consultations?',
        answer: 'Yes, TOTARO offers free initial consultations to assess your export needs and provide customized recommendations for your global business expansion.',
        url: `${baseUrl}/contact`,
        language: 'en-US',
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
