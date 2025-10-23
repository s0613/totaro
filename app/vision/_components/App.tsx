"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import AboutSection from "./AboutSection";
import { VideoPlayer } from "./VideoPlayer";

export interface Video {
  id: string;
  user_id: string;
  title: string;
  prompt: string;
  status: "pending" | "processing" | "completed" | "failed";
  video_url?: string;
  thumbnail_url?: string;
  duration?: number;
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

const mockVideos: Video[] = [
  {
    id: "1",
    user_id: "demo",
    title: "아름다운 일몰 풍경",
    prompt:
      "해변에서 파도가 부드럽게 밀려오는 모습, 석양이 지평선에 걸쳐있고 갈매기들이 날아다니는 평화로운 장면",
    status: "completed",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail_url:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    duration: 10,
    created_at: FIXED_CREATED_AT,
    updated_at: FIXED_UPDATED_AT,
  },
  {
    id: "2",
    user_id: "demo",
    title: "도시의 밤 풍경",
    prompt: "높은 빌딩들 사이로 네온사인이 반짝이고 차량들이 지나가는 야경",
    status: "processing",
    duration: 5,
    created_at: FIXED_CREATED_AT,
    updated_at: FIXED_UPDATED_AT,
  },
  {
    id: "3",
    user_id: "demo",
    title: "숲속의 고요함",
    prompt: "안개가 낀 숲속에서 햇살이 나무 사이로 비치는 모습",
    status: "completed",
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail_url:
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=800",
    duration: 8,
    created_at: FIXED_CREATED_AT,
    updated_at: FIXED_UPDATED_AT,
  },
];

const VisionApp: React.FC = () => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardTilts, setCardTilts] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [autoAnimationStarted, setAutoAnimationStarted] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showGeneratedVideo, setShowGeneratedVideo] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<Video | null>(null);
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

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          const newVideo: Video = {
            id: Date.now().toString(),
            user_id: "demo",
            title,
            prompt,
            status: "completed",
            video_url:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            thumbnail_url: "/video.mp4",
            duration,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setVideos([newVideo, ...videos]);
          setTitle("");
          setPrompt("");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleDelete = (videoId: string) => {
    if (confirm("정말로 이 비디오를 삭제하시겠습니까?")) {
      setVideos(videos.filter((v) => v.id !== videoId));
    }
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

    // 비디오 제목 자동 입력
    const titleText = "청원푸드 홈페이지 홍보 영상";
    await typeText(titleText, setTitle, 80);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // 프롬프트 자동 입력
    const promptText = "홈페이지를 영어 나레이션으로 주문 방법 같은 것들을 설명하는 영상 만들어줘";
    await typeText(promptText, setPrompt, 50);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // 비디오 생성 시뮬레이션 시작: 정확히 5초 표시 후 전환
    setLoading(true);
    setProgress(0);

    const DURATION_MS = 5000;
    const startAt = Date.now();

    let progressTimer: any;
    if (reducedMotion) {
      // 모션 최소화: 바로 100%로
      progressTimer = setTimeout(() => setProgress(100), 300);
    } else {
      progressTimer = setInterval(() => {
        const elapsed = Date.now() - startAt;
        const pct = Math.min(100, Math.round((elapsed / DURATION_MS) * 100));
        setProgress(pct);
        if (pct >= 100) {
          clearInterval(progressTimer);
        }
      }, 100);
    }

    setTimeout(() => {
      // 5초 후 바로 예시 영상 표시
      setLoading(false);
      setProgress(100);
      const newVideo: Video = {
        id: Date.now().toString(),
        user_id: "demo",
        title: titleText,
        prompt: promptText,
        status: "completed",
            video_url: "/video.mp4",
        thumbnail_url: "/video.mp4",
        duration: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setGeneratedVideo(newVideo);
      setShowForm(false);
      setShowGeneratedVideo(true);
    }, DURATION_MS);
  };

  const handleStartDemo = async () => {
    createSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const titleText = "청원푸드 홈페이지 홍보 영상";
    await typeText(titleText, setTitle, 80);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const promptText =
      "홈페이지를 영어 나레이션으로 주문 방법 같은 것들을 설명하는 영상 만들어줘";
    await typeText(promptText, setPrompt, 50);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          const newVideo: Video = {
            id: Date.now().toString(),
            user_id: "demo",
            title: titleText,
            prompt: promptText,
            status: "completed",
            video_url: "/video.mp4",
            thumbnail_url: "/video.mp4",
            duration: 5,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setVideos([newVideo, ...videos]);
          setTitle("");
          setPrompt("");
          setTimeout(() => {
            setSelectedVideo(newVideo);
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 1000);
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

      {/* in-vision header removed as requested */}

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
        </div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="web-animate-fade-in">
            <div className="mb-12 flex justify-center">
              <img src="/logo.png" alt="Vision Create" className="h-32 w-32 md:h-40 md:w-40 web-logo-glow web-animate-float opacity-90" style={{ animationDuration: "10s" }} />
            </div>
            <div className="inline-block px-5 py-2.5 mb-10 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
              <span className="text-sm font-bold text-gray-200 tracking-wide">✦ 사내 전용 AI 영상 생성(In‑house)</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-10 leading-[0.9] tracking-tighter">
              <span className="text-gray-400 font-medium text-3xl md:text-5xl lg:text-6xl block mb-3">영상은 누구나 만들지만,</span>
              <span className="inline-block">
                <span className="text-white">결과는</span>
                <span className="inline-block cursor-default relative web-animate-pulse-scale ml-2">
                  <span className="relative z-10 text-white">우리만 만듭니다.</span>
                </span>
              </span>
            </h2>
            <p className="text-xl md:text-3xl text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed font-light">
              모든 처리가 사내 전용 파이프라인에서 이뤄지며 데이터가 외부로 나가지 않습니다.<br />
              <span className="text-gray-500 text-lg md:text-2xl">보안·프라이버시 기준을 준수하는 기업용 워크플로우.</span>
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

        {/* 스크롤 인디케이터 제거 */}
      </section>

      <section ref={createSectionRef} id="create" className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 web-animate-slide-up">
            <div className="inline-block px-5 py-2.5 mb-8 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
              <span className="text-sm font-bold text-gray-200 tracking-wide">🎬 In‑house Video Creation</span>
            </div>
            <h3 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              <span className="text-blue-400 block mb-2">AI가 만드는</span>
              <span className="inline-block hover:scale-105 transition-transform text-gray-100">당신만의 영상</span>
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              프롬프트를 입력하고 몇 초만 기다리면<br />
              <span className="text-gray-200 font-semibold">프리미엄 퀄리티</span>의 비디오가 완성됩니다
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gray-500 rounded-3xl blur-xl opacity-10 group-hover:opacity-25 transition duration-1000"></div>
              <div className="relative web-glass-strong rounded-3xl p-10 web-animate-slide-up web-hover-lift shadow-2xl shadow-black/40 border-white/20">
                {showForm ? (
                  <form onSubmit={handleSubmit} className="space-y-7">
                    {!loading && (
                      <>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-3 tracking-wide">비디오 제목</label>
                          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium" placeholder="예: 아름다운 일몰 풍경" disabled={autoAnimationStarted} />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-3 tracking-wide">프롬프트</label>
                          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} required rows={6} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none font-medium leading-relaxed" placeholder="생성하고 싶은 비디오를 상세히 설명해주세요...&#10;&#10;예: 해변에서 파도가 부드럽게 밀려오는 모습, 석양이 지평선에 걸쳐있고 갈매기들이 날아다니는 평화로운 장면" disabled={autoAnimationStarted} />
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
                          <h4 className="text-lg font-bold text-white mb-2">AI가 영상을 생성하고 있습니다</h4>
                          <p className="text-sm text-gray-400 mb-4">잠시만 기다려주세요...</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm font-bold text-gray-300">
                            <span>진행률</span>
                            <span className="text-blue-400">{progress}%</span>
                          </div>
                          <div className="relative w-full h-4 bg-white/10 rounded-full overflow-hidden">
                            <div className="absolute inset-0 bg-web-gradient-apple transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>프롬프트 분석 완료</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${progress > 30 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span>{progress > 30 ? '이미지 생성 완료' : '이미지 생성 중...'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${progress > 70 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span>{progress > 70 ? '비디오 합성 완료' : '비디오 합성 중...'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${progress === 100 ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            <span>{progress === 100 ? '최종 완성!' : '최종 처리 중...'}</span>
                          </div>
                        </div>

                        {/* 미리보기 스켈레톤 */}
                        <div className="mt-4">
                          <div className="aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 relative">
                          </div>
                        </div>
                      </div>
                    )}
                    {!loading && (
                      <button type="button" onClick={() => { window.location.href = '/inquiry'; }} className="group relative w-full py-6 bg-web-gradient-apple rounded-2xl text-white font-bold text-lg hover:scale-[1.02] transition-all shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 overflow-hidden web-btn-shimmer web-ripple">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          서비스 문의하기
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </button>
                    )}
                  </form>
                ) : showGeneratedVideo && generatedVideo ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-gray-200 mb-4">생성 완료!</h4>
                      <p className="text-gray-400">AI가 당신의 영상을 완성했습니다</p>
                    </div>
                    <div className="relative">
                      <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden">
                        <video 
                          className="w-full h-full object-cover" 
                          controls 
                          poster={generatedVideo.thumbnail_url}
                        >
                          <source src={generatedVideo.video_url} type="video/mp4" />
                        </video>
                      </div>
                      <div className="mt-4">
                        <h5 className="text-lg font-bold text-white mb-2">{generatedVideo.title}</h5>
                        <p className="text-sm text-gray-400 mb-6">{generatedVideo.prompt}</p>
                        <div className="text-center">
                          <button 
                            onClick={() => { window.location.href = '/inquiry'; }} 
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
                          </button>
                          <p className="text-xs text-gray-500 mt-3">
                            이 영상처럼 AI가 만드는 맞춤형 비디오를 원하신다면 문의해주세요
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
                <h4 className="text-3xl font-black mb-8 text-gray-200">AI 비디오 생성 프로세스</h4>
                <div className="space-y-7">
                  {[
                    { icon: "✨", title: "프롬프트 분석", desc: "AI가 당신의 설명을 정확히 이해하고 분석합니다", color: "from-slate-400 to-slate-600" },
                    { icon: "🎨", title: "이미지 생성", desc: "고품질 키프레임 이미지들을 생성합니다", color: "from-gray-400 to-gray-600" },
                    { icon: "🎬", title: "비디오 합성", desc: "프레임들을 자연스럽게 연결하여 비디오를 만듭니다", color: "from-zinc-400 to-zinc-600" },
                    { icon: "✅", title: "최종 완성", desc: "고품질 비디오가 완성되어 다운로드 가능합니다", color: "from-neutral-400 to-neutral-600" },
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

            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-40 px-6 bg-black relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-slate-600 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-gray-700 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "2s", animationDuration: "10s" }} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2.5 mb-8 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
              <span className="text-sm font-bold text-gray-200 tracking-wide">🎥 GALLERY</span>
            </div>
            <h3 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              <span className="text-gray-200">영상 Preview</span>
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              AI가 만들어낸 놀라운 비디오들을 확인해보세요<br />
              <span className="text-sm text-gray-500 mt-2 inline-block">당신의 다음 창작물을 위한 영감</span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="relative group">
                <div className="relative web-glass rounded-3xl overflow-hidden shadow-xl shadow-black/40 border-white/10">
                  <div className="relative h-72 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
                    {video.thumbnail_url ? (
                      <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-20 h-20 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                      </div>
                    )}
                    {video.status === "processing" && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-sm font-semibold">생성 중...</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">{getStatusBadge(video.status)}</div>
                  </div>
                  <div className="p-7">
                    <h4 className="text-xl font-bold mb-3 web-line-clamp-2 group-hover:text-blue-400 transition-all">{video.title}</h4>
                    <p className="text-sm text-gray-400 mb-5 web-line-clamp-2 leading-relaxed">{video.prompt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                      <span>{new Date(video.created_at).toLocaleDateString("ko-KR", { month: "short", day: "numeric", timeZone: "UTC" })}</span>
                      {video.duration && <span className="px-2 py-1 bg-white/5 rounded-lg">{video.duration}초</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AboutSection />

      <footer className="relative py-20 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="Vision Create" className="h-16 w-16 web-logo-glow opacity-80" />
            </div>
            <h2 className="text-3xl font-black text-gray-200 mb-4 tracking-tight">VISIONCREATE</h2>
            <p className="text-gray-500 text-base mb-10 font-medium">© 2025 VISIONCREATE. Powered by Advanced AI Technology.</p>
          </div>
        </div>
      </footer>

      {selectedVideo && (
        <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
};

export default VisionApp;


