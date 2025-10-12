/**
 * Toss Payments API Integration (Server-Side)
 *
 * Documentation: https://docs.tosspayments.com/reference
 */

import { TOSS_CONFIG } from './payment-config';
import type {
  PaymentConfirmRequest,
  PaymentConfirmResponse,
  PaymentCancelRequest,
  PaymentCancelResponse,
  TossPaymentsError,
} from './payment-types';

/**
 * Base64 encode secret key for authentication
 */
function getAuthHeader(): string {
  if (!TOSS_CONFIG.secretKey) {
    throw new Error('TOSS_SECRET_KEY is not configured');
  }

  // Toss Payments uses Basic Auth with secret key as username and empty password
  const credentials = `${TOSS_CONFIG.secretKey}:`;
  const encoded = Buffer.from(credentials).toString('base64');
  return `Basic ${encoded}`;
}

/**
 * Confirm payment after user approval
 *
 * @param paymentKey - Payment key from success redirect
 * @param orderId - Order ID
 * @param amount - Payment amount (must match original amount)
 * @returns Payment confirmation response
 */
export async function confirmPayment(
  request: PaymentConfirmRequest
): Promise<PaymentConfirmResponse> {
  try {
    const response = await fetch(`${TOSS_CONFIG.apiBaseUrl}/payments/confirm`, {
      method: 'POST',
      headers: {
        Authorization: getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey: request.paymentKey,
        orderId: request.orderId,
        amount: request.amount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error: TossPaymentsError = {
        code: data.code || 'UNKNOWN_ERROR',
        message: data.message || 'Payment confirmation failed',
        data: {
          orderId: request.orderId,
          paymentKey: request.paymentKey,
        },
      };
      throw error;
    }

    return data as PaymentConfirmResponse;
  } catch (error) {
    if ((error as TossPaymentsError).code) {
      throw error;
    }

    throw {
      code: 'NETWORK_ERROR',
      message: 'Failed to connect to Toss Payments API',
      data: {
        orderId: request.orderId,
      },
    } as TossPaymentsError;
  }
}

/**
 * Get payment details by payment key
 *
 * @param paymentKey - Payment key
 * @returns Payment details
 */
export async function getPayment(paymentKey: string): Promise<PaymentConfirmResponse> {
  try {
    const response = await fetch(`${TOSS_CONFIG.apiBaseUrl}/payments/${paymentKey}`, {
      method: 'GET',
      headers: {
        Authorization: getAuthHeader(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error: TossPaymentsError = {
        code: data.code || 'UNKNOWN_ERROR',
        message: data.message || 'Failed to retrieve payment',
        data: {
          paymentKey,
        },
      };
      throw error;
    }

    return data as PaymentConfirmResponse;
  } catch (error) {
    if ((error as TossPaymentsError).code) {
      throw error;
    }

    throw {
      code: 'NETWORK_ERROR',
      message: 'Failed to connect to Toss Payments API',
      data: {
        paymentKey,
      },
    } as TossPaymentsError;
  }
}

/**
 * Get payment details by order ID
 *
 * @param orderId - Order ID
 * @returns Payment details
 */
export async function getPaymentByOrderId(orderId: string): Promise<PaymentConfirmResponse> {
  try {
    const response = await fetch(`${TOSS_CONFIG.apiBaseUrl}/payments/orders/${orderId}`, {
      method: 'GET',
      headers: {
        Authorization: getAuthHeader(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error: TossPaymentsError = {
        code: data.code || 'UNKNOWN_ERROR',
        message: data.message || 'Failed to retrieve payment',
        data: {
          orderId,
        },
      };
      throw error;
    }

    return data as PaymentConfirmResponse;
  } catch (error) {
    if ((error as TossPaymentsError).code) {
      throw error;
    }

    throw {
      code: 'NETWORK_ERROR',
      message: 'Failed to connect to Toss Payments API',
      data: {
        orderId,
      },
    } as TossPaymentsError;
  }
}

/**
 * Cancel payment (full or partial)
 *
 * @param request - Cancel request
 * @returns Cancel response
 */
export async function cancelPayment(
  request: PaymentCancelRequest
): Promise<PaymentCancelResponse> {
  try {
    const body: Record<string, unknown> = {
      cancelReason: request.cancelReason,
    };

    // Partial cancel
    if (request.cancelAmount) {
      body.cancelAmount = request.cancelAmount;
    }

    // Refund to different account (virtual account payments)
    if (request.refundReceiveAccount) {
      body.refundReceiveAccount = request.refundReceiveAccount;
    }

    const response = await fetch(
      `${TOSS_CONFIG.apiBaseUrl}/payments/${request.paymentKey}/cancel`,
      {
        method: 'POST',
        headers: {
          Authorization: getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const error: TossPaymentsError = {
        code: data.code || 'UNKNOWN_ERROR',
        message: data.message || 'Payment cancellation failed',
        data: {
          paymentKey: request.paymentKey,
        },
      };
      throw error;
    }

    return data as PaymentCancelResponse;
  } catch (error) {
    if ((error as TossPaymentsError).code) {
      throw error;
    }

    throw {
      code: 'NETWORK_ERROR',
      message: 'Failed to connect to Toss Payments API',
      data: {
        paymentKey: request.paymentKey,
      },
    } as TossPaymentsError;
  }
}

/**
 * Verify webhook signature
 * (If Toss Payments provides webhook signature verification, implement here)
 *
 * @param payload - Webhook payload
 * @param signature - Webhook signature header
 * @returns Whether signature is valid
 */
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  // TODO: Implement webhook signature verification if Toss Payments supports it
  // For now, return true (insecure - should validate in production)
  console.warn('[Toss Payments] Webhook signature verification not implemented');
  return true;
}

/**
 * Health check - verify API connection
 *
 * @returns Whether API is accessible
 */
export async function healthCheck(): Promise<boolean> {
  try {
    // Try to make a simple API call
    const response = await fetch(`${TOSS_CONFIG.apiBaseUrl}/payments/orders/HEALTH_CHECK`, {
      method: 'GET',
      headers: {
        Authorization: getAuthHeader(),
      },
    });

    // We expect 404 for non-existent order, but if we get 401/403, config is wrong
    return response.status !== 401 && response.status !== 403;
  } catch {
    return false;
  }
}
