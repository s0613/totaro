/**
 * POST /api/payments/webhook
 *
 * Handle Toss Payments webhooks for payment status changes
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/payments/toss-payments';
import type { TossPaymentsWebhook } from '@/lib/payments/payment-types';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('toss-signature') || '';
    const body = await request.text();

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('[Payment Webhook] Invalid signature');
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_SIGNATURE',
        },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const webhook: TossPaymentsWebhook = JSON.parse(body);

    console.log('[Payment Webhook] Received:', {
      eventType: webhook.eventType,
      orderId: webhook.data.orderId,
      status: webhook.data.status,
      createdAt: webhook.createdAt,
    });

    // Handle different event types
    switch (webhook.eventType) {
      case 'PAYMENT_STATUS_CHANGED':
        await handlePaymentStatusChanged(webhook);
        break;

      default:
        console.warn('[Payment Webhook] Unknown event type:', webhook.eventType);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Payment Webhook] Error:', error);

    // Still return 200 to prevent Toss from retrying
    // (log error and investigate manually)
    return NextResponse.json({ success: true });
  }
}

async function handlePaymentStatusChanged(webhook: TossPaymentsWebhook) {
  const payment = webhook.data;

  console.log('[Payment Status Changed]', {
    orderId: payment.orderId,
    paymentKey: payment.paymentKey,
    status: payment.status,
    method: payment.method,
    totalAmount: payment.totalAmount,
  });

  // TODO: Update database based on payment status
  // switch (payment.status) {
  //   case 'DONE':
  //     await db.orders.update({
  //       where: { orderId: payment.orderId },
  //       data: {
  //         status: 'PAID',
  //         paymentKey: payment.paymentKey,
  //         paidAt: new Date(payment.approvedAt),
  //       },
  //     });
  //     break;
  //
  //   case 'CANCELED':
  //   case 'PARTIAL_CANCELED':
  //     await db.orders.update({
  //       where: { orderId: payment.orderId },
  //       data: {
  //         status: payment.status === 'CANCELED' ? 'REFUNDED' : 'PARTIAL_REFUNDED',
  //         refundedAt: new Date(),
  //       },
  //     });
  //     break;
  //
  //   case 'EXPIRED':
  //   case 'ABORTED':
  //     await db.orders.update({
  //       where: { orderId: payment.orderId },
  //       data: {
  //         status: 'CANCELLED',
  //       },
  //     });
  //     break;
  // }

  // TODO: Send email notifications based on status
  // TODO: Notify CRM of status change
  // TODO: Trigger fulfillment workflow if DONE
}
