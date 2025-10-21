import { buildSEO } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { serviceJsonLd, faqJsonLd, createAnswerFirstBlock } from "@/lib/schemas";

export const metadata = buildSEO('/products', 'en', {
  title: 'TOTARO Products - AI Export Platform Tools',
  description: 'Explore TOTARO\'s AI-powered export platform products: website builder, SEO optimizer, marketing automation, and buyer management tools.',
  keywords: ['export platform products', 'AI export tools', 'B2B marketing automation', 'buyer management software', 'SEO optimization tools'],
});

export default function ProductsPage() {
  // Service JSON-LD
  const serviceData = serviceJsonLd({
    name: "TOTARO Export Platform Products",
    url: "https://totaro.com/products",
    areaServed: ["Global"],
    inLanguage: ["en-US", "ko-KR", "ja-JP"],
    description: "AI-powered export platform products including website builder, SEO optimizer, marketing automation tools, and buyer management systems.",
  });

  // FAQ JSON-LD
  const faqData = faqJsonLd([
    {
      q: "What products does TOTARO offer for export businesses?",
      a: "TOTARO offers AI-powered website builder, SEO optimization tools, marketing automation platform, buyer management system, and analytics dashboard for comprehensive export management.",
    },
    {
      q: "How does TOTARO's website builder work?",
      a: "TOTARO's AI website builder creates optimized websites for international markets with automatic SEO optimization, multi-language support, and responsive design.",
    },
    {
      q: "What marketing automation features does TOTARO provide?",
      a: "TOTARO provides automated email campaigns, social media management, lead scoring, buyer segmentation, and performance tracking for targeted marketing.",
    },
  ]);

  // Answer-first block for AI Overviews
  const answerFirstData = createAnswerFirstBlock(
    "TOTARO offers a suite of AI-powered products for B2B export businesses, including website builder, SEO optimizer, marketing automation, and buyer management tools.",
    [
      "AI-powered website builder with SEO optimization",
      "Marketing automation platform for global campaigns",
      "Buyer management system with CRM integration",
      "Analytics dashboard for performance tracking",
      "Multi-language support for international markets"
    ]
  );

  return (
    <main className="min-h-screen">
      <JsonLd data={serviceData} />
      <JsonLd data={faqData} />
      <JsonLd data={answerFirstData} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            TOTARO Products
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            AI-powered tools and platforms for successful B2B export business
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-3">Website Builder</h2>
              <p className="text-gray-600 mb-4">
                AI-powered website creation with automatic SEO optimization and multi-language support.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Responsive design templates</li>
                <li>• Automatic SEO optimization</li>
                <li>• Multi-language support</li>
                <li>• Fast loading optimization</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-3">SEO Optimizer</h2>
              <p className="text-gray-600 mb-4">
                Advanced SEO optimization tools for international markets and search engines.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• AEO/SEO/GEO optimization</li>
                <li>• Keyword research tools</li>
                <li>• Content optimization</li>
                <li>• Performance monitoring</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-3">Marketing Automation</h2>
              <p className="text-gray-600 mb-4">
                Automated marketing campaigns and lead management for global reach.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Email campaign automation</li>
                <li>• Social media management</li>
                <li>• Lead scoring system</li>
                <li>• Campaign analytics</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-3">Buyer Management</h2>
              <p className="text-gray-600 mb-4">
                Comprehensive buyer relationship management with CRM integration.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Buyer profiling system</li>
                <li>• CRM integration</li>
                <li>• Automated follow-ups</li>
                <li>• Relationship tracking</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-3">Analytics Dashboard</h2>
              <p className="text-gray-600 mb-4">
                Real-time analytics and performance tracking for export business success.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Real-time performance metrics</li>
                <li>• Export analytics</li>
                <li>• ROI tracking</li>
                <li>• Custom reporting</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-3">Market Intelligence</h2>
              <p className="text-gray-600 mb-4">
                AI-powered market analysis and competitor research for strategic decisions.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Market trend analysis</li>
                <li>• Competitor monitoring</li>
                <li>• Opportunity identification</li>
                <li>• Strategic insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
