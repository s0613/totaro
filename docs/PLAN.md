# PLAN: Sora Extend Korean - 프로젝트 실행 계획 및 진행 상황

## 문서 정보
- **프로젝트명**: Sora Extend Korean
- **시작일**: 2025-10-12
- **최종 업데이트**: 2025-10-12
- **현재 Phase**: Phase 1 - MVP 개발

---

## 📋 전체 로드맵

### Phase 1: MVP 개발 (4주) - 현재 단계
**목표**: 기본 웹 애플리케이션 + 영상 생성 파이프라인

### Phase 2: 사용자 기능 (4주)
**목표**: 인증, 이력 관리, 대시보드

### Phase 3: 확장 및 최적화 (4주)
**목표**: Redis 큐, 클라우드 스토리지, 모니터링

---

## ✅ Phase 1: MVP 개발 (Week 1-4)

### Week 1: 기초 설정 및 코어 파이프라인

#### 1.1 프로젝트 구조 설정
- [x] 프로젝트 디렉토리 생성
- [x] Git 저장소 초기화
- [x] 문서 작성 (PRD, LLD, claude.md)
- [x] `.gitignore` 설정
- [ ] README.md 작성

#### 1.2 Python 백엔드 환경 설정
- [x] Python 3.11+ 설치 확인
- [x] 가상환경 생성
- [x] requirements.txt 작성
- [x] 필수 패키지 설치
  - [x] FastAPI
  - [x] openai
  - [x] fal-client
  - [x] moviepy
  - [x] opencv-python

#### 1.3 코어 파이프라인 구현
- [x] `sora_extend_korean.py` 기본 구조
- [x] fal.ai API 통합
  - [x] 이미지 업로드 함수
  - [x] 비디오 생성 함수
  - [x] 비디오 다운로드 함수
- [x] OpenAI GPT-4 프롬프트 계획 기능
- [x] OpenCV 프레임 추출 기능
- [x] MoviePy 비디오 병합 기능
- [ ] 단위 테스트 작성

**현재 상태**: ✅ 완료
**블로커**: 없음

---

### Week 2: FastAPI 백엔드 구축

#### 2.1 프로젝트 구조 생성
```
backend/
├── __init__.py
├── main.py              # FastAPI 앱 엔트리
├── models.py            # Pydantic 모델
├── routers/
│   ├── __init__.py
│   ├── generate.py      # POST /api/generate
│   ├── status.py        # GET /api/status/:id
│   └── result.py        # GET /api/result/:id, /api/download/:id
├── services/
│   ├── __init__.py
│   ├── job_registry.py  # 작업 상태 관리
│   └── video_service.py # 파이프라인 실행
└── config.py            # 환경변수 로딩
```

**작업 항목**:
- [ ] 디렉토리 구조 생성
- [ ] `main.py` FastAPI 앱 초기화
- [ ] CORS 설정 추가
- [ ] `.env` 파일 설정

#### 2.2 Pydantic 모델 정의
- [ ] `GenerateRequest` 모델
- [ ] `GenerateResponse` 모델
- [ ] `StatusResponse` 모델
- [ ] `ResultResponse` 모델
- [ ] 입력 검증 로직

#### 2.3 JobRegistry 구현
- [ ] Job 데이터 클래스 정의
- [ ] 메모리 기반 작업 저장소
- [ ] CRUD 메서드 (create, get, update)
- [ ] 로그 추가 메서드

#### 2.4 VideoService 구현
- [ ] SoraExtendKorean 래핑
- [ ] 백그라운드 작업 실행 로직
- [ ] 진행률 업데이트 콜백
- [ ] 오류 처리 및 재시도

#### 2.5 API 엔드포인트 구현
- [ ] POST /api/generate
  - [ ] 요청 검증
  - [ ] Job ID 생성
  - [ ] BackgroundTask 실행
- [ ] GET /api/status/:id
  - [ ] 작업 조회
  - [ ] 진행률 반환
- [ ] GET /api/result/:id
  - [ ] 완료된 작업 결과 반환
- [ ] GET /api/download/:id
  - [ ] 파일 스트리밍

**현재 상태**: 🔄 진행 예정
**예상 완료**: Week 2 종료

---

### Week 3: Next.js 프론트엔드 구현

