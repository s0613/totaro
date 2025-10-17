# TOTARO 웹 아키텍처(MLP) — 2025-10-14

## 0) 개요
- 목적: 메인 홈페이지 기반, 서비스 하위 페이지(1. 웹 빌더, 2. B2B 키워드 최적화, 5. Shopify 해외 판매)의 정보구조/라우팅/컴포넌트/데이터/SEO/이벤트/마일스톤 정의
- 범위 제외: 3. AI 영상/콘텐츠 생성(이미 구축 — 참조만)

---

## 1) IA(Information Architecture)

```
/                                   (메인: Hero/핵심 가치/CTA)
├─ /solutions/builder                (1. 웹 빌더)
├─ /solutions/b2b-keywords          (2. B2B 타겟 키워드 최적화)
├─ /solutions/shopify-export        (5. 쇼피파이 외국 판매 사이트 구축)
├─ /solutions/ai-video              (3. AI 영상/콘텐츠 생성 — 기 구축)
├─ /about/developers
├─ /contact
└─ /en/*                            (모든 상응 영문 라우팅)
```

---

## 2) 라우팅/폴더 구조

```
app/
  page.tsx                          // 메인 Hero(임팩트형)
  about/developers/page.tsx
  contact/page.tsx
  solutions/
    builder/page.tsx
    b2b-keywords/page.tsx
    shopify-export/page.tsx
    ai-video/page.tsx               // 참고용(기 구축)
  en/
    page.tsx
    solutions/
      builder/page.tsx
      b2b-keywords/page.tsx
      shopify-export/page.tsx
components/
  hero/HeroImpact.tsx
  solutions/SectionHero.tsx
  solutions/FeatureGrid.tsx
  solutions/StepFlow.tsx
  solutions/Testimonial.tsx
  solutions/FAQ.tsx
  solutions/PricingCta.tsx
lib/
  analytics.ts                      // GA4 이벤트
  events.ts                         // 이벤트 상수
  forms.ts                          // 문의/데모 제출
  schema.ts                         // Zod 스키마
  seo.ts                            // JSON‑LD 헬퍼
public/
  videos/ai-video-loop.mp4
  og/ai-video-hero.jpg
```

---

## 3) 공통 템플릿/가이드(솔루션 페이지)
- 섹션: Hero → 문제/대안 → 기능 → 사용 흐름 → 통합/연동 → 사례/성과 → FAQ → CTA
- 공통 컴포넌트: SectionHero, FeatureGrid, StepFlow, Testimonial, FAQ, PricingCta
- 공통 이벤트: cta_demo, cta_contact, cta_pricing, out_link_shopify
- SEO: Product/Service + BreadcrumbList + H2 키워드 정규화 + hreflang
- 접근성/성능: 폰트 서브셋, prefers-reduced-motion, 이미지 `next/image`, LCP<2.5s

---

## 4) 페이지별 설계

### 4-1) (1) 웹 빌더 — /solutions/builder
- 목적: 노코드/로코드로 다국어 랜딩/캠페인 생성
- 섹션: SectionHero, FeatureGrid(템플릿/블록/i18n/접근성/성능), StepFlow(프롬프트→추천→미리보기→배포), Integration(GA4/Search Console/Sitemaps)
- 데이터
  - SiteTemplate { id, name, i18nLocales, sections, performanceScore }
  - GenerationRequest { prompt, locale, targetMarket, theme }
  - DeploymentInfo { vercelProjectId, previewUrl, prodUrl }
- 이벤트: cta_demo, builder_generate_click, builder_preview_open, builder_deploy_request
- SEO: SoftwareApplication 또는 Service 스키마

#### 컴포넌트 트리(요약)
- page.tsx
  - SectionHero(title, subtitle, cta)
  - FeatureGrid(features[])
  - StepFlow
    - PromptForm(onSubmit)
    - TemplatePicker(templates[])
    - PreviewPane(html, locale)
    - DeployButton(onClick)
  - IntegrationSection(GA4, SearchConsole, Sitemaps)

#### 상태/흐름
- `builderState`: { step: 'prompt'|'template'|'preview'|'deploy', locale, targetMarket }
- 전이: promptSubmitted → templateChosen → previewReady → deployRequested → deploySuccess

