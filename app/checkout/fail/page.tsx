"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { parsePaymentParams, parseTossErrorMessage } from "@/lib/payments/payment-utils";

export default function CheckoutFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { code, message, orderId } = parsePaymentParams(searchParams);
  const currentLang = searchParams.get("lang") || "ko";

  const errorMessage = code
    ? parseTossErrorMessage(code, currentLang === "en" ? "en" : "ko")
    : message || (currentLang === "en" ? "Payment failed" : "결제에 실패했습니다");

  return (
    <section className="min-h-screen bg-bg text-textPrimary flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-warning/20 flex items-center justify-center">
          <svg
            width="56"
            height="56"
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

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">
          {currentLang === "en" ? "Payment Failed" : "결제 실패"}
        </h1>

        {/* Error Message */}
        <p className="text-xl text-textSecondary mb-6">{errorMessage}</p>

        {/* Error Code & Order ID */}
        <div className="bg-surface/50 border border-line rounded-lg p-4 mb-8 text-sm">
          {code && (
            <div className="flex justify-between mb-2">
              <span className="text-textSecondary">
                {currentLang === "en" ? "Error Code" : "에러 코드"}
              </span>
              <span className="font-mono text-textPrimary">{code}</span>
            </div>
          )}
          {orderId && (
            <div className="flex justify-between">
              <span className="text-textSecondary">
                {currentLang === "en" ? "Order ID" : "주문번호"}
              </span>
              <span className="font-mono text-textPrimary">{orderId}</span>
            </div>
          )}
        </div>

        {/* Common Causes */}
        <div className="bg-surface border border-line rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-textPrimary mb-3">
            {currentLang === "en" ? "Common Causes:" : "일반적인 원인:"}
          </h3>
          <ul className="space-y-2 text-sm text-textSecondary">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>
                {currentLang === "en"
                  ? "Insufficient balance or credit limit"
                  : "잔액 부족 또는 한도 초과"}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>
                {currentLang === "en"
                  ? "Incorrect card information"
                  : "카드 정보 오류"}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>
                {currentLang === "en"
                  ? "Card blocked or restricted"
                  : "카드 정지 또는 제한"}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>
                {currentLang === "en"
                  ? "Security verification failed"
                  : "보안 인증 실패"}
              </span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push(`/checkout?lang=${currentLang}`)}
            className="btn-primary px-8 py-4"
          >
            {currentLang === "en" ? "Try Again" : "다시 시도"}
          </button>
          <a
            href={`/?lang=${currentLang}`}
            className="px-8 py-4 border border-line rounded-lg text-textSecondary hover:text-textPrimary hover:border-accent transition-colors inline-block"
          >
            {currentLang === "en" ? "Back to Home" : "홈으로 돌아가기"}
          </a>
        </div>

        {/* Support */}
        <p className="text-sm text-textSecondary/70 mt-8">
          {currentLang === "en"
            ? "If the problem persists, please contact support."
            : "문제가 지속되면 고객센터로 문의해 주세요."}
        </p>
      </div>
    </section>
  );
}

