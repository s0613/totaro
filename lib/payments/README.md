# Toss Payments 통합 가이드

이 문서는 totaro 프로젝트의 Toss Payments 통합 구현을 설명합니다.

## 📁 파일 구조

```
lib/payments/
├── payment-config.ts       # 환경설정 및 상수
├── payment-types.ts        # TypeScript 타입 정의
├── payment-utils.ts        # 유틸리티 함수
├── toss-payments.ts        # Toss API 클라이언트 (서버 사이드)
└── README.md              # 이 문서

app/components/payment/
├── PaymentWidget.tsx       # 결제 위젯 컴포넌트
└── PaymentWindow.tsx       # 결제 창 컴포넌트

app/api/payments/
├── confirm/route.ts        # 결제 승인 API
├── cancel/route.ts         # 결제 취소 API
└── webhook/route.ts        # 웹훅 핸들러

app/checkout/
├── page.tsx               # 결제 페이지
├── success/page.tsx       # 결제 성공 페이지
└── fail/page.tsx          # 결제 실패 페이지
```

## 🔐 환경변수 설정

### 개발 환경 (.env.local)

```bash
# Toss Payments 테스트 키
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq
TOSS_SECRET_KEY=test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R

# 사이트 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Payment Widget 버전
NEXT_PUBLIC_TOSS_PAYMENT_WIDGET_VERSION=2.0
```

### 프로덕션 환경 (.env.production)

```bash
# Toss Payments 실제 키 (승인 후 발급)
NEXT_PUBLIC_TOSS_CLIENT_KEY=live_ck_실제키입력
TOSS_SECRET_KEY=live_sk_실제키입력

# 실제 도메인
NEXT_PUBLIC_SITE_URL=https://totaro.com

# Payment Widget 버전
NEXT_PUBLIC_TOSS_PAYMENT_WIDGET_VERSION=2.0
```

## 🚀 테스트 모드에서 실제 모드로 전환하기

### 1단계: Toss Payments 승인 받기

