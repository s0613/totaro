export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; lang?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.orderId;
  const lang = params.lang === "en" ? "en" : "ko";

  return (
    <section className="min-h-screen bg-bg text-textPrimary flex items-center justify-center px-8">
      <div className="text-center max-w-2xl">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-success/20 flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-success">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">{lang === "en" ? "Order Received" : "주문이 접수되었습니다"}</h1>
        <p className="text-textSecondary mb-6">
          {lang === "en"
            ? "We will contact you shortly to confirm scope and schedule."
            : "담당 매니저가 곧 범위와 일정을 확인드릴게요."}
        </p>
        {orderId && (
          <p className="text-sm text-textSecondary/80 mb-8">{lang === "en" ? "Order ID" : "주문번호"}: <span className="text-textPrimary font-mono">{orderId}</span></p>
        )}
        <a href="/" className="btn-primary px-8 py-4 inline-block">{lang === "en" ? "Back to Home" : "홈으로"}</a>
      </div>
    </section>
  );
}
