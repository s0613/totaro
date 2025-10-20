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
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) {
      // Reduced motion: just fade in
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.6,
      });
      // Play video after animation
      if (videoRef.current) {
        setTimeout(() => {
          videoRef.current?.play();
        }, 600);
      }
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInView) {
      // 페이지 진입 시 뷰포트 안이면 즉시 인트로 애니메이션 실행
      gsap.fromTo(
        bgRef.current,
        { scale: 1.08, opacity: 0 },
        { scale: 1.0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.05 }
      );
      gsap.fromTo(
        subcopyRef.current,
        { opacity: 0, y: 16 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.45, 
          ease: "power2.out", 
          delay: 0.1,
          onComplete: () => {
            // 애니메이션이 완료되면 비디오 재생
            if (videoRef.current) {
              videoRef.current.play();
            }
          }
        }
      );

      // 이후 스크롤 패럴럭스만 연결
      gsap.to(headlineRef.current, {
        y: -80,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.to(subcopyRef.current, {
        y: -40,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    } else {
      // 스크롤로 진입할 때 기존 동작 유지
      gsap.fromTo(
        bgRef.current,
        { scale: 1.2, opacity: 0 },
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
            onEnter: () => {
              // 스크롤로 진입하면 비디오 재생
              if (videoRef.current) {
                videoRef.current.play();
              }
            },
          },
        }
      );
      gsap.to(headlineRef.current, {
        y: -80,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.to(subcopyRef.current, {
        y: -40,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <>
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg"
      style={{ willChange: "opacity" }}
    >
      {/* Background with depth zoom */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{ willChange: "transform, opacity" }}
      >
        {/* Video background */}
        <video
          ref={videoRef}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/herosectionVideo.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-surface/40 to-bg/80" />

        {/* Arc Reactor Effect - Iron Man Heart */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Core glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(91, 164, 255, 0.8) 0%, rgba(91, 164, 255, 0.4) 50%, transparent 100%)`,
              boxShadow: '0 0 60px rgba(91, 164, 255, 0.6), 0 0 120px rgba(91, 164, 255, 0.4)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          
          {/* Rotating rings */}
          {[1, 2, 3, 4, 5].map((ring) => (
            <div
              key={ring}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
              style={{
                width: `${ring * 120}px`,
                height: `${ring * 120}px`,
                borderColor: `rgba(91, 164, 255, ${0.3 / ring})`,
                animation: `rotate${ring % 2 === 0 ? 'Clockwise' : 'CounterClockwise'} ${15 + ring * 3}s linear infinite`,
                borderStyle: ring % 2 === 0 ? 'dashed' : 'solid',
                borderWidth: ring === 1 ? '3px' : '2px',
              }}
            />
          ))}
          
          {/* Energy particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-blue-400"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-${150 + (i % 3) * 50}px)`,
                opacity: 0.6,
                animation: `particleFloat ${3 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                boxShadow: '0 0 10px rgba(91, 164, 255, 0.8)',
              }}
            />
          ))}
        </div>

        {/* Accent glow background */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, #5BA4FF 0%, transparent 70%)`,
          }}
        />
      </div>
      
      {/* CSS animations */}
      <style jsx>{`
        @keyframes rotateClockwise {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        
        @keyframes rotateCounterClockwise {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
        }
        
        @keyframes particleFloat {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>

      {/* Center brand only */}
      <div className="relative z-10 text-center px-8 max-w-6xl select-none">
        <h1 className="text-textPrimary font-extrabold tracking-[0.25em] text-5xl sm:text-6xl md:text-7xl">TOTARO</h1>
        {/* Explanation within hero for single-screen view */}
        <div className="mt-8 text-center">
          <h2
            ref={headlineRef}
            className="text-textPrimary text-xl md:text-2xl font-bold mb-4 text-pretty break-keep leading-snug"
            dangerouslySetInnerHTML={{ __html: content.headline }}
          />
          {content.subcopy && (
            <p ref={subcopyRef} className="text-textSecondary max-w-3xl mx-auto text-base md:text-lg text-pretty break-keep">
              {content.subcopy}
            </p>
          )}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              onClick={() => trackCTAClick("Get Started", "hero_inline")}
              className="btn-primary text-base md:text-lg px-8 md:px-10 py-4 md:py-5 shadow-soft hover:shadow-lg transition-shadow inline-block"
            >
              {content.primaryCta}
            </a>
            <a
              href="/web"
              onClick={() => trackCTAClick("Web Builder", "hero_inline")}
              className="btn-secondary text-base md:text-lg px-8 md:px-10 py-4 md:py-5 shadow-soft hover:shadow-lg transition-shadow inline-block"
            >
              웹빌더 솔루션 보기
            </a>
          </div>
        </div>
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
    </>
  );
}
