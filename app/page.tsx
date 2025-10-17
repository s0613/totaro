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
import Footer from "./components/Footer";
import { getContent, type Lang } from "@/lib/i18n";

export default function Home() {
  const lang = "ko" as Lang;
  const content = getContent(lang);

  return (
    <>
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
