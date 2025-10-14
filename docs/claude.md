# Sora Extend Korean 프로젝트 가이드

이 프로젝트는 **fal.ai의 Sora 2 API**를 활용하여 12초 제한을 넘어 긴 영상(30초+)을 생성하는 웹 애플리케이션입니다.

## 프로젝트 개요

**목표**: 단 하나의 프롬프트로 30초 이상의 일관된 고품질 영상을 자동 생성
**핵심 기술**: OpenAI GPT-4 (프롬프트 계획) + fal.ai Sora 2 (영상 생성) + MoviePy (후처리)

## 핵심 아키텍처 설계 원칙

### 1) UI/프론트엔드 계층

**프레임워크**: Next.js 14+ (App Router) + React 18+
- 서버 사이드 렌더링(SSR)과 클라이언트 인터랙션의 최적 조합
- API Routes로 백엔드 통합 간소화

**디자인 시스템**: Radix UI + Tailwind CSS
- **Radix Themes**: 접근성 좋은 프리미티브 컴포넌트 (Button, Dialog, Select 등)
- **Tailwind CSS**: 유틸리티 클래스 기반 스타일링으로 빠른 개발
- **Emotion** (선택): 동적 스타일링이 필요한 경우 CSS-in-JS 추가

**레이아웃/컴포넌트**:
- 입력 폼: 프롬프트, 세그먼트 설정 (길이/개수/해상도/화면비)
- 상태 표시: 진행바, 로그 스트림, 실시간 업데이트
- 결과 표시: 비디오 플레이어, 다운로드 버튼

**상태 관리**:
- React Query (TanStack Query): API 호출, 폴링, 캐싱
- Zustand (선택): 글로벌 상태 (사용자 설정, 생성 이력)

### 2) 인증/계정 관리

**시스템**: Supabase Auth
- 이메일/비밀번호, 소셜 로그인 (Google, GitHub)
- Row Level Security (RLS)로 사용자별 데이터 격리
- 세션 관리 및 JWT 토큰 기반 인증

**사용자 데이터**:
- 생성 이력 (jobs 테이블)
- API 키 관리 (암호화 저장)
- 크레딧/사용량 추적

### 3) 백엔드/데이터 계층

**런타임**: Python 3.11+ 환경
- Docker Compose로 개발 환경 표준화
- `.env` 파일로 환경변수 관리

**API 서버**: FastAPI
- 비동기 처리 (asyncio)
- 자동 API 문서화 (Swagger/OpenAPI)
- CORS 설정 (개발: `*`, 운영: 특정 도메인)

**데이터베이스**: Supabase (PostgreSQL)
- **jobs 테이블**: 작업 ID, 상태, 진행률, 결과 경로, 사용자 ID
- **users 테이블**: 사용자 정보 (Supabase Auth 연동)
- **api_keys 테이블**: 암호화된 OpenAI/fal.ai API 키

**큐/작업 관리**:
- 초기: FastAPI BackgroundTasks (메모리 기반)
- 확장: Redis + RQ (Python Redis Queue) 또는 Celery

**스토리지**:
- 로컬: `sora_extended_videos/` 디렉토리
- 클라우드: Supabase Storage (S3 호환)
- 생성된 영상 파일, 중간 세그먼트, 프레임 이미지 저장

### 4) 시크릿/환경변수

**.env 파일 구조**:
```env
# OpenAI (프롬프트 계획)
OPENAI_API_KEY=sk-proj-...

# fal.ai (Sora 비디오 생성)
FAL_KEY=...

# Supabase
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...

# 앱 설정
ENVIRONMENT=development
CORS_ORIGINS=*
```

**보안**:
- API 키는 서버 측에만 저장 (클라이언트 노출 금지)
- Supabase Service Key는 서버 전용
- 환경변수는 `.gitignore`에 추가

### 5) 로그/모니터링 시스템

**개발 단계**:
- Python `logging` 모듈 (콘솔 출력)
- FastAPI 로거로 요청/응답 로그

**운영 단계** (향후):
- **Loki** + **Grafana** + **Promtail**: 로그 수집 및 시각화
- **Sentry**: 에러 트래킹
- **Uptime Kuma**: 서비스 상태 모니터링

## 프로젝트 문서 구조

모든 문서는 `docs/` 디렉토리에 위치합니다:

- **`docs/claude.md`**: 이 파일, 프로젝트 전체 가이드
- **`docs/PLAN.md`**: 프로젝트 실행 로그 및 진행 상황 추적
- **`docs/PRD.md`**: 제품 요구사항 명세서 (Product Requirements Document)
- **`docs/LLD.md`**: 저수준 설계 문서 (Low Level Design) - 기술적 구현 상세

**문서 업데이트 원칙**:
- 모든 개발은 문서 기반으로 진행
- 코드 변경 시 관련 문서도 함께 업데이트
- PLAN.md에 진행 상황 체크리스트 유지

## API 키 및 서비스 설정

### OpenAI API
- **목적**: GPT-4를 사용한 프롬프트 계획 생성
- **키 발급**: https://platform.openai.com/api-keys
- **비용**: 프롬프트 계획당 약 $0.01 (GPT-4o 기준)

