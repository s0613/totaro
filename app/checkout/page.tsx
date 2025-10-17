"use client";

import { useState, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PaymentWidget from "@/app/components/payment/PaymentWidget";
import { generateOrderName } from "@/lib/payments/payment-utils";

const schema = z.object({
  name: z.string().min(2, "이름을 입력해주세요"),
  email: z.string().email("유효한 이메일을 입력해주세요"),
  company: z.string().min(2, "회사명을 입력해주세요"),
  plan: z.enum(["starter"]).refine((val) => val === "starter", {
    message: "요금제를 선택해주세요",
  }),
  message: z.string().optional(),
  agree: z.literal(true).refine((val) => val === true, {
    message: "약관에 동의해 주세요",
  }),
});

type FormData = z.infer<typeof schema>;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentLang = searchParams.get("lang") || "ko";
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { plan: "starter" } });


  const onSubmit = async (data: FormData) => {
    // Form validation passed, proceed to payment step
    setSubmitting(true);
    setShowPayment(true);
    setCustomerInfo(data);
  };

  // Show payment widget after form submission
  if (showPayment && customerInfo) {
    return (
      <section className="min-h-screen bg-bg text-textPrimary py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setShowPayment(false);
              setSubmitting(false);
            }}
            className="mb-6 text-textSecondary hover:text-textPrimary flex items-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {currentLang === "en" ? "Back to Form" : "폼으로 돌아가기"}
          </button>

          <h1 className="text-4xl font-bold mb-2">
            {currentLang === "en" ? "Payment" : "결제"}
          </h1>
          <p className="text-textSecondary mb-10 text-pretty break-keep">
            {currentLang === "en"
              ? "Complete your order by entering payment information."
              : "결제 정보를 입력하여 주문을 완료하세요."}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <aside className="lg:col-span-1 bg-surface border border-line rounded-xl p-6 h-max">
              <h2 className="text-xl font-semibold mb-4">
                {currentLang === "en" ? "Order Summary" : "주문 요약"}
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">{currentLang === "en" ? "Name" : "이름"}</span>
                  <span className="font-semibold">{customerInfo.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">Email</span>
                  <span className="font-semibold">{customerInfo.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">{currentLang === "en" ? "Company" : "회사명"}</span>
                  <span className="font-semibold">{customerInfo.company}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">{currentLang === "en" ? "Plan" : "요금제"}</span>
                  <span className="font-semibold">{currentLang === "en" ? "Starter" : "스타터"}</span>
                </div>
              </div>
            </aside>

            {/* Payment Widget */}
            <div className="lg:col-span-2">
              <PaymentWidget
                amount={0}
                orderName={generateOrderName("starter", currentLang === "en" ? "en" : "ko")}
                customerName={customerInfo.name}
                customerEmail={customerInfo.email}
                currency="KRW"
                onPaymentRequest={(orderId) => {
                  console.log("[Checkout] Payment initiated:", orderId);
                }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-bg text-textPrimary py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          {currentLang === "en" ? "Checkout" : "구매하기"}
        </h1>
        <p className="text-textSecondary mb-10 text-pretty break-keep">
          {currentLang === "en"
            ? "AEO/SEO/GEO‑ready website production."
            : "AEO·SEO·GEO 친화적 웹사이트 제작."}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <aside className="lg:col-span-1 bg-surface border border-line rounded-xl p-6 h-max">
            <h2 className="text-xl font-semibold mb-4">
              {currentLang === "en" ? "Order Summary" : "주문 요약"}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-textSecondary">{currentLang === "en" ? "Plan" : "요금제"}</span>
                <span className="font-semibold">{currentLang === "en" ? "Starter" : "스타터"}</span>
              </div>
            </div>
          </aside>

          {/* Checkout Form */}
          <div className="lg:col-span-2 bg-surface border border-line rounded-xl p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">{currentLang === "en" ? "Name" : "이름"} *</label>
                  <input className="w-full px-4 py-3 bg-bg border border-line rounded-lg" {...register("name")} placeholder={currentLang === "en" ? "Your name" : "홍길동"} />
                  {errors.name && <p className="text-warning text-sm mt-2">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <input className="w-full px-4 py-3 bg-bg border border-line rounded-lg" {...register("email")} placeholder="you@example.com" />
                  {errors.email && <p className="text-warning text-sm mt-2">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">{currentLang === "en" ? "Company" : "회사명"} *</label>
                <input className="w-full px-4 py-3 bg-bg border border-line rounded-lg" {...register("company")} placeholder={currentLang === "en" ? "Company Inc." : "토타로 주식회사"} />
                {errors.company && <p className="text-warning text-sm mt-2">{errors.company.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">{currentLang === "en" ? "Plan" : "요금제"}</label>
                <select className="w-full px-4 py-3 bg-bg border border-line rounded-lg" {...register("plan")}>
                  <option value="starter">{currentLang === "en" ? "Starter" : "스타터"}</option>
                </select>
                {errors.plan && <p className="text-warning text-sm mt-2">{errors.plan.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">{currentLang === "en" ? "Notes (optional)" : "요청사항 (선택)"}</label>
                <textarea className="w-full px-4 py-3 bg-bg border border-line rounded-lg min-h-[120px]" {...register("message")} placeholder={currentLang === "en" ? "Tell us about your scope/timeline" : "원하시는 범위/일정을 알려주세요"} />
              </div>

              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" className="mt-1" {...register("agree")} />
                <span className="text-textSecondary text-pretty break-keep">
                  {currentLang === "en"
                    ? (
                        <>I agree to the <a className="text-accent hover:underline" href="/legal/terms">Terms</a> and <a className="text-accent hover:underline" href="/legal/privacy">Privacy Policy</a>.</>
                      )
                    : (
                        <>
                          <a className="text-accent hover:underline" href="/legal/terms">이용약관</a> 및 <a className="text-accent hover:underline" href="/legal/privacy">개인정보처리방침</a>에 동의합니다.
                        </>
                      )}
                </span>
              </label>
              {errors.agree && <p className="text-warning text-sm">{errors.agree.message}</p>}

              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary px-8 py-4">
                  {submitting ? (currentLang === "en" ? "Processing..." : "처리 중...") : currentLang === "en" ? "Place Order" : "주문하기"}
                </button>
                <a href={`${pathname}?lang=${currentLang}`} className="px-8 py-4 border border-line rounded-lg text-textSecondary hover:text-textPrimary">
                  {currentLang === "en" ? "Cancel" : "취소"}
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
