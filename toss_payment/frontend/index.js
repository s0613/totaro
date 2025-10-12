// 토스페이먼츠 SDK v2 결제위젯 연동
class TossPaymentWidget {
  constructor() {
    this.clientKey = 'test_ck_D5Ge1vyYnrbv0kz74wme1GXoOL1A'; // 테스트 클라이언트 키
    this.customerKey = this.generateCustomerKey();
    this.widgets = null;
    this.paymentMethodWidget = null;
    this.agreementWidget = null;
    this.amount = 50000; // 결제 금액
  }

  // 고유한 고객 키 생성
  generateCustomerKey() {
    return 'customer_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  // 고유한 주문 ID 생성
  generateOrderId() {
    return 'order_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  // 토스페이먼츠 SDK 초기화
  async initializeTossPayments() {
    try {
      console.log('토스페이먼츠 SDK 초기화 중...');
      
      // SDK 초기화
      const tossPayments = TossPayments(this.clientKey);
      
      // 결제위젯 인스턴스 생성
      this.widgets = tossPayments.widgets({
        customerKey: this.customerKey
      });

      console.log('토스페이먼츠 SDK 초기화 완료');
      return true;
    } catch (error) {
      console.error('토스페이먼츠 SDK 초기화 실패:', error);
      this.showError('토스페이먼츠 SDK 초기화에 실패했습니다.');
      return false;
    }
  }

  // 결제 금액 설정
  async setAmount() {
    try {
      await this.widgets.setAmount({
        currency: 'KRW',
        value: this.amount
      });
      console.log('결제 금액 설정 완료:', this.amount);
    } catch (error) {
      console.error('결제 금액 설정 실패:', error);
      throw error;
    }
  }

  // 결제 UI 렌더링
  async renderPaymentMethods() {
    try {
      console.log('결제 UI 렌더링 중...');
      
      this.paymentMethodWidget = await this.widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'DEFAULT'
      });

      // 결제수단 선택 이벤트 리스너
      this.paymentMethodWidget.on('paymentMethodSelect', (selectedPaymentMethod) => {
        console.log('선택된 결제수단:', selectedPaymentMethod);
        this.enablePaymentButton();
      });

      console.log('결제 UI 렌더링 완료');
    } catch (error) {
      console.error('결제 UI 렌더링 실패:', error);
      this.showError('결제 UI 렌더링에 실패했습니다.');
      throw error;
    }
  }

  // 이용약관 UI 렌더링
  async renderAgreement() {
    try {
      console.log('이용약관 UI 렌더링 중...');
      
      this.agreementWidget = await this.widgets.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT'
      });

      console.log('이용약관 UI 렌더링 완료');
    } catch (error) {
      console.error('이용약관 UI 렌더링 실패:', error);
      this.showError('이용약관 UI 렌더링에 실패했습니다.');
      throw error;
    }
  }

  // 결제 요청
  async requestPayment() {
    try {
      console.log('결제 요청 중...');
      
      const orderId = this.generateOrderId();
      
      const paymentRequest = {
        orderId: orderId,
        orderName: '토스 티셔츠 외 2건',
        successUrl: window.location.origin + '/success.html',
        failUrl: window.location.origin + '/fail.html',
        customerEmail: 'customer123@gmail.com',
        customerName: '김토스',
        customerMobilePhone: '01012341234'
      };

      console.log('결제 요청 정보:', paymentRequest);

      // 결제 요청 실행
      await this.widgets.requestPayment(paymentRequest);
      
    } catch (error) {
      console.error('결제 요청 실패:', error);
      this.showError('결제 요청에 실패했습니다: ' + error.message);
    }
  }

  // 결제 버튼 활성화
  enablePaymentButton() {
    const button = document.getElementById('payment-button');
    button.disabled = false;
    button.textContent = '결제하기';
  }

  // 에러 메시지 표시
  showError(message) {
    alert('오류: ' + message);
  }

  // 로딩 상태 표시
  showLoading(elementId, message = '로딩 중...') {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="loading">${message}</div>`;
  }

  // 메인 초기화 함수
  async init() {
    try {
      console.log('결제위젯 초기화 시작');
      
      // SDK 초기화
      const initialized = await this.initializeTossPayments();
      if (!initialized) return;

      // 결제 금액 설정
      await this.setAmount();

      // UI 렌더링
      await Promise.all([
        this.renderPaymentMethods(),
        this.renderAgreement()
      ]);

      // 결제 버튼 이벤트 리스너 등록
      this.setupPaymentButton();

      console.log('결제위젯 초기화 완료');
      
    } catch (error) {
      console.error('결제위젯 초기화 실패:', error);
      this.showError('결제위젯 초기화에 실패했습니다.');
    }
  }

  // 결제 버튼 이벤트 설정
  setupPaymentButton() {
    const button = document.getElementById('payment-button');
    button.addEventListener('click', () => {
      this.requestPayment();
    });
  }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  const paymentWidget = new TossPaymentWidget();
  paymentWidget.init();
});

// 전역 에러 핸들러
window.addEventListener('error', (event) => {
  console.error('전역 에러:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('처리되지 않은 Promise 거부:', event.reason);
});
