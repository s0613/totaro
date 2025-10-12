const express = require('express');
const cors = require('cors');
const PaymentsRouter = require('./payments.router');

class PaymentServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.paymentsRouter = new PaymentsRouter();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * 미들웨어 설정
   */
  setupMiddleware() {
    // CORS 설정
    this.app.use(cors({
      origin: ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:5500'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // JSON 파싱
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // 요청 로깅
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });

    // 정적 파일 서빙 (프론트엔드 파일)
    this.app.use(express.static('../frontend'));
  }

  /**
   * 라우트 설정
   */
  setupRoutes() {
    // API 라우트
    this.app.use('/api/payments', this.paymentsRouter.getRouter());

    // 루트 경로 - 프론트엔드 서빙
    this.app.get('/', (req, res) => {
      res.sendFile('index.html', { root: '../frontend' });
    });

    // API 문서
    this.app.get('/api/docs', (req, res) => {
      const routes = this.paymentsRouter.getRoutes();
      res.json({
        success: true,
        data: {
          title: '토스페이먼츠 결제 API',
          version: '1.0.0',
          description: '토스페이먼츠 SDK v2 결제위젯 연동을 위한 백엔드 API',
          baseUrl: `http://localhost:${this.port}/api/payments`,
          routes: routes
        }
      });
    });

    // 404 처리
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '요청한 페이지를 찾을 수 없습니다.',
          path: req.originalUrl
        }
      });
    });
  }

  /**
   * 에러 처리 설정
   */
  setupErrorHandling() {
    // 전역 에러 핸들러
    this.app.use((error, req, res, next) => {
      console.error('서버 에러:', error);
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 내부 오류가 발생했습니다.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }
      });
    });

    // 처리되지 않은 Promise 거부 처리
    process.on('unhandledRejection', (reason, promise) => {
      console.error('처리되지 않은 Promise 거부:', reason);
    });

    // 처리되지 않은 예외 처리
    process.on('uncaughtException', (error) => {
      console.error('처리되지 않은 예외:', error);
      process.exit(1);
    });
  }

  /**
   * 서버 시작
   */
  start() {
    this.app.listen(this.port, () => {
      console.log('='.repeat(60));
      console.log('🚀 토스페이먼츠 결제 서버가 시작되었습니다!');
      console.log('='.repeat(60));
      console.log(`📡 서버 주소: http://localhost:${this.port}`);
      console.log(`🌐 프론트엔드: http://localhost:${this.port}`);
      console.log(`📚 API 문서: http://localhost:${this.port}/api/docs`);
      console.log(`❤️  헬스 체크: http://localhost:${this.port}/api/payments/health`);
      console.log('='.repeat(60));
      console.log('📋 사용 가능한 API 엔드포인트:');
      
      const routes = this.paymentsRouter.getRoutes();
      routes.forEach(route => {
        console.log(`   ${route.method.padEnd(6)} /api/payments${route.path} - ${route.description}`);
      });
      
      console.log('='.repeat(60));
      console.log('💡 사용법:');
      console.log('   1. 브라우저에서 http://localhost:3001 접속');
      console.log('   2. 결제위젯에서 결제 진행');
      console.log('   3. 결제 성공/실패 페이지에서 결과 확인');
      console.log('='.repeat(60));
    });
  }

  /**
   * 서버 중지
   */
  stop() {
    console.log('서버를 중지합니다...');
    process.exit(0);
  }
}

// 서버 인스턴스 생성 및 시작
const server = new PaymentServer();
server.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM 신호를 받았습니다. 서버를 종료합니다...');
  server.stop();
});

process.on('SIGINT', () => {
  console.log('SIGINT 신호를 받았습니다. 서버를 종료합니다...');
  server.stop();
});

module.exports = PaymentServer;
