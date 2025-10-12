"use client";

import PaymentWindow from "@/app/components/payment/PaymentWindow";
import { PLAN_PRICES } from "@/lib/payments/payment-config";
import { useSearchParams } from "next/navigation";

export default function PaymentsTestPage() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") === "en" ? "en" : "ko") as "ko" | "en";

  // Simple test values
  const amount = PLAN_PRICES.starter;
  const orderName = lang === "en" ? "totaro Website Starter" : "totaro 웹사이트 스타터";

  return (
    <section className="min-h-screen bg-bg text-textPrimary py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          {lang === "en" ? "Toss Payments Test" : "토스 결제 테스트"}
        </h1>
        <p className="text-textSecondary mb-8">
          {lang === "en"
            ? "This page renders the Toss Payments widget for a test charge."
            : "테스트 결제를 위한 Toss Payments 위젯 화면입니다."}
        </p>

        <div className="bg-surface border border-line rounded-xl p-6">
          <PaymentWindow amount={amount} orderName={orderName} />
        </div>

        <div className="mt-8 text-sm text-textSecondary">
          <p>
            {lang === "en"
              ? "Make sure NEXT_PUBLIC_TOSS_CLIENT_KEY and TOSS_SECRET_KEY are set in .env.local."
              : ".env.local에 NEXT_PUBLIC_TOSS_CLIENT_KEY와 TOSS_SECRET_KEY가 설정되어 있어야 합니다."}
          </p>
        </div>
      </div>
    </section>
  );
}
