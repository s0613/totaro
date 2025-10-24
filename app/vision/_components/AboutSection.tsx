"use client";

import React, { useState, useEffect } from "react";

const AboutSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById("about");
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <section id="about" className="py-40 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black">
        <div className="absolute top-20 left-20 w-96 h-96 bg-slate-600 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-20 right-20 w-[32rem] h-[32rem] bg-gray-700 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s", animationDuration: "10s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-600 rounded-full blur-3xl opacity-5 animate-pulse" style={{ animationDelay: "4s", animationDuration: "12s" }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 animate-slide-up">
          <div className="inline-block px-5 py-2.5 mb-8 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg shadow-black/20">
            <span className="text-sm font-bold text-gradient-silver tracking-wide">👨‍💻 ABOUT ME</span>
          </div>
          <h3 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
            <span className="text-gradient-silver inline-block hover:scale-105 transition-transform cursor-default">개발자 소개</span>
          </h3>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            AI 기술로 새로운 가능성을 만들어가는<br />
            <span className="text-gradient-silver font-semibold">풀스택 개발자</span>입니다
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`relative group animate-slide-up ${isVisible ? "animate-fade-in" : ""}`} style={{ animationDelay: "0.2s" }}>
            <div className="absolute -inset-4 bg-gradient-silver rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative glass-strong rounded-3xl p-8 hover-lift shadow-2xl shadow-black/40 border-white/20">
              <div className="relative overflow-hidden rounded-2xl">
                <img src="/songseungju.webp" alt="송승주 개발자" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-apple rounded-full flex items-center justify-center text-2xl shadow-xl shadow-black/40 animate-float">💻</div>
              <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-accent rounded-full flex items-center justify-center text-xl shadow-xl shadow-black/40 animate-float" style={{ animationDelay: "1s" }}>🚀</div>
            </div>
          </div>

          <div className={`space-y-8 animate-slide-up ${isVisible ? "animate-fade-in" : ""}`} style={{ animationDelay: "0.4s" }}>
            <div className="glass rounded-3xl p-10 hover-lift shadow-xl shadow-black/30 border-white/10">
              <h4 className="text-3xl font-black mb-6 text-gradient-silver">송승주</h4>
              <p className="text-base text-gray-400 leading-relaxed mb-6">
                "기술을 가진 사람만 콘텐츠를 만들 수 있는 세상"을 바꾸고자 개발되었습니다. 저는 코드를 짜는 사람으로서, 복잡한 기술을 감추고 누구나 AI를 통해 바이어에게 <span className="text-gradient-silver font-semibold">'보이는' 영상과 스토리</span>를 만들 수 있도록 시스템을 설계했습니다.
              </p>
              <p className="text-base text-gray-400 leading-relaxed mb-6">
                생성형 AI와 데이터 파이프라인을 결합해, 제품이 스스로 팔리고 성장하는 구조를 코드로 구현하고 있습니다. TOTARO는 기술보다 결과를, 영상보다 메시지를 중요하게 생각합니다.
              </p>
              <p className="text-base text-gray-400 leading-relaxed">우리는 기술로 브랜드의 이야기가 세계로 전달되는 방식을 다시 설계하고 있습니다.</p>
            </div>

            <div className="glass rounded-3xl p-8 hover-lift shadow-xl shadow-black/30 border-white/10">
              <h5 className="text-2xl font-bold mb-6 text-gradient-silver">주요 경력</h5>
              <div className="space-y-6">
                {[
                  { name: "Trynic AI", description: "패션/광고용 AI 영상·이미지 합성 서비스", role: "모델 선택·의상 합성·레퍼런스 기반 생성" },
                  { name: "Medivu(메디뷰)", description: "의료영상 판독문 자동 생성/가명화 솔루션", role: "병원 워크플로우 연계" },
                  { name: "TotaloadCert/수출 중고차 ERP", description: "말소→통관→선적 문서 자동화와 진행 현황 통합 조회", role: "문서 자동화 시스템 구축" },
                ].map((project, i) => (
                  <div key={i} className="relative group/project">
                    {i < 2 && <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-gray-600 to-gray-800 opacity-50"></div>}
                    <div className="flex items-start gap-6 p-6 bg-white/5 hover:bg-white/10 rounded-2xl transition-all hover:translate-x-2 border border-white/5 hover:border-white/20">
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gradient-silver mt-2 shadow-lg"></div>
                      <div className="flex-1">
                        <h6 className="font-bold text-lg mb-2 group-hover/project:text-white transition-colors">{project.name}</h6>
                        <p className="text-sm text-gray-300 mb-2 leading-relaxed">{project.description}</p>
                        <div className="text-xs text-gray-500 font-medium">{project.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-20 text-center animate-slide-up ${isVisible ? "animate-fade-in" : ""}`} style={{ animationDelay: "0.6s" }}>
          <div className="glass rounded-3xl p-12 hover-lift shadow-xl shadow-black/30 border-white/10 max-w-4xl mx-auto">
            <div className="text-6xl mb-6 opacity-20">"</div>
            <div className="text-sm text-gray-500 mb-4">- 스티브 잡스</div>
            <blockquote className="text-lg md:text-2xl lg:text-3xl font-light text-gray-300 leading-relaxed mb-6">
              혁신은 리더와 팔로워를 구분하는<br />
              <span className="text-gradient-silver font-semibold">유일한 기준</span>입니다.
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;


