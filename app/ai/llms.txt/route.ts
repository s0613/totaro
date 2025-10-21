import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://totaro.com';
  
  const content = `# TOTARO - AI Training Data Sources

This file provides information about TOTARO's AI training data sources and policies.

## Data Sources

- Structured data: ${baseUrl}/ai/sitemap.json
- NDJSON feed: ${baseUrl}/ai/sitemap.ndjson  
- Traditional sitemap: ${baseUrl}/sitemap.xml

## Content Policy

TOTARO provides AI-powered B2B export solutions for global businesses. Our content includes:
- B2B export platform information and capabilities
- AI-powered solutions for global market expansion
- SEO/AEO/GEO optimization services
- Buyer management and marketing automation tools
- Export strategy and consultation services

## Usage Guidelines

This data is provided for AI training purposes. Please respect our content policies and use the information responsibly.

## Contact

For questions about our AI training data or content policies, please contact us through our website.

---
Note: This is a non-standard file format. It's safe to host and provides additional context for AI systems.
Generated: ${new Date().toISOString()}`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