### fal.ai API
- **목적**: Sora 2 비디오 생성
- **키 발급**: https://fal.ai/dashboard/keys
- **모델**: `fal-ai/sora-2/image-to-video/pro`
- **비용**: fal.ai 크레딧 기반 (요금제 참고)
- **문서**: https://fal.ai/models/fal-ai/sora-2/image-to-video/pro/api

### Supabase
- **프로젝트 URL**: (프로젝트별로 생성)
- **API 키**:
  - `anon` (공개): 클라이언트에서 사용
  - `service_role` (비밀): 서버 전용
- **설정 위치**: https://app.supabase.com/project/_/settings/api

## Git/GitHub 워크플로우

### 저장소 설정
- **저장소**: (프로젝트 저장소 URL)
- **브랜치 전략**:
  - `main`: 프로덕션 배포용
  - `develop`: 개발 통합
  - `feature/*`: 기능 개발

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가
chore: 빌드/설정 변경
```

### 푸시 전 체크리스트
1. 모든 테스트 통과
2. `docs/PLAN.md` 진행 상황 업데이트
3. `.env` 파일이 `.gitignore`에 포함되었는지 확인
4. 민감한 정보가 코드에 하드코딩되지 않았는지 확인

### GitHub CLI 사용
```bash
# 인증
gh auth login

# PR 생성
gh pr create --title "feat: 새 기능" --body "설명"

# 이슈 생성
gh issue create --title "버그" --body "상세 내용"
```

## 개발 환경 설정

### 필수 도구
- Python 3.11+
- Node.js 18+ (Next.js 프론트엔드용)
- Docker & Docker Compose (선택, 환경 표준화용)
- FFmpeg (MoviePy 의존성)

### 로컬 실행
```bash
# 백엔드 (Python)
pip install -r requirements.txt
uvicorn backend.main:app --reload

# 프론트엔드 (Next.js)
cd frontend
npm install
npm run dev
```

## 배포 전략

### 개발 환경
- 로컬 개발 서버
- 로컬 파일 시스템 스토리지
- 메모리 기반 작업 큐

### 스테이징 환경
- Vercel (Next.js 프론트엔드)
- Railway 또는 Render (FastAPI 백엔드)
- Supabase (데이터베이스/스토리지)

### 프로덕션 환경
- Vercel (프론트엔드)
- AWS EC2 또는 GCP Compute Engine (백엔드)
- Redis (작업 큐)
- Supabase Storage (파일 저장)
- CloudFront (CDN)

## 성능 최적화

### 백엔드
- 비동기 처리 (asyncio, FastAPI)
- Redis 캐싱 (프롬프트 계획 결과)
- 작업 큐로 긴 작업 분산

### 프론트엔드
- React Query로 API 캐싱
- 이미지/비디오 지연 로딩
- Next.js Image 최적화

### 스토리지
- 생성 파일 자동 정리 (24시간 후)
- CDN으로 다운로드 속도 향상

## 보안 체크리스트

- [ ] API 키는 서버 환경변수로만 관리
- [ ] CORS 설정 (운영: 특정 도메인만 허용)
- [ ] 입력 검증 (프롬프트 길이, 세그먼트 범위)
- [ ] 파일 경로 검증 (디렉토리 탈출 방지)
- [ ] Rate Limiting (API 남용 방지)
- [ ] Supabase RLS 설정 (사용자별 데이터 격리)
- [ ] HTTPS 강제 (운영 환경)

## 트러블슈팅

### 일반적인 문제

**1. fal.ai API 크레딧 부족**
- 해결: https://fal.ai/dashboard 에서 크레딧 충전

**2. MoviePy FFmpeg 오류**
- 해결: FFmpeg 설치 확인 (`ffmpeg -version`)

**3. Supabase 연결 실패**
- 해결: `.env` 파일의 URL/키 확인, 네트워크 방화벽 점검

**4. 메모리 부족 (비디오 처리)**
- 해결: 서버 메모리 증설, 작업 큐로 순차 처리

## 다음 단계

### Phase 1 (현재)
- [x] fal.ai API 통합 완료
- [ ] Next.js 프론트엔드 구축
- [ ] FastAPI 백엔드 API 구현
- [ ] Supabase 인증/DB 연동

### Phase 2
- [ ] 작업 이력 조회 기능
- [ ] 사용자별 API 키 관리
- [ ] 크레딧 시스템 도입

### Phase 3
- [ ] Redis 작업 큐 전환
- [ ] 클라우드 스토리지 전환
- [ ] 실시간 로그 스트리밍 (WebSocket)

## 참고 자료

- **Next.js 문서**: https://nextjs.org/docs
- **FastAPI 문서**: https://fastapi.tiangolo.com
- **Supabase 문서**: https://supabase.com/docs
- **fal.ai 문서**: https://fal.ai/docs
- **Radix UI**: https://www.radix-ui.com
- **Tailwind CSS**: https://tailwindcss.com

---

**작성일**: 2025-10-12
**최종 수정**: 2025-10-12
