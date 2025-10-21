import { buildSEO } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { serviceJsonLd, faqJsonLd, createAnswerFirstBlock } from "@/lib/schemas";

export const metadata = buildSEO('/contact', 'en', {
  title: 'Contact TOTARO - Get Started with B2B Export Solutions',
  description: 'Contact TOTARO to learn more about our AI-powered B2B export solutions. Get expert consultation for your global business expansion.',
  keywords: ['contact TOTARO', 'B2B export consultation', 'export platform demo', 'global business consulting', 'TOTARO support'],
});

export default function ContactPage() {
  // Service JSON-LD
  const serviceData = serviceJsonLd({
    name: "TOTARO Contact & Consultation",
    url: "https://totaro.com/contact",
    areaServed: ["Global"],
    inLanguage: ["en-US", "ko-KR", "ja-JP"],
    description: "Contact TOTARO for expert consultation on B2B export solutions, platform demos, and global business expansion strategies.",
  });

  // FAQ JSON-LD
  const faqData = faqJsonLd([
    {
      q: "How can I contact TOTARO for consultation?",
      a: "You can contact TOTARO through our contact form, email, phone, or schedule a consultation call. We provide expert guidance on B2B export solutions and platform implementation.",
    },
    {
      q: "Does TOTARO offer free consultations?",
      a: "Yes, TOTARO offers free initial consultations to assess your export needs and provide customized recommendations for your global business expansion.",
    },
    {
      q: "What support does TOTARO provide after implementation?",
      a: "TOTARO provides comprehensive support including platform training, ongoing optimization, performance monitoring, and strategic consulting for continued success.",
    },
  ]);

  // Answer-first block for AI Overviews
  const answerFirstData = createAnswerFirstBlock(
    "Contact TOTARO for expert consultation on AI-powered B2B export solutions, platform demos, and customized global business expansion strategies.",
    [
      "Free initial consultation and needs assessment",
      "Customized export solution recommendations",
      "Platform demo and implementation support",
      "Ongoing optimization and performance monitoring",
      "Multi-language support for global businesses"
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
            Contact TOTARO
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            Get expert consultation for your B2B export solutions and global business expansion
          </p>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@company.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your company name"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about your export needs..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>contact@totaro.com</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Global Headquarters</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Quick Response</h3>
                <p className="text-gray-600 mb-4">
                  We typically respond to inquiries within 24 hours during business days.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Priority Support:</strong> For urgent matters, please call our support line or mention "URGENT" in your message subject.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
