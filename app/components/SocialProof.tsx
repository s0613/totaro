"use client";

import { useState } from "react";

interface SocialProofProps {
  content: {
    title: string;
    testimonials: {
      title: string;
    };
  };
  lang: "ko" | "en";
}

const testimonials = [
  {
    company: "트**닉",
    industry: "AI 영상 생성 서비스",
    name: "김**",
    role: "해외영업팀장",
    quote: "웹사이트/콘텐츠 구조를 수출형으로 재설계한 뒤, 유럽·중동에서 유의미한 인바운드가 들어오기 시작했습니다.",
    result: "월 해외 문의 4건 → 17건",
  },
  {
    company: "기버**",
    industry: "F&B 프랜차이즈",
    name: "정**",
    role: "브랜드 매니저",
    quote: "지역 타겟팅과 멀티랭귀지 적용 이후 해외 파트너 문의가 꾸준히 증가했고, 운영 인력 없이도 리드가 자동 분류됩니다.",
    result: "리드 응답 시간 70% 단축",
  },
  {
    company: "업**우",
    industry: "DX/AX 솔루션",
    name: "오**",
    role: "Growth Lead",
    quote: "AEO·SEO·GEO 전략을 한 번에 적용하면서 유입 품질이 확실히 달라졌습니다. 세일즈 파이프라인이 안정화됐어요.",
    result: "데모 요청 전환율 2.1배",
  },
];

const partnerLogos = [
  { name: "청원농산", logo: "청원***" },
  { name: "트라이닉", logo: "트**닉" },
  { name: "기버케밥", logo: "기버**" },
  { name: "벤처클럽", logo: "벤처**" },
  { name: "업플로우", logo: "업**우" },
  { name: "메디뷰", logo: "메**뷰" },
];

export default function SocialProof({ content, lang }: SocialProofProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="relative bg-bg py-32 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Partner Logos */}
        <div className="mb-24">
          <h3 className="text-center text-sm font-semibold text-textSecondary/60 uppercase tracking-widest mb-12">
            {content.title}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {partnerLogos.map((partner, index) => (
              <div
                key={index}
                className="text-textSecondary/40 text-2xl font-bold hover:text-textSecondary/70 transition-colors"
              >
                {partner.logo}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-textPrimary text-center mb-16">
            {content.testimonials.title}
          </h2>

          <div className="relative bg-surface rounded-2xl p-12 border border-line">
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1 bg-accent/10 rounded-full mb-4">
                <span className="text-accent font-semibold text-sm">
                  {testimonials[activeTestimonial].industry}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-textPrimary mb-2">
                {testimonials[activeTestimonial].company}
              </h3>
            </div>

            <blockquote className="text-center mb-8">
              <p className="text-xl text-textSecondary leading-relaxed mb-6">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div className="inline-block px-6 py-3 bg-accent/10 rounded-lg">
                <p className="text-accent font-bold text-lg">
                  {testimonials[activeTestimonial].result}
                </p>
              </div>
            </blockquote>

            <div className="text-center">
              <p className="text-textPrimary font-semibold">
                {testimonials[activeTestimonial].name}
              </p>
              <p className="text-textSecondary text-sm">
                {testimonials[activeTestimonial].role}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-surface border border-line hover:border-accent transition-colors flex items-center justify-center"
                aria-label="이전 후기"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-textPrimary"
                >
                  <path
                    d="M15 18l-6-6 6-6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeTestimonial
                        ? "bg-accent w-8"
                        : "bg-line hover:bg-line/60"
                    }`}
                    aria-label={`후기 ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-surface border border-line hover:border-accent transition-colors flex items-center justify-center"
                aria-label="다음 후기"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-textPrimary"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
