import LogoIntro from "./components/LogoIntro";
import Hero from "./components/Hero";
import SignatureFeature from "./components/SignatureFeature";
import ServiceDetails from "./components/ServiceDetails";
import HowItWorks from "./components/HowItWorks";
import UseCases from "./components/UseCases";
import Outcomes from "./components/Outcomes";
import SocialProof from "./components/SocialProof";
import CTAForm from "./components/CTAForm";
import OrderSection from "./components/OrderSection";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import { getContent, type Lang } from "@/lib/i18n";
import { buildSEO } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { serviceJsonLd, faqJsonLd, createAnswerFirstBlock } from "@/lib/schemas";

export const metadata = buildSEO('/', 'en');

export default function Home() {
  const lang = "ko" as Lang;
  const content = getContent(lang);

  // Service JSON-LD
  const serviceData = serviceJsonLd({
    name: "TOTARO Complete B2B Export Solutions",
    url: "https://totaro.com",
    areaServed: ["Global"],
    inLanguage: ["en-US", "ko-KR", "ja-JP"],
    description: "AI-powered B2B export platform providing complete solutions: websites, AEO/SEO/GEO optimization, targeted marketing, and buyer management for global businesses.",
  });

  // FAQ JSON-LD
  const faqData = faqJsonLd([
    {
      q: "What is TOTARO's complete B2B export solution?",
      a: "TOTARO provides AI-powered B2B export solutions including professional websites, AEO/SEO/GEO optimization, targeted marketing campaigns, and comprehensive buyer management tools.",
    },
    {
      q: "How does TOTARO help with global market expansion?",
      a: "TOTARO uses AI to optimize your online presence, identify target markets, create localized content, and manage buyer relationships across multiple countries and languages.",
    },
    {
      q: "What makes TOTARO different from other export platforms?",
      a: "TOTARO combines website development, SEO optimization, targeted marketing, and buyer management in one integrated platform powered by AI for maximum efficiency and results.",
    },
  ]);

  // Answer-first block for AI Overviews
  const answerFirstData = createAnswerFirstBlock(
    "TOTARO is an AI-powered B2B export platform that provides complete solutions for global business expansion, including professional websites, SEO optimization, targeted marketing, and buyer management.",
    [
      "AI-powered website development and optimization",
      "AEO/SEO/GEO optimization for global visibility",
      "Targeted marketing campaigns for international markets",
      "Comprehensive buyer relationship management",
      "Multi-language and multi-country support"
    ]
  );

  return (
    <>
      <JsonLd data={serviceData} />
      <JsonLd data={faqData} />
      <JsonLd data={answerFirstData} />
      
      {/* Logo Intro Animation */}
      <LogoIntro />

      {/* Hero Section */}
      <Hero content={content.hero} lang={lang} />

      {/* Signature Feature - TOTARO 통합 솔루션 시각화 */}
      <SignatureFeature content={content.signatureFeature} />

      {/* Service Details - 각 서비스별 상세 설명 */}
      <ServiceDetails content={content.serviceDetails} />

      {/* How It Works Section */}
      <HowItWorks title={content.howItWorks.title} steps={content.howItWorks.steps} />

      {/* Use Cases Section */}
      <UseCases title={content.useCases.title} cases={content.useCases.cases} />

      {/* Outcomes Section */}
      <Outcomes title={content.outcomes.title} metrics={content.outcomes.metrics} />

      {/* Social Proof - 고객 후기 & 파트너 로고 */}
      <SocialProof content={content.socialProof} lang={lang} />

      {/* Order Section - 웹사이트 구매 주문하기 */}
      <OrderSection lang={lang} />

      {/* CTA Form Section */}
      <CTAForm content={content.cta} />

      {/* FAQ Section */}
      <FAQ title={content.faq.title} items={content.faq.items} />

      {/* Footer */}
      <Footer content={content.footer} />
    </>
  );
}
