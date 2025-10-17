"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

export interface Website {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "processing" | "completed" | "failed";
  preview_url?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

// Deterministic PRNG (Mulberry32)
function createSeededRng(seed: number) {
  let t = seed >>> 0;
  return function random() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Deterministic timestamps to avoid SSR/CSR mismatch
const FIXED_CREATED_AT = "2025-01-01T00:00:00.000Z";
const FIXED_UPDATED_AT = "2025-01-01T00:00:00.000Z";

const mockWebsites: Website[] = [
  {
    id: "1",
    user_id: "demo",
    title: "청원푸드 온라인 주문 사이트",
    description: "신선한 식자재를 온라인으로 주문할 수 있는 쇼핑몰 웹사이트",
    category: "쇼핑몰",
    status: "completed",
    preview_url: "https://example.com/preview1",
    thumbnail_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    created_at: FIXED_CREATED_AT,
    updated_at: FIXED_UPDATED_AT,
  },
  {
    id: "2",
    user_id: "demo",
    title: "카페 브랜드 홍보 사이트",
    description: "로컬 카페의 브랜드 스토리와 메뉴를 소개하는 웹사이트",
    category: "브랜드",
    status: "processing",
    created_at: FIXED_CREATED_AT,
    updated_at: FIXED_UPDATED_AT,
  },
  {
    id: "3",
    user_id: "demo",
    title: "영상 생성 플랫폼 trynicai",
    description: "AI 기반 영상 생성과 편집 서비스를 제공하는 플랫폼",
    category: "영상",
    status: "completed",
    preview_url: "https://example.com/preview3",
    thumbnail_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    created_at: FIXED_CREATED_AT,
    updated_at: FIXED_UPDATED_AT,
  },
];

const WebApp: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("쇼핑몰");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [websites, setWebsites] = useState<Website[]>(mockWebsites);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardTilts, setCardTilts] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [autoAnimationStarted, setAutoAnimationStarted] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showGeneratedWebsite, setShowGeneratedWebsite] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState<Website | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const createSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const newTilts: { [key: string]: { x: number; y: number } } = {};
      Object.entries(cardRefs.current).forEach(([id, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const cardCenterX = rect.left + rect.width / 2;
          const cardCenterY = rect.top + rect.height / 2;
          const deltaX = e.clientX - cardCenterX;
          const deltaY = e.clientY - cardCenterY;
          const maxTilt = 15;
          const tiltX = (deltaY / rect.height) * maxTilt;
          const tiltY = (deltaX / rect.width) * -maxTilt;
          newTilts[id] = { x: tiltX, y: tiltY };
        }
      });
      setCardTilts(newTilts);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 자동 애니메이션 시작
  useEffect(() => {
    if (!autoAnimationStarted) {
      const timer = setTimeout(() => {
        startAutoAnimation();
      }, 2000); // 페이지 로드 후 2초 뒤 시작

      return () => clearTimeout(timer);
    }
  }, [autoAnimationStarted]);

  // 줄인 동작 설정 감지
  useEffect(() => {
    if (typeof window !== "undefined" && "matchMedia" in window) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mq.addEventListener?.("change", handler);
      return () => mq.removeEventListener?.("change", handler);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    if (reducedMotion) {
      setTimeout(() => setProgress(100), 300);
    } else {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const increment = Math.max(1, Math.round(5 * (1 - prev / 100)));
          return Math.min(100, prev + increment);
        });
      }, 100);
    }

    const finishTimer = setInterval(() => {
      if (progress >= 100) {
        clearInterval(finishTimer);
        setLoading(false);
        const newWebsite: Website = {
          id: Date.now().toString(),
          user_id: "demo",
          title,
          description,
          category,
          status: "completed",
          preview_url: "https://example.com/preview",
          thumbnail_url: "/video.mp4",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setWebsites([newWebsite, ...websites]);
        setTitle("");
        setDescription("");
      }
    }, 120);
  };


  const typeText = (
    text: string,
    setter: (value: string) => void,
    delay = 50
  ) => {
    return new Promise<void>((resolve) => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setter(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });
  };

  const startAutoAnimation = async () => {
    if (autoAnimationStarted) return;
    setAutoAnimationStarted(true);

    // 웹사이트 제목 자동 입력
    const titleText = "청원푸드 온라인 주문 사이트";
    await typeText(titleText, setTitle, 80);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // 웹사이트 설명 자동 입력
    const descriptionText = "신선한 식자재를 온라인으로 주문할 수 있는 쇼핑몰 웹사이트를 만들어주세요. 주문 기능, 결제 시스템, 배송 추적이 포함되어야 합니다.";
    await typeText(descriptionText, setDescription, 50);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // 웹사이트 생성 시뮬레이션 시작
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          
          // 생성된 웹사이트 객체 생성
          const newWebsite: Website = {
            id: Date.now().toString(),
            user_id: "demo",
            title: titleText,
            description: descriptionText,
            category: "쇼핑몰",
            status: "completed",
            preview_url: "https://example.com/preview",
            thumbnail_url: "/video.mp4",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          setGeneratedWebsite(newWebsite);
          
          // 5초 후 폼 숨기고 웹사이트 표시
          setTimeout(() => {
            setShowForm(false);
            setShowGeneratedWebsite(true);
          }, 5000);
          
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: "대기 중", color: "bg-gray-500/50" },
      processing: { label: "생성 중", color: "bg-yellow-500/50" },
      completed: { label: "완료", color: "bg-green-500/50" },
      failed: { label: "실패", color: "bg-red-500/50" },
    } as const;
    const { label, color } = (config as any)[status];
    return (
      <span className={`px-3 py-1.5 text-xs font-bold text-white rounded-full ${color} backdrop-blur-md border border-white/10`}>
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden pt-20">
      <div
        className="fixed pointer-events-none z-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl transition-all duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(102,126,234,0.4) 0%, transparent 70%)",
          left: mousePos.x - 300,
          top: mousePos.y - 300,
        }}
      />

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-web-mesh-gradient">
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-web-gradient-apple blur-3xl animate-web-float opacity-10"
                style={{
                  width: `${300 + i * 150}px`,
                  height: `${300 + i * 150}px`,
                  left: `${10 + i * 20}%`,
                  top: `${5 + i * 15}%`,
                  animationDelay: `${i * 1.5}s`,
                  animationDuration: `${8 + i * 2}s`,
                }}
              />
            ))}
          </div>
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="web-animate-fade-in">
            <div className="mb-12 flex justify-center">
              <img src="/logo.png" alt="Web Create" className="h-32 w-32 md:h-40 md:w-40 web-logo-glow web-animate-float opacity-90" style={{ animationDuration: "10s" }} />
            </div>
            <div className="inline-block px-5 py-2.5 mb-10 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
              <span className="text-sm font-bold web-text-gradient-silver tracking-wide">✦ AI POWERED WEB DEVELOPMENT</span>
            </div>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 leading-[0.9] tracking-tighter">
              <span className="text-gray-400 font-medium text-5xl md:text-7xl lg:text-8xl block mb-3">웹사이트는 누구나 만들지만,</span>
              <span className="inline-block">
                <span className="inline-block cursor-default relative web-animate-pulse-scale">
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">결과</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-30 animate-pulse -z-10"></span>
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">는 우리만 만듭니다.</span>
              </span>
            </h2>
            <p className="text-xl md:text-3xl text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed font-light">
              AI 웹사이트가 SEO·GEO·AEO까지 최적화되어<br />
              <span className="text-gray-500 text-lg md:text-2xl">브랜드 노출을 확장합니다.</span>
            </p>
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {useMemo(() => {
            const rng = createSeededRng(12345); // fixed seed for deterministic SSR/CSR
            return [...Array(20)].map((_, i) => {
              const left = `${rng() * 100}%`;
              const top = `${rng() * 100}%`;
              const animationDelay = `${rng() * 5}s`;
              const animationDuration = `${10 + rng() * 10}s`;
              return (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full web-animate-float opacity-20"
                  style={{ left, top, animationDelay, animationDuration }}
                />
              );
            });
          }, [])}
        </div>

      </section>

      <section ref={createSectionRef} id="create" className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 web-animate-slide-up">
            <div className="inline-block px-5 py-2.5 mb-8 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
              <span className="text-sm font-bold web-text-gradient-silver tracking-wide">🌐 WEB CREATION</span>
            </div>
            <h3 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              <span className="web-text-gradient-blue block mb-2">AI가 만드는</span>
              <span className="inline-block hover:scale-105 transition-transform text-gray-100">당신만의 웹사이트</span>
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              프롬프트를 입력하고 몇 초만 기다리면<br />
              <span className="web-text-gradient-silver font-semibold">프리미엄 퀄리티</span>의 웹사이트가 완성됩니다
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative group">
              <div className="absolute -inset-1 bg-web-gradient-silver rounded-3xl blur-xl opacity-10 group-hover:opacity-25 transition duration-1000"></div>
              <div className="relative web-glass-strong rounded-3xl p-10 web-animate-slide-up web-hover-lift shadow-2xl shadow-black/40 border-white/20">
                {showForm ? (
                  <form onSubmit={handleSubmit} className="space-y-7">
                    {!loading && (
                      <>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-3 tracking-wide">웹사이트 제목</label>
                          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium" placeholder="예: 청원푸드 온라인 주문 사이트" disabled={autoAnimationStarted} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-3 tracking-wide">웹사이트 설명</label>
                          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={6} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none font-medium leading-relaxed" placeholder="생성하고 싶은 웹사이트를 상세히 설명해주세요...&#10;&#10;예: 신선한 식자재를 온라인으로 주문할 수 있는 쇼핑몰 웹사이트" disabled={autoAnimationStarted} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-3 tracking-wide">카테고리</label>
                          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium" disabled={autoAnimationStarted}>
                            <option value="쇼핑몰">쇼핑몰</option>
                            <option value="브랜드">브랜드</option>
                            <option value="영상">영상</option>
                            <option value="교육">교육</option>
                            <option value="의료">의료</option>
                            <option value="기타">기타</option>
                          </select>
                        </div>
                      </>
                    )}
                    {loading && (
                      <div className="space-y-6 p-8 bg-white/5 rounded-2xl border border-white/10" role="status" aria-live="polite">
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                            <div className="relative">
                              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                              <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500 border-r-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
                            </div>
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2">AI가 웹사이트를 생성하고 있습니다</h4>
                          <p className="text-sm text-gray-400 mb-4">잠시만 기다려주세요...</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm font-bold text-gray-300">
                            <span>진행률</span>
                            <span className="web-text-gradient">{progress}%</span>
                          </div>
                          <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden">
                            <div className="absolute inset-0 bg-web-gradient-apple transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent web-animate-shimmer" style={{ animationDuration: "1.5s", animationIterationCount: "infinite" }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>프롬프트 분석 완료</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${progress > 30 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span>{progress > 30 ? '디자인 생성 완료' : '디자인 생성 중...'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${progress > 70 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span>{progress > 70 ? '코드 생성 완료' : '코드 생성 중...'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${progress === 100 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            <span>{progress === 100 ? '최종 완성!' : '최종 처리 중...'}</span>
                          </div>
                        </div>

                        {/* 미리보기 스켈레톤 */}
                        <div className="mt-4">
                          <div className="aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent web-animate-shimmer" style={{ animationDuration: "2s" }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <button type="button" onClick={() => { window.location.href = 'http://localhost:3001/#contact'; }} disabled={loading || autoAnimationStarted} className="group relative w-full py-6 bg-web-gradient-apple rounded-2xl text-white font-bold text-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 overflow-hidden web-btn-shimmer web-ripple">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            생성 중...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            서비스 문의하기
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </span>
                      {!loading && <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
                    </button>
                  </form>
                ) : showGeneratedWebsite && generatedWebsite ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold web-text-gradient-silver mb-4">생성 완료!</h4>
                      <p className="text-gray-400">AI가 당신의 웹사이트를 완성했습니다</p>
                    </div>
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden">
                        <video 
                          className="w-full h-full object-cover" 
                          controls 
                          poster={generatedWebsite.thumbnail_url}
                        >
                          <source src="/video.mp4" type="video/mp4" />
                        </video>
                      </div>
                      <div className="mt-4">
                        <h5 className="text-lg font-bold text-white mb-2">{generatedWebsite.title}</h5>
                        <p className="text-sm text-gray-400 mb-6">{generatedWebsite.description}</p>
                        <div className="text-center">
                          <button 
                            onClick={() => { window.location.href = 'http://localhost:3001/#contact'; }} 
                            className="group relative px-8 py-4 bg-web-gradient-apple rounded-xl text-white font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60 overflow-hidden web-btn-shimmer web-ripple"
                          >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              서비스 문의하기
                              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </button>
                          <p className="text-xs text-gray-500 mt-3">
                            이 웹사이트처럼 AI가 만드는 맞춤형 웹사이트를 원하신다면 문의해주세요
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-6 web-animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="web-glass rounded-3xl p-10 web-hover-lift shadow-xl shadow-black/30 border-white/10">
                <h4 className="text-3xl font-black mb-8 web-text-gradient-silver">AI 웹사이트 생성 프로세스</h4>
                <div className="space-y-7">
                  {[
                    { icon: "✨", title: "프롬프트 분석", desc: "AI가 당신의 설명을 정확히 이해하고 분석합니다", color: "from-slate-400 to-slate-600" },
                    { icon: "🎨", title: "디자인 생성", desc: "모던하고 반응형 디자인을 자동으로 생성합니다", color: "from-gray-400 to-gray-600" },
                    { icon: "💻", title: "코드 생성", desc: "최적화된 HTML, CSS, JavaScript 코드를 생성합니다", color: "from-zinc-400 to-zinc-600" },
                    { icon: "✅", title: "최종 완성", desc: "SEO·GEO·AEO 최적화된 웹사이트가 완성됩니다", color: "from-neutral-400 to-neutral-600" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-5 group/item hover:translate-x-2 transition-transform duration-300">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl shadow-xl shadow-black/40 group-hover/item:scale-110 group-hover/item:shadow-2xl transition-all duration-300`}>{step.icon}</div>
                      <div className="flex-1">
                        <h5 className="font-bold text-lg mb-1.5 group-hover/item:text-white transition-colors">{step.title}</h5>
                        <p className="text-sm text-gray-400 leading-relaxed group-hover/item:text-gray-300 transition-colors">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="web-glass rounded-3xl p-8 web-hover-lift shadow-xl shadow-black/30 border-white/10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-xl shadow-lg shadow-black/40">💡</div>
                  <h5 className="text-lg font-bold text-gray-100">프로 팁</h5>
                </div>
                <ul className="space-y-3.5 text-sm text-gray-400">
                  <li className="flex items-start gap-3 group/tip hover:text-gray-300 transition-colors"><span className="text-slate-400 mt-0.5 group-hover/tip:text-slate-300 transition-colors">▸</span><span>구체적인 설명일수록 더 정확한 결과를 얻을 수 있습니다</span></li>
                  <li className="flex items-start gap-3 group/tip hover:text-gray-300 transition-colors"><span className="text-slate-400 mt-0.5 group-hover/tip:text-slate-300 transition-colors">▸</span><span>색상, 레이아웃, 기능 등을 명시하세요</span></li>
                  <li className="flex items-start gap-3 group/tip hover:text-gray-300 transition-colors"><span className="text-slate-400 mt-0.5 group-hover/tip:text-slate-300 transition-colors">▸</span><span>SEO·GEO·AEO 최적화가 자동으로 적용됩니다</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-40 px-6 bg-gradient-to-b from-black via-gray-900/10 to-black relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-slate-600 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-gray-700 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "2s", animationDuration: "10s" }} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2.5 mb-8 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
              <span className="text-sm font-bold web-text-gradient-silver tracking-wide">🚀 FEATURES</span>
            </div>
            <h3 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              <span className="web-text-gradient-silver">완벽한 웹사이트 솔루션</span>
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              AI 웹사이트 제작부터 마케팅까지<br />
              <span className="text-sm text-gray-500 mt-2 inline-block">모든 것을 한 번에 해결</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "SEO 최적화",
                description: "검색엔진 최적화로 상위 노출을 보장합니다",
                color: "from-blue-400 to-blue-600"
              },
              {
                icon: "🌍",
                title: "GEO 최적화",
                description: "지역 검색 최적화로 로컬 고객을 확보합니다",
                color: "from-green-400 to-green-600"
              },
              {
                icon: "📱",
                title: "AEO 최적화",
                description: "음성 검색 최적화로 미래를 준비합니다",
                color: "from-purple-400 to-purple-600"
              },
              {
                icon: "📈",
                title: "웹사이트 마케팅",
                description: "전문 마케팅팀이 성과를 극대화합니다",
                color: "from-orange-400 to-orange-600"
              },
              {
                icon: "🛠️",
                title: "자체 웹빌더",
                description: "직관적인 드래그 앤 드롭으로 쉽게 편집",
                color: "from-pink-400 to-pink-600"
              },
              {
                icon: "⚡",
                title: "빠른 로딩",
                description: "최적화된 코드로 빠른 속도를 보장합니다",
                color: "from-yellow-400 to-yellow-600"
              }
            ].map((feature, i) => (
              <div key={i} className="relative group">
                <div className="relative web-glass rounded-3xl p-8 web-hover-lift shadow-xl shadow-black/40 border-white/10">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl shadow-xl shadow-black/40 group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 mb-6`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-3 line-clamp-2 group-hover:web-text-gradient transition-all">{feature.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-40 px-6 bg-gradient-to-b from-black via-gray-900/10 to-black relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-slate-600 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-gray-700 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "2s", animationDuration: "10s" }} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2.5 mb-8 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
              <span className="text-sm font-bold web-text-gradient-silver tracking-wide">🌐 GALLERY</span>
            </div>
            <h3 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              <span className="web-text-gradient-silver">웹사이트 Preview</span>
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              AI가 만들어낸 놀라운 웹사이트들을 확인해보세요<br />
              <span className="text-sm text-gray-500 mt-2 inline-block">당신의 다음 프로젝트를 위한 영감</span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {websites.map((website) => (
              <div key={website.id} className="relative group">
                <div className="relative web-glass rounded-3xl overflow-hidden shadow-xl shadow-black/40 border-white/10">
                  <div className="relative h-72 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
                    {website.thumbnail_url ? (
                      <img src={website.thumbnail_url} alt={website.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-20 h-20 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                    )}
                    {website.status === "processing" && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-sm font-semibold">생성 중...</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">{getStatusBadge(website.status)}</div>
                  </div>
                  <div className="p-7">
                    <h4 className="text-xl font-bold mb-3 web-line-clamp-2 group-hover:web-text-gradient transition-all">{website.title}</h4>
                    <p className="text-sm text-gray-400 mb-5 web-line-clamp-2 leading-relaxed">{website.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-5 font-semibold">
                      <span>{new Date(website.created_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric", timeZone: "UTC" })}</span>
                      <span className="px-2 py-1 bg-white/5 rounded-lg">{website.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative py-20 px-6 border-t border-white/5 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="Web Create" className="h-16 w-16 web-logo-glow opacity-80" />
            </div>
            <h2 className="text-3xl font-black web-text-gradient-silver mb-4 tracking-tight">TOTARO WEB</h2>
            <p className="text-gray-500 text-base mb-10 font-medium">© 2025 TOTARO WEB. Powered by Advanced AI Technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebApp;
