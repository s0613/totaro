"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { trackCTAClick } from "@/lib/analytics";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroProps {
  content: {
    eyebrow: string;
    headline: string;
    subcopy: string;
    primaryCta: string;
  };
  lang: "ko" | "en";
}

export default function Hero({ content }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subcopyRef = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) {
      // Reduced motion: just fade in
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.6,
      });
      return;
    }

    // Depth zoom on background
    gsap.fromTo(
      bgRef.current,
      {
        scale: 1.2,
        opacity: 0,
      },
      {
        scale: 1.0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${window.innerHeight * 0.5}`,
          scrub: 1,
        },
      }
    );

    // Parallax on headline (moves faster)
    gsap.to(headlineRef.current, {
      y: -80,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Parallax on subcopy (moves slower)
    gsap.to(subcopyRef.current, {
      y: -40,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-bg"
      style={{ willChange: "opacity" }}
    >
      {/* Background with depth zoom */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{ willChange: "transform, opacity" }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-surface to-bg opacity-80" />

        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <filter id="noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="4"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" opacity="0.5" />
          </svg>
        </div>

        {/* Accent glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, #5BA4FF 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 text-center px-8 max-w-6xl">
        <p className="eyebrow mb-6 text-accent">{content.eyebrow}</p>

        <h1
          ref={headlineRef}
          className="copy-hero text-textPrimary mb-8"
          dangerouslySetInnerHTML={{ __html: content.headline }}
          style={{ willChange: "transform" }}
        />

        <p
          ref={subcopyRef}
          className="copy-sub text-textSecondary mb-10 mx-auto max-w-3xl text-lg"
          style={{ willChange: "transform" }}
        >
          {content.subcopy}
        </p>

        <a
          href="#contact"
          onClick={() => trackCTAClick("Get Started", "hero")}
          className="btn-primary text-lg px-10 py-5 shadow-soft hover:shadow-lg transition-shadow inline-block"
        >
          {content.primaryCta}
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-60">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs text-textSecondary/80 uppercase tracking-widest font-semibold">
            Scroll
          </span>
          <div className="relative">
            <svg
              width="28"
              height="42"
              viewBox="0 0 28 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1.5"
                y="1.5"
                width="25"
                height="39"
                rx="12.5"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-textSecondary/60"
              />
              <circle
                cx="14"
                cy="12"
                r="3"
                fill="currentColor"
                className="text-accent animate-bounce"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
