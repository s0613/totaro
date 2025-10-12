# 토스페이먼츠 결제 위젯 디버깅 가이드

## 수정 사항 (2025-01-12)

### ✅ 개선된 에러 처리 및 로깅

결제 위젯 초기화 과정에서 발생할 수 있는 문제를 더 명확하게 파악하기 위해 다음을 개선했습니다:

1. **상세한 로깅 추가**
   - SDK 로드 상태 확인
   - DOM 요소 존재 여부 확인
   - 각 단계별 초기화 상태 로깅

2. **DOM 렌더링 대기 시간 증가**
   - 100ms → 300ms로 증가
   - React의 hydration 완료 대기

3. **에러 처리 강화**
   - DOM 요소가 없을 경우 명확한 에러 메시지
   - SDK 로드 실패 시 즉시 감지
   - 에러 상세 정보 콘솔 출력

## 디버깅 방법

### 1. 브라우저 개발자 도구 열기

**Chrome / Edge:**

- Windows/Linux: `F12` 또는 `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`

**Firefox:**

- Windows/Linux: `F12` 또는 `Ctrl + Shift + K`
- Mac: `Cmd + Option + K`

### 2. Console 탭에서 로그 확인

결제 페이지 (`/payments/test`)에 접속하면 다음과 같은 로그가 출력됩니다:

```
✅ 정상 동작 시:
[TossPayments] SDK 로드 완료
[TossPayments] 위젯 초기화 시작
[TossPayments] clientKey: test_ck_***
[TossPayments] customerKey: customer_***
[TossPayments] orderId: order_***
[TossPayments] amount: 490000
[TossPayments] DOM 요소 확인 완료
[TossPayments] SDK 초기화 완료
[TossPayments] 위젯 인스턴스 생성 완료
[TossPayments] 금액 설정 완료: 490000
[TossPayments] 결제 수단 UI 렌더링 시작...
[TossPayments] 결제 수단 UI 렌더링 완료
[TossPayments] 이용약관 UI 렌더링 시작...
[TossPayments] 이용약관 UI 렌더링 완료
[TossPayments] 모든 위젯 렌더링 완료
```

### 3. 일반적인 에러 및 해결 방법

#### ❌ "DOM 요소를 찾을 수 없습니다"

```
[TossPayments] DOM 요소를 찾을 수 없습니다
```

**원인**: `#payment-method` 또는 `#agreement` DOM 요소가 렌더링되지 않음  
**해결**:

- 페이지 새로고침 (`Cmd/Ctrl + R`)
- Hard refresh (`Cmd/Ctrl + Shift + R`)
- 캐시 삭제 후 새로고침

#### ❌ "SDK가 로드되지 않았습니다"

```
[TossPayments] SDK가 로드되지 않았습니다
```

**원인**: 토스페이먼츠 SDK 스크립트 로드 실패  
**해결**:

- 네트워크 연결 확인
- `https://js.tosspayments.com/v2/standard` 접근 가능 여부 확인
- 브라우저 확장 프로그램(광고 차단 등) 비활성화

#### ❌ "결제 위젯 초기화에 실패했습니다"

```
[TossPayments] 초기화 오류: {...}
```

**원인**: 위젯 초기화 과정에서 예외 발생  
**해결**:

1. Console에서 에러 상세 정보 확인
2. `clientKey`가 올바른지 확인
3. MCP 문서 참고하여 파라미터 검증

## 환경 변수 확인

### `.env.local` 파일

```env
# 토스페이먼츠 클라이언트 키 (결제위젯 연동 키)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_D5Ge1vyYnrbv0kz74wme1GXoOL1A

# 토스페이먼츠 시크릿 키
TOSS_SECRET_KEY=test_sk_***
```

**참고**: 환경 변수가 없어도 기본 테스트 키로 동작하지만, 프로덕션에서는 반드시 설정해야 합니다.

## 네트워크 요청 확인

### Network 탭에서 확인할 항목

1. **SDK 스크립트 로드**
   - URL: `https://js.tosspayments.com/v2/standard`
   - Status: `200 OK`
   - Type: `script`

2. **결제 위젯 API 호출**
   - 위젯 렌더링 시 토스페이먼츠 API 호출
   - CORS 에러 없음 확인

## 로컬 개발 서버 재시작

변경사항이 반영되지 않는 경우:

```bash
# 서버 종료 (Ctrl+C)

# 포트 강제 종료 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# 개발 서버 재시작
cd /Users/songseungju/totalo
npm run dev
```

## MCP 도구를 활용한 문제 해결

토스페이먼츠 MCP를 사용하여 공식 문서 검색:

```javascript
// 결제위젯 초기화 관련 문서
mcp_tosspayments -
  integration -
  guide_get -
  v2 -
  documents({
    keywords: ["결제위젯", "초기화", "렌더링"],
    searchMode: "balanced",
    maxTokens: 15000,
  });

// 에러 코드 관련 문서
mcp_tosspayments -
  integration -
  guide_get -
  v2 -
  documents({
    keywords: ["에러", "코드", "오류"],
    searchMode: "precise",
    maxTokens: 10000,
  });
```

## 문제가 계속되는 경우

1. **브라우저 캐시 완전 삭제**
   - Chrome: Settings → Privacy → Clear browsing data
   - 모든 시간 범위 선택
   - "Cached images and files" 체크

2. **다른 브라우저로 테스트**
   - Chrome, Firefox, Safari에서 각각 테스트

3. **로그 전체 내용 확인**
   - Console에서 모든 로그 복사
   - 에러 스택 트레이스 확인

4. **코드 검증**

   ```bash
   # TypeScript 타입 체크
   npx tsc --noEmit

   # Lint 체크
   npx next lint
   ```

## 정상 동작 확인 체크리스트

- [ ] 페이지 로딩 시 스피너 표시
- [ ] 3-5초 내에 결제 UI 렌더링
- [ ] 결제수단 선택 UI 표시
- [ ] 이용약관 UI 표시
- [ ] 결제수단 선택 시 버튼 활성화
- [ ] 콘솔에 에러 없음

## 추가 리소스

- [토스페이먼츠 공식 문서](https://docs.tosspayments.com)
- [결제위젯 v2 마이그레이션 가이드](https://docs.tosspayments.com/migration/v2)
- [개발자 센터](https://developers.tosspayments.com)

---

**마지막 업데이트**: 2025-01-12  
**버전**: v2 SDK  
**테스트 환경**: Next.js 15.0.2, React 19
