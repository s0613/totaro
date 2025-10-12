/**
 * Toss Payments Utility Functions
 */

import { nanoid } from 'nanoid';
import type { PlanType } from './payment-config';

/**
 * Generate unique order ID
 * Format: ORDER_YYYYMMDDHHMMSS_RANDOMID
 */
export function generateOrderId(): string {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:T]/g, '')
    .slice(0, 14); // YYYYMMDDHHmmss
  const randomId = nanoid(8);
  return `ORDER_${timestamp}_${randomId}`;
}

/**
 * Generate order name from plan
 */
export function generateOrderName(plan: PlanType, lang: 'ko' | 'en' = 'ko'): string {
  const planNames = {
    ko: {
      starter: '스타터 플랜',
      professional: '프로페셔널 플랜',
      enterprise: '엔터프라이즈 플랜',
    },
    en: {
      starter: 'Starter Plan',
      professional: 'Professional Plan',
      enterprise: 'Enterprise Plan',
    },
  };

  return planNames[lang][plan];
}

/**
 * Format price with currency
 */
export function formatPrice(amount: number, currency: 'KRW' | 'USD' | 'JPY' = 'KRW'): string {
  const formatters = {
    KRW: new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }),
    USD: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }),
    JPY: new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }),
  };

  return formatters[currency].format(amount);
}

/**
 * Validate payment amount
 * Toss Payments requires minimum 100 KRW
 */
export function validatePaymentAmount(amount: number, currency: 'KRW' | 'USD' | 'JPY' = 'KRW'): {
  valid: boolean;
  error?: string;
} {
  const minimums = {
    KRW: 100,
    USD: 1,
    JPY: 100,
  };

  const minimum = minimums[currency];

  if (amount < minimum) {
    return {
      valid: false,
      error: `Minimum payment amount is ${formatPrice(minimum, currency)}`,
    };
  }

  return { valid: true };
}

/**
 * Parse Toss Payments error code to user-friendly message
 */
