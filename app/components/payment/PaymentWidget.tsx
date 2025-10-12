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
  customerMobilePhone?: string;
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
  customerMobilePhone,
  currency = "KRW",
  onPaymentRequest,
}: PaymentWidgetProps) {
  const widgetsRef = useRef<any>(null);
  const paymentMethodWidgetRef = useRef<any>(null);
  const agreementWidgetRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedOrderId] = useState(() => orderId || generateOrderId());
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  // SDK 로드 완료 시 호출
  const onSdkLoad = () => {
    setIsSdkLoaded(true);
  };

  // SDK 로드 및 DOM 준비 후 위젯 초기화
  useEffect(() => {
    if (!isSdkLoaded) return;

    const initializeWidget = async () => {
      try {
        if (!TOSS_CONFIG.clientKey) {
          throw new Error("NEXT_PUBLIC_TOSS_CLIENT_KEY가 설정되지 않았습니다.");
        }

        if (!window.TossPayments) {
          throw new Error("Toss Payments SDK가 로드되지 않았습니다.");
        }

        // DOM이 렌더링될 때까지 대기 (더 긴 시간)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // DOM 요소 확인 (여러 번 시도)
        let paymentMethodElement = null;
        let agreementElement = null;
        
        // 최대 3번 시도
        for (let i = 0; i < 3; i++) {
          paymentMethodElement = document.querySelector('#payment-method');
          agreementElement = document.querySelector('#agreement');
          
          if (paymentMethodElement && agreementElement) {
            break;
          }
          
          console.log(`[PaymentWidget] DOM 요소 확인 시도 ${i + 1}/3:`, {
            paymentMethod: !!paymentMethodElement,
            agreement: !!agreementElement
          });
          
          // 300ms 대기 후 재시도
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        if (!paymentMethodElement || !agreementElement) {
          throw new Error("결제 UI 영역을 찾을 수 없습니다. 페이지를 새로고침해주세요.");
        }

        console.log("[PaymentWidget] 토스페이먼츠 SDK v2 초기화 중...");

        // 토스페이먼츠 SDK 초기화
        const tossPayments = window.TossPayments(TOSS_CONFIG.clientKey);
        
        // customerKey는 고객을 구분하는 고유 식별자
        const customerKey = customerEmail || generatedOrderId;
        console.log("[PaymentWidget] customerKey:", customerKey);

        // 결제위젯 인스턴스 생성
        const widgets = tossPayments.widgets({
          customerKey: customerKey
        });

        widgetsRef.current = widgets;

        // 결제 금액 설정 (반드시 렌더링 전에 호출)
        await widgets.setAmount({
          currency: currency,
          value: amount
        });
        console.log("[PaymentWidget] 금액 설정 완료:", { currency, value: amount });

        // 결제 수단 UI 렌더링
        const paymentMethodWidget = await widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT"
        });
        
        paymentMethodWidgetRef.current = paymentMethodWidget;

        // 결제수단 선택 이벤트 리스너
        paymentMethodWidget.on('paymentMethodSelect', (selectedMethod: any) => {
          console.log("[PaymentWidget] 선택된 결제수단:", selectedMethod);
          setSelectedPaymentMethod(selectedMethod?.code || null);
        });

        // 이용약관 UI 렌더링
        const agreementWidget = await widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT"
        });
        
        agreementWidgetRef.current = agreementWidget;

        console.log("[PaymentWidget] 위젯 렌더링 완료");
        setIsReady(true);
      } catch (err: any) {
        console.error("[PaymentWidget] 초기화 오류:", err);
        setError(err?.message || "결제 위젯 초기화에 실패했습니다.");
      }
    };

    initializeWidget();
  }, [isSdkLoaded, amount, currency, customerEmail, generatedOrderId]);

  const handlePayment = async () => {
    if (!widgetsRef.current) {
      alert("결제 위젯이 준비되지 않았습니다. 잠시만 기다려주세요.");
      return;
    }

    try {
      // 주문 생성 콜백
      onPaymentRequest?.(generatedOrderId);

      console.log("[PaymentWidget] 결제 요청:", {
        orderId: generatedOrderId,
        orderName,
        amount,
        customerEmail,
        customerName
      });

      // 결제 요청 (Redirect 방식)
      await widgetsRef.current.requestPayment({
        orderId: generatedOrderId,
        orderName: orderName,
        successUrl: TOSS_CONFIG.successUrl,
        failUrl: TOSS_CONFIG.failUrl,
        customerEmail: customerEmail,
        customerName: customerName,
        customerMobilePhone: customerMobilePhone,
      });
    } catch (err: any) {
      console.error("[PaymentWidget] 결제 요청 오류:", err);

      // 에러 코드별 처리
      if (err.code === "PAY_PROCESS_CANCELED") {
        alert("결제를 취소하셨습니다.");
      } else if (err.code === "PAY_PROCESS_ABORTED") {
        alert("결제가 실패했습니다. 다시 시도해주세요.");
      } else if (err.code === "REJECT_CARD_COMPANY") {
        alert("카드사에서 거절했습니다. 카드 정보를 확인해주세요.");
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
      {/* 토스페이먼츠 SDK v2 로드 */}
      <Script
        src="https://js.tosspayments.com/v2/standard"
        onLoad={onSdkLoad}
        onError={() => setError("Toss Payments SDK 로드에 실패했습니다.")}
      />

      <div className="space-y-6">
        {!isReady ? (
          <div className="p-12 text-center bg-surface border border-line rounded-lg">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-textSecondary font-medium">결제 위젯을 불러오는 중...</p>
            <p className="text-textSecondary text-sm mt-2">잠시만 기다려주세요</p>
          </div>
        ) : (
          <>
            {/* 주문 정보 요약 */}
            <div className="p-6 bg-surface border border-line rounded-xl space-y-3">
              <h3 className="font-semibold text-textPrimary mb-4">주문 정보</h3>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary text-sm">주문번호</span>
                <span className="font-mono text-textPrimary text-sm">{generatedOrderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textSecondary text-sm">상품명</span>
                <span className="text-textPrimary text-sm font-medium">{orderName}</span>
              </div>
              <div className="border-t border-line pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-textPrimary font-semibold">결제금액</span>
                  <span className="font-bold text-accent text-2xl">
                    {currency === "KRW" ? "₩" : "$"}
                    {amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 결제 수단 선택 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-textPrimary">결제 수단</h3>
              <div id="payment-method" className="bg-surface border border-line rounded-xl overflow-hidden" />
            </div>

            {/* 이용약관 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-textPrimary">이용약관</h3>
              <div id="agreement" className="bg-surface border border-line rounded-xl overflow-hidden" />
            </div>

            {/* 결제하기 버튼 */}
            <button
              onClick={handlePayment}
              disabled={!selectedPaymentMethod}
              className="w-full py-5 text-lg font-bold text-white bg-accent rounded-xl hover:bg-accent/90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300 shadow-lg hover:shadow-xl"
            >
              {selectedPaymentMethod ? "결제하기" : "결제수단을 선택해주세요"}
            </button>

            {/* 안내 메시지 */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">💳 테스트 결제</span>
                <br />
                테스트 환경에서는 실제 결제가 발생하지 않습니다.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
