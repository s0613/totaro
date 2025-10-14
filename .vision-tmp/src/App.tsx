import React, { useState, useEffect, useRef } from 'react';
import { VideoPlayer } from './components/Video/VideoPlayer';
import AboutSection from './components/About/AboutSection';
import { Video } from './lib/supabase';

// Mock data
const mockVideos: Video[] = [
  {
    id: '1',
    user_id: 'demo',
    title: '아름다운 일몰 풍경',
    prompt: '해변에서 파도가 부드럽게 밀려오는 모습, 석양이 지평선에 걸쳐있고 갈매기들이 날아다니는 평화로운 장면',
    status: 'completed',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    duration: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'demo',
    title: '도시의 밤 풍경',
    prompt: '높은 빌딩들 사이로 네온사인이 반짝이고 차량들이 지나가는 야경',
    status: 'processing',
    duration: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'demo',
    title: '숲속의 고요함',
    prompt: '안개가 낀 숲속에서 햇살이 나무 사이로 비치는 모습',
    status: 'completed',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
    duration: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardTilts, setCardTilts] = useState<{ [key: string]: { x: number; y: number } }>({});
  const heroRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const createSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Calculate 3D tilt for each card
      const newTilts: { [key: string]: { x: number; y: number } } = {};
      Object.entries(cardRefs.current).forEach(([id, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const cardCenterX = rect.left + rect.width / 2;
          const cardCenterY = rect.top + rect.height / 2;

          // Calculate distance from mouse to card center
          const deltaX = e.clientX - cardCenterX;
          const deltaY = e.clientY - cardCenterY;

          // Calculate tilt angles (max 15 degrees)
          const maxTilt = 15;
          const tiltX = (deltaY / rect.height) * maxTilt;
          const tiltY = (deltaX / rect.width) * -maxTilt;

          newTilts[id] = { x: tiltX, y: tiltY };
        }
      });
      setCardTilts(newTilts);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
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
            user_id: 'demo',
            title,
            prompt,
            status: 'completed',
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
            duration,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setVideos([newVideo, ...videos]);
          setTitle('');
          setPrompt('');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleDelete = (videoId: string) => {
    if (confirm('정말로 이 비디오를 삭제하시겠습니까?')) {
      setVideos(videos.filter(v => v.id !== videoId));
    }
  };

  const typeText = (text: string, setter: (value: string) => void, delay = 50) => {
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

  const handleStartDemo = async () => {
    // Scroll to create section
    createSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Wait for scroll
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Type title
    const titleText = '청원푸드 홈페이지 홍보 영상';
    await typeText(titleText, setTitle, 80);

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 300));

    // Type prompt
    const promptText = '홈페이지를 영어 나레이션으로 주문 방법 같은 것들을 설명하는 영상 만들어줘';
    await typeText(promptText, setPrompt, 50);

    // Wait before submitting
    await new Promise(resolve => setTimeout(resolve, 500));

    // Start loading
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          const newVideo: Video = {
            id: Date.now().toString(),
            user_id: 'demo',
            title: titleText,
            prompt: promptText,
            status: 'completed',
            video_url: '/demo-video.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            duration: 5,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setVideos([newVideo, ...videos]);
          setTitle('');
          setPrompt('');

          // Show video in popup after completion
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
      pending: { label: '대기 중', color: 'bg-gray-500/50' },
      processing: { label: '생성 중', color: 'bg-yellow-500/50' },
      completed: { label: '완료', color: 'bg-green-500/50' },
      failed: { label: '실패', color: 'bg-red-500/50' },
    };
    const { label, color } = config[status as keyof typeof config];
    return (
      <span className={`px-3 py-1.5 text-xs font-bold text-white rounded-full ${color} backdrop-blur-md border border-white/10`}>
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Mouse follow gradient */}
      <div
        className="fixed pointer-events-none z-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl transition-all duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(102,126,234,0.4) 0%, transparent 70%)',
          left: mousePos.x - 300,
          top: mousePos.y - 300,
        }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-black/95 backdrop-blur-3xl border-b border-white/5 shadow-2xl shadow-black/50' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-12 w-12 logo-glow"
              />
              <h1 className="text-2xl font-bold text-gradient-silver hover:scale-105 transition-transform cursor-pointer tracking-tight">
                VISIONCREATE
              </h1>
            </div>
            <div className="flex items-center gap-8">
              <a href="#create" className="group text-sm font-semibold text-gray-400 hover:text-white transition-all relative">
                <span className="relative z-10">생성</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-silver group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#gallery" className="group text-sm font-semibold text-gray-400 hover:text-white transition-all relative">
                <span className="relative z-10">갤러리</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-silver group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#about" className="group text-sm font-semibold text-gray-400 hover:text-white transition-all relative">
                <span className="relative z-10">소개</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-silver group-hover:w-full transition-all duration-300"></span>
              </a>
              <button className="px-6 py-2.5 bg-gradient-accent rounded-full text-sm font-bold hover:scale-105 hover:shadow-xl hover:shadow-gray-700/50 transition-all border border-white/10 btn-shimmer">
                <span className="relative z-10 flex items-center gap-2">
                  시작하기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-mesh-gradient">
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-apple blur-3xl animate-float opacity-10"
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

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="animate-fade-in">
            {/* Large floating logo */}
            <div className="mb-12 flex justify-center">
              <img
                src="/logo.png"
                alt="Vision Create"
                className="h-32 w-32 md:h-40 md:w-40 logo-glow animate-float opacity-90"
                style={{ animationDuration: '10s' }}
              />
            </div>

            <div className="inline-block px-5 py-2.5 mb-10 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
              <span className="text-sm font-bold text-gradient-silver tracking-wide">
                ✦ AI POWERED VIDEO GENERATION
              </span>
            </div>

            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black mb-10 leading-[0.9] tracking-tighter">
              <span className="text-gray-400 font-medium text-5xl md:text-7xl lg:text-8xl block mb-3">영상은 누구나 만들지만,</span>
              <span className="inline-block">
                <span className="inline-block cursor-default relative animate-pulse-scale">
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">결과</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-30 animate-pulse -z-10"></span>
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">는 우리만 만듭니다.</span>
              </span>
            </h2>

            <p className="text-xl md:text-3xl text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed font-light">
              AI 영상이 SEO·SNS 알고리즘까지 최적화되어<br />
              <span className="text-gray-500 text-lg md:text-2xl">브랜드 노출을 확장합니다.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button
                onClick={handleStartDemo}
                className="group relative px-14 py-6 bg-gradient-accent rounded-2xl text-white font-bold text-lg hover:scale-[1.05] transition-all shadow-2xl shadow-gray-900/80 hover:shadow-gray-700/90 overflow-hidden btn-shimmer ripple border border-white/10"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  지금 시작하기
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="group px-14 py-6 bg-white/8 backdrop-blur-xl rounded-2xl text-white font-bold text-lg hover:bg-white/12 transition-all border border-white/20 hover:scale-[1.05] ripple shadow-lg shadow-black/50">
                <span className="flex items-center gap-3">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  더 알아보기
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <span className="text-xs font-semibold">스크롤</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Create Section */}
      <section ref={createSectionRef} id="create" className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-block px-5 py-2.5 mb-8 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
              <span className="text-sm font-bold text-gradient-silver tracking-wide">🎬 VIDEO CREATION</span>
            </div>
            <h3 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              <span className="text-gradient-blue block mb-2">AI가 만드는</span>
              <span className="inline-block hover:scale-105 transition-transform text-gray-100">당신만의 영상</span>
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              프롬프트를 입력하고 몇 초만 기다리면<br />
              <span className="text-gradient-silver font-semibold">프리미엄 퀄리티</span>의 비디오가 완성됩니다
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-silver rounded-3xl blur-xl opacity-10 group-hover:opacity-25 transition duration-1000"></div>
              <div className="relative glass-strong rounded-3xl p-10 animate-slide-up hover-lift shadow-2xl shadow-black/40 border-white/20">
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 tracking-wide">
                      비디오 제목
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
                      placeholder="예: 아름다운 일몰 풍경"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 tracking-wide">
                      프롬프트
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      required
                      rows={6}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none font-medium leading-relaxed"
                      placeholder="생성하고 싶은 비디오를 상세히 설명해주세요...&#10;&#10;예: 해변에서 파도가 부드럽게 밀려오는 모습, 석양이 지평선에 걸쳐있고 갈매기들이 날아다니는 평화로운 장면"
                      disabled={loading}
                    />
                  </div>

                  {loading && (
                    <div className="space-y-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex justify-between text-sm font-bold text-gray-300">
                        <span>생성 중...</span>
                        <span className="text-gradient">{progress}%</span>
                      </div>
                      <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-apple transition-all duration-500 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                          style={{ animationDuration: '1.5s', animationIterationCount: 'infinite' }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full py-6 bg-gradient-apple rounded-2xl text-white font-bold text-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-2xl shadow-purple-500/40 hover:shadow-purple-500/60 overflow-hidden btn-shimmer ripple"
                  >
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
                    {!loading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass rounded-3xl p-10 hover-lift shadow-xl shadow-black/30 border-white/10">
                <h4 className="text-3xl font-black mb-8 text-gradient-silver">AI 비디오 생성 프로세스</h4>
                <div className="space-y-7">
                  {[
                    { icon: '✨', title: '프롬프트 분석', desc: 'AI가 당신의 설명을 정확히 이해하고 분석합니다', color: 'from-slate-400 to-slate-600' },
                    { icon: '🎨', title: '이미지 생성', desc: '고품질 키프레임 이미지들을 생성합니다', color: 'from-gray-400 to-gray-600' },
                    { icon: '🎬', title: '비디오 합성', desc: '프레임들을 자연스럽게 연결하여 비디오를 만듭니다', color: 'from-zinc-400 to-zinc-600' },
                    { icon: '✅', title: '최종 완성', desc: '고품질 비디오가 완성되어 다운로드 가능합니다', color: 'from-neutral-400 to-neutral-600' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-5 group/item hover:translate-x-2 transition-transform duration-300">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl shadow-xl shadow-black/40 group-hover/item:scale-110 group-hover/item:shadow-2xl transition-all duration-300`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-lg mb-1.5 group-hover/item:text-white transition-colors">{step.title}</h5>
                        <p className="text-sm text-gray-400 leading-relaxed group-hover/item:text-gray-300 transition-colors">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-3xl p-8 hover-lift shadow-xl shadow-black/30 border-white/10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-xl shadow-lg shadow-black/40">
                    💡
                  </div>
                  <h5 className="font-bold text-lg text-gray-100">프로 팁</h5>
                </div>
                <ul className="space-y-3.5 text-sm text-gray-400">
                  <li className="flex items-start gap-3 group/tip hover:text-gray-300 transition-colors">
                    <span className="text-slate-400 mt-0.5 group-hover/tip:text-slate-300 transition-colors">▸</span>
                    <span>구체적인 설명일수록 더 정확한 결과를 얻을 수 있습니다</span>
                  </li>
                  <li className="flex items-start gap-3 group/tip hover:text-gray-300 transition-colors">
                    <span className="text-slate-400 mt-0.5 group-hover/tip:text-slate-300 transition-colors">▸</span>
                    <span>색상, 분위기, 카메라 각도 등을 명시하세요</span>
                  </li>
                  <li className="flex items-start gap-3 group/tip hover:text-gray-300 transition-colors">
                    <span className="text-slate-400 mt-0.5 group-hover/tip:text-slate-300 transition-colors">▸</span>
                    <span>5-10초 길이가 가장 안정적인 품질을 제공합니다</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-40 px-6 bg-gradient-to-b from-black via-gray-900/10 to-black relative">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-slate-600 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-gray-700 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s', animationDuration: '10s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2.5 mb-8 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
              <span className="text-sm font-bold text-gradient-silver tracking-wide">🎥 GALLERY</span>
            </div>
            <h3 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              <span className="text-gradient-silver">영상 Preview</span>
            </h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              AI가 만들어낸 놀라운 비디오들을 확인해보세요<br />
              <span className="text-sm text-gray-500 mt-2 inline-block">당신의 다음 창작물을 위한 영감</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, i) => {
              return (
                <div
                  key={video.id}
                  className="relative group"
                >
                  <div className="relative glass rounded-3xl overflow-hidden shadow-xl shadow-black/40 border-white/10">
                  {/* Thumbnail */}
                  <div
                    className="relative h-72 bg-gradient-to-br from-gray-900 to-black cursor-pointer overflow-hidden"
                    onClick={() => video.status === 'completed' && setSelectedVideo(video)}
                  >
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-20 h-20 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                      </div>
                    )}

                    {video.status === 'processing' && (
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-sm font-semibold">생성 중...</p>
                        </div>
                      </div>
                    )}

                    {video.status === 'completed' && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                        <div className="transform scale-75 group-hover:scale-100 transition-transform duration-500">
                          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status badge */}
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(video.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-7">
                    <h4 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-gradient transition-all">
                      {video.title}
                    </h4>

                    <p className="text-sm text-gray-400 mb-5 line-clamp-2 leading-relaxed">
                      {video.prompt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-5 font-semibold">
                      <span>{new Date(video.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
                      {video.duration && (
                        <span className="px-2 py-1 bg-white/5 rounded-lg">{video.duration}초</span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {video.status === 'completed' && (
                        <>
                          <button
                            onClick={() => setSelectedVideo(video)}
                            className="group/btn flex-1 px-4 py-3 bg-gradient-apple rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg ripple"
                          >
                            <span className="flex items-center justify-center gap-1.5">
                              <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                              재생
                            </span>
                          </button>
                          {video.video_url && (
                            <a
                              href={video.video_url}
                              download
                              className="group/btn flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-bold text-center ripple"
                            >
                              <span className="flex items-center justify-center gap-1.5">
                                <svg className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                다운로드
                              </span>
                            </a>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="group/btn px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all text-sm font-bold ripple"
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          <svg className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          삭제
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <footer className="relative py-20 px-6 border-t border-white/5 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/logo.png"
                alt="Vision Create"
                className="h-16 w-16 logo-glow opacity-80"
              />
            </div>
            <h2 className="text-3xl font-black text-gradient-silver mb-4 tracking-tight">VISIONCREATE</h2>
            <p className="text-gray-500 text-base mb-10 font-medium">AI로 창조하는 무한한 가능성</p>
            <div className="flex justify-center gap-8 mb-10 flex-wrap">
              <a href="#" className="group text-sm font-semibold text-gray-500 hover:text-gray-300 transition-all relative">
                <span className="relative">
                  이용약관
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-silver group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
              <a href="#" className="group text-sm font-semibold text-gray-500 hover:text-gray-300 transition-all relative">
                <span className="relative">
                  개인정보처리방침
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-silver group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
              <a href="#" className="group text-sm font-semibold text-gray-500 hover:text-gray-300 transition-all relative">
                <span className="relative">
                  문의하기
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-silver group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
            </div>
            <div className="flex justify-center gap-6 mb-8">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110 border border-white/10">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110 border border-white/10">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110 border border-white/10">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
            <p className="text-gray-600 text-sm font-medium">© 2025 VISIONCREATE. Powered by Advanced AI Technology.</p>
          </div>
        </div>
      </footer>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
};

export default App;