export function parseTossErrorMessage(errorCode: string, lang: 'ko' | 'en' = 'ko'): string {
  const errorMessages: Record<string, { ko: string; en: string }> = {
    INVALID_REQUEST: {
      ko: '잘못된 요청입니다. 다시 시도해주세요.',
      en: 'Invalid request. Please try again.',
    },
    INVALID_API_KEY: {
      ko: 'API 키가 올바르지 않습니다.',
      en: 'Invalid API key.',
    },
    INVALID_SECRET_KEY: {
      ko: 'Secret key가 올바르지 않습니다.',
      en: 'Invalid secret key.',
    },
    UNAUTHORIZED_KEY: {
      ko: '인증되지 않은 키입니다.',
      en: 'Unauthorized key.',
    },
    NOT_FOUND_PAYMENT: {
      ko: '결제 정보를 찾을 수 없습니다.',
      en: 'Payment not found.',
    },
    ALREADY_PROCESSED_PAYMENT: {
      ko: '이미 처리된 결제입니다.',
      en: 'Payment already processed.',
    },
    PROVIDER_ERROR: {
      ko: '결제 처리 중 오류가 발생했습니다.',
      en: 'Payment provider error.',
    },
    EXCEED_MAX_CARD_INSTALLMENT_PLAN: {
      ko: '할부 개월 수가 초과되었습니다.',
      en: 'Installment plan exceeds maximum.',
    },
    INVALID_REQUEST_PARAM: {
      ko: '요청 파라미터가 올바르지 않습니다.',
      en: 'Invalid request parameters.',
    },
    NOT_ALLOWED_POINT_USE: {
      ko: '포인트 사용이 불가능합니다.',
      en: 'Point usage not allowed.',
    },
    INVALID_CARD_EXPIRATION: {
      ko: '카드 유효기간이 올바르지 않습니다.',
      en: 'Invalid card expiration date.',
    },
    INVALID_STOPPED_CARD: {
      ko: '정지된 카드입니다.',
      en: 'Card is stopped.',
    },
    EXCEED_MAX_DAILY_PAYMENT_COUNT: {
      ko: '하루 결제 한도를 초과했습니다.',
      en: 'Daily payment limit exceeded.',
    },
    NOT_SUPPORTED_INSTALLMENT_PLAN_CARD_OR_MERCHANT: {
      ko: '할부가 지원되지 않는 카드 또는 가맹점입니다.',
      en: 'Installment not supported for this card or merchant.',
    },
    INVALID_CARD_INSTALLMENT_PLAN: {
      ko: '잘못된 할부 개월 수입니다.',
      en: 'Invalid installment plan.',
    },
    NOT_SUPPORTED_MONTHLY_INSTALLMENT_PLAN: {
      ko: '월 할부가 지원되지 않습니다.',
      en: 'Monthly installment not supported.',
    },
    EXCEED_MAX_PAYMENT_AMOUNT: {
      ko: '결제 금액이 한도를 초과했습니다.',
      en: 'Payment amount exceeds limit.',
    },
    INVALID_CARD_LOST_OR_STOLEN: {
      ko: '분실 또는 도난 신고된 카드입니다.',
      en: 'Card is reported as lost or stolen.',
    },
    RESTRICTED_TRANSFER_ACCOUNT: {
      ko: '계좌 이체가 제한된 계좌입니다.',
      en: 'Transfer restricted account.',
    },
    INVALID_CARD_NUMBER: {
      ko: '카드 번호가 올바르지 않습니다.',
      en: 'Invalid card number.',
    },
    INVALID_UNREGISTERED_SUBMALL: {
      ko: '등록되지 않은 서브몰입니다.',
      en: 'Unregistered submall.',
    },
    NOT_REGISTERED_BUSINESS: {
      ko: '등록되지 않은 사업자입니다.',
      en: 'Business not registered.',
    },
    EXCEED_MAX_ONE_DAY_WITHDRAW_AMOUNT: {
      ko: '일일 출금 한도를 초과했습니다.',
      en: 'Daily withdrawal limit exceeded.',
    },
    EXCEED_MAX_ONE_TIME_WITHDRAW_AMOUNT: {
      ko: '1회 출금 한도를 초과했습니다.',
      en: 'Single withdrawal limit exceeded.',
    },
    CARD_PROCESSING_ERROR: {
      ko: '카드사에서 오류가 발생했습니다.',
      en: 'Card processing error.',
    },
    EXCEED_MAX_AMOUNT: {
      ko: '거래 금액 한도를 초과했습니다.',
      en: 'Transaction amount limit exceeded.',
    },
    INVALID_ACCOUNT_INFO: {
      ko: '계좌 정보가 올바르지 않습니다.',
      en: 'Invalid account information.',
    },
    ACCOUNT_PAYMENT_BLOCKED: {
      ko: '계좌 결제가 차단되었습니다.',
      en: 'Account payment blocked.',
    },
    INSUFFICIENT_BALANCE: {
      ko: '잔액이 부족합니다.',
      en: 'Insufficient balance.',
    },
    REJECTED_CARD_PAYMENT: {
      ko: '카드 결제가 거절되었습니다.',
      en: 'Card payment rejected.',
    },
  };

  const message = errorMessages[errorCode];
  if (!message) {
    return lang === 'ko'
      ? '결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.'
      : 'An error occurred during payment processing. Please try again.';
  }

  return message[lang];
}

/**
 * Calculate VAT (10% for KRW transactions)
 */
export function calculateVAT(amount: number): number {
  return Math.floor(amount / 11); // VAT is included in total amount
}

/**
 * Calculate supply amount (excluding VAT)
 */
export function calculateSupplyAmount(amount: number): number {
  return amount - calculateVAT(amount);
}

/**
 * Sanitize payment data for logging (remove sensitive info)
 */
export function sanitizePaymentData(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = ['cardNumber', 'cvc', 'password', 'accountNumber', 'secretKey'];
  const sanitized = { ...data };

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '***';
    }
  }

  return sanitized;
}

/**
 * Create customer key from email (for billing key subscription payments)
 */
export function createCustomerKey(email: string): string {
  // Use base64 encoding of email as customer key
  if (typeof window !== 'undefined') {
    return btoa(email);
  } else {
    return Buffer.from(email).toString('base64');
  }
}

/**
 * Parse query parameters from success/fail URLs
 */
export function parsePaymentParams(searchParams: URLSearchParams): {
  paymentKey: string | null;
  orderId: string | null;
  amount: string | null;
  code: string | null;
  message: string | null;
} {
  return {
    paymentKey: searchParams.get('paymentKey'),
    orderId: searchParams.get('orderId'),
    amount: searchParams.get('amount'),
    code: searchParams.get('code'),
    message: searchParams.get('message'),
  };
}
