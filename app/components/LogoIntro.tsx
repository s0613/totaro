"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface LogoIntroProps {
  onComplete?: () => void;
}

export default function LogoIntro({ onComplete }: LogoIntroProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullLogoRef = useRef<HTMLDivElement>(null);
  const leftRectRef = useRef<SVGPathElement>(null);
  const rightRectRef = useRef<SVGPathElement>(null);
  const tHorizontalRef = useRef<SVGGElement>(null);
  const tVerticalRef = useRef<SVGGElement>(null);
  const mouseIconRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-play logo decomposition animation on site entry
  useEffect(() => {
    if (!isMounted || !containerRef.current || !fullLogoRef.current) return;

    if (prefersReducedMotion) {
      // For reduced motion, just show briefly and hide
      setTimeout(() => {
        setIsCompleted(true);
        onComplete?.();
      }, 3000);
      return;
    }

    // Initial state - logo visible
    gsap.set(fullLogoRef.current, { opacity: 1, scale: 1 });
    gsap.set(leftRectRef.current, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
    gsap.set(rightRectRef.current, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
    gsap.set(tHorizontalRef.current, { y: 0, scaleX: 1, scaleY: 1, opacity: 1 });
    gsap.set(tVerticalRef.current, { y: 0, scale: 1, opacity: 1 });
    gsap.set(mouseIconRef.current, { opacity: 0, scale: 0.8 });

    // Create auto-playing timeline that simulates scroll animation
    const tl = gsap.timeline({
      onComplete: () => {
        setIsCompleted(true);
        onComplete?.();
      }
    });

    // Phase 1: Logo stays (0-15%)
    tl.to(fullLogoRef.current, {
      duration: 0.45,
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
        duration: 0.75,
        ease: "power2.inOut",
      },
      0.45
    )
    .to(
      rightRectRef.current,
      {
        x: window.innerWidth * 0.6,
        y: -window.innerHeight * 0.4,
        scale: 12,
        rotation: 8,
        opacity: 0.15,
        duration: 0.75,
        ease: "power2.inOut",
      },
      0.45
    )
    // Phase 3: T Horizontal → Navigation (35-60%)
    .to(
      tHorizontalRef.current,
      {
        y: -window.innerHeight * 0.45,
        scaleX: 5,
        scaleY: 0.5,
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
      },
      1.05
    )
    // Phase 4: T Vertical → Mouse icon (50-75%)
    .to(
      tVerticalRef.current,
      {
        y: window.innerHeight * 0.4,
        scale: 0.4,
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
      },
      1.5
    )
    .to(
      mouseIconRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "power2.out",
      },
      1.8
    )
    // Phase 5: Rectangles fade more (70-85%)
    .to(
      [leftRectRef.current, rightRectRef.current],
      {
        opacity: 0.05,
        duration: 0.45,
      },
      2.1
    )
    // Phase 6: Everything fades out (85-100%)
    .to(
      [leftRectRef.current, rightRectRef.current],
      {
        opacity: 0,
        duration: 0.45,
      },
      2.55
    )
    .to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.45,
        ease: "power2.in",
      },
      2.55
    );
  }, [isMounted, prefersReducedMotion, onComplete]);

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

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return null;
  }

  // Don't render if animation is completed
  if (isCompleted) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-bg"
      style={{ height: "100vh" }}
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

      {/* Mouse Icon */}
      <div
        ref={mouseIconRef}
        className="fixed bottom-16 left-1/2 -translate-x-1/2"
        style={{
          opacity: 0,
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