#### 데이터 스키마(TypeScript)
```ts
export type SiteTemplate = {
  id: string;
  name: string;
  i18nLocales: string[]; // ['ko','en']
  sections: Array<{ key: string; props: Record<string, unknown> }>; 
  performanceScore?: number; // Lighthouse 예측 점수
};

export type GenerationRequest = {
  prompt: string;
  locale: 'ko'|'en';
  targetMarket: 'KR'|'US'|'JP'|'EU';
  theme?: 'light'|'dark';
};

export type DeploymentInfo = {
  vercelProjectId: string;
  previewUrl?: string;
  prodUrl?: string;
};
```

#### API 설계
- POST `/api/builder/generate` body: GenerationRequest → 200 { template: SiteTemplate }
- POST `/api/builder/deploy` body: { templateId, locale } → 200 DeploymentInfo

#### 분석 이벤트
- `builder_generate_click`, `builder_preview_open`, `builder_deploy_request`, `builder_deploy_success`

#### SEO/JSON‑LD(예시)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TOTARO Web Builder",
  "applicationCategory": "BusinessApplication",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
```

#### 수용 기준(AC)
- 프롬프트 입력 후 3초 내 템플릿 추천 반환
- 미리보기에서 ko/en 토글 시 레이아웃 흔들림 없음(CLS≈0)
- 배포 클릭 후 60초 내 Preview URL 제공

#### 와이어프레임(ASCII)
```
┌───────────────────────────── Hero(가치/CTA) ───────────────────────────┐
│ FeatureGrid(4)                                                        │
├── StepFlow ─ prompt → template → preview → deploy                     │
│  [PromptForm] [TemplatePicker] [PreviewPane] [DeployButton]           │
└──────────────────────── Integrations/FAQ/CTA ─────────────────────────┘
```

### 4-2) (2) B2B 키워드 최적화 — /solutions/b2b-keywords
- 목적: 바이어 의도 기반 키워드/콘텐츠 구조 추천
- 섹션: SectionHero, Problem/Why, FeatureGrid(클러스터링/SERP/스키마/내부링크), StepFlow(도메인→맵→권고안→체크리스트), Case/FAQ/PricingCta
- 데이터
  - KeywordCluster { topic, intents[], terms[], targetLocales[] }
  - PageRecommendation { url, title, h1, schemaTypes[], internalLinks[] }
  - TrackingPlan { events[], goals[] }
- 이벤트: b2b_audit_start, b2b_audit_download, cta_contact
- SEO: HowTo, FAQPage, BreadcrumbList

#### 컴포넌트 트리(요약)
- page.tsx
  - SectionHero
  - AuditForm(domain, locale)
  - ClusterMap(clusters[])
  - RecommendationTable(recommendations[])
  - ChecklistDownloadButton

#### 상태/흐름
- `auditState`: { domain, locale, status: 'idle'|'running'|'done', clusters, recommendations }
- 전이: start → fetch serp → build clusters → map pages → output checklist

#### 데이터 스키마(TypeScript)
```ts
export type KeywordCluster = {
  topic: string;
  intents: Array<'informational'|'comparative'|'transactional'>;
  terms: string[];
  targetLocales: string[];
};

export type PageRecommendation = {
  url: string;
  title: string;
  h1: string;
  schemaTypes: string[]; // ['Product','FAQPage']
  internalLinks: string[];
};

export type TrackingPlan = {
  events: string[];
  goals: string[];
};
```

#### API 설계
- POST `/api/keywords/audit` body: { domain, locale } → 200 { clusters: KeywordCluster[], recommendations: PageRecommendation[] }
- GET `/api/keywords/checklist?domain=...` → 200 file(pdf|csv)

#### 분석 이벤트
- `b2b_audit_start`, `b2b_cluster_view`, `b2b_reco_export`, `cta_contact`

#### SEO/JSON‑LD(예시)
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "B2B Keyword Optimization",
  "step": ["Audit","Cluster","Recommend","Implement"]
}
```

#### 수용 기준(AC)
- 도메인 입력 후 10초 내 클러스터 맵 표시(샘플 데이터 허용)
- 권고안 표에서 title/h1/schemaTypes가 최소 5행 이상 출력
- 체크리스트 다운로드 링크 정상 동작

#### 와이어프레임(ASCII)
```
┌────────────── Hero ──────────────┐
│ [AuditForm] domain, locale       │
├──────── ClusterMap ──────────────┤
│ bubbles by topic/intent          │
├──── RecommendationTable ─────────┤
│ URL | title | h1 | schema | links│
└──── ChecklistDownload/CTA ───────┘
```

