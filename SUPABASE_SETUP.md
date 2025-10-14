# Supabase 백엔드 설정 가이드

이 가이드는 Supabase를 사용하여 비디오 생성 앱의 백엔드를 설정하는 방법을 안내합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 계정 생성 또는 로그인
2. "New Project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호, 지역 설정
4. 프로젝트가 생성될 때까지 대기 (약 2분)

## 2. 데이터베이스 스키마 설정

1. Supabase 대시보드에서 "SQL Editor" 메뉴로 이동
2. `supabase-schema.sql` 파일의 내용을 복사하여 붙여넣기
3. "Run" 버튼 클릭하여 실행
4. 테이블과 정책이 성공적으로 생성되었는지 확인

생성되는 테이블:
- `users`: 사용자 정보 저장
- `videos`: 비디오 메타데이터 저장

## 3. Storage 버킷 생성

1. Supabase 대시보드에서 "Storage" 메뉴로 이동
2. "New bucket" 클릭
3. 버킷 설정:
   - Name: `videos`
   - Public bucket: No (비공개)
   - File size limit: 100 MB
   - Allowed MIME types: `video/mp4`, `video/webm`
4. "Create bucket" 클릭

### Storage 정책 설정

Storage 버킷 생성 후, "Policies" 탭에서 다음 정책들을 추가:

#### 업로드 정책
```sql
CREATE POLICY "Users can upload their own videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### 조회 정책
```sql
CREATE POLICY "Users can view their own videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### 삭제 정책
```sql
CREATE POLICY "Users can delete their own videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 4. 환경 변수 설정

1. Supabase 대시보드에서 "Settings" > "API" 메뉴로 이동
2. 다음 정보를 복사:
   - Project URL
   - anon public key
3. `.env` 파일을 생성하고 다음 내용 추가:

```bash
# Supabase
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# fal.ai
VITE_FAL_KEY=your-fal-api-key
```

## 5. 인증 설정 (선택사항)

Supabase Auth를 사용하려면:

1. Supabase 대시보드에서 "Authentication" > "Providers" 메뉴로 이동
2. Email 인증 활성화
3. 필요한 경우 OAuth 제공자 추가 (Google, GitHub 등)

## 6. 테스트

모든 설정이 완료되면:

1. 앱 실행: `npm run dev`
2. 회원가입 및 로그인 테스트
3. 비디오 생성 및 조회 테스트
4. Supabase 대시보드에서 데이터 확인

## API 사용 예시

### 비디오 생성
```typescript
import { videoApi } from './lib/api';

const video = await videoApi.createVideo({
  title: '테스트 비디오',
  prompt: '아름다운 풍경',
  user_id: user.id,
});
```

### 비디오 목록 조회
```typescript
const videos = await videoApi.getUserVideos(user.id);
```

### 비디오 업데이트
```typescript
await videoApi.updateVideo(videoId, {
  status: 'completed',
  video_url: 'https://...',
});
```

### 비디오 삭제
```typescript
await videoApi.deleteVideo(videoId);
```

## 문제 해결

### 연결 오류
- 환경 변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트가 활성 상태인지 확인

### 권한 오류
- RLS (Row Level Security) 정책이 올바르게 설정되었는지 확인
- 사용자가 올바르게 인증되었는지 확인

### Storage 오류
- Storage 버킷이 생성되었는지 확인
- Storage 정책이 올바르게 설정되었는지 확인
- 파일 크기 제한을 확인

## 다음 단계

백엔드 설정이 완료되었습니다. 이제 다음을 진행하세요:

1. 프론트엔드 UI 구축
2. fal.ai API와 연동
3. 실시간 업데이트 구현
4. 에러 처리 개선
