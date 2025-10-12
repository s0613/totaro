# 토스페이먼츠 SDK v2 결제위젯 연동 예제

토스페이먼츠 SDK v2를 사용한 결제위젯 연동 예제입니다. 프론트엔드와 백엔드가 분리된 구조로 구현되어 있습니다.

## 📋 목차

- [프로젝트 구조](#프로젝트-구조)
- [기능 소개](#기능-소개)
- [설치 및 실행](#설치-및-실행)
- [API 문서](#api-문서)
- [사용법](#사용법)
- [주요 변경사항](#주요-변경사항)
- [문제 해결](#문제-해결)

## 🏗️ 프로젝트 구조

```
toss_payment/
├── frontend/                 # 프론트엔드 파일
│   ├── index.html           # 메인 결제 페이지
│   ├── success.html         # 결제 성공 페이지
│   ├── fail.html           # 결제 실패 페이지
│   ├── index.js            # 결제위젯 연동 JavaScript
│   └── style.css           # 스타일시트
├── backend/                 # 백엔드 API 서버
│   ├── server.js           # Express 서버
│   ├── payments.controller.js  # 결제 컨트롤러
│   ├── payments.service.js     # 결제 서비스
│   ├── payments.router.js      # 라우터
│   └── package.json        # Node.js 의존성
└── README.md               # 프로젝트 문서
```

## ✨ 기능 소개

### 프론트엔드
- **토스페이먼츠 SDK v2** 결제위젯 연동
- **반응형 디자인**으로 모바일/데스크톱 지원
- **실시간 결제수단 선택** 및 결제 버튼 활성화
- **결제 성공/실패 페이지** 자동 리다이렉트
- **에러 처리** 및 사용자 친화적 메시지

### 백엔드
- **Express.js** 기반 RESTful API
- **결제 승인 API** 연동
- **결제 조회/취소** 기능
- **웹훅 이벤트** 처리
- **CORS 설정** 및 에러 핸들링

## 🚀 설치 및 실행

### 1. 백엔드 서버 실행

```bash
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 서버 시작
npm start

# 개발 모드 (nodemon 사용)
npm run dev
```

### 2. 프론트엔드 접속

브라우저에서 다음 주소로 접속:
- **메인 페이지**: http://localhost:3001
- **API 문서**: http://localhost:3001/api/docs
- **헬스 체크**: http://localhost:3001/api/payments/health

## 📚 API 문서

### 기본 정보
- **Base URL**: `http://localhost:3001/api/payments`
- **Content-Type**: `application/json`
- **Authorization**: Basic Auth (시크릿 키 사용)

### 주요 엔드포인트

#### 1. 결제 승인
```http
POST /api/payments/confirm
Content-Type: application/json

{
  "paymentKey": "string",
  "orderId": "string", 
  "amount": number
}
```

#### 2. 결제 조회
```http
GET /api/payments/{paymentKey}
```

#### 3. 결제 취소
```http
POST /api/payments/{paymentKey}/cancel
Content-Type: application/json

{
  "cancelReason": "string",
  "cancelAmount": number
}
```

#### 4. 웹훅 처리
```http
POST /api/payments/webhook
Content-Type: application/json

{
  "eventType": "string",
  "data": {}
}
```

## 🎯 사용법

### 1. 결제 프로세스

1. **메인 페이지 접속**: http://localhost:3001
2. **결제수단 선택**: 결제위젯에서 원하는 결제수단 선택
3. **결제 버튼 클릭**: "결제하기" 버튼 활성화 후 클릭
4. **결제 진행**: 토스페이먼츠 결제창에서 결제 정보 입력
5. **결과 확인**: 성공/실패 페이지에서 결과 확인

### 2. 테스트 결제

테스트 환경에서는 실제 결제가 발생하지 않습니다:
- **테스트 카드**: 4242-4242-4242-4242
- **유효기간**: 임의의 미래 날짜
- **CVC**: 임의의 3자리 숫자

### 3. 개발자 도구 활용

브라우저 개발자 도구에서 다음을 확인할 수 있습니다:
- **콘솔 로그**: 결제위젯 초기화 및 이벤트 로그
- **네트워크 탭**: API 호출 및 응답 확인
- **애플리케이션 탭**: 로컬 스토리지 및 세션 정보

## 🔄 주요 변경사항 (SDK v2)

### v1 → v2 마이그레이션

#### 1. SDK 초기화
```javascript
// v1
const paymentWidget = PaymentWidget(clientKey, customerKey);

// v2
const tossPayments = TossPayments(clientKey);
const widgets = tossPayments.widgets({ customerKey });
```

#### 2. 결제 금액 설정
```javascript
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

#### 3. 이벤트 처리
```javascript
// v1
paymentMethodsWidget.on("ready", () => {
  // 결제 버튼 활성화
});

// v2
paymentMethodWidget.on("paymentMethodSelect", (selectedPaymentMethod) => {
  // 결제수단 선택 시 처리
});
```

## 🛠️ 문제 해결

### 자주 발생하는 문제

#### 1. CORS 오류
```
Access to XMLHttpRequest blocked by CORS policy
```
**해결방법**: 백엔드 서버의 CORS 설정 확인

#### 2. 결제위젯 로딩 실패
```
TossPayments is not defined
```
**해결방법**: 토스페이먼츠 SDK 스크립트 로드 확인

#### 3. API 키 오류
```
UNAUTHORIZED_KEY
```
**해결방법**: 클라이언트 키와 시크릿 키 매칭 확인

#### 4. 결제 승인 실패
```
NOT_FOUND_PAYMENT_SESSION
```
**해결방법**: 결제 요청 후 10분 이내 승인 필요

### 디버깅 팁

1. **브라우저 콘솔** 확인
2. **네트워크 탭**에서 API 호출 상태 확인
3. **토스페이먼츠 개발자센터**에서 테스트 결제내역 확인
4. **서버 로그** 확인

## 📞 지원 및 문의

- **토스페이먼츠 고객센터**: 1544-7772
- **이메일**: support@tosspayments.com
- **개발자센터**: https://developers.tosspayments.com
- **실시간 기술지원**: https://discord.gg/tosspayments

## 📄 라이선스

MIT License

## 🔗 관련 링크

- [토스페이먼츠 개발자센터](https://developers.tosspayments.com)
- [SDK v2 문서](https://docs.tosspayments.com/sdk/v2/js)
- [결제위젯 가이드](https://docs.tosspayments.com/guides/payment-widget)
- [API 레퍼런스](https://docs.tosspayments.com/reference)

---

**주의사항**: 이 예제는 테스트 환경용입니다. 실제 서비스에 적용할 때는 보안 및 에러 처리를 강화해주세요.
