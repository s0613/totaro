export default function OptimizePage() {
  return (
    <section className="min-h-screen bg-bg text-textPrimary px-8 py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">AEO/SEO/GEO 최적화 가이드</h1>
        <p className="text-textSecondary mb-10 text-pretty break-keep">
          AI 검색 시대에는 전통적인 SEO만으로는 부족합니다. AEO(Answer Engine Optimization), GEO(Generative Engine Optimization),
          LEO(LLM Engine Optimization)를 상황에 맞게 결합해 브랜드가 AI 답변에 인용/언급되도록 설계해야 합니다.
        </p>

        {/* 1. 정의와 차이 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">1) AEO·SEO·GEO·LEO: 뜻과 차이</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface border border-line rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">AEO · AI 답변 최적화</h3>
              <ul className="list-disc pl-5 text-textSecondary space-y-1">
                <li>질문에 대한 간결한 정답 제공(FAQ/가이드, 요약 중심)</li>
                <li>구조화 데이터(Organization/WebSite/WebPage/Offer, FAQ 등)</li>
                <li>브랜드/제품을 한 문장으로 설명 가능한 정의 문구</li>
              </ul>
            </div>
            <div className="bg-surface border border-line rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">SEO · 검색엔진 최적화</h3>
              <ul className="list-disc pl-5 text-textSecondary space-y-1">
                <li>의도 기반 IA, 메타/헤딩/내부링크, Core Web Vitals</li>
                <li>색인 친화: sitemap/robots, 크롤링 허용 범위 설계</li>
                <li>권위 신호(백링크/저자/레퍼런스) 강화</li>
              </ul>
            </div>
            <div className="bg-surface border border-line rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">GEO · 지역/생성 엔진 최적화</h3>
              <ul className="list-disc pl-5 text-textSecondary space-y-1">
                <li>hreflang/다국어, 국가·도시·산업별 랜딩</li>
                <li>현지 시그널(주소/연락처/사례/용어)과 CTA 현지화</li>
                <li>지역별 인용 가능한 레퍼런스 구축</li>
              </ul>
            </div>
            <div className="bg-surface border border-line rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">LEO · LLM 엔진별 최적화</h3>
              <ul className="list-disc pl-5 text-textSecondary space-y-1">
                <li>플랫폼별 톤/형식 최적화(ChatGPT/Claude/Perplexity/Gemini)</li>
                <li>인용 친화(출처 명시, 신뢰 가능한 데이터/케이스)</li>
                <li>질문 중심 설계로 모델의 요약/추론 친화성 확보</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. 플랫폼별 전략 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">2) 플랫폼별 최적화 전략</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface border border-line rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">ChatGPT</h3>
              <ul className="list-disc pl-5 text-textSecondary space-y-1">
                <li>대화형·단계별 설명, 명확한 요약/핵심 문장</li>
                <li>브랜드 포지셔닝 한 줄 정의(엘리베이터 피치)</li>
              </ul>
            </div>
            <div className="bg-surface border border-line rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">Claude</h3>
              <ul className="list-disc pl-5 text-textSecondary space-y-1">
                <li>논리/근거 중심 구조, 윤리/안전 고려</li>
                <li>정의→근거→예시 순서의 분석형 포맷</li>
              </ul>
            </div>
            <div className="bg-surface border border-line rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">Perplexity</h3>
              <ul className="list-disc pl-5 text-textSecondary space-y-1">
                <li>인용 가능한 1차 출처/데이터 제공</li>
                <li>출처 표기, 리서치 페이지/케이스 스터디 강화</li>
              </ul>
            </div>
            <div className="bg-surface border border-line rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">Google Gemini/AI Overview</h3>
              <ul className="list-disc pl-5 text-textSecondary space-y-1">
                <li>SEO 시그널 + 멀티모달(이미지/동영상) 설명 강화</li>
                <li>명확한 스키마, 요약 가능한 문장 구조</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. AEO 4단계 템플릿 */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-3">3) AEO 콘텐츠 4단계 템플릿</h2>
          <ol className="list-decimal pl-5 text-textSecondary space-y-1">
            <li>질문: 사용자의 실제 질문을 제목/인트로에 명시</li>
            <li>상황: 대상/제약/목적(예: 예산·지역·산업) 맥락 제시</li>
            <li>문제: 흔한 실수/오해와 실패 요인 정리</li>
            <li>해결: 단계별 체크리스트와 간결한 정답 제시</li>
          </ol>
        </section>

        {/* 4. 체크리스트 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">4) 실행 체크리스트</h2>
          <ul className="list-disc pl-5 text-textSecondary space-y-1">
            <li>브랜드 한 줄 정의와 대표 사례 3개를 모든 랜딩에 일관되게 사용</li>
            <li>FAQ/가이드에 질문·답변 구조 도입, 요약 박스 제공</li>
            <li>스키마(Organization/WebSite/WebPage/FAQ/Offer)와 hreflang 적용</li>
            <li>국가/산업별 랜딩과 현지 CTA, 인용 가능한 레퍼런스 구축</li>
          </ul>
        </section>
      </div>
    </section>
  );
}


