"use client";

import { useMemo } from "react";
import Link from "next/link";

interface SignatureFeatureProps {
  content: {
    title: string;
    subtitle: string;
  };
}

export default function SignatureFeature({ content }: SignatureFeatureProps) {
  const steps = useMemo(
    () => [
      { label: "WEB BUILDER", desc: "AI 기반 웹사이트 제작" },
      { label: "AEO/SEO/GEO", desc: "AI·검색·지역 최적화" },
      { label: "Ads/DM", desc: "타겟 마케팅 캠페인" },
      { label: "CRM", desc: "바이어 관리 자동화" },
    ],
    []
  );

  const getHref = (label: string) => {
    if (label === "WEB BUILDER") return "/solutions/builder";
    if (label === "AEO/SEO/GEO") return "/payments/test";
    if (label === "Ads/DM") return "/vision";
    return undefined;
  };

  return (
    <section className="relative bg-bg overflow-hidden py-16 lg:py-24 px-8">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[800px] h-[800px] rounded-full opacity-10 blur-3xl"
          style={{
            background: `radial-gradient(circle, #5BA4FF 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto">
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-textPrimary mb-6">
            {content.title}
          </h2>
          <p className="text-lg md:text-xl text-textSecondary max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>
        {/* Horizontal list */}
        <div className="flex flex-row flex-nowrap gap-6 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const href = getHref(step.label);
            const CardContent = (
              <div className="px-6 md:px-8 py-8 md:py-10 rounded-2xl bg-surface/50 backdrop-blur-lg border-2 border-accent/40 h-full overflow-hidden transition-transform hover:scale-[1.02]">
                <h3 className="text-2xl md:text-3xl font-bold text-accent mb-3 leading-tight break-words">{step.label}</h3>
                <p className="text-sm md:text-base text-textSecondary leading-relaxed break-words">{step.desc}</p>
              </div>
            );
            return (
              <div key={index} className="text-center min-w-[260px] md:min-w-[280px] flex-none">
                {href ? (
                  <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-accent rounded-2xl">
                    {CardContent}
                  </Link>
                ) : (
                  CardContent
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
