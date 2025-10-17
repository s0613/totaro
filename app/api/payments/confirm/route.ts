import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

/**
 * 결제 승인 API
 *
 * Toss Payments 공식 가이드 기반:
 * https://docs.tosspayments.com/reference#결제-승인
 *
 * Flow:
 * 1. 클라이언트로부터 paymentKey, orderId, amount 수신
 * 2. Toss API로 승인 요청 (Secret Key 사용)
 * 3. 승인 성공 시 Supabase에 저장
 * 4. 결과 반환
 */

const ConfirmSchema = z.object({
  paymentKey: z.string().min(1),
  orderId: z.string().min(1),
  amount: z.union([z.number(), z.string().regex(/^\d+$/)]),
});

export async function POST(req: NextRequest) {
  try {
    // 1. 요청 검증
    const json = await req.json();
    const result = ConfirmSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { paymentKey, orderId } = result.data;
    const amount = typeof result.data.amount === "string"
      ? parseInt(result.data.amount, 10)
      : result.data.amount;

    // 2. Secret Key 확인
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      console.error("[Payments] TOSS_SECRET_KEY not configured");
      return NextResponse.json(
        { success: false, message: "Payment system not configured" },
        { status: 500 }
      );
    }

    // 3. Toss API 승인 요청
    // Basic Auth: Base64(secretKey + ':')
    const auth = Buffer.from(`${secretKey}:`).toString("base64");

    console.log("[Payments] Confirming payment:", { orderId, amount });

    const resp = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
      cache: "no-store",
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      console.error("[Payments] Toss API error:", data);

      // Supabase에 실패 상태 업데이트
      try {
        const supabase = await createClient();
        await supabase
          .from("orders")
          .update({
            status: "failed",
            error_message: data?.message || "Payment confirmation failed",
            updated_at: new Date().toISOString()
          })
          .eq("id", orderId);
      } catch (dbErr) {
        console.error("[Payments] Failed to update order status:", dbErr);
      }

      return NextResponse.json(
        {
          success: false,
          message: data?.message || "결제 승인에 실패했습니다",
          code: data?.code,
          data
        },
        { status: resp.status }
      );
    }

    // 4. Supabase에 결제 완료 상태 저장
    try {
      const supabase = await createClient();

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "paid",
          payment_key: paymentKey,
          payment_method: data.method || "CARD",
          payment_data: data,
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("[Payments] Supabase update error:", updateError);
        // 결제는 성공했으나 DB 업데이트 실패 - 수동 처리 필요
        // TODO: Send alert to admin
      } else {
        console.log("[Payments] Order updated successfully:", orderId);
      }
    } catch (dbErr) {
      console.error("[Payments] Database error:", dbErr);
      // 결제는 성공했으나 DB 저장 실패
      // TODO: Implement retry logic or alert system
    }

    // 5. 성공 응답 (Toss 공식 샘플과 동일한 형식)
    return NextResponse.json({
      success: true,
      orderId,
      payment: data
    });

  } catch (err) {
    console.error("[Payments Confirm] Unexpected error:", err);
    return NextResponse.json(
      { success: false, message: "결제 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

