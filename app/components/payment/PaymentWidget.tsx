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
    tosspayments: any;
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
  const paymentRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedOrderId] = useState(() => orderId || generateOrderId());

  const initializePayment = () => {
    try {
      if (!window.tosspayments) {
        throw new Error("Toss Payments not loaded");
      }

      const tossPayments = window.tosspayments(TOSS_CONFIG.clientKey);
      const payment = tossPayments.payment({
        customerKey: customerEmail || generatedOrderId
      });

      paymentRef.current = payment;
      setIsReady(true);
    } catch (err: any) {
      console.error("Init error:", err);
      setError(err?.message || "Failed to initialize");
    }
  };

  const handlePayment = async () => {
    if (!paymentRef.current) {
      alert("Please wait...");
      return;
    }

    try {
      onPaymentRequest?.(generatedOrderId);

      await paymentRef.current.requestPayment({
        method: "CARD",
        amount: {
          currency,
          value: amount,
        },
        orderId: generatedOrderId,
        orderName,
        successUrl: TOSS_CONFIG.successUrl,
        failUrl: TOSS_CONFIG.failUrl,
        customerEmail,
        customerName,
      });
    } catch (err: any) {
      console.error("Payment error:", err);
      alert("Payment failed: " + (err?.message || "Unknown error"));
    }
  };

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v2/standard"
        onLoad={initializePayment}
        onError={() => setError("Script load failed")}
      />

      <div className="space-y-6">
        {!isReady ? (
          <div className="p-12 text-center bg-gray-50 border rounded">
            <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="p-4 bg-gray-50 border rounded text-sm space-y-2">
              <div className="flex justify-between">
                <span>Order ID</span>
                <span className="font-mono">{generatedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Order Name</span>
                <span>{orderName}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount</span>
                <span className="font-bold">
                  {currency === "KRW" ? "₩" : "$"}
                  {amount.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="w-full py-5 text-lg font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Pay Now
            </button>
          </>
        )}
      </div>
    </>
  );
}
