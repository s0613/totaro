"use client";

import { useEffect, useRef, useState } from "react";
import { generateOrderId } from "@/lib/payments/payment-utils";
import type { TossPaymentsWidgetSDK, PaymentRequestOptions } from "@/lib/payments/payment-types";

interface PaymentWindowProps {
  amount: number;
  orderName: string;
  orderId?: string;
  currency?: "KRW" | "USD" | "JPY";
}

export default function PaymentWindow({ amount, orderName, orderId, currency = "KRW" }: PaymentWindowProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [oid] = useState(() => orderId || generateOrderId());
  const tossRef = useRef<TossPaymentsWidgetSDK | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!clientKey) throw new Error("NEXT_PUBLIC_TOSS_CLIENT_KEY is not configured");

        if (!window.TossPayments) {
          const script = document.createElement("script");
          script.src = "https://js.tosspayments.com/v2/standard";
          script.async = true;
          document.head.appendChild(script);
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Toss Payments SDK"));
          });
        }

        let tries = 0;
        while (!window.TossPayments && tries < 50) {
          await new Promise((r) => setTimeout(r, 100));
          tries++;
        }
        if (!window.TossPayments) throw new Error("TossPayments SDK failed to initialize");

        tossRef.current = window.TossPayments(clientKey!);
        setIsLoading(false);
      } catch (e: any) {
        console.error("[PaymentWindow] load error:", e);
        setError(e?.message || "SDK load failed");
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const onPay = async () => {
    if (!tossRef.current) {
      alert("결제 스크립트가 로드되지 않았습니다.");
      return;
    }
    try {
      const origin = window.location.origin;
      const opts: PaymentRequestOptions = {
        method: "CARD",
        orderId: oid,
        orderName,
        amount,
        currency,
        successUrl: `${origin}/checkout/success`,
        failUrl: `${origin}/checkout/fail`,
      };
      await tossRef.current.requestPayment(opts);
    } catch (e) {
      console.error("[PaymentWindow] requestPayment error:", e);
      alert("결제 요청 중 오류가 발생했습니다.");
    }
  };

  if (error) {
    return (
      <div className="bg-warning/10 border border-warning rounded-lg p-6 text-center">
        <p className="text-warning font-semibold mb-2">결제 스크립트 로드 실패</p>
        <p className="text-textSecondary text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="bg-surface border border-line rounded-lg p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-textSecondary">결제 스크립트 로딩 중...</p>
        </div>
      ) : (
        <button onClick={onPay} className="w-full bg-accent text-bg font-bold text-lg py-5 rounded-lg hover:bg-accent/90 transition-all shadow-soft hover:shadow-lg">
          결제하기
        </button>
      )}

      <div className="bg-surface/50 border border-line rounded-lg p-4 text-sm text-textSecondary">
        <div className="flex justify-between mb-2">
          <span>주문번호</span>
          <span className="font-mono text-textPrimary">{oid}</span>
        </div>
        <div className="flex justify-between">
          <span>주문명</span>
          <span className="text-textPrimary">{orderName}</span>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    TossPayments: (clientKey: string) => TossPaymentsWidgetSDK;
  }
}

