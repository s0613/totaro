import LogoIntro from "../components/LogoIntro";
import Hero from "../components/Hero";
import SignatureFeature from "../components/SignatureFeature";
import ServiceDetails from "../components/ServiceDetails";
import HowItWorks from "../components/HowItWorks";
import UseCases from "../components/UseCases";
import Outcomes from "../components/Outcomes";
import SocialProof from "../components/SocialProof";
import CTAForm from "../components/CTAForm";
import OrderSection from "../components/OrderSection";
import Footer from "../components/Footer";
import { getContent, type Lang } from "@/lib/i18n";
import { buildSEO } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { serviceJsonLd, faqJsonLd } from "@/lib/schemas";

export const metadata = buildSEO('/ca', 'ca');

export default function CAPage() {
  const lang = "en" as Lang;
  const content = getContent(lang);

  // Service JSON-LD
  const serviceData = serviceJsonLd({
    name: "Korean Acorn Premium Products Canada",
    url: "https://koreanacorn.com/ca",
    areaServed: ["Canada"],
    inLanguage: ["en-CA"],
    description: "Premium Korean products delivered to Canada with fast shipping and quality guarantee.",
  });

  // FAQ JSON-LD
  const faqData = faqJsonLd([
    {
      q: "How long does shipping take to Canada?",
      a: "Standard shipping to Canada takes 10-15 business days, with express shipping available for 5-7 business days.",
    },
    {
      q: "Do you offer free shipping to Canada?",
      a: "Yes, we offer free shipping on orders over $100 CAD to Canada.",
    },
    {
      q: "What about customs and duties?",
      a: "All customs duties and taxes are included in the shipping cost for Canadian customers.",
    },
  ]);

  return (
    <>
      <JsonLd data={serviceData} />
      <JsonLd data={faqData} />
      
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

      {/* Footer */}
      <Footer content={content.footer} />
    </>
  );
}
