"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { TOSS_CONFIG } from "@/lib/payments/payment-config";
import { generateOrderId } from "@/lib/payments/payment-utils";

interface PaymentWidgetProps {
  amount: number;
  orderId?: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  currency?: "KRW" | "USD" | "JPY";
  onPaymentRequest?: (orderId: string) => void;
}

declare global {
  interface Window {
    TossPayments: any;
  }
}

export default function PaymentWidget({
  amount,
  orderId,
  orderName,
  customerName,
  customerEmail,
  currency = "KRW",
  onPaymentRequest,
}: PaymentWidgetProps) {
  const paymentWidgetRef = useRef<any>(null);
  const paymentMethodsWidgetRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedOrderId] = useState(() => orderId || generateOrderId());

  const initializePayment = async () => {
    try {
      if (!TOSS_CONFIG.clientKey) {
        throw new Error("NEXT_PUBLIC_TOSS_CLIENT_KEY가 설정되지 않았습니다.");
      }

      if (!window.TossPayments) {
        throw new Error("Toss Payments SDK가 로드되지 않았습니다.");
      }

      console.log("[PaymentWidget] Initializing with clientKey:", TOSS_CONFIG.clientKey.substring(0, 20) + '...');

      // Payment Widget 생성
      const tossPayments = await window.TossPayments(TOSS_CONFIG.clientKey);

      // Payment Widget SDK v2 방식
      // customerKey는 고객을 구분하는 고유 식별자 (이메일 또는 주문ID)
      const paymentWidget = await tossPayments.widgets({
        customerKey: customerEmail || generatedOrderId
      });

      paymentWidgetRef.current = paymentWidget;

      // 결제 수단 위젯 렌더링
      // selector, amount(number), options(optional)
      const paymentMethodsWidget = await paymentWidget.renderPaymentMethods(
        "#payment-methods",
        amount, // 숫자만 전달 (객체가 아님!)
        { variantKey: "DEFAULT" }
      );

      paymentMethodsWidgetRef.current = paymentMethodsWidget;

      // 이용약관 위젯 렌더링
      await paymentWidget.renderAgreement(
        "#agreement",
        { variantKey: "AGREEMENT" }
      );

      console.log("[PaymentWidget] Widgets rendered successfully");
      setIsReady(true);
    } catch (err: any) {
      console.error("[PaymentWidget] Init error:", err);
      setError(err?.message || "결제 위젯 초기화에 실패했습니다.");
    }
  };

  const handlePayment = async () => {
    if (!paymentWidgetRef.current) {
      alert("결제 위젯이 준비되지 않았습니다. 잠시만 기다려주세요.");
      return;
    }

    try {
      // 주문 생성 콜백
      onPaymentRequest?.(generatedOrderId);

      console.log("[PaymentWidget] 결제 요청:", {
        orderId: generatedOrderId,
        orderName,
        amount
      });

      // 결제 요청
      await paymentWidgetRef.current.requestPayment({
        orderId: generatedOrderId,
        orderName: orderName,
        successUrl: TOSS_CONFIG.successUrl,
        failUrl: TOSS_CONFIG.failUrl,
        customerEmail: customerEmail,
        customerName: customerName,
      });
    } catch (err: any) {
      console.error("[PaymentWidget] Payment error:", err);

      if (err.code === "USER_CANCEL") {
        alert("결제를 취소하셨습니다.");
      } else if (err.code === "INVALID_CARD_COMPANY") {
        alert("유효하지 않은 카드입니다.");
      } else {
        alert("결제에 실패했습니다: " + (err?.message || "알 수 없는 오류"));
      }
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-semibold">❌ {error}</p>
        <p className="text-red-500 text-sm mt-2">
          환경변수를 확인하세요: <code className="bg-red-100 px-2 py-1 rounded">NEXT_PUBLIC_TOSS_CLIENT_KEY</code>
        </p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v2/standard"
        onLoad={initializePayment}
        onError={() => setError("Toss Payments SDK 로드에 실패했습니다.")}
      />

      <div className="space-y-6">
        {!isReady ? (
          <div className="p-12 text-center bg-surface border border-line rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-textSecondary">결제 위젯을 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* 주문 정보 */}
            <div className="p-4 bg-surface border border-line rounded-lg text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-textSecondary">주문번호</span>
                <span className="font-mono text-textPrimary">{generatedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textSecondary">상품명</span>
                <span className="text-textPrimary">{orderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textSecondary">결제금액</span>
                <span className="font-bold text-accent text-lg">
                  {currency === "KRW" ? "₩" : "$"}
                  {amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* 결제 수단 선택 위젯 */}
            <div id="payment-methods" className="bg-surface border border-line rounded-lg p-4" />

            {/* 이용약관 동의 위젯 */}
            <div id="agreement" className="bg-surface border border-line rounded-lg p-4" />

            {/* 결제하기 버튼 */}
            <button
              onClick={handlePayment}
              className="w-full py-5 text-lg font-bold text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
            >
              결제하기
            </button>

            {/* 안내 메시지 */}
            <p className="text-xs text-textSecondary text-center">
              결제 버튼 클릭 시 Toss Payments 결제창으로 이동합니다.
            </p>
          </>
        )}
      </div>
    </>
  );
}

