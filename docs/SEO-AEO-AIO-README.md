# SEO-AEO-AIO README

이 문서는 TOTARO 프로젝트의 SEO(Search Engine Optimization), AEO(AI Engine Optimization), GEO(Global Engine Optimization), AIO(AI Optimization) 설정에 대한 가이드입니다.

## 개요

이 프로젝트는 글로벌 B2B 브랜드 사이트로 설계되어 Google AIO 및 AEO를 위한 최적화된 구조를 제공합니다:

- **인덱싱/중복 해결**: www→non-www 301 리다이렉트, HTTP→HTTPS, self-canonical, hreflang reciprocal
- **JSON-LD 주입**: Organization, WebSite with SearchAction, Service per locale, FAQ
- **AI 지향 피드**: `/ai/sitemap.json`, `/ai/sitemap.ndjson`, `/llms.txt`
- **robots.txt 업데이트**: 정적 자산 허용, GPTBot 정책 토글
- **sitemap.xml**: canonical-only 엔트리

## 주요 파일 구조

### 설정 파일

- `next.config.mjs`: trailingSlash, www→non-www 리다이렉트, 글로벌 i18n 설정 (en, ko, jp)
- `app/robots.ts`: GPTBot 정책 포함 robots.txt 생성
- `app/sitemap.ts`: 플랫폼 페이지 canonical-only sitemap 생성

### SEO 라이브러리

- `lib/seo.ts`: `buildSEO()` 함수로 글로벌 메타데이터 관리
- `lib/schemas.ts`: TOTARO 브랜드용 JSON-LD 스키마 함수들
- `components/seo/JsonLd.tsx`: JSON-LD 렌더링 컴포넌트

### 플랫폼 페이지

- `app/page.tsx`: 메인 페이지 (en-US, default)
- `app/solutions/page.tsx`: 솔루션 페이지
- `app/products/page.tsx`: 제품 페이지
- `app/contact/page.tsx`: 연락처 페이지

### AI 피드

- `app/ai/sitemap.json/route.ts`: 구조화된 JSON 피드
- `app/ai/sitemap.ndjson/route.ts`: NDJSON 스트림 피드
- `app/ai/llms.txt/route.ts`: AI 시스템용 텍스트 파일

## 수정 방법

### 요약(Summaries) 수정

각 페이지의 JSON-LD 데이터에서 서비스 설명을 수정하려면:

1. `app/page.tsx`, `app/solutions/page.tsx`, `app/products/page.tsx`, `app/contact/page.tsx`에서 `serviceData` 객체 수정
2. `description` 필드를 업데이트

### FAQ 수정

각 페이지의 FAQ를 수정하려면:

1. 해당 페이지의 `faqData` 배열에서 질문과 답변 수정
2. 새로운 FAQ 추가 또는 기존 FAQ 제거

### Answer-first 블록 수정

AI Overviews용 Answer-first 블록을 수정하려면:

1. 각 페이지의 `answerFirstData` 객체에서 `summary`와 `keyPoints` 수정
2. 간결한 요약과 핵심 포인트를 업데이트

### GPTBot 정책 토글

환경 변수로 GPTBot 접근을 제어할 수 있습니다:

```bash
# GPTBot 허용
GPTBOT_POLICY=allow

# GPTBot 차단 (기본값)
GPTBOT_POLICY=block
```

### 조직 정보 수정

글로벌 조직 정보를 수정하려면:

1. `app/layout.tsx`에서 `organizationData` 객체 수정
2. 회사명, URL, 로고, 소셜 미디어 링크 업데이트

### 다국어 설정 수정

글로벌 다국어 설정을 수정하려면:

1. `lib/seo.ts`에서 `localeConfig` 객체 수정
2. 각 언어별 제목, 설명, 키워드 업데이트

## 검증 방법

### 로컬 빌드 및 테스트

```bash
npm run build
npm run start
```

### 확인할 엔드포인트

- `/robots.txt` - GPTBot 정책 확인
- `/sitemap.xml` - canonical 엔트리 확인
- `/ai/sitemap.json` - AI 피드 확인
- `/ai/sitemap.ndjson` - NDJSON 피드 확인
- `/llms.txt` - AI 시스템 파일 확인

### Search Console 설정

1. 사이트맵 재제출: `https://totaro.com/sitemap.xml`
2. robots.txt 검증
3. 구조화된 데이터 테스트
4. "Alternate page with proper canonical tag" 문제 해결 확인

### 배포 후 단계

1. Google Search Console에서 사이트맵 재검증
2. "Alternate page with proper canonical tag" 문제 해결 확인
3. 라이브 테스트 실행 및 인덱싱 요청: `/`, `/solutions`, `/products`, `/contact`
4. seoClarity 또는 BrightEdge 보고서에서 AIO/AEO 가시성 개선 확인

## 환경 변수

- `GPTBOT_POLICY`: GPTBot 접근 정책 ('allow' | 'block', 기본값: 'block')

## 브랜드 정보

- **도메인**: https://totaro.com
- **브랜드**: TOTARO - Complete B2B Export Solutions
- **산업**: AI-powered B2B Export Platform
- **설립년도**: 2024
- **직원 수**: 50-200명

## 주의사항

- 모든 변경사항은 idempotent하게 설계되어 안전하게 재실행 가능
- 외부 패키지 불필요
- TypeScript 및 Next.js App Router 호환
- 글로벌 B2B 브랜드에 최적화된 구조
- 미래 서브도메인 확장을 위한 모듈화된 설계
