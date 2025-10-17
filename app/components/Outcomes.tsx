"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Metric {
  label: string;
  value: string;
}

interface OutcomesProps {
  title: string;
  metrics: Metric[];
}

export default function Outcomes({ title, metrics }: OutcomesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const metricRefs = useRef<HTMLDivElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) {
      // Reduced motion: show static values
      metricRefs.current.forEach((el) => {
        if (el) {
          gsap.to(el, { opacity: 1, duration: 0.6 });
        }
      });
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;

    // IntersectionObserver 폴백: 트리거 미동작 시 가시성 진입 즉시 실행
    let io: IntersectionObserver | null = null;
    const runImmediate = () => {
      metricRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            delay: i * 0.16,
            ease: "back.out(1.6)",
          }
        );
      });
    };

    // 뷰포트 안이면 즉시 재생, 아니면 스크롤 진입 시 1회 재생
    if (isInView) {
      metricRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            delay: i * 0.16,
            ease: "back.out(1.6)",
          }
        );
      });
    } else {
      // Count-up animation on scroll enter
      metricRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: i * 0.2,
            ease: "back.out(1.7)",
            immediateRender: false,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%",
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
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-surface py-24 px-8"
    >
      <div className="max-w-6xl w-full">
        <h2 className="text-5xl font-bold text-textPrimary text-center mb-20">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {metrics.map((metric, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) metricRefs.current[i] = el;
              }}
              className="text-center"
              style={{ opacity: 0, willChange: "opacity, transform" }}
            >
              <div className="mb-4">
                <div className="inline-block p-6 rounded-2xl bg-accent/10 border border-accent/20">
                  <div className="text-6xl font-bold text-accent">
                    {metric.value}
                  </div>
                </div>
              </div>
              <div className="text-xl text-textPrimary font-semibold">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 pointer-events-none">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, #5BA4FF 0%, transparent 70%)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
