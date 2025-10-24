"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Step {
  step: number;
  label: string;
  desc: string;
}

interface HowItWorksProps {
  title: string;
  steps: Step[];
}

export default function HowItWorks({ title, steps }: HowItWorksProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<HTMLDivElement[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) {
      // Reduced motion: just fade in all steps
      stepRefs.current.forEach((el) => {
        if (el) {
          gsap.to(el, { opacity: 1, duration: 0.6 });
        }
      });
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      end: "bottom center",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const newActiveStep = Math.min(
          Math.floor(progress * steps.length),
          steps.length - 1
        );
        setActiveStep(newActiveStep);
      },
    });

    return () => trigger.kill();
  }, [prefersReducedMotion, steps.length]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === activeStep) {
        gsap.to(el, {
          scale: 1.05,
          boxShadow: "0 0 30px rgba(91,164,255,.4)",
          borderColor: "rgba(91,164,255,.6)",
          duration: 0.4,
          ease: "power2.out",
        });
      } else {
        gsap.to(el, {
          scale: 1,
          boxShadow: "none",
          borderColor: "rgba(255,255,255,.08)",
          duration: 0.4,
          ease: "power2.out",
        });
      }
    });
  }, [activeStep, prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-surface py-16 sm:py-24 px-4 sm:px-8"
    >
      <div className="max-w-7xl w-full">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-textPrimary text-center mb-12 sm:mb-20 px-2">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) stepRefs.current[i] = el;
              }}
              className="bg-bg rounded-lg p-4 sm:p-6 md:p-8 border border-line transition-all min-h-[180px] sm:min-h-[200px] md:min-h-[240px] flex flex-col"
              style={{ willChange: "transform, box-shadow, border-color" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent text-sm sm:text-lg font-bold">{step.step}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-textPrimary">{step.label}</h3>
              </div>
              <p className="text-textSecondary text-xs sm:text-sm leading-relaxed flex-1 flex items-center">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
