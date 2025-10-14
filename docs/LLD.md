# LLD: Sora Extend Korean - 저수준 설계 문서 (Low Level Design)

## 문서 정보
- **작성일**: 2025-10-12
- **버전**: 1.0
- **작성자**: Development Team
- **상태**: Draft

---

## 1. 시스템 아키텍처 개요

### 1.1 전체 구조도
```
┌─────────────────────────────────────────────────────────┐
│                    프론트엔드 (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  입력 폼 UI  │  │  상태 폴링   │  │  결과 페이지  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │ REST API
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   백엔드 (FastAPI)                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │            API Routers                           │   │
│  │  • POST /api/generate   (작업 생성)              │   │
│  │  • GET  /api/status/:id (상태 조회)              │   │
│  │  • GET  /api/result/:id (결과 조회)              │   │
│  │  • GET  /api/download/:id (파일 다운로드)         │   │
│  └──────────────────────────────────────────────────┘   │
│                           │                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Services Layer                          │   │
│  │  • VideoService (파이프라인 실행)                 │   │
│  │  • JobRegistry (작업 상태 관리)                   │   │
│  │  • StorageService (파일 관리)                     │   │
│  └──────────────────────────────────────────────────┘   │
│                           │                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │       Core Pipeline (sora_extend_korean.py)      │   │
│  │  1. plan_prompts() → GPT-4o                      │   │
│  │  2. create_video() → fal.ai                      │   │
│  │  3. download_video() → HTTP                      │   │
│  │  4. extract_last_frame() → OpenCV                │   │
│  │  5. concatenate_videos() → MoviePy               │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   OpenAI     │  │   fal.ai     │  │   Supabase   │
│   GPT-4o     │  │   Sora 2     │  │  (DB/Auth)   │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 1.2 기술 스택 상세

#### 프론트엔드
- **Next.js 14.2+** (App Router)
- **React 18+**
- **TypeScript 5+**
- **Radix UI** (접근성 컴포넌트)
- **Tailwind CSS 3+** (스타일링)
- **React Query (TanStack Query)** (서버 상태 관리)
- **Zustand** (클라이언트 상태, 선택)

#### 백엔드
- **Python 3.11+**
- **FastAPI 0.110+** (웹 프레임워크)
- **Uvicorn** (ASGI 서버)
- **Pydantic 2+** (데이터 검증)
- **fal-client** (fal.ai SDK)
- **openai** (OpenAI SDK)
- **moviepy** (비디오 편집)
- **opencv-python** (이미지 처리)

#### 데이터베이스/스토리지
- **Supabase PostgreSQL** (관계형 DB)
- **로컬 파일 시스템** → **Supabase Storage** (S3 호환)

#### 작업 큐
- **Phase 1**: FastAPI BackgroundTasks (메모리)
- **Phase 2**: Redis + RQ (분산 큐)

---

## 2. 데이터베이스 설계

### 2.1 ERD (Entity Relationship Diagram)

```
┌─────────────────────────┐
│        users            │
│─────────────────────────│
│ id (UUID, PK)           │
│ email (VARCHAR)         │
│ created_at (TIMESTAMP)  │
│ last_login (TIMESTAMP)  │
└─────────────────────────┘
            │
            │ 1:N
            ▼
┌─────────────────────────────────────┐
│             jobs                    │
│─────────────────────────────────────│
│ id (UUID, PK)                       │
│ user_id (UUID, FK → users.id)      │
│ status (ENUM)                       │
│ prompt (TEXT)                       │
│ config (JSONB)                      │
│ progress (FLOAT)                    │
│ result_path (VARCHAR)               │
│ error_message (TEXT)                │
│ created_at (TIMESTAMP)              │
│ updated_at (TIMESTAMP)              │
│ completed_at (TIMESTAMP)            │
└─────────────────────────────────────┘
            │
            │ 1:N
            ▼
┌─────────────────────────────────────┐
│           job_logs                  │
│─────────────────────────────────────│
│ id (BIGSERIAL, PK)                  │
│ job_id (UUID, FK → jobs.id)         │
│ timestamp (TIMESTAMP)               │
│ level (VARCHAR)                     │
│ message (TEXT)                      │
└─────────────────────────────────────┘
```

### 2.2 테이블 스키마

#### `users` 테이블
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Supabase Auth와 연동 (auth.users 참조)
```

#### `jobs` 테이블
```sql
CREATE TYPE job_status AS ENUM (
    'queued',      -- 대기 중
    'planning',    -- 프롬프트 계획 생성 중
    'generating',  -- 세그먼트 생성 중
    'merging',     -- 병합 중
    'completed',   -- 완료
    'failed'       -- 실패
);

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status job_status DEFAULT 'queued',
    prompt TEXT NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    -- config 예시: {"seconds": 8, "segments": 4, "resolution": "720p", "aspect": "16:9"}
    progress FLOAT DEFAULT 0.0 CHECK (progress >= 0 AND progress <= 1),
    result_path VARCHAR(500),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
```

