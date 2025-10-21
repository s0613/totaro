import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const gptBotPolicy = process.env.GPTBOT_POLICY || 'block';
  
  const rules = [
    {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/api/', '/preview/'],
    },
  ];

  // Add GPTBot rule based on environment variable
  if (gptBotPolicy === 'allow') {
    rules.push({
      userAgent: 'GPTBot',
      allow: ['/'],
      disallow: ['/api/', '/preview/'],
    });
  } else {
    rules.push({
      userAgent: 'GPTBot',
      disallow: ['/'],
    });
  }

  return {
    rules,
    sitemap: 'https://totaro.com/sitemap.xml',
  };
}