#### 3.1 Next.js 프로젝트 설정
```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx            # 홈 (입력 폼)
│   ├── status/[jobId]/page.tsx
│   └── result/[jobId]/page.tsx
├── components/
│   ├── GenerateForm.tsx
│   ├── ProgressBar.tsx
│   ├── VideoPlayer.tsx
│   └── LogViewer.tsx
├── hooks/
│   ├── useVideoGeneration.ts
│   └── useJobStatus.ts
├── lib/
│   └── api.ts
└── styles/
    └── globals.css
```

**작업 항목**:
- [ ] Next.js 14+ 프로젝트 생성
- [ ] TypeScript 설정
- [ ] Tailwind CSS 설정
- [ ] Radix UI 설치

#### 3.2 컴포넌트 개발
- [ ] GenerateForm (입력 폼)
  - [ ] 프롬프트 입력 필드
  - [ ] 옵션 선택 (seconds, segments, resolution, aspect)
  - [ ] 폼 검증
  - [ ] 제출 버튼
- [ ] ProgressBar (진행 상태)
  - [ ] 0-100% 프로그레스 바
  - [ ] 상태 메시지 표시
- [ ] VideoPlayer (비디오 재생)
  - [ ] HTML5 비디오 플레이어
  - [ ] 컨트롤 버튼
- [ ] LogViewer (로그 스트림)
  - [ ] 로그 목록 표시
  - [ ] 자동 스크롤

#### 3.3 페이지 구현
- [ ] 홈페이지 (/)
  - [ ] GenerateForm 배치
  - [ ] 설명 텍스트
- [ ] 상태 페이지 (/status/[jobId])
  - [ ] useJobStatus 훅 사용
  - [ ] ProgressBar 표시
  - [ ] LogViewer 표시
  - [ ] 폴링 (2초 간격)
- [ ] 결과 페이지 (/result/[jobId])
  - [ ] VideoPlayer 표시
  - [ ] 다운로드 버튼
  - [ ] 메타데이터 표시

#### 3.4 React Query 설정
- [ ] QueryClient 설정
- [ ] useVideoGeneration 훅
- [ ] useJobStatus 훅 (폴링)
- [ ] 오류 처리

**현재 상태**: 🔄 진행 예정
**예상 완료**: Week 3 종료

---

### Week 4: 통합 테스트 및 배포

#### 4.1 통합 테스트
- [ ] 엔드투엔드 테스트
  - [ ] 프롬프트 입력 → 생성 → 다운로드
  - [ ] 오류 시나리오 (API 키 부족, 네트워크 오류)
- [ ] 성능 테스트
  - [ ] 세그먼트 4개 × 8초 생성 시간 측정
  - [ ] 메모리 사용량 확인
- [ ] 버그 수정

#### 4.2 배포 준비
- [ ] 환경변수 점검
  - [ ] OPENAI_API_KEY
  - [ ] FAL_KEY
  - [ ] CORS_ORIGINS
- [ ] 프로덕션 빌드 테스트
  - [ ] `npm run build` (프론트엔드)
  - [ ] Docker 이미지 빌드 (백엔드)

#### 4.3 스테이징 배포
- [ ] Vercel 배포 (프론트엔드)
  - [ ] 환경변수 설정
  - [ ] 도메인 연결 (선택)
- [ ] Railway 배포 (백엔드)
  - [ ] 환경변수 설정
  - [ ] 헬스 체크 엔드포인트

#### 4.4 문서 업데이트
- [ ] README.md 작성
  - [ ] 설치 방법
  - [ ] 로컬 실행 가이드
  - [ ] 환경변수 설명
- [ ] API 문서 (FastAPI Swagger)
- [ ] 사용자 가이드

**현재 상태**: 🔄 진행 예정
**예상 완료**: Week 4 종료

---

## 🚀 Phase 2: 사용자 기능 (Week 5-8)

### Week 5-6: 인증 및 데이터베이스

#### 5.1 Supabase 설정
- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 생성
  - [ ] users 테이블
  - [ ] jobs 테이블
  - [ ] job_logs 테이블
- [ ] RLS 정책 설정

#### 5.2 Supabase Auth 연동
- [ ] 백엔드에 Supabase 클라이언트 추가
- [ ] JWT 검증 미들웨어
- [ ] 프론트엔드 Auth UI
  - [ ] 로그인 페이지
  - [ ] 회원가입 페이지
  - [ ] 소셜 로그인 (Google, GitHub)

