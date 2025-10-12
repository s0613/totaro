/**
 * POST /api/payments/cancel
 *
 * Cancel payment (full or partial refund)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { cancelPayment } from '@/lib/payments/toss-payments';
import { parseTossErrorMessage } from '@/lib/payments/payment-utils';
import type { TossPaymentsError } from '@/lib/payments/payment-types';

const cancelSchema = z.object({
  paymentKey: z.string().min(1, 'Payment key is required'),
  cancelReason: z.string().min(1, 'Cancel reason is required'),
  cancelAmount: z.number().positive().optional(),
  refundReceiveAccount: z
    .object({
      bank: z.string(),
      accountNumber: z.string(),
      holderName: z.string(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const result = cancelSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_REQUEST',
          message: 'Invalid request parameters',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { paymentKey, cancelReason, cancelAmount, refundReceiveAccount } = result.data;

    console.log('[Payment Cancel] Request:', {
      paymentKey: paymentKey.substring(0, 20) + '...',
      cancelReason,
      cancelAmount,
      isPartial: !!cancelAmount,
    });

    // TODO: Verify payment exists and belongs to authenticated user
    // const payment = await db.payments.findUnique({ where: { paymentKey } });
    // if (!payment || payment.userId !== session.userId) {
    //   return NextResponse.json({ success: false, error: 'PAYMENT_NOT_FOUND' }, { status: 404 });
    // }

    // Cancel payment
    const cancelResult = await cancelPayment({
      paymentKey,
      cancelReason,
      cancelAmount,
      refundReceiveAccount,
    });

    console.log('[Payment Cancel] Success:', {
      paymentKey: cancelResult.paymentKey,
      status: cancelResult.status,
      cancels: cancelResult.cancels?.length || 0,
    });

    // TODO: Update order status in database
    // await db.orders.update({
    //   where: { paymentKey },
    //   data: {
    //     status: cancelResult.status === 'CANCELED' ? 'REFUNDED' : 'PARTIAL_REFUNDED',
    //     refundedAt: new Date(),
    //   },
    // });

    // TODO: Send refund confirmation email
    // TODO: Notify CRM

    return NextResponse.json({
      success: true,
      payment: {
        paymentKey: cancelResult.paymentKey,
        status: cancelResult.status,
        cancels: cancelResult.cancels,
      },
    });
  } catch (error) {
    console.error('[Payment Cancel] Error:', error);

    // Handle Toss Payments API errors
    if ((error as TossPaymentsError).code) {
      const tossError = error as TossPaymentsError;
      const lang = 'ko'; // TODO: Get from request headers or query param

      return NextResponse.json(
        {
          success: false,
          error: tossError.code,
          message: parseTossErrorMessage(tossError.code, lang),
          details: tossError.data,
        },
        { status: 400 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
