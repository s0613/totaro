"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Service {
  id?: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  benefits: string[];
}

interface ServiceDetailsProps {
  content: {
    website: Service;
    aeo: Service;
    ads: Service;
    crm: Service;
  };
}

export default function ServiceDetails({ content }: ServiceDetailsProps) {
  const services: Service[] = [
    { ...content.website, id: "website" },
    { ...content.aeo, id: "aeo" },
    { ...content.ads, id: "ads" },
    { ...content.crm, id: "crm" },
  ];
  const containerRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<HTMLDivElement[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const children = containerRef.current.querySelectorAll(".js-service-child");

    // 초기 상태 세팅 후 더 짧고 부드러운 트윈으로 전환
    gsap.set(children, { opacity: 0, y: 12 });

    ScrollTrigger.batch(children, {
      start: "top 88%",
      once: true,
      onEnter: (batch) => {
        gsap.to(batch as Element[], {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.06,
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <section id="solution" ref={containerRef} className="relative bg-surface py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-textPrimary mb-6">
            토탈로가 제공하는 솔루션
          </h2>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            각 단계별 최적화된 도구로 수출 성공률을 높입니다
          </p>
        </div>

        <div className="space-y-24">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => {
                if (el) serviceRefs.current[index] = el;
              }}
              className={`flex flex-col lg:flex-row gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Icon & Title */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-block text-8xl mb-6 js-service-child" style={{ willChange: "transform, opacity" }}>{service.icon}</div>
                <h3 className="text-4xl font-bold text-textPrimary mb-4 js-service-child" style={{ willChange: "transform, opacity" }}>
                  {service.title}
                </h3>
                <p className="text-lg text-textSecondary mb-8 js-service-child" style={{ willChange: "transform, opacity" }}>
                  {service.description}
                </p>

                {/* Benefits */}
                <div className="space-y-3 js-service-child">
                  {service.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="text-accent"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-textPrimary font-semibold">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="flex-1">
                <div className="bg-bg rounded-2xl p-8 border border-line js-service-child" style={{ willChange: "transform, opacity" }}>
                  <h4 className="text-xl font-bold text-textPrimary mb-6">
                    주요 기능
                  </h4>
                  <ul className="space-y-4">
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-textSecondary"
                      >
                        <span className="text-accent mt-1">▪</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
