import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ConfirmSchema = z.object({
  paymentKey: z.string().min(1),
  orderId: z.string().min(1),
  amount: z.union([z.number(), z.string().regex(/^\d+$/)]),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const result = ConfirmSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { paymentKey, orderId } = result.data;
    const amount = typeof result.data.amount === "string" ? parseInt(result.data.amount, 10) : result.data.amount;

    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { success: false, message: "TOSS_SECRET_KEY is not configured" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${secretKey}:`).toString("base64");

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
      return NextResponse.json(
        { success: false, message: data?.message || "Confirm failed", code: data?.code, data },
        { status: resp.status }
      );
    }

    // TODO: persist order status = paid, send emails/CRM notification
    return NextResponse.json({ success: true, orderId, payment: data });
  } catch (err) {
    console.error("[Payments Confirm] Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

