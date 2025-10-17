"use client";

import { trackCTAClick } from "@/lib/analytics";

interface OrderSectionProps {
  lang: "ko" | "en";
}

export default function OrderSection({ lang }: OrderSectionProps) {
  const isEn = lang === "en";

  const bulletsKo = [
    "AEO·SEO·GEO 친화적 설계",
    "타겟 고객 키워드/의도 기반 IA",
    "다국어(i18n)/hreflang/지역 타겟팅",
    "구글 색인/서치 콘솔 세팅 포함",
  ];

  const bulletsEn = [
    "AEO/SEO/GEO‑friendly architecture",
    "Buyer‑intent keyword IA",
    "Multilingual/hreflang & GEO targeting",
    "Google indexing/Search Console setup",
  ];

  const bullets = isEn ? bulletsEn : bulletsKo;

  return (
    <section className="relative bg-surface py-24 px-8 border-t border-line">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-textPrimary mb-4">
            {isEn ? "Website Purchase Order" : "웹사이트 구매 주문하기"}
          </h2>
          <p className="text-lg text-textSecondary text-pretty break-keep">
            {isEn
              ? "AEO/SEO/GEO‑ready website production."
              : "AEO·SEO·GEO 친화적 웹사이트 제작."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-bg rounded-xl p-8 border border-line">
            <h3 className="text-2xl font-semibold mb-4">{isEn ? "Starter Plan" : "스타터 플랜"}</h3>
            {/* price display removed */}
            <ul className="space-y-3 mb-8">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 inline-block w-2 h-2 rounded-full bg-accent" />
                  <span className="text-textSecondary">{b}</span>
                </li>
              ))}
            </ul>
            <a
            href="/#contact"
              onClick={() => {
              trackCTAClick("Contact", "order_section");
              }}
              className="btn-primary px-8 py-4 inline-block"
            >
            {isEn ? "Contact Us" : "문의하기"}
            </a>
          </div>

          <div className="bg-bg rounded-xl p-8 border border-line">
            <h3 className="text-2xl font-semibold mb-4">{isEn ? "What’s Included" : "포함 사항"}</h3>
            <ul className="space-y-3">
              {(isEn
                ? [
                    "Design system & responsive layouts",
                    "Core Web Vitals budget",
                    "Structured data (Organization/WebSite/WebPage/Offer)",
                    "Sitemap/robots/console handover",
                  ]
                : [
                    "디자인 시스템 및 반응형 레이아웃",
                    "코어 웹 바이탈 성능 기준",
                    "구조화 데이터(Organization/WebSite/WebPage/Offer)",
                    "사이트맵/로봇/서치 콘솔 인수인계",
                  ]).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent mt-0.5">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-textSecondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

