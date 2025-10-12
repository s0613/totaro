// 토스페이먼츠 API 설정 예제
module.exports = {
  // API 키 설정
  toss: {
    clientKey: 'test_ck_D5Ge1vyYnrbv0kz74wme1GXoOL1A',
    secretKey: 'test_sk_D4yKeq5bgrpKRd0JYbLVGX0lzW6Y',
    baseURL: 'https://api.tosspayments.com/v1'
  },

  // 서버 설정
  server: {
    port: process.env.PORT || 3001,
    environment: process.env.NODE_ENV || 'development'
  },

  // CORS 설정
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:8080', 
      'http://127.0.0.1:5500'
    ],
    credentials: true
  },

  // 로깅 설정
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};
