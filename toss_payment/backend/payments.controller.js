const PaymentsService = require('./payments.service');

class PaymentsController {
  constructor() {
    this.paymentsService = new PaymentsService();
  }

  /**
   * 결제 승인 처리
   * @param {Object} req - Express 요청 객체
   * @param {Object} res - Express 응답 객체
   */
  async confirmPayment(req, res) {
    try {
      const { paymentKey, orderId, amount } = req.body;

      // 필수 파라미터 검증
      if (!paymentKey || !orderId || !amount) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: '필수 파라미터가 누락되었습니다. (paymentKey, orderId, amount)'
          }
        });
      }

      // 결제 승인 API 호출
      const result = await this.paymentsService.confirmPayment({
        paymentKey,
        orderId,
        amount: parseInt(amount)
      });

      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          message: '결제가 성공적으로 승인되었습니다.'
        });
      } else {
        res.status(result.error.status || 400).json({
          success: false,
          error: result.error
        });
      }

    } catch (error) {
      console.error('결제 승인 컨트롤러 오류:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 내부 오류가 발생했습니다.'
        }
      });
    }
  }

  /**
   * 결제 조회 처리
   * @param {Object} req - Express 요청 객체
   * @param {Object} res - Express 응답 객체
   */
  async getPayment(req, res) {
    try {
      const { paymentKey } = req.params;

      // 필수 파라미터 검증
      if (!paymentKey) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'paymentKey가 누락되었습니다.'
          }
        });
      }

      // 결제 조회 API 호출
      const result = await this.paymentsService.getPayment(paymentKey);

      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          message: '결제 정보를 성공적으로 조회했습니다.'
        });
      } else {
        res.status(result.error.status || 400).json({
          success: false,
          error: result.error
        });
      }

    } catch (error) {
      console.error('결제 조회 컨트롤러 오류:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 내부 오류가 발생했습니다.'
        }
      });
    }
  }

  /**
   * 결제 취소 처리
   * @param {Object} req - Express 요청 객체
   * @param {Object} res - Express 응답 객체
   */
  async cancelPayment(req, res) {
    try {
      const { paymentKey } = req.params;
      const { cancelReason, cancelAmount } = req.body;

      // 필수 파라미터 검증
      if (!paymentKey || !cancelReason) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: '필수 파라미터가 누락되었습니다. (paymentKey, cancelReason)'
          }
        });
      }

      // 결제 취소 API 호출
      const result = await this.paymentsService.cancelPayment({
        paymentKey,
        cancelReason,
        cancelAmount: cancelAmount ? parseInt(cancelAmount) : undefined
      });

      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          message: '결제가 성공적으로 취소되었습니다.'
        });
      } else {
        res.status(result.error.status || 400).json({
          success: false,
          error: result.error
        });
      }

    } catch (error) {
      console.error('결제 취소 컨트롤러 오류:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 내부 오류가 발생했습니다.'
        }
      });
    }
  }

  /**
   * 웹훅 이벤트 처리
   * @param {Object} req - Express 요청 객체
   * @param {Object} res - Express 응답 객체
   */
  async handleWebhook(req, res) {
    try {
      const webhookData = req.body;

      // 웹훅 데이터 검증
      if (!webhookData || !webhookData.eventType) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_WEBHOOK_DATA',
            message: '유효하지 않은 웹훅 데이터입니다.'
          }
        });
      }

      // 웹훅 이벤트 처리
      const result = await this.paymentsService.handleWebhook(webhookData);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: '웹훅 이벤트가 성공적으로 처리되었습니다.'
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error
        });
      }

    } catch (error) {
      console.error('웹훅 처리 컨트롤러 오류:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 내부 오류가 발생했습니다.'
        }
      });
    }
  }

  /**
   * 헬스 체크
   * @param {Object} req - Express 요청 객체
   * @param {Object} res - Express 응답 객체
   */
  async healthCheck(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: '토스페이먼츠 API 서버가 정상적으로 작동 중입니다.',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    } catch (error) {
      console.error('헬스 체크 오류:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'HEALTH_CHECK_ERROR',
          message: '헬스 체크에 실패했습니다.'
        }
      });
    }
  }

  /**
   * API 키 정보 조회
   * @param {Object} req - Express 요청 객체
   * @param {Object} res - Express 응답 객체
   */
  async getApiInfo(req, res) {
    try {
      res.status(200).json({
        success: true,
        data: {
          clientKey: 'test_ck_D5Ge1vyYnrbv0kz74wme1GXoOL1A',
          environment: 'test',
          version: 'v1',
          supportedMethods: [
            'confirmPayment',
            'getPayment',
            'cancelPayment',
            'handleWebhook'
          ]
        },
        message: 'API 정보를 성공적으로 조회했습니다.'
      });
    } catch (error) {
      console.error('API 정보 조회 오류:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'API_INFO_ERROR',
          message: 'API 정보 조회에 실패했습니다.'
        }
      });
    }
  }
}

module.exports = PaymentsController;