#### `job_logs` 테이블
```sql
CREATE TABLE job_logs (
    id BIGSERIAL PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    timestamp TIMESTAMP DEFAULT NOW(),
    level VARCHAR(20) DEFAULT 'INFO',
    message TEXT NOT NULL
);

CREATE INDEX idx_job_logs_job_id ON job_logs(job_id);
```

### 2.3 RLS (Row Level Security) 정책

```sql
-- users 테이블: 자신의 정보만 조회
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- jobs 테이블: 자신의 작업만 조회
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jobs"
    ON jobs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs"
    ON jobs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- job_logs 테이블: 자신의 작업 로그만 조회
ALTER TABLE job_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own job logs"
    ON job_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM jobs
            WHERE jobs.id = job_logs.job_id
            AND jobs.user_id = auth.uid()
        )
    );
```

---

## 3. API 설계

### 3.1 엔드포인트 명세

#### **POST /api/generate**
**설명**: 새 영상 생성 작업 요청

**요청 본문**:
```json
{
  "prompt": "미래 도시를 배경으로 한 자동차 드라이빙 영상",
  "seconds": 8,
  "segments": 4,
  "resolution": "720p",
  "aspect": "16:9"
}
```

**응답** (201 Created):
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "message": "작업이 생성되었습니다."
}
```

**오류** (400 Bad Request):
```json
{
  "detail": "프롬프트는 필수 입력입니다."
}
```

---

#### **GET /api/status/{job_id}**
**설명**: 작업 진행 상태 조회

**응답** (200 OK):
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "generating",
  "progress": 0.45,
  "message": "세그먼트 2/4 생성 중...",
  "logs": [
    {"timestamp": "2025-10-12T10:00:00Z", "level": "INFO", "message": "프롬프트 계획 완료"},
    {"timestamp": "2025-10-12T10:01:00Z", "level": "INFO", "message": "세그먼트 1 생성 시작"}
  ]
}
```

---

#### **GET /api/result/{job_id}**
**설명**: 완료된 작업 결과 조회

**응답** (200 OK):
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "result_path": "/sora_extended_videos/550e8400.../extended_video.mp4",
  "download_url": "https://api.example.com/api/download/550e8400-e29b-41d4-a716-446655440000",
  "metadata": {
    "duration": 32.0,
    "resolution": "1280x720",
    "file_size": 15728640
  }
}
```

---

#### **GET /api/download/{job_id}**
**설명**: 생성된 비디오 파일 다운로드

**응답** (200 OK):
- **Content-Type**: `video/mp4`
- **Content-Disposition**: `attachment; filename="video_550e8400.mp4"`
- **Body**: 비디오 파일 스트림

---

### 3.2 Pydantic 모델

```python
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

# 요청 모델
class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=500)
    seconds: Literal[4, 8, 12] = 8
    segments: int = Field(4, ge=2, le=10)
    resolution: Literal["720p", "1080p"] = "720p"
    aspect: Literal["16:9", "9:16", "1:1"] = "16:9"

# 응답 모델
class GenerateResponse(BaseModel):
    job_id: str
    status: Literal["queued", "planning", "generating", "merging", "completed", "failed"]
    message: str

class JobLog(BaseModel):
    timestamp: datetime
    level: str
    message: str

class StatusResponse(BaseModel):
    job_id: str
    status: str
    progress: float = Field(ge=0.0, le=1.0)
    message: Optional[str] = None
    logs: list[JobLog] = []

class VideoMetadata(BaseModel):
    duration: float
    resolution: str
    file_size: int

class ResultResponse(BaseModel):
    job_id: str
    status: str
    result_path: Optional[str] = None
    download_url: Optional[str] = None
    metadata: Optional[VideoMetadata] = None
```

---

## 4. 핵심 컴포넌트 설계

### 4.1 JobRegistry (작업 상태 관리)

**역할**: 메모리 또는 DB에서 작업 상태 추적

```python
from typing import Dict, Optional
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class Job:
    job_id: str
    status: str
    progress: float = 0.0
    message: str = ""
    logs: list = field(default_factory=list)
    result_path: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

class JobRegistry:
    """메모리 기반 작업 레지스트리 (Phase 1)"""

    def __init__(self):
        self._jobs: Dict[str, Job] = {}

    def create(self, job_id: str) -> Job:
        job = Job(job_id=job_id, status="queued")
        self._jobs[job_id] = job
        return job

    def get(self, job_id: str) -> Optional[Job]:
        return self._jobs.get(job_id)

    def update(self, job_id: str, **kwargs):
        if job := self._jobs.get(job_id):
            for key, value in kwargs.items():
                setattr(job, key, value)
            job.updated_at = datetime.now()

    def add_log(self, job_id: str, level: str, message: str):
        if job := self._jobs.get(job_id):
            job.logs.append({
                "timestamp": datetime.now().isoformat(),
                "level": level,
                "message": message
            })
