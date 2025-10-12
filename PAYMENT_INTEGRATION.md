# 토스페이먼츠 결제위젯 v2 통합 가이드

## 개요

totalo 앱에 토스페이먼츠 SDK v2 결제위젯이 통합되었습니다. 최신 v2 API를 활용하여 더 나은 사용자 경험과 안정성을 제공합니다.

## 통합된 기능

### 1. PaymentWidget 컴포넌트 (v2)
- **위치**: `app/components/payment/PaymentWidget.tsx`
- **SDK 버전**: v2 (https://js.tosspayments.com/v2/standard)
- **주요 기능**:
  - 결제 수단 UI 자동 렌더링
  - 이용약관 UI 자동 렌더링  
  - 결제수단 선택 이벤트 처리
  - 반응형 디자인
  - 에러 처리 및 사용자 안내

### 2. 결제 프로세스

```
사용자 주문 
  ↓
PaymentWidget 렌더링
  ↓
결제수단 선택
  ↓
결제 요청 (requestPayment)
  ↓
토스페이먼츠 결제창
  ↓
성공: /checkout/success
실패: /checkout/fail
  ↓
결제 승인 API 호출
  ↓
주문 완료
```

## v1 → v2 주요 변경사항

### SDK 초기화
```typescript
// v1
const tossPayments = TossPayments(clientKey);
const paymentWidget = tossPayments.widget({ customerKey });

// v2
const tossPayments = TossPayments(clientKey);
const widgets = tossPayments.widgets({ customerKey });
```

### 금액 설정
```typescript
// v1
paymentWidget.renderPaymentMethods("#payment-method", {
  value: 10000,
  currency: "KRW"
});

// v2
await widgets.setAmount({
  currency: "KRW",
  value: 10000
});
await widgets.renderPaymentMethods({
  selector: "#payment-method"
});
```

### 이벤트 처리
```typescript
// v1
paymentWidget.on("ready", () => {
  // 준비 완료
});

// v2
const paymentMethodWidget = await widgets.renderPaymentMethods({...});
paymentMethodWidget.on("paymentMethodSelect", (selectedMethod) => {
  // 결제수단 선택됨
});
```

## 사용법

### 1. Checkout 페이지에서 사용
```tsx
import PaymentWidget from "@/app/components/payment/PaymentWidget";

<PaymentWidget
  amount={890000}
  orderName="토타로 스타터 플랜"
  customerName="홍길동"
  customerEmail="hong@example.com"
  currency="KRW"
  onPaymentRequest={(orderId) => {
    console.log("결제 시작:", orderId);
  }}
/>
```

### 2. 환경 변수 설정
```env
# .env.local
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...
NEXT_PUBLIC_TOSS_SUCCESS_URL=http://localhost:3000/checkout/success
NEXT_PUBLIC_TOSS_FAIL_URL=http://localhost:3000/checkout/fail
```

### 3. 결제 승인 API
```typescript
// app/api/payments/confirm/route.ts
import { confirmPayment } from "@/lib/payments/toss-payments";

export async function POST(request: Request) {
  const { paymentKey, orderId, amount } = await request.json();
  
  const result = await confirmPayment({
    paymentKey,
    orderId,
    amount
  });
  
  return Response.json(result);
}
```

## 주요 컴포넌트

### PaymentWidget Props
```typescript
interface PaymentWidgetProps {
  amount: number;                    // 결제 금액 (필수)
  orderId?: string;                  // 주문 ID (선택, 자동 생성)
  orderName: string;                 // 주문명 (필수)
  customerName?: string;             // 구매자명
  customerEmail?: string;            // 구매자 이메일
  customerMobilePhone?: string;      // 구매자 전화번호
  currency?: "KRW" | "USD" | "JPY"; // 통화 (기본: KRW)
  onPaymentRequest?: (orderId: string) => void; // 결제 요청 콜백
}
```

### 상태 관리
- `isReady`: 위젯 렌더링 완료 여부
- `isSdkLoaded`: SDK 로드 완료 여부
- `selectedPaymentMethod`: 선택된 결제수단
- `error`: 에러 메시지

## 테스트

### 테스트 결제 정보
- **카드번호**: 4242-4242-4242-4242
- **유효기간**: 임의의 미래 날짜
- **CVC**: 임의의 3자리 숫자
- **비밀번호**: 임의의 2자리 숫자

### 테스트 환경
테스트 클라이언트 키를 사용하면 실제 결제가 발생하지 않습니다.

## 에러 처리

### 주요 에러 코드
- `PAY_PROCESS_CANCELED`: 사용자가 결제 취소
- `PAY_PROCESS_ABORTED`: 결제 실패
- `REJECT_CARD_COMPANY`: 카드사 거절
- `NOT_FOUND_PAYMENT_SESSION`: 결제 세션 만료
- `UNAUTHORIZED_KEY`: API 키 오류
- `FORBIDDEN_REQUEST`: 잘못된 요청

### 에러 핸들링 예시
```typescript
try {
  await widgets.requestPayment({...});
} catch (err: any) {
  if (err.code === "PAY_PROCESS_CANCELED") {
    // 사용자 취소 처리
  } else if (err.code === "REJECT_CARD_COMPANY") {
    // 카드 거절 처리
  }
}
```

## UI/UX 개선사항

### 1. 반응형 디자인
- 모바일/데스크톱 최적화
- 다크모드 지원

### 2. 사용자 경험
- 실시간 결제수단 선택 피드백
- 로딩 상태 표시
- 명확한 에러 메시지
- 테스트 결제 안내

### 3. 접근성
- 키보드 네비게이션 지원
- 스크린 리더 호환
- 명확한 레이블링

## 보안

### 1. API 키 관리
- 클라이언트 키: 프론트엔드에서 사용 (공개 가능)
- 시크릿 키: 서버에서만 사용 (비공개)
- 환경 변수로 관리

### 2. 결제 검증
- 서버에서 결제 승인 API 호출
- 금액 검증 (클라이언트 금액과 서버 금액 일치 확인)
- 중복 결제 방지

## 문제 해결

### 1. SDK 로드 실패
```
Toss Payments SDK가 로드되지 않았습니다.
```
**해결방법**: 인터넷 연결 확인, CDN 접근 가능 여부 확인

### 2. 위젯 초기화 실패
```
NEXT_PUBLIC_TOSS_CLIENT_KEY가 설정되지 않았습니다.
```
**해결방법**: 환경 변수 설정 확인

### 3. 결제 승인 실패
```
NOT_FOUND_PAYMENT_SESSION
```
**해결방법**: 결제 요청 후 10분 이내에 승인 필요

## 개발자 도구

### 콘솔 로그
```typescript
[PaymentWidget] 토스페이먼츠 SDK v2 초기화 중...
[PaymentWidget] customerKey: customer@example.com
[PaymentWidget] 금액 설정 완료: { currency: 'KRW', value: 890000 }
[PaymentWidget] 선택된 결제수단: { code: '카드' }
[PaymentWidget] 결제 요청: { orderId: '...', orderName: '...', amount: 890000 }
```

### 네트워크 탭
- SDK 로드: `https://js.tosspayments.com/v2/standard`
- 결제 승인 API: `POST /api/payments/confirm`
- 결제 조회 API: `GET /api/payments/{paymentKey}`

## 추가 기능

### 1. 브랜드페이 (선택사항)
```typescript
const widgets = tossPayments.widgets({
  customerKey,
  brandpay: {
    redirectUrl: 'https://yourdomain.com/auth'
  }
});
```

### 2. 해외 간편결제 (PayPal 등)
```typescript
await widgets.setAmount({
  currency: "USD",
  value: 100.00
});
```

### 3. 커스텀 결제수단 (Pro 플랜)
결제위젯 어드민에서 커스텀 결제수단 추가 가능

## 참고 자료

- [토스페이먼츠 개발자센터](https://developers.tosspayments.com)
- [SDK v2 문서](https://docs.tosspayments.com/sdk/v2/js)
- [결제위젯 가이드](https://docs.tosspayments.com/guides/payment-widget)
- [API 레퍼런스](https://docs.tosspayments.com/reference)

## 지원

- **고객센터**: 1544-7772
- **이메일**: support@tosspayments.com
- **실시간 채팅**: [Discord](https://discord.gg/tosspayments)

---

**마지막 업데이트**: 2025-10-12
**작성자**: totalo development team