### 4-3) (5) Shopify 해외 판매 — /solutions/shopify-export
- 목적: 다국어 스토어 구축/현지화/결제/물류 연동
- 섹션: SectionHero, FeatureGrid(다국어/다통화/결제/배송/피드), StepFlow(카탈로그→현지화→결제/배송→마켓→론칭), Integration(Shopify App/Payments/Merchant Center), Case/FAQ/PricingCta
- 데이터
  - CatalogItem { sku, title, localeVariants[], media[] }
  - ChannelConfig { country, currency, paymentGateways[], shippingRules[] }
  - LaunchChecklist { items[], status }
- 이벤트: shopify_consult_request, out_link_shopify, launch_checklist_download
- SEO: Product/OfferCatalog, Organization, FAQPage

#### 컴포넌트 트리(요약)
- page.tsx
  - SectionHero
  - FeatureGrid
  - StepFlow(steps: catalog, l10n, payments, channels, launch)
  - ChannelMatrix(channels[])
  - LaunchChecklistDownload

#### 상태/흐름
- `exportState`: { country, currency, stepsCompleted: string[], channels: string[] }
- 전이: catalogUploaded → localized → paymentsSet → channelsLinked → launchReady

#### 데이터 스키마(TypeScript)
```ts
export type CatalogItem = {
  sku: string;
  title: string;
  localeVariants: Array<{ locale: string; title: string; description?: string }>;
  media: string[]; // URLs
};

export type ChannelConfig = {
  country: string;
  currency: string;
  paymentGateways: string[];
  shippingRules: string[];
};

export type LaunchChecklist = {
  items: Array<{ key: string; label: string; done: boolean }>;
  status: 'draft'|'ready';
};
```

#### API 설계
- POST `/api/shopify/checklist` body: { country } → 200 LaunchChecklist
- GET `/api/shopify/channels` → 200 { channels: string[] }

#### 분석 이벤트
- `shopify_consult_request`, `shopify_channel_select`, `launch_checklist_download`, `out_link_shopify`

#### SEO/JSON‑LD(예시)
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Shopify Export Setup",
  "areaServed": ["US","JP","EU"],
  "provider": { "@type": "Organization", "name": "TOTARO" }
}
```

#### 수용 기준(AC)
- 국가 선택 시 채널 매트릭스가 즉시 갱신(loading ≤ 1s)
- 체크리스트 파일 다운로드 가능(csv 또는 pdf)
- 외부 채널 링크(Shopify App, Payments) 200 응답 확인

#### 와이어프레임(ASCII)
```
┌────────────── Hero ──────────────┐
│ FeatureGrid(다국어/결제/배송/피드) │
├────────── StepFlow ──────────────┤
│ catalog → l10n → payments → channels → launch
├──────── ChannelMatrix ───────────┤
│ 🇺🇸 🇯🇵 🇪🇺  payments/shipping       │
└──── ChecklistDownload/CTA ───────┘
```

---

## 5) 기술 통합 지점
- 폼 처리: app/api/forms/submit/route.ts(Edge/Node) + lib/forms.ts(Zod)
- 번역: next-intl 또는 JSON 리소스(i18n 베이스)
- 관측성: Sentry, Logtail(선택)
- 배포: Vercel Preview → 리뷰 → Prod Promote, 도메인/SSL 자동

---

## 6) 마일스톤/DoD/리스크
- M1(오늘): 라우트/컴포넌트 스캐폴드, SectionHero/FeatureGrid/StepFlow 공통화, JSON‑LD 헬퍼 확장
- M2(내일): (1) 빌더 페이지 콘텐츠 채우기 + 이벤트 연동 + i18n(ko/en)
- M3(모레): (2) B2B 키워드 페이지 진단 폼/샘플 리포트, 스키마 검증
- M4(이후): (5) Shopify 페이지 체크리스트/상담 폼, 외부 채널 링크 검증

DoD(공통): CLS≈0, LCP<2.5s, 접근성 AA, GA4 이벤트 수집, hreflang/JSON‑LD 유효

리스크: 영상/폰트 용량, 다국어 레이아웃 흔들림, 외부 채널 정책 변경 → 각각 서브셋/고정 높이/모니터링 배치로 대응


