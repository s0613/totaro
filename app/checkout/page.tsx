"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentLang = searchParams.get("lang") || "ko";
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { plan: "starter" } });

  const priceKRW = 890000;
  const priceFormatted = new Intl.NumberFormat("ko-KR").format(priceKRW);

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      const res = await fetch("/api/orders" + (currentLang ? `?lang=${currentLang}` : ""), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, price: priceKRW, currency: "KRW" }),
      });

      if (!res.ok) throw new Error("Order failed");
      const json = await res.json();
      const orderId = json.id as string;
      router.push(`/checkout/success?orderId=${encodeURIComponent(orderId)}${currentLang ? `&lang=${currentLang}` : ""}`);
    } catch {
      alert(currentLang === "en" ? "Payment could not be created. Please try again." : "주문 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-bg text-textPrimary py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          {currentLang === "en" ? "Checkout" : "구매하기"}
        </h1>
        <p className="text-textSecondary mb-10">
          {currentLang === "en"
            ? "AEO/SEO/GEO‑ready website production. From ₩890,000."
            : "AEO·SEO·GEO 친화적 웹사이트 제작. 89만원부터."}
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
              <div className="flex items-center justify-between">
                <span className="text-textSecondary">{currentLang === "en" ? "Price" : "가격"}</span>
                <span className="font-bold text-2xl">₩{priceFormatted}</span>
              </div>
              <p className="text-xs text-textSecondary/70">
                {currentLang === "en"
                  ? "Price shown is the starting price. Final quote may vary based on scope."
                  : "표시 가격은 시작가입니다. 최종 견적은 범위에 따라 달라질 수 있습니다."}
              </p>
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
                  <option value="starter">{currentLang === "en" ? "Starter (from ₩890,000)" : "스타터 (89만원부터)"}</option>
                </select>
                {errors.plan && <p className="text-warning text-sm mt-2">{errors.plan.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">{currentLang === "en" ? "Notes (optional)" : "요청사항 (선택)"}</label>
                <textarea className="w-full px-4 py-3 bg-bg border border-line rounded-lg min-h-[120px]" {...register("message")} placeholder={currentLang === "en" ? "Tell us about your scope/timeline" : "원하시는 범위/일정을 알려주세요"} />
              </div>

              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" className="mt-1" {...register("agree")} />
                <span className="text-textSecondary">
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
