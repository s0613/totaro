"use client";

import { useState, useEffect } from "react";

interface SignatureFeatureProps {
  content: {
    title: string;
    subtitle: string;
  };
}

export default function SignatureFeature({ content }: SignatureFeatureProps) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "totaro", desc: "올인원 수출 플랫폼" },
    { label: "WEBSITE", desc: "바이어 중심 웹사이트" },
    { label: "AEO/SEO/GEO", desc: "AI·검색·지역 최적화" },
    { label: "Ads/DM", desc: "타겟 마케팅 캠페인" },
    { label: "CRM", desc: "바이어 관리 자동화" },
  ];

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 터치 스와이프
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextStep();
    }
    if (touchStart - touchEnd < -50) {
      prevStep();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-bg overflow-hidden py-24 px-8">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[800px] h-[800px] rounded-full opacity-10 blur-3xl"
          style={{
            background: `radial-gradient(circle, #5BA4FF 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl w-full">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-textPrimary mb-6">
            {content.title}
          </h2>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Animation Area with Touch Support */}
        <div
          className="relative h-[400px] flex items-center justify-center mb-16"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className={`absolute transition-all duration-500 ${
                index === activeStep
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90 pointer-events-none"
              }`}
            >
              <div className="text-center">
                <div className="inline-block px-12 py-8 rounded-2xl bg-surface/50 backdrop-blur-lg border-2 border-accent/40">
                  <h3 className="text-6xl font-bold text-accent mb-4">
                    {step.label}
                  </h3>
                  <p className="text-xl text-textSecondary">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevStep}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface/80 backdrop-blur-lg border border-line hover:border-accent transition-all flex items-center justify-center group"
            aria-label="이전"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-textSecondary group-hover:text-accent transition-colors"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={nextStep}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-surface/80 backdrop-blur-lg border border-line hover:border-accent transition-all flex items-center justify-center group"
            aria-label="다음"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-textSecondary group-hover:text-accent transition-colors"
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

        {/* Progress Indicator - Clickable */}
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className="flex flex-col items-center gap-2 transition-all hover:scale-110"
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeStep
                    ? "bg-accent scale-150"
                    : "bg-line hover:bg-accent/50"
                }`}
              />
              <span
                className={`text-xs transition-all duration-300 ${
                  index === activeStep
                    ? "text-accent font-semibold"
                    : "text-textSecondary/60 hover:text-textSecondary"
                }`}
              >
                {step.label}
              </span>
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center mt-8 text-textSecondary/60 text-sm">
          <p>← → 화살표 키 또는 스와이프로 이동</p>
        </div>
      </div>
    </section>
  );
}
