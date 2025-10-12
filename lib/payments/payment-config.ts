/**
 * Toss Payments Configuration
 */

// Environment Variables
export const TOSS_CONFIG = {
  // Client Key (Public - can be exposed to frontend)
  clientKey: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "",

  // Secret Key (Private - server-side only)
  secretKey: process.env.TOSS_SECRET_KEY || "",

  // Widget Version
  widgetVersion: process.env.NEXT_PUBLIC_TOSS_PAYMENT_WIDGET_VERSION || "2.0",

  // API Base URL
  apiBaseUrl: "https://api.tosspayments.com/v1",

  // Success/Fail URLs (will be dynamically generated with full domain in production)
  successUrl: process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`
    : "http://localhost:3000/checkout/success",

  failUrl: process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/fail`
    : "http://localhost:3000/checkout/fail",
} as const;

// Validation
export function validateTossConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!TOSS_CONFIG.clientKey) {
    errors.push("NEXT_PUBLIC_TOSS_CLIENT_KEY is not configured");
  }

  if (!TOSS_CONFIG.secretKey) {
    errors.push("TOSS_SECRET_KEY is not configured (server-side only)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Test Card Numbers (for development)
export const TEST_CARDS = {
  success: {
    number: "5570-1234-5678-9012",
    expiry: "12/25",
    cvc: "123",
    password: "1234",
    description: "성공 케이스 (일반 결제)",
  },
  insufficientFunds: {
    number: "5570-1234-5678-9013",
    expiry: "12/25",
    cvc: "123",
    password: "1234",
    description: "잔액 부족",
  },
  invalidCard: {
    number: "5570-1234-5678-9014",
    expiry: "12/25",
    cvc: "123",
    password: "1234",
    description: "유효하지 않은 카드",
  },
  expiredCard: {
    number: "5570-1234-5678-9015",
    expiry: "12/25",
    cvc: "123",
    password: "1234",
    description: "만료된 카드",
  },
} as const;

// Payment Method Names (for display)
export const PAYMENT_METHOD_NAMES = {
  CARD: "카드",
  TRANSFER: "계좌이체",
  VIRTUAL_ACCOUNT: "가상계좌",
  MOBILE_PHONE: "휴대폰",
} as const;

// Payment Status Names (for display)
export const PAYMENT_STATUS_NAMES = {
  READY: "결제 준비",
  IN_PROGRESS: "결제 진행 중",
  WAITING_FOR_DEPOSIT: "입금 대기",
  DONE: "결제 완료",
  CANCELED: "결제 취소",
  PARTIAL_CANCELED: "부분 취소",
  ABORTED: "결제 중단",
  EXPIRED: "결제 만료",
} as const;

// Plan Prices (in KRW)
export const PLAN_PRICES = {
  starter: 890000,
  professional: 1990000,
  enterprise: 4990000,
} as const;

export type PlanType = keyof typeof PLAN_PRICES;

