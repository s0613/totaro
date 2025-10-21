# AEO-AIO README

이 문서는 Korean Acorn 프로젝트의 AEO(AI Engine Optimization) 및 AIO(AI Optimization) 설정에 대한 가이드입니다.

## 개요

이 프로젝트는 Google AIO 및 AEO를 위한 최적화된 구조로 설계되었습니다:

- **인덱싱/중복 해결**: www→non-www 301 리다이렉트, HTTP→HTTPS, self-canonical, hreflang reciprocal
- **JSON-LD 주입**: Organization, WebSite with SearchAction, Service per locale, FAQ
- **AI 지향 피드**: `/ai/sitemap.json`, `/ai/sitemap.ndjson`, `/ai/llms.txt`
- **robots.txt 업데이트**: 정적 자산 허용, GPTBot 정책 토글
- **sitemap.xml**: canonical-only 엔트리

## 주요 파일 구조

### 설정 파일

- `next.config.mjs`: trailingSlash, www→non-www 리다이렉트, i18n 설정
- `app/robots.ts`: GPTBot 정책 포함 robots.txt 생성
- `app/sitemap.ts`: canonical-only sitemap 생성

### SEO 라이브러리

- `lib/seo.ts`: `buildSEO()` 함수로 메타데이터 관리
- `lib/schemas.ts`: JSON-LD 스키마 함수들
- `components/seo/JsonLd.tsx`: JSON-LD 렌더링 컴포넌트

### 페이지

- `app/page.tsx`: 메인 페이지 (default locale)
- `app/us/page.tsx`: 미국 페이지 (en-US)
- `app/ca/page.tsx`: 캐나다 페이지 (en-CA)

### AI 피드

- `app/ai/sitemap.json/route.ts`: 구조화된 JSON 피드
- `app/ai/sitemap.ndjson/route.ts`: NDJSON 스트림 피드
- `app/ai/llms.txt/route.ts`: AI 시스템용 텍스트 파일

## 수정 방법

### 요약(Summaries) 수정

각 페이지의 JSON-LD 데이터에서 서비스 설명을 수정하려면:

1. `app/page.tsx`, `app/us/page.tsx`, `app/ca/page.tsx`에서 `serviceData` 객체 수정
2. `description` 필드를 업데이트

### FAQ 수정

각 페이지의 FAQ를 수정하려면:

1. 해당 페이지의 `faqData` 배열에서 질문과 답변 수정
2. 새로운 FAQ 추가 또는 기존 FAQ 제거

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
- `/ai/llms.txt` - AI 시스템 파일 확인

### Search Console 설정

1. 사이트맵 재제출: `/sitemap.xml`
2. robots.txt 검증
3. 구조화된 데이터 테스트

## 환경 변수

- `GPTBOT_POLICY`: GPTBot 접근 정책 ('allow' | 'block', 기본값: 'block')

## 주의사항

- 모든 변경사항은 idempotent하게 설계되어 안전하게 재실행 가능
- 외부 패키지 불필요
- TypeScript 및 Next.js App Router 호환
