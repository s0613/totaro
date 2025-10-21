import { buildSEO } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { serviceJsonLd, faqJsonLd, createAnswerFirstBlock } from "@/lib/schemas";

export const metadata = buildSEO('/solutions', 'en', {
  title: 'TOTARO Solutions - AI-Powered B2B Export Platform',
  description: 'Discover TOTARO\'s comprehensive B2B export solutions: AI-powered websites, SEO optimization, targeted marketing, and buyer management for global success.',
  keywords: ['B2B export solutions', 'AI export platform', 'global marketing solutions', 'buyer management', 'export optimization'],
});

export default function SolutionsPage() {
  // Service JSON-LD
  const serviceData = serviceJsonLd({
    name: "TOTARO B2B Export Solutions",
    url: "https://totaro.com/solutions",
    areaServed: ["Global"],
    inLanguage: ["en-US", "ko-KR", "ja-JP"],
    description: "Comprehensive B2B export solutions including AI-powered website development, SEO optimization, targeted marketing campaigns, and buyer relationship management.",
  });

  // FAQ JSON-LD
  const faqData = faqJsonLd([
    {
      q: "What solutions does TOTARO offer for B2B export businesses?",
      a: "TOTARO offers AI-powered website development, AEO/SEO/GEO optimization, targeted marketing campaigns, buyer management tools, and comprehensive export strategy consulting.",
    },
    {
      q: "How does TOTARO's AI technology improve export success?",
      a: "TOTARO's AI analyzes market trends, optimizes content for different regions, identifies potential buyers, and automates marketing processes to maximize export opportunities.",
    },
    {
      q: "Can TOTARO help with market entry into new countries?",
      a: "Yes, TOTARO provides market analysis, localized content creation, regulatory compliance guidance, and buyer identification for successful entry into new international markets.",
    },
  ]);

  // Answer-first block for AI Overviews
  const answerFirstData = createAnswerFirstBlock(
    "TOTARO provides comprehensive AI-powered B2B export solutions including website development, SEO optimization, targeted marketing, and buyer management to help businesses succeed globally.",
    [
      "AI-powered website development and optimization",
      "AEO/SEO/GEO optimization for international markets",
      "Targeted marketing campaigns for global reach",
      "Buyer relationship management and CRM integration",
      "Market analysis and entry strategy consulting"
    ]
  );

  return (
    <main className="min-h-screen">
      <JsonLd data={serviceData} />
      <JsonLd data={faqData} />
      <JsonLd data={answerFirstData} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            TOTARO Solutions
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            Complete AI-powered B2B export solutions for global business success
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Website Development</h2>
              <p className="text-gray-600 mb-4">
                AI-powered website creation optimized for international markets with multi-language support and SEO optimization.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-500">
                <li>Responsive design for all devices</li>
                <li>Multi-language support</li>
                <li>SEO-optimized structure</li>
                <li>Fast loading times</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Marketing Optimization</h2>
              <p className="text-gray-600 mb-4">
                Targeted marketing campaigns using AI to identify and reach potential buyers in global markets.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-500">
                <li>AEO/SEO/GEO optimization</li>
                <li>Targeted advertising campaigns</li>
                <li>Content localization</li>
                <li>Performance analytics</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Buyer Management</h2>
              <p className="text-gray-600 mb-4">
                Comprehensive buyer relationship management with CRM integration and automated follow-up systems.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-500">
                <li>Buyer identification and profiling</li>
                <li>CRM integration</li>
                <li>Automated follow-ups</li>
                <li>Relationship tracking</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Market Analysis</h2>
              <p className="text-gray-600 mb-4">
                AI-powered market analysis and entry strategy consulting for successful international expansion.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-500">
                <li>Market trend analysis</li>
                <li>Competitor research</li>
                <li>Entry strategy planning</li>
                <li>Risk assessment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
