# Totaro

AEO/SEO/GEO 친화적 웹사이트 제작 플랫폼

## 기술 스택

### 프론트엔드

- **Next.js 15** + **React 18** + **TypeScript** - UI 프레임워크
- **Tailwind CSS** - 스타일링
- **GSAP** - 애니메이션

## 주요 기능

1. **웹사이트 소개**
   - Hero 섹션
   - 서비스 상세 설명
   - 사용 사례
   - 고객 후기

2. **비전 AI 페이지**
   - AI 비디오 플레이어
   - 서비스 소개

3. **웹 최적화 페이지**
   - AEO/SEO/GEO 설명
   - 최적화 기능 안내

4. **다국어 지원**
   - 한국어/영어 전환
   - 다크/라이트 테마

## 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 열림

### 3. 프로덕션 빌드

```bash
npm run build
npm start
```

### 4. 배포

```bash
npm run deploy
```

## 프로젝트 구조

```
app/
├── components/           # 재사용 가능한 컴포넌트
├── content/             # 다국어 콘텐츠
├── api/                 # API 라우트
├── checkout/            # (삭제됨)
├── legal/               # 법적 문서
├── optimize/            # 최적화 페이지
├── vision/              # 비전 페이지
└── web/                 # 웹 페이지

lib/
├── analytics.ts         # 분석 도구
├── contexts/            # React 컨텍스트
├── hooks/               # 커스텀 훅
├── hubspot.ts           # HubSpot 연동
├── i18n.ts             # 다국어 설정
├── mailer.ts           # 이메일 전송
└── utils.ts            # 유틸리티 함수
```

## 라이선스

MIT License
# totaro
# totaro
# totaro
