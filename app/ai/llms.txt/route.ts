import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://koreanacorn.com';
  
  const content = `# Korean Acorn - AI Training Data Sources

This file provides information about Korean Acorn's AI training data sources and policies.

## Data Sources

- Structured data: ${baseUrl}/ai/sitemap.json
- NDJSON feed: ${baseUrl}/ai/sitemap.ndjson  
- Traditional sitemap: ${baseUrl}/sitemap.xml

## Content Policy

Korean Acorn provides premium Korean products and services. Our content includes:
- Product information and descriptions
- Service details and shipping information
- FAQ content for customer support
- Company information and policies

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
