"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Status = "idle" | "confirming" | "success" | "error";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const lang = (searchParams.get("lang") === "en" ? "en" : "ko") as "ko" | "en";

  const validParams = useMemo(() => paymentKey && orderId && amount, [paymentKey, orderId, amount]);

  useEffect(() => {
    const confirm = async () => {
      if (!validParams) return;
      try {
        setStatus("confirming");
        const res = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json?.message || `HTTP ${res.status}`);
        }
        setConfirmedOrderId(json.orderId || orderId!);
        setStatus("success");
      } catch (e: any) {
        setError(e?.message || "Confirm failed");
        setStatus("error");
      }
    };
    confirm();
  }, [validParams, paymentKey, orderId, amount]);

  return (
    <section className="min-h-screen bg-bg text-textPrimary flex items-center justify-center px-8">
      <div className="text-center max-w-2xl">
        {status === "confirming" && (
          <div className="bg-surface border border-line rounded-xl p-10">
            <div className="inline-block w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6" />
            <h1 className="text-3xl font-bold mb-2">{lang === "en" ? "Confirming Payment" : "결제 확인 중"}</h1>
            <p className="text-textSecondary">{lang === "en" ? "Please wait a moment" : "잠시만 기다려 주세요"}</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-success/20 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-success">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">{lang === "en" ? "Order Received" : "주문 완료"}</h1>
            <p className="text-textSecondary mb-6">{lang === "en" ? "We will contact you shortly." : "담당자가 곧 연락드리겠습니다."}</p>
            {confirmedOrderId && (
              <p className="text-sm text-textSecondary/80 mb-8">{lang === "en" ? "Order ID" : "주문번호"}: <span className="text-textPrimary font-mono">{confirmedOrderId}</span></p>
            )}
            <a href="/" className="btn-primary px-8 py-4 inline-block">{lang === "en" ? "Back to Home" : "홈으로"}</a>
          </div>
        )}

        {status === "error" && (
          <div className="bg-warning/10 border border-warning rounded-xl p-10">
            <h1 className="text-3xl font-bold mb-2">{lang === "en" ? "Payment Confirmation Failed" : "결제 확인 실패"}</h1>
            <p className="text-textSecondary mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <a href="/checkout" className="btn-primary px-8 py-4 inline-block">{lang === "en" ? "Try Again" : "다시 시도"}</a>
              <a href="/" className="px-8 py-4 border border-line rounded-lg text-textSecondary hover:text-textPrimary inline-block">{lang === "en" ? "Home" : "홈"}</a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

