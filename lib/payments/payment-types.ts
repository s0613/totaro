/**
 * Toss Payments TypeScript Type Definitions
 *
 * Based on: https://docs.tosspayments.com/reference
 */

// Payment Widget SDK Types
export interface TossPaymentsWidgetSDK {
  renderPaymentMethods: (
    selector: string,
    options: PaymentMethodsOptions
  ) => Promise<void>;
  renderAgreement: (selector: string) => Promise<void>;
  requestPayment: (options: PaymentRequestOptions) => Promise<void>;
}

export interface PaymentMethodsOptions {
  value: number;
  currency?: 'KRW' | 'USD' | 'JPY';
  country?: 'KR' | 'US' | 'JP';
}

export interface PaymentRequestOptions {
  method: 'CARD' | 'TRANSFER' | 'VIRTUAL_ACCOUNT' | 'MOBILE_PHONE';
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  successUrl: string;
  failUrl: string;
}

// Payment Confirmation Types
export interface PaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentConfirmResponse {
  version: string;
  paymentKey: string;
  type: 'NORMAL' | 'BILLING' | 'BRANDPAY';
  orderId: string;
  orderName: string;
  mId: string;
  currency: 'KRW' | 'USD' | 'JPY';
  method: 'CARD' | 'TRANSFER' | 'VIRTUAL_ACCOUNT' | 'MOBILE_PHONE';
  totalAmount: number;
  balanceAmount: number;
  status: 'READY' | 'IN_PROGRESS' | 'WAITING_FOR_DEPOSIT' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED';
  requestedAt: string;
  approvedAt: string;
  useEscrow: boolean;
  lastTransactionKey: string | null;
  suppliedAmount: number;
  vat: number;
  cultureExpense: boolean;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  cancels: Cancel[] | null;
  card?: CardInfo;
  virtualAccount?: VirtualAccountInfo;
  transfer?: TransferInfo;
  mobilePhone?: MobilePhoneInfo;
  receipt?: ReceiptInfo;
  checkout?: CheckoutInfo;
  easyPay?: EasyPayInfo;
  country: 'KR' | 'US' | 'JP';
  failure?: FailureInfo;
  isPartialCancelable: boolean;
  discount?: DiscountInfo;
}

export interface Cancel {
  cancelAmount: number;
  cancelReason: string;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  refundableAmount: number;
  easyPayDiscountAmount: number;
  canceledAt: string;
  transactionKey: string;
  receiptKey: string | null;
}

export interface CardInfo {
  amount: number;
  issuerCode: string;
  acquirerCode: string;
  number: string;
  installmentPlanMonths: number;
  approveNo: string;
  useCardPoint: boolean;
  cardType: 'CREDIT' | 'CHECK' | 'GIFT';
  ownerType: 'PERSONAL' | 'CORPORATE';
  acquireStatus: 'READY' | 'REQUESTED' | 'COMPLETED' | 'CANCEL_REQUESTED' | 'CANCELED';
  isInterestFree: boolean;
  interestPayer: string | null;
}

export interface VirtualAccountInfo {
  accountType: 'NORMAL' | 'FIXED';
  accountNumber: string;
  bankCode: string;
  customerName: string;
  dueDate: string;
  refundStatus: 'NONE' | 'PENDING' | 'FAILED' | 'PARTIAL_FAILED' | 'COMPLETED';
  expired: boolean;
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
}

export interface TransferInfo {
  bankCode: string;
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
}

export interface MobilePhoneInfo {
  customerMobilePhone: string;
  settlementStatus: 'INCOMPLETE' | 'COMPLETE';
  receiptUrl: string;
}

export interface ReceiptInfo {
  url: string;
}

export interface CheckoutInfo {
  url: string;
}

export interface EasyPayInfo {
  provider: string;
  amount: number;
  discountAmount: number;
}

export interface FailureInfo {
  code: string;
  message: string;
}

export interface DiscountInfo {
  amount: number;
}

// Payment Cancellation Types
export interface PaymentCancelRequest {
  paymentKey: string;
  cancelReason: string;
  cancelAmount?: number;
  refundReceiveAccount?: {
    bank: string;
    accountNumber: string;
    holderName: string;
  };
}

export interface PaymentCancelResponse extends PaymentConfirmResponse {
  // Same structure as confirm response
}

// Webhook Types
export interface TossPaymentsWebhook {
  eventType: 'PAYMENT_STATUS_CHANGED';
  createdAt: string;
  data: PaymentConfirmResponse;
}

// Order Database Types
export interface OrderData {
  id: string;
  userId?: string;
  name: string;
  email: string;
  company: string;
  plan: 'starter' | 'professional' | 'enterprise';
  price: number;
  currency: 'KRW' | 'USD' | 'JPY';
  message?: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  paymentKey?: string;
  orderId: string;
  createdAt: string;
  updatedAt: string;
}

// Error Types
export interface TossPaymentsError {
  code: string;
  message: string;
  data?: {
    orderId?: string;
    paymentKey?: string;
  };
}

// Frontend Widget Load Function
export type LoadTossPaymentsWidget = (options: {
  clientKey: string;
  customerKey?: string;
}) => Promise<TossPaymentsWidgetSDK>;
