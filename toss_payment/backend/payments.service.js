const axios = require('axios');

class PaymentsService {
  constructor() {
    // 토스페이먼츠 API 설정
    this.baseURL = 'https://api.tosspayments.com/v1';
    this.secretKey = 'test_sk_D4yKeq5bgrpKRd0JYbLVGX0lzW6Y'; // 테스트 시크릿 키
    this.clientKey = 'test_ck_D5Ge1vyYnrbv0kz74wme1GXoOL1A'; // 테스트 클라이언트 키
    
    // 시크릿 키 인코딩 (Base64)
    this.authorization = Buffer.from(`${this.secretKey}:`).toString('base64');
    
    // Axios 인스턴스 생성
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Basic ${this.authorization}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 결제 승인 API 호출
   * @param {Object} paymentData - 결제 승인 데이터
   * @param {string} paymentData.paymentKey - 결제 키
   * @param {string} paymentData.orderId - 주문 ID
   * @param {number} paymentData.amount - 결제 금액
   * @returns {Promise<Object>} 결제 승인 결과
   */
  async confirmPayment(paymentData) {
    try {
      console.log('결제 승인 요청:', paymentData);

      const response = await this.api.post('/payments/confirm', {
        paymentKey: paymentData.paymentKey,
        orderId: paymentData.orderId,
        amount: paymentData.amount
      });

      console.log('결제 승인 성공:', response.data);
      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('결제 승인 실패:', error.response?.data || error.message);
      
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.message || error.message,
          status: error.response?.status || 500
        }
      };
    }
  }

  /**
   * 결제 조회 API 호출
   * @param {string} paymentKey - 결제 키
   * @returns {Promise<Object>} 결제 정보
   */
  async getPayment(paymentKey) {
    try {
      console.log('결제 조회 요청:', paymentKey);

      const response = await this.api.get(`/payments/${paymentKey}`);

      console.log('결제 조회 성공:', response.data);
      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('결제 조회 실패:', error.response?.data || error.message);
      
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.message || error.message,
          status: error.response?.status || 500
        }
      };
    }
  }

  /**
   * 결제 취소 API 호출
   * @param {Object} cancelData - 결제 취소 데이터
   * @param {string} cancelData.paymentKey - 결제 키
   * @param {string} cancelData.cancelReason - 취소 사유
   * @param {number} cancelData.cancelAmount - 취소 금액 (선택사항)
   * @returns {Promise<Object>} 결제 취소 결과
   */
  async cancelPayment(cancelData) {
    try {
      console.log('결제 취소 요청:', cancelData);

      const response = await this.api.post(`/payments/${cancelData.paymentKey}/cancel`, {
        cancelReason: cancelData.cancelReason,
        cancelAmount: cancelData.cancelAmount
      });

      console.log('결제 취소 성공:', response.data);
      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('결제 취소 실패:', error.response?.data || error.message);
      
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'UNKNOWN_ERROR',
          message: error.response?.data?.message || error.message,
          status: error.response?.status || 500
        }
      };
    }
  }

  /**
   * 웹훅 이벤트 처리
   * @param {Object} webhookData - 웹훅 데이터
   * @returns {Promise<Object>} 처리 결과
   */
  async handleWebhook(webhookData) {
    try {
      console.log('웹훅 이벤트 수신:', webhookData);

      const { eventType, data } = webhookData;

      switch (eventType) {
        case 'PAYMENT_STATUS_CHANGED':
          return await this.handlePaymentStatusChanged(data);
        case 'PAYMENT_CONFIRMED':
          return await this.handlePaymentConfirmed(data);
        default:
          console.log('알 수 없는 웹훅 이벤트:', eventType);
          return {
            success: true,
            message: '이벤트 처리 완료'
          };
      }

    } catch (error) {
      console.error('웹훅 처리 실패:', error);
      
      return {
        success: false,
        error: {
          code: 'WEBHOOK_PROCESSING_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * 결제 상태 변경 이벤트 처리
   * @param {Object} paymentData - 결제 데이터
   * @returns {Promise<Object>} 처리 결과
   */
  async handlePaymentStatusChanged(paymentData) {
    try {
      console.log('결제 상태 변경 처리:', paymentData);

      // 결제 상태에 따른 비즈니스 로직 처리
      const { status, paymentKey, orderId } = paymentData;

      switch (status) {
        case 'DONE':
          console.log('결제 완료:', { paymentKey, orderId });
          // 결제 완료 후 처리 로직 (주문 상태 업데이트, 재고 차감 등)
          break;
        case 'ABORTED':
          console.log('결제 실패:', { paymentKey, orderId });
          // 결제 실패 후 처리 로직
          break;
        case 'IN_PROGRESS':
          console.log('결제 진행 중:', { paymentKey, orderId });
          // 결제 진행 중 처리 로직
          break;
        default:
          console.log('알 수 없는 결제 상태:', status);
      }

      return {
        success: true,
        message: '결제 상태 변경 처리 완료'
      };

    } catch (error) {
      console.error('결제 상태 변경 처리 실패:', error);
      throw error;
    }
  }

  /**
   * 결제 승인 이벤트 처리
   * @param {Object} paymentData - 결제 데이터
   * @returns {Promise<Object>} 처리 결과
   */
  async handlePaymentConfirmed(paymentData) {
    try {
      console.log('결제 승인 처리:', paymentData);

      // 결제 승인 후 처리 로직
      const { paymentKey, orderId, amount } = paymentData;

      // 주문 상태 업데이트, 재고 차감, 이메일 발송 등의 비즈니스 로직
      console.log('비즈니스 로직 처리:', { paymentKey, orderId, amount });

      return {
        success: true,
        message: '결제 승인 처리 완료'
      };

    } catch (error) {
      console.error('결제 승인 처리 실패:', error);
      throw error;
    }
  }

  /**
   * 에러 코드별 메시지 반환
   * @param {string} code - 에러 코드
   * @returns {string} 에러 메시지
   */
  getErrorMessage(code) {
    const errorMessages = {
      'NOT_FOUND_PAYMENT_SESSION': '결제 시간이 만료되어 결제 진행 데이터가 존재하지 않습니다.',
      'REJECT_CARD_COMPANY': '카드사에서 해당 카드를 거절했습니다.',
      'FORBIDDEN_REQUEST': 'API 키값 또는 주문번호가 최초 요청한 값과 다릅니다.',
      'UNAUTHORIZED_KEY': 'API 키를 잘못 입력했습니다.',
      'PAY_PROCESS_CANCELED': '구매자에 의해 결제가 취소되었습니다.',
      'PAY_PROCESS_ABORTED': '결제가 실패했습니다.'
    };

    return errorMessages[code] || '알 수 없는 오류가 발생했습니다.';
  }
}

module.exports = PaymentsService;