#### 5.3 DB 기반 작업 관리
- [ ] JobRegistry를 DB 기반으로 전환
- [ ] jobs 테이블 CRUD
- [ ] job_logs 테이블 로깅

**현재 상태**: ⏳ 대기 중

---

### Week 7-8: 대시보드 및 이력 관리

#### 7.1 사용자 대시보드
- [ ] 대시보드 페이지 (/dashboard)
  - [ ] 사용자 정보 표시
  - [ ] 최근 생성 이력
  - [ ] 통계 (총 생성 수, 성공률)

#### 7.2 생성 이력 기능
- [ ] 이력 목록 페이지 (/history)
  - [ ] 썸네일 그리드
  - [ ] 필터링 (날짜, 상태)
  - [ ] 검색 (프롬프트)
- [ ] 상세 페이지
  - [ ] 재다운로드
  - [ ] 재생성 (같은 설정)

#### 7.3 API 키 관리
- [ ] API 키 설정 페이지
  - [ ] OpenAI API 키 입력
  - [ ] fal.ai API 키 입력
  - [ ] 암호화 저장

**현재 상태**: ⏳ 대기 중

---

## 🔧 Phase 3: 확장 및 최적화 (Week 9-12)

### Week 9-10: Redis 큐 및 스토리지

#### 9.1 Redis 작업 큐
- [ ] Redis 서버 설정
- [ ] RQ (Python Redis Queue) 통합
- [ ] Worker 프로세스 구현
- [ ] 작업 큐잉 로직

#### 9.2 Supabase Storage 전환
- [ ] Supabase Storage 버킷 생성
- [ ] 파일 업로드 로직
- [ ] 다운로드 URL 생성 (서명)
- [ ] 자동 정리 (24시간 후 삭제)

**현재 상태**: ⏳ 대기 중

---

### Week 11-12: 모니터링 및 최적화

#### 11.1 모니터링 시스템
- [ ] Sentry 연동 (에러 트래킹)
- [ ] Loki + Grafana (로그 수집)
- [ ] Uptime Kuma (상태 모니터링)

#### 11.2 WebSocket 실시간 로그
- [ ] FastAPI WebSocket 엔드포인트
- [ ] 프론트엔드 WebSocket 클라이언트
- [ ] 실시간 로그 스트리밍

#### 11.3 성능 최적화
- [ ] 프롬프트 계획 캐싱 (Redis)
- [ ] CDN 설정 (CloudFront)
- [ ] 이미지 최적화
- [ ] 로드 테스트

**현재 상태**: ⏳ 대기 중

---

## 🐛 이슈 및 블로커

### 현재 이슈
_없음_

### 해결된 이슈
1. **fal.ai API 통합** ✅
   - 문제: OpenAI Sora API 직접 접근 불가
   - 해결: fal.ai SDK 사용으로 전환

---

## 📝 회의 및 결정 사항

### 2025-10-12
- **결정**: fal.ai API 사용 확정
- **결정**: Phase 1에서 메모리 기반 JobRegistry 사용, Phase 2에서 DB 전환
- **결정**: 프론트엔드 Radix UI + Tailwind CSS 사용

---

## 📊 진행 상황 요약

### 전체 진행률: 15%
- Phase 1 (Week 1): ✅ 60% 완료
- Phase 1 (Week 2-4): 🔄 0% 진행 예정
- Phase 2: ⏳ 대기 중
- Phase 3: ⏳ 대기 중

### 다음 단계
1. FastAPI 백엔드 구조 생성
2. JobRegistry 및 VideoService 구현
3. API 엔드포인트 구현

---

## 🎯 목표 및 성공 지표

### Phase 1 목표
- [ ] 프롬프트 입력 → 30초 영상 생성 가능
- [ ] 진행 상태 실시간 업데이트
- [ ] 생성 성공률 90%+
- [ ] 평균 생성 시간 < 10분 (8초×4개 기준)

### Phase 2 목표
- [ ] 사용자 인증 기능 작동
- [ ] 이력 조회 가능
- [ ] 10명 이상 베타 테스터 참여

### Phase 3 목표
- [ ] 동시 5개 작업 처리
- [ ] 서버 Uptime 99%+
- [ ] 평균 응답 시간 < 500ms

---

**최종 업데이트**: 2025-10-12 10:30 KST
**다음 업데이트 예정**: 2025-10-13
