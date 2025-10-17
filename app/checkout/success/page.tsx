"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { parsePaymentParams } from "@/lib/payments/payment-utils";
import type { PaymentConfirmResponse } from "@/lib/payments/payment-types";

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirming, setConfirming] = useState(true);
  const [payment, setPayment] = useState<PaymentConfirmResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { paymentKey, orderId, amount } = parsePaymentParams(searchParams);
  const currentLang = searchParams.get("lang") || "ko";

  useEffect(() => {
    const confirmPayment = async () => {
      if (!paymentKey || !orderId || !amount) {
        setError(currentLang === "en" ? "Invalid payment parameters" : "잘못된 결제 정보입니다");
        setConfirming(false);
        return;
      }

      try {
        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount, 10),
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Payment confirmation failed");
        }

        setPayment(data.payment);
        setConfirming(false);
      } catch (err) {
        console.error("[Checkout Success] Confirm error:", err);
        setError(
          currentLang === "en"
            ? "Payment confirmation failed. Please contact support."
            : "결제 승인에 실패했습니다. 고객센터로 문의해주세요."
        );
        setConfirming(false);
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount, currentLang]);

  if (confirming) {
    return (
      <section className="min-h-screen bg-bg text-textPrimary flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <h1 className="text-3xl font-bold mb-3">
            {currentLang === "en" ? "Confirming Payment..." : "결제 승인 중..."}
          </h1>
          <p className="text-textSecondary">
            {currentLang === "en"
              ? "Please wait while we confirm your payment."
              : "결제를 승인하고 있습니다. 잠시만 기다려주세요."}
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-bg text-textPrimary flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-warning/20 flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              className="text-warning"
            >
              <path
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">
            {currentLang === "en" ? "Payment Error" : "결제 오류"}
          </h1>
          <p className="text-textSecondary mb-6">{error}</p>
          <button
            onClick={() => router.push(`/checkout?lang=${currentLang}`)}
            className="btn-primary px-8 py-4"
          >
            {currentLang === "en" ? "Try Again" : "다시 시도"}
          </button>
        </div>
      </section>
    );
  }

  if (!payment) {
    return null;
  }

  return (
    <section className="min-h-screen bg-bg text-textPrimary py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              className="text-success"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            {currentLang === "en" ? "Payment Successful!" : "결제가 완료되었습니다!"}
          </h1>
          <p className="text-xl text-textSecondary">
            {currentLang === "en"
              ? "Thank you for your order. We'll get started right away."
              : "주문해 주셔서 감사합니다. 바로 작업을 시작하겠습니다."}
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-surface border border-line rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">
            {currentLang === "en" ? "Payment Details" : "결제 내역"}
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-line">
              <span className="text-textSecondary">
                {currentLang === "en" ? "Order ID" : "주문번호"}
              </span>
              <span className="font-mono font-semibold">{payment.orderId}</span>
            </div>

            <div className="flex justify-between py-3 border-b border-line">
              <span className="text-textSecondary">
                {currentLang === "en" ? "Order Name" : "주문명"}
              </span>
              <span className="font-semibold">{payment.orderName}</span>
            </div>

            <div className="flex justify-between py-3 border-b border-line">
              <span className="text-textSecondary">
                {currentLang === "en" ? "Payment Method" : "결제수단"}
              </span>
              <span className="font-semibold">
                {payment.method === "CARD"
                  ? currentLang === "en"
                    ? "Card"
                    : "카드"
                  : payment.method}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-line">
              <span className="text-textSecondary">
                {currentLang === "en" ? "Amount" : "결제금액"}
              </span>
              <span className="font-bold text-2xl text-accent">
                ₩{new Intl.NumberFormat("ko-KR").format(payment.totalAmount)}
              </span>
            </div>

            <div className="flex justify-between py-3">
              <span className="text-textSecondary">
                {currentLang === "en" ? "Approved At" : "승인일시"}
              </span>
              <span className="font-semibold">
                {new Date(payment.approvedAt).toLocaleString(currentLang === "en" ? "en-US" : "ko-KR")}
              </span>
            </div>
          </div>

          {/* Receipt Link */}
          {payment.receipt && (
            <div className="mt-6 pt-6 border-t border-line">
              <a
                href={payment.receipt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-semibold inline-flex items-center gap-2"
              >
                {currentLang === "en" ? "View Receipt" : "영수증 보기"}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-accent mb-3">
            {currentLang === "en" ? "What's Next?" : "다음 단계"}
          </h3>
          <ul className="space-y-2 text-textSecondary">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">1.</span>
              <span>
                {currentLang === "en"
                  ? "Our team will contact you within 24 hours to discuss project details."
                  : "24시간 이내에 담당자가 연락드려 프로젝트 세부사항을 논의합니다."}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">2.</span>
              <span>
                {currentLang === "en"
                  ? "We'll create a detailed project plan and timeline."
                  : "상세한 프로젝트 계획 및 일정을 작성합니다."}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">3.</span>
              <span>
                {currentLang === "en"
                  ? "Development begins once the plan is approved."
                  : "계획 승인 후 개발을 시작합니다."}
              </span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <a href={`/?lang=${currentLang}`} className="btn-primary px-8 py-4">
            {currentLang === "en" ? "Back to Home" : "홈으로 돌아가기"}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg text-textPrimary flex items-center justify-center px-6">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
