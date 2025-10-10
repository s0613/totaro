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
    company: "ABC Manufacturing",
    industry: "전자부품",
    name: "김철수",
    role: "수출팀장",
    quote: "토탈로 도입 후 해외 문의가 3배 증가했습니다. 특히 AI 검색 최적화 덕분에 ChatGPT에서 우리 제품이 추천되는 걸 직접 확인했어요.",
    result: "월 문의 15건 → 48건",
  },
  {
    company: "XYZ Global",
    industry: "기계설비",
    name: "이영희",
    role: "대표이사",
    quote: "5명짜리 스타트업인데 전담 수출팀 없이 유럽 바이어 10곳과 계약했습니다. CRM 자동화가 정말 혁신적이에요.",
    result: "계약 성사율 2.5배 증가",
  },
  {
    company: "DEF Industries",
    industry: "화학소재",
    name: "박민수",
    role: "마케팅 본부장",
    quote: "기존에 쓰던 5개 툴을 토탈로 하나로 통합했습니다. 운영 비용은 절반으로 줄고 효율은 두 배로 늘었어요.",
    result: "마케팅 ROI 320% 증가",
  },
];

const partnerLogos = [
  { name: "삼성", logo: "SAMSUNG" },
  { name: "LG", logo: "LG" },
  { name: "현대", logo: "HYUNDAI" },
  { name: "SK", logo: "SK" },
  { name: "포스코", logo: "POSCO" },
  { name: "한화", logo: "HANWHA" },
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
          <h2 className="text-5xl font-bold text-textPrimary text-center mb-16">
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
