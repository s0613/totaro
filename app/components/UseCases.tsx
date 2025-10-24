"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseCase {
  title: string;
  before: string;
  after: string;
}

interface UseCasesProps {
  title: string;
  cases: UseCase[];
}

export default function UseCases({ title, cases }: UseCasesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) {
      // Reduced motion: just fade in
      cardRefs.current.forEach((el) => {
        if (el) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.6 });
        }
      });
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;

    // IntersectionObserver 폴백: 트리거 미동작 시 가시성 진입 즉시 실행
    let io: IntersectionObserver | null = null;
    const runImmediate = () => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            delay: i * 0.12,
            ease: "power2.out",
          }
        );
      });
    };

    // 뷰포트 안이면 즉시 스태거 재생, 아니면 스크롤 진입 시 재생
    if (isInView) {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            delay: i * 0.12,
            ease: "power2.out",
          }
        );
      });
    } else {
      // Stagger animation on scroll enter
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.15, // 150ms stagger
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });
    }

    // IO 등록 (스크롤 트리거 불발 시 안전망)
    io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runImmediate();
          if (io) io.disconnect();
        }
      },
      { root: null, rootMargin: "200px 0px", threshold: 0.05 }
    );
    io.observe(containerRef.current);

    // 레이아웃/이미지 로드 후 트리거 재계산
    const onLoad = () => {
      try {
        ScrollTrigger.refresh();
      } catch {}
    };
    window.addEventListener("load", onLoad);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener("load", onLoad);
      if (io) io.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="cases"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-bg py-16 sm:py-24 px-4 sm:px-8"
    >
      <div className="max-w-7xl w-full">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-textPrimary text-center mb-12 sm:mb-20 px-2">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {cases.map((useCase, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              className="bg-surface rounded-lg p-4 sm:p-6 md:p-8 border border-line hover:border-accent/40 transition-all group min-h-[240px] sm:min-h-[280px] md:min-h-[320px] flex flex-col"
              style={{ opacity: 0, willChange: "opacity, transform" }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-textPrimary mb-4 sm:mb-6 group-hover:text-accent transition-colors">
                {useCase.title}
              </h3>

              <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col justify-center">
                {/* Before */}
                <div className="relative pl-4 sm:pl-6">
                  <div className="absolute left-0 top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-textSecondary/30" />
                  <div className="text-xs sm:text-sm text-textSecondary/60 mb-1">Before</div>
                  <div className="text-textSecondary line-through text-sm sm:text-base">{useCase.before}</div>
                </div>

                {/* Arrow */}
                <div className="pl-4 sm:pl-6">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-accent sm:w-6 sm:h-6"
                  >
                    <path
                      d="M12 4L12 20M12 20L18 14M12 20L6 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* After */}
                <div className="relative pl-4 sm:pl-6">
                  <div className="absolute left-0 top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-accent" />
                  <div className="text-xs sm:text-sm text-accent/80 mb-1">After</div>
                  <div className="text-textPrimary font-semibold text-sm sm:text-base">{useCase.after}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
