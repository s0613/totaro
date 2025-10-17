# Toss Payments 실제 결제 전환 체크리스트

## 📋 전환 전 준비사항

### 1. Toss Payments 승인 프로세스

- [ ] **1.1** [Toss Payments 개발자센터](https://developers.tosspayments.com) 회원가입
- [ ] **1.2** 사업자 정보 등록
  - 사업자등록증
  - 통장 사본
  - 대표자 신분증
- [ ] **1.3** 심사 신청 제출
- [ ] **1.4** 심사 승인 완료 (보통 1-3 영업일)
- [ ] **1.5** 실제 키(live key) 발급 받기
  - Client Key: `live_ck_로 시작`
  - Secret Key: `live_sk_로 시작`

### 2. 환경 준비

- [ ] **2.1** Vercel 프로덕션 환경 준비 완료
- [ ] **2.2** Supabase 프로덕션 데이터베이스 생성
- [ ] **2.3** 도메인 SSL 인증서 확인 (HTTPS 필수)
- [ ] **2.4** 모니터링 도구 설정 (Sentry, GA 등)

---

## 🔑 환경변수 설정

### Vercel Dashboard 설정

**Dashboard → Settings → Environment Variables → Production**

```bash
# Toss Payments (실제 키)
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_발급받은실제키
TOSS_SECRET_KEY=live_sk_발급받은실제키

# Site URL (실제 도메인)
NEXT_PUBLIC_SITE_URL=https://totaro.com

# Supabase (프로덕션)
NEXT_PUBLIC_SUPABASE_URL=https://your-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=prod-service-role-key

# Payment Widget Version
NEXT_PUBLIC_TOSS_PAYMENT_WIDGET_VERSION=2.0
```

### 환경변수 검증

```bash
# Vercel CLI로 검증
vercel env ls

# 또는 Dashboard에서 확인
# Settings > Environment Variables > Production
```

---

## ✅ 배포 전 테스트

### 1. 로컬 환경에서 최종 테스트

```bash
# 환경변수 확인
cat .env.local

# 테스트 서버 실행
npm run dev

# 테스트 결제 수행
# http://localhost:3000/checkout
# 테스트 카드: 5570-1234-5678-9012
```

- [ ] **1.1** 결제 위젯 로딩 확인
- [ ] **1.2** 카드 정보 입력 가능 확인
- [ ] **1.3** 결제 승인 성공 확인
- [ ] **1.4** Success 페이지 이동 확인
- [ ] **1.5** Supabase에 주문 저장 확인
- [ ] **1.6** 결제 실패 케이스 테스트
- [ ] **1.7** 금액 불일치 에러 테스트

### 2. Staging 환경 테스트 (선택)

```bash
# Staging 브랜치 배포
vercel --env=preview

# Staging URL로 접속하여 테스트
```

- [ ] **2.1** 실제 URL 콜백 테스트
- [ ] **2.2** HTTPS 환경에서 결제 테스트
- [ ] **2.3** 모바일 환경 테스트

---

## 🚀 프로덕션 배포

### 1. 환경변수 전환

- [ ] **1.1** Vercel Dashboard에서 실제 키 설정
- [ ] **1.2** `NEXT_PUBLIC_TOSS_CLIENT_KEY` → `live_ck_` 키로 변경
- [ ] **1.3** `TOSS_SECRET_KEY` → `live_sk_` 키로 변경
- [ ] **1.4** `NEXT_PUBLIC_SITE_URL` → 실제 도메인으로 변경
- [ ] **1.5** 환경변수 저장 및 배포

### 2. 배포 실행

```bash
# Main 브랜치에 머지
git checkout main
git merge develop
git push origin main

# Vercel 자동 배포 확인
# 또는 수동 배포
vercel --prod
```

- [ ] **2.1** 배포 성공 확인
- [ ] **2.2** 프로덕션 URL 접속 확인
- [ ] **2.3** 빌드 로그 확인 (에러 없음)

---

## 🧪 프로덕션 검증

### 1. 소액 실제 결제 테스트

⚠️ **중요: 실제 카드로 소액(1,000원) 테스트 결제를 먼저 수행하세요!**

- [ ] **1.1** 실제 카드로 1,000원 테스트 결제
- [ ] **1.2** 결제 성공 확인
- [ ] **1.3** Toss Dashboard에서 결제 내역 확인
- [ ] **1.4** Supabase에서 주문 상태 확인 (`status: paid`)
- [ ] **1.5** Success 페이지 정상 표시 확인
- [ ] **1.6** 영수증 이메일 수신 확인 (선택)

### 2. 테스트 결제 취소

- [ ] **2.1** Toss Dashboard에서 테스트 결제 취소
- [ ] **2.2** 환불 완료 확인
- [ ] **2.3** Supabase 상태 업데이트 확인

### 3. 실패 케이스 테스트

- [ ] **3.1** 잔액 부족 카드로 테스트
- [ ] **3.2** Fail 페이지 정상 표시 확인
- [ ] **3.3** 에러 로그 확인

---

## 📊 모니터링 설정

### 1. Toss Dashboard 확인

- [ ] **1.1** [Toss Dashboard](https://dashboard.tosspayments.com) 로그인
- [ ] **1.2** 실시간 결제 내역 모니터링 설정
- [ ] **1.3** 일일/주간 리포트 이메일 설정
- [ ] **1.4** 결제 실패 알림 설정

### 2. 에러 모니터링

- [ ] **2.1** Sentry 에러 트래킹 확인
- [ ] **2.2** Vercel 로그 모니터링
- [ ] **2.3** Supabase 쿼리 성능 확인

### 3. Analytics 설정

- [ ] **3.1** GA4 결제 이벤트 트래킹 확인
- [ ] **3.2** 전환율 대시보드 설정
- [ ] **3.3** Funnel 분석 설정

---

## 🔒 보안 점검

### 최종 보안 체크리스트

- [ ] **1** Secret Key가 클라이언트 번들에 포함되지 않음
- [ ] **2** HTTPS 강제 적용됨
- [ ] **3** CORS 설정 확인
- [ ] **4** Rate Limiting 설정 (DDoS 방지)
- [ ] **5** 결제 금액 서버 검증 로직 확인
- [ ] **6** SQL Injection 방지 확인
- [ ] **7** XSS 공격 방지 확인
- [ ] **8** 환경변수 암호화 확인 (Vercel Secrets)

### 보안 명령어 검증

```bash
# 클라이언트 번들에서 Secret Key 검색 (절대 발견되면 안 됨!)
grep -r "test_sk_" .next/
grep -r "live_sk_" .next/

# 결과: 아무것도 나오지 않아야 함!
```

---

## 📞 문제 발생 시 대응

### 1. 결제 실패 문제

**증상:** 모든 결제가 실패

**체크사항:**

1. Toss Dashboard에서 키 상태 확인
2. 환경변수가 올바르게 설정되었는지 확인
3. 네트워크 로그 확인 (Browser DevTools)
4. 서버 로그 확인 (`/api/payments/confirm`)

**해결:**

```bash
# 환경변수 재확인
vercel env ls

# 배포 재실행
vercel --prod --force
```

### 2. 금액 불일치 에러

**증상:** "금액이 일치하지 않습니다" 에러

**원인:** 클라이언트와 서버의 금액이 다름

**해결:**

```typescript
// 클라이언트 (PaymentWidget.tsx)
amount: 890000; // Integer 사용

// 서버 (confirm/route.ts)
amount: 890000; // 동일한 값
```

### 3. Webhook 실패

**증상:** Webhook 수신 안 됨

**체크사항:**

1. Toss Dashboard에서 Webhook URL 확인
2. HTTPS 인증서 유효성 확인
3. Webhook 엔드포인트 로그 확인

### 4. 긴급 연락처

- **Toss Payments 고객센터:** 1544-7772
- **개발자 문의:** https://developers.tosspayments.com/support
- **Vercel 서포트:** https://vercel.com/support

---

## ✨ 배포 완료 후

### 1. 팀 공유

- [ ] **1.1** 배포 완료 알림 (Slack, Email 등)
- [ ] **1.2** 테스트 결과 공유
- [ ] **1.3** 모니터링 대시보드 링크 공유
- [ ] **1.4** 운영 가이드 문서 공유

### 2. 문서 업데이트

- [ ] **2.1** README 업데이트 (프로덕션 URL)
- [ ] **2.2** API 문서 업데이트
- [ ] **2.3** 배포 로그 기록

### 3. 지속적 모니터링

**첫 주:**

- 매일 결제 내역 확인
- 에러 로그 모니터링
- 고객 피드백 수집

**첫 달:**

- 주간 리포트 확인
- 전환율 분석
- A/B 테스트 계획

---

## 📝 배포 기록

| 날짜       | 작업             | 담당자 | 비고      |
| ---------- | ---------------- | ------ | --------- |
| 2025-01-12 | 테스트 모드 완료 | Team   | 개발 완료 |
| YYYY-MM-DD | 실제 키 발급     |        | Toss 승인 |
| YYYY-MM-DD | 프로덕션 배포    |        | Live 전환 |

---

**마지막 업데이트:** 2025-01-12
**다음 리뷰:** 프로덕션 배포 후 1주일

**문의:** payments@TOTARO.com
