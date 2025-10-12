const express = require('express');
const PaymentsController = require('./payments.controller');

class PaymentsRouter {
  constructor() {
    this.router = express.Router();
    this.paymentsController = new PaymentsController();
    this.setupRoutes();
  }

  /**
   * 라우트 설정
   */
  setupRoutes() {
    // 헬스 체크
    this.router.get('/health', (req, res) => {
      this.paymentsController.healthCheck(req, res);
    });

    // API 정보 조회
    this.router.get('/info', (req, res) => {
      this.paymentsController.getApiInfo(req, res);
    });

    // 결제 승인
    this.router.post('/confirm', (req, res) => {
      this.paymentsController.confirmPayment(req, res);
    });

    // 결제 조회
    this.router.get('/:paymentKey', (req, res) => {
      this.paymentsController.getPayment(req, res);
    });

    // 결제 취소
    this.router.post('/:paymentKey/cancel', (req, res) => {
      this.paymentsController.cancelPayment(req, res);
    });

    // 웹훅 이벤트 처리
    this.router.post('/webhook', (req, res) => {
      this.paymentsController.handleWebhook(req, res);
    });

    // 404 처리
    this.router.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '요청한 API 엔드포인트를 찾을 수 없습니다.',
          path: req.originalUrl,
          method: req.method
        }
      });
    });

    // 에러 처리 미들웨어
    this.router.use((error, req, res, next) => {
      console.error('라우터 에러:', error);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'ROUTER_ERROR',
          message: '라우터 처리 중 오류가 발생했습니다.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }
      });
    });
  }

  /**
   * 라우터 반환
   * @returns {express.Router} Express 라우터
   */
  getRouter() {
    return this.router;
  }

  /**
   * 라우트 정보 조회
   * @returns {Array} 라우트 정보 배열
   */
  getRoutes() {
    return [
      {
        method: 'GET',
        path: '/health',
        description: '서버 헬스 체크'
      },
      {
        method: 'GET',
        path: '/info',
        description: 'API 정보 조회'
      },
      {
        method: 'POST',
        path: '/confirm',
        description: '결제 승인',
        body: {
          paymentKey: 'string (required)',
          orderId: 'string (required)',
          amount: 'number (required)'
        }
      },
      {
        method: 'GET',
        path: '/:paymentKey',
        description: '결제 조회',
        params: {
          paymentKey: 'string (required)'
        }
      },
      {
        method: 'POST',
        path: '/:paymentKey/cancel',
        description: '결제 취소',
        params: {
          paymentKey: 'string (required)'
        },
        body: {
          cancelReason: 'string (required)',
          cancelAmount: 'number (optional)'
        }
      },
      {
        method: 'POST',
        path: '/webhook',
        description: '웹훅 이벤트 처리',
        body: {
          eventType: 'string (required)',
          data: 'object (required)'
        }
      }
    ];
  }
}

module.exports = PaymentsRouter;
