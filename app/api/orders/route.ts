import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const orderSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  plan: z.enum(["starter"]),
  message: z.string().optional(),
  price: z.number().positive(),
  currency: z.enum(["KRW"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    // In production, create a payment intent / order with your PSP (e.g., Toss Payments, PortOne, Stripe)
    // For now, mock an order id and return success
    const id = `ORD-${Date.now().toString(36).toUpperCase()}`;

    // TODO: send confirmation email, persist order

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("[Order Error]", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