1. [Toss Payments 개발자센터](https://developers.tosspayments.com)에서 회원가입
2. 사업자 정보 등록
3. 심사 신청 및 승인 대기
4. 승인 완료 후 **실제 키(live key)** 발급 받기

### 2단계: 환경변수 업데이트

**Vercel 환경변수 설정:**

```bash
# Vercel 대시보드에서 설정
Production Environment Variables:
- NEXT_PUBLIC_TOSS_CLIENT_KEY: live_ck_실제키
- TOSS_SECRET_KEY: live_sk_실제키
- NEXT_PUBLIC_SITE_URL: https://totaro.com
```

### 3단계: 코드 변경 없음!

환경변수만 변경하면 코드 수정 없이 자동으로 실제 결제로 전환됩니다.

모든 API 호출은 `payment-config.ts`의 환경변수를 참조하므로:
- 테스트 키 → 테스트 모드
- 실제 키 → 실제 모드

## 📝 사용 방법

### 결제 위젯 사용 (권장)

```tsx
import PaymentWidget from '@/app/components/payment/PaymentWidget';

export default function CheckoutPage() {
  return (
    <PaymentWidget
      amount={890000}
      orderName="totaro 웹사이트 스타터 플랜"
      customerName="홍길동"
      customerEmail="hong@example.com"
      currency="KRW"
      onPaymentRequest={(orderId) => {
        console.log('결제 시작:', orderId);
      }}
    />
  );
}
```

### 결제 플로우

```
1. 사용자가 결제 버튼 클릭
   ↓
2. Toss Payment Widget 로드
   ↓
3. 카드 정보 입력 및 승인
   ↓
4. Toss 서버 리디렉션 (paymentKey, orderId, amount 포함)
   ↓
5. /checkout/success 페이지 이동
   ↓
6. POST /api/payments/confirm 호출 (서버)
   ↓
7. Toss API로 최종 승인 요청
   ↓
8. 주문 상태 업데이트 (Supabase)
   ↓
9. 사용자에게 결과 표시
```

## 🧪 테스트 카드 번호

개발 환경에서 사용 가능한 테스트 카드:

| 카드 번호 | 만료일 | CVC | 비밀번호 | 결과 |
|----------|--------|-----|---------|------|
| 5570-1234-5678-9012 | 12/25 | 123 | 1234 | ✅ 성공 |
| 5570-1234-5678-9013 | 12/25 | 123 | 1234 | ❌ 잔액 부족 |
| 5570-1234-5678-9014 | 12/25 | 123 | 1234 | ❌ 유효하지 않은 카드 |
| 5570-1234-5678-9015 | 12/25 | 123 | 1234 | ❌ 만료된 카드 |

## 🔧 API 엔드포인트

### POST /api/payments/confirm

결제 승인 처리

**Request:**
```json
{
  "paymentKey": "payment_key_from_toss",
  "orderId": "ORDER_20250112_XXXXX",
  "amount": 890000
}
```

**Response (성공):**
```json
{
  "success": true,
  "data": {
    "orderId": "ORDER_20250112_XXXXX",
    "paymentKey": "payment_key_from_toss",
    "status": "DONE",
    "totalAmount": 890000
  }
}
```

### POST /api/payments/cancel

결제 취소 처리

**Request:**
```json
{
  "paymentKey": "payment_key_from_toss",
  "cancelReason": "고객 요청",
  "cancelAmount": 890000  // 부분 취소 시 금액 지정
}
```

### POST /api/payments/webhook

Toss Payments 웹훅 수신 (선택사항)

## 🛡️ 보안 체크리스트

- [x] Secret Key는 절대 클라이언트에 노출되지 않음 (서버 사이드만)
- [x] Client Key만 클라이언트에서 사용 (NEXT_PUBLIC_*)
- [x] 결제 금액 검증 (서버에서 재확인)
- [x] HTTPS 사용 (프로덕션)
- [x] CORS 설정 확인
- [x] 환경변수 암호화 (Vercel Secrets)

## 📊 결제 상태 관리

결제 상태는 Supabase `orders` 테이블에 저장:

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  amount BIGINT NOT NULL,
  currency TEXT DEFAULT 'KRW',
  status TEXT DEFAULT 'pending',
  payment_key TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**상태 값:**
- `pending` - 결제 대기
- `paid` - 결제 완료
- `failed` - 결제 실패
- `cancelled` - 결제 취소

## 🐛 트러블슈팅

### 문제: "TOSS_SECRET_KEY is not configured" 에러

**해결:**
```bash
# .env.local 파일 확인
cat .env.local | grep TOSS_SECRET_KEY

# 없으면 추가
echo "TOSS_SECRET_KEY=test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R" >> .env.local

# 서버 재시작
npm run dev
```

### 문제: CORS 에러

**해결:** `middleware.ts`에서 허용된 도메인 확인

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Toss Payments 도메인 허용
  response.headers.set(
    'Access-Control-Allow-Origin',
    'https://api.tosspayments.com'
  );

  return response;
}
```

### 문제: 결제 금액 불일치

**해결:** 클라이언트와 서버의 금액이 정확히 일치해야 함

```typescript
// ❌ 잘못된 예
const amount = 890000.00;  // Float 사용 금지

// ✅ 올바른 예
const amount = 890000;  // Integer 사용
```

## 📚 참고 문서

- [Toss Payments 공식 문서](https://docs.tosspayments.com)
- [Payment Widget API Reference](https://docs.tosspayments.com/reference/widget-sdk)
- [결제 승인 API](https://docs.tosspayments.com/reference#결제-승인)
- [테스트 가이드](https://docs.tosspayments.com/guides/test)

## 🔄 업데이트 로그

- 2025-01-12: 초기 통합 완료 (테스트 모드)
- 2025-01-XX: 실제 결제 전환 예정

---

**문의:** 결제 관련 문제는 이슈 등록 또는 Toss Payments 고객센터(1544-7772)로 연락