```

---

### 4.2 VideoService (파이프라인 실행)

```python
import uuid
from sora_extend_korean import SoraExtendKorean

class VideoService:
    def __init__(self, registry: JobRegistry, openai_key: str, fal_key: str):
        self.registry = registry
        self.sora = SoraExtendKorean(openai_key, fal_key)

    async def generate_video(self, job_id: str, request: GenerateRequest):
        """백그라운드에서 비디오 생성 실행"""
        try:
            # 1. 상태 업데이트: 계획 생성
            self.registry.update(job_id, status="planning", progress=0.1)
            self.registry.add_log(job_id, "INFO", "프롬프트 계획 생성 시작")

            segments = self.sora.plan_prompts(
                request.prompt,
                request.seconds,
                request.segments
            )

            self.registry.add_log(job_id, "INFO", f"{len(segments)}개 세그먼트 계획 완료")

            # 2. 상태 업데이트: 세그먼트 생성
            self.registry.update(job_id, status="generating", progress=0.2)

            for i, segment in enumerate(segments, 1):
                self.registry.add_log(job_id, "INFO", f"세그먼트 {i}/{len(segments)} 생성 중...")
                # 실제 생성 로직 (기존 코드 재사용)
                progress = 0.2 + (0.6 * i / len(segments))
                self.registry.update(job_id, progress=progress)

            # 3. 상태 업데이트: 병합
            self.registry.update(job_id, status="merging", progress=0.9)
            self.registry.add_log(job_id, "INFO", "세그먼트 병합 중...")

            final_path = self.sora.generate_extended_video(
                request.prompt,
                request.seconds,
                request.segments
            )

            # 4. 완료
            self.registry.update(
                job_id,
                status="completed",
                progress=1.0,
                result_path=str(final_path)
            )
            self.registry.add_log(job_id, "INFO", "영상 생성 완료")

        except Exception as e:
            self.registry.update(
                job_id,
                status="failed",
                error_message=str(e)
            )
            self.registry.add_log(job_id, "ERROR", f"오류 발생: {e}")
```

---

## 5. 프론트엔드 설계

### 5.1 페이지 구조

```
app/
├── page.tsx                 # 홈페이지 (입력 폼)
├── status/[jobId]/page.tsx  # 진행 상태 페이지
├── result/[jobId]/page.tsx  # 결과 페이지
└── layout.tsx               # 레이아웃 (헤더, 네비게이션)
```

### 5.2 상태 관리 (React Query)

```typescript
// hooks/useVideoGeneration.ts
import { useMutation } from '@tanstack/react-query';

export function useVideoGeneration() {
  return useMutation({
    mutationFn: async (data: GenerateRequest) => {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
  });
}

// hooks/useJobStatus.ts
import { useQuery } from '@tanstack/react-query';

export function useJobStatus(jobId: string) {
  return useQuery({
    queryKey: ['job-status', jobId],
    queryFn: async () => {
      const res = await fetch(`/api/status/${jobId}`);
      return res.json();
    },
    refetchInterval: 2000, // 2초마다 폴링
    enabled: !!jobId,
  });
}
```

### 5.3 UI 컴포넌트

```typescript
// components/GenerateForm.tsx
import { useVideoGeneration } from '@/hooks/useVideoGeneration';
import { useRouter } from 'next/navigation';

export function GenerateForm() {
  const { mutate, isLoading } = useVideoGeneration();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    mutate({
      prompt: formData.get('prompt'),
      seconds: Number(formData.get('seconds')),
      segments: Number(formData.get('segments')),
      resolution: formData.get('resolution'),
      aspect: formData.get('aspect'),
    }, {
      onSuccess: (data) => {
        router.push(`/status/${data.job_id}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 폼 필드들 */}
    </form>
  );
}
```

---

## 6. 배포 및 인프라

### 6.1 개발 환경

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - ./sora_extended_videos:/app/sora_extended_videos

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

### 6.2 프로덕션 배포

**프론트엔드 (Vercel)**:
```bash
vercel --prod
```

**백엔드 (Railway)**:
```yaml
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn backend.main:app --host 0.0.0.0 --port $PORT"
  }
}
```

---

## 7. 성능 최적화

### 7.1 백엔드 최적화
- 비동기 I/O (asyncio)
- 작업 큐로 분산 처리
- Redis 캐싱 (프롬프트 계획 결과)

### 7.2 프론트엔드 최적화
- React Query 캐싱
- Next.js Image 최적화
- 코드 스플리팅

### 7.3 네트워크 최적화
- CDN (CloudFront/Cloudflare)
- Gzip/Brotli 압축
- HTTP/2

---

## 8. 보안 고려사항

### 8.1 인증/권한
- Supabase JWT 검증
- API 키는 서버 환경변수
- Rate Limiting (10 req/hour/user)

### 8.2 입력 검증
- 프롬프트 길이 제한 (500자)
- SQL Injection 방지 (ORM 사용)
- 파일 경로 검증

---

**작성 완료일**: 2025-10-12
