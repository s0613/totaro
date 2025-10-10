"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface LogoIntroProps {
  onComplete?: () => void;
}

export default function LogoIntro({ onComplete }: LogoIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fullLogoRef = useRef<HTMLDivElement>(null);
  const leftRectRef = useRef<SVGPathElement>(null);
  const rightRectRef = useRef<SVGPathElement>(null);
  const tHorizontalRef = useRef<SVGGElement>(null);
  const tVerticalRef = useRef<SVGGElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const mouseIconRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 1,
        onComplete,
      });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Set initial state - logo visible immediately
    gsap.set(fullLogoRef.current, { opacity: 1, scale: 1 });

    // Phase 1: Logo stays (0-15%)
    tl.to(fullLogoRef.current, {
      duration: 0.15,
    })
    // Phase 2: Rectangles split and expand (15-40%)
    .to(
      leftRectRef.current,
      {
        x: -window.innerWidth * 0.6,
        y: window.innerHeight * 0.4,
        scale: 12,
        rotation: -8,
        opacity: 0.15,
        duration: 0.25,
        ease: "power2.inOut",
      },
      0.15
    )
    .to(
      rightRectRef.current,
      {
        x: window.innerWidth * 0.6,
        y: -window.innerHeight * 0.4,
        scale: 12,
        rotation: 8,
        opacity: 0.15,
        duration: 0.25,
        ease: "power2.inOut",
      },
      0.15
    )
    // Phase 3: T Horizontal → Navigation (35-60%)
    .to(
      tHorizontalRef.current,
      {
        y: -window.innerHeight * 0.45,
        scaleX: 5,
        scaleY: 0.5,
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut",
      },
      0.35
    )
    .to(
      navRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.15,
        ease: "power2.out",
      },
      0.5
    )
    // Phase 4: T Vertical → Mouse icon (50-75%)
    .to(
      tVerticalRef.current,
      {
        y: window.innerHeight * 0.4,
        scale: 0.4,
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut",
      },
      0.5
    )
    .to(
      mouseIconRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 0.15,
        ease: "power2.out",
      },
      0.6
    )
    // Phase 5: Rectangles fade more (70-85%)
    .to(
      [leftRectRef.current, rightRectRef.current],
      {
        opacity: 0.05,
        duration: 0.15,
      },
      0.7
    )
    // Phase 6: Everything fades out (85-100%)
    .to(
      [leftRectRef.current, rightRectRef.current],
      {
        opacity: 0,
        duration: 0.15,
      },
      0.85
    )
    .to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
      },
      0.85
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [prefersReducedMotion, onComplete]);

  // Mouse icon bounce animation
  useEffect(() => {
    if (prefersReducedMotion || !mouseIconRef.current) return;

    gsap.to(mouseIconRef.current, {
      y: "+=10",
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, [prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-bg"
      style={{ height: "300vh" }}
    >
      {/* Full Logo with separating parts */}
      <div
        ref={fullLogoRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10"
        style={{ willChange: "transform, opacity" }}
      >
        <svg
          width="369"
          height="367"
          viewBox="0 0 369 367"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-auto h-auto"
          style={{
            maxWidth: "min(70vw, 500px)",
            height: "auto",
            overflow: "visible"
          }}
        >
          {/* Left Rectangle */}
          <path
            ref={leftRectRef}
            d="M183.473 366.583L0.446289 327.112V41.8849L92.0202 61.1978L42.3673 72.3027V294.522L278.188 345.822L183.473 366.583Z"
            fill="#E9ECEF"
            style={{
              transformOrigin: "center center",
              willChange: "transform"
            }}
          />

          {/* Right Rectangle */}
          <path
            ref={rightRectRef}
            d="M185.527 0L368.554 39.5915V324.698L276.98 305.385L326.633 294.28V72.182L90.812 20.7614L185.527 0Z"
            fill="#E9ECEF"
            style={{
              transformOrigin: "center center",
              willChange: "transform"
            }}
          />

          {/* T Horizontal Bar */}
          <g
            ref={tHorizontalRef}
            style={{ transformOrigin: "center center", willChange: "transform" }}
          >
            <path
              d="M278.188 99.5822L141.552 168.264L95.4028 145.571L232.28 77.0103L278.188 99.5822Z"
              fill="#E9ECEF"
            />
            <path
              d="M278.188 145.571L186.856 190.836V145.571L278.188 99.5822V145.571Z"
              fill="url(#paint0_linear)"
            />
          </g>

          {/* T Vertical Bar */}
          <g
            ref={tVerticalRef}
            style={{ transformOrigin: "center center", willChange: "transform" }}
          >
            <path
              d="M95.4028 145.571V191.198L141.552 214.494V168.264L95.4028 145.571Z"
              fill="#E9ECEF"
            />
            <path
              d="M186.356 281.645L142.052 259.69V214.797L186.356 191.661V281.645Z"
              fill="url(#paint1_linear)"
              stroke="#E9ECEF"
            />
            <path
              d="M232.522 214.494V260L186.856 282.451V236.221L232.522 214.494Z"
              fill="#E9ECEF"
            />
          </g>

          <defs>
            <linearGradient
              id="paint0_linear"
              x1="174.533"
              y1="172.247"
              x2="284.557"
              y2="120.874"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.04" stopColor="#5BA4FF" />
              <stop offset="0.66" stopColor="#E9ECEF" />
            </linearGradient>
            <linearGradient
              id="paint1_linear"
              x1="164.265"
              y1="282.451"
              x2="164.265"
              y2="190.836"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.24" stopColor="#E9ECEF" />
              <stop offset="0.31" stopColor="#D9DDE1" />
              <stop offset="0.39" stopColor="#C4C9CE" />
              <stop offset="0.48" stopColor="#A9B0B7" />
              <stop offset="0.57" stopColor="#8A9299" />
              <stop offset="0.66" stopColor="#6B7379" />
              <stop offset="0.71" stopColor="#5BA4FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Navigation Bar */}
      <div
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 opacity-0"
        style={{ transform: "translateY(-20px)", willChange: "opacity, transform" }}
      >
        <nav className="flex items-center justify-between px-8 py-5 bg-bg/95 backdrop-blur-lg border-b border-line/50">
          <div className="flex items-center gap-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 369 367"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M278.188 99.5822L141.552 168.264L95.4028 145.571L232.28 77.0103L278.188 99.5822Z"
                fill="#5BA4FF"
              />
              <path
                d="M95.4028 145.571V191.198L141.552 214.494V168.264L95.4028 145.571Z"
                fill="#E9ECEF"
              />
              <path
                d="M232.522 214.494V260L186.856 282.451V236.221L232.522 214.494Z"
                fill="#E9ECEF"
              />
            </svg>
            <span className="text-lg font-bold text-textPrimary tracking-tight">
              totaro
            </span>
          </div>
          <div className="flex items-center gap-10">
            <a
              href="#home"
              className="text-sm font-medium text-textPrimary hover:text-accent transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#solution"
              className="text-sm font-medium text-textPrimary hover:text-accent transition-colors duration-200"
            >
              Solution
            </a>
            <a
              href="#cases"
              className="text-sm font-medium text-textPrimary hover:text-accent transition-colors duration-200"
            >
              Cases
            </a>
            <a
              href="#contact"
              className="text-sm font-semibold text-bg bg-accent hover:bg-accent/90 transition-colors duration-200 px-5 py-2.5 rounded-lg"
            >
              Contact
            </a>
          </div>
        </nav>
      </div>

      {/* Mouse Icon */}
      <div
        ref={mouseIconRef}
        className="fixed bottom-16 left-1/2 -translate-x-1/2 opacity-0"
        style={{
          transform: "translateX(-50%) scale(0.8)",
          willChange: "opacity, transform",
        }}
      >
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
                className="text-accent"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
