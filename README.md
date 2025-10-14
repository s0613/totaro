# AI 비디오 생성 플랫폼

텍스트 프롬프트로 AI 비디오를 생성하는 풀스택 웹 애플리케이션입니다.

## 기술 스택

### 프론트엔드
- **React 18** + **TypeScript** - UI 프레임워크
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Supabase Client** - 실시간 데이터베이스 연동

### 백엔드
- **Supabase** - 데이터베이스, 인증, 스토리지
  - PostgreSQL 데이터베이스
  - Row Level Security (RLS)
  - 실시간 구독
  - Storage 버킷

### AI 서비스
- **fal.ai** - AI 비디오 생성 API

## 주요 기능

1. **사용자 인증**
   - 이메일/비밀번호 회원가입 및 로그인
   - Supabase Auth 사용

2. **비디오 생성**
   - 텍스트 프롬프트 입력
   - 화면 비율 선택 (16:9, 9:16, 1:1)
   - 비디오 길이 설정 (3-10초)
   - 실시간 진행 상황 표시

3. **비디오 관리**
   - 생성된 비디오 목록 보기
   - 비디오 재생
   - 비디오 다운로드
   - 비디오 삭제

4. **실시간 업데이트**
   - Supabase 실시간 구독으로 비디오 상태 자동 업데이트
   - 비디오 생성 진행 상황 실시간 표시

## 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가:

```bash
# Supabase
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# fal.ai
VITE_FAL_KEY=your-fal-api-key
```

### 3. Supabase 설정

`SUPABASE_SETUP.md` 파일의 지침을 따라 Supabase 프로젝트를 설정하세요:

1. Supabase 프로젝트 생성
2. `supabase-schema.sql` 실행하여 데이터베이스 스키마 생성
3. Storage 버킷 'videos' 생성 및 정책 설정
4. API 키 복사 및 `.env` 파일에 추가

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 열림

### 5. 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 프로젝트 구조

```
src/
├── components/
│   ├── Auth/
│   │   └── AuthForm.tsx          # 로그인/회원가입 폼
│   └── Video/
│       ├── VideoCard.tsx         # 비디오 카드 컴포넌트
│       ├── VideoCreationForm.tsx # 비디오 생성 폼
│       ├── VideoList.tsx         # 비디오 목록
│       └── VideoPlayer.tsx       # 비디오 플레이어
├── contexts/
│   └── AuthContext.tsx           # 인증 컨텍스트
├── hooks/
│   └── useRealtimeVideos.ts      # 실시간 비디오 훅
├── lib/
│   ├── api.ts                    # Supabase API 함수
│   ├── falService.ts             # fal.ai 서비스
│   └── supabase.ts               # Supabase 클라이언트
├── App.tsx                       # 메인 앱 컴포넌트
├── main.tsx                      # 엔트리 포인트
└── index.css                     # 글로벌 스타일
```

## 데이터베이스 스키마

### users 테이블
- `id` (UUID) - 사용자 ID
- `email` (TEXT) - 이메일
- `name` (TEXT) - 이름
- `created_at` (TIMESTAMP) - 생성 시간

### videos 테이블
- `id` (UUID) - 비디오 ID
- `user_id` (UUID) - 사용자 ID
- `title` (TEXT) - 제목
- `prompt` (TEXT) - 프롬프트
- `status` (TEXT) - 상태 (pending, processing, completed, failed)
- `video_url` (TEXT) - 비디오 URL
- `thumbnail_url` (TEXT) - 썸네일 URL
- `duration` (NUMERIC) - 길이 (초)
- `fal_request_id` (TEXT) - fal.ai 요청 ID
- `created_at` (TIMESTAMP) - 생성 시간
- `updated_at` (TIMESTAMP) - 수정 시간

## API 사용 예시

### 비디오 생성

```typescript
import { videoApi } from './lib/api';
import { falService } from './lib/falService';

// 1. 비디오 레코드 생성
const video = await videoApi.createVideo({
  title: '제목',
  prompt: '프롬프트',
  user_id: user.id,
});

// 2. AI 비디오 생성
const { request_id } = await falService.generateVideoAsync({
  prompt: '프롬프트',
  duration: 5,
  aspectRatio: '16:9',
});

// 3. 비디오 상태 업데이트
await videoApi.updateVideo(video.id, {
  status: 'completed',
  video_url: result.video_url,
});
```

### 실시간 구독

```typescript
import { subscriptions } from './lib/api';

const subscription = subscriptions.subscribeToVideos(userId, (payload) => {
  console.log('비디오 업데이트:', payload);
});

// 구독 해제
subscription.unsubscribe();
```

## 보안

- Row Level Security (RLS) 활성화
- 사용자는 자신의 데이터만 접근 가능
- Storage 버킷은 비공개로 설정
- 환경 변수로 API 키 관리

## 문제 해결

### 비디오 생성 실패
- fal.ai API 키가 올바른지 확인
- 프롬프트가 너무 길거나 짧지 않은지 확인
- 네트워크 연결 확인

### 실시간 업데이트 작동 안 함
- Supabase 프로젝트의 Realtime 기능이 활성화되어 있는지 확인
- RLS 정책이 올바르게 설정되어 있는지 확인

### 인증 오류
- Supabase URL과 Anon Key가 올바른지 확인
- 이메일 인증이 활성화되어 있는지 확인

## 향후 개선 사항

- [ ] 프롬프트 개선 AI (OpenAI API)
- [ ] 비디오 편집 기능
- [ ] 소셜 로그인 (Google, GitHub)
- [ ] 비디오 공유 기능
- [ ] 사용량 제한 및 요금제
- [ ] 비디오 템플릿

## 라이선스

MIT License
