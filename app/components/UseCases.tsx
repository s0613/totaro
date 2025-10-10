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
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-bg py-24 px-8"
    >
      <div className="max-w-7xl w-full">
        <h2 className="text-5xl font-bold text-textPrimary text-center mb-20">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((useCase, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              className="bg-surface rounded-lg p-8 border border-line hover:border-accent/40 transition-all group"
              style={{ opacity: 0, willChange: "opacity, transform" }}
            >
              <h3 className="text-2xl font-bold text-textPrimary mb-6 group-hover:text-accent transition-colors">
                {useCase.title}
              </h3>

              <div className="space-y-4">
                {/* Before */}
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-textSecondary/30" />
                  <div className="text-sm text-textSecondary/60 mb-1">Before</div>
                  <div className="text-textSecondary line-through">{useCase.before}</div>
                </div>

                {/* Arrow */}
                <div className="pl-6">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-accent"
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
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-accent" />
                  <div className="text-sm text-accent/80 mb-1">After</div>
                  <div className="text-textPrimary font-semibold">{useCase.after}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
