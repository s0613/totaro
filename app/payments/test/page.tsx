"use client";

import { useEffect, useRef, useState } from "react";
import { PLAN_PRICES } from "@/lib/payments/payment-config";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    TossPayments: any;
  }
}

export default function PaymentsTestPage() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") === "en" ? "en" : "ko") as "ko" | "en";

  // 결제 정보
  const amount = PLAN_PRICES.starter;
  const orderName = lang === "en" ? "totaro Website Starter" : "totaro 웹사이트 스타터";

  // 상태 관리
  const widgetsRef = useRef<any>(null);
  const paymentMethodWidgetRef = useRef<any>(null);
  const agreementWidgetRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  // 고유 키 생성 (클라이언트에서만)
  const [customerKey, setCustomerKey] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  // SDK 로드 완료
  const onSdkLoad = () => {
    console.log('[TossPayments] SDK 로드 완료');
    setIsSdkLoaded(true);
  };

  // SDK 수동 로드
  const loadSDK = () => {
    if (window.TossPayments) {
      console.log('[TossPayments] SDK 이미 로드됨');
      setIsSdkLoaded(true);
      return;
    }

    console.log('[TossPayments] SDK 수동 로드 시작');
    
    // 동적 import 방식으로 시도
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v2/standard';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('[TossPayments] SDK 수동 로드 완료');
      // SDK 로드 후 약간의 지연을 두고 상태 업데이트
      setTimeout(() => {
        if (window.TossPayments) {
          console.log('[TossPayments] window.TossPayments 확인됨');
          setIsSdkLoaded(true);
        } else {
          console.error('[TossPayments] window.TossPayments가 여전히 없음');
          setError('SDK 로드 후 TossPayments 객체를 찾을 수 없습니다.');
        }
      }, 100);
    };
    
    script.onerror = (e) => {
      console.error('[TossPayments] SDK 수동 로드 실패:', e);
      setError('Toss Payments SDK 로드에 실패했습니다.');
    };
    
    document.head.appendChild(script);
  };

  // 컴포넌트 마운트 시 SDK 로드 및 ID 생성
  useEffect(() => {
    // 클라이언트에서만 ID 생성
    setCustomerKey('customer_test_' + Math.floor(Math.random() * 1000000));
    setOrderId('order_test_' + Math.floor(Math.random() * 1000000));
    
    loadSDK();
  }, []);

  // 위젯 초기화
  useEffect(() => {
    if (!isSdkLoaded) return;

    const initializeWidget = async () => {
      try {
        console.log('[TossPayments] 위젯 초기화 시작');
        
        // 하드코딩된 클라이언트 키 사용 (테스트용)
        const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
        console.log('[TossPayments] clientKey:', clientKey ? '설정됨' : '없음');
        
        if (!clientKey) {
          setError('클라이언트 키가 설정되지 않았습니다.');
          return;
        }

        console.log('[TossPayments] customerKey:', customerKey);
        console.log('[TossPayments] orderId:', orderId);
        console.log('[TossPayments] amount:', amount);

        // DOM이 완전히 렌더링될 때까지 대기 (더 긴 시간)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // DOM 요소 확인 (여러 번 시도)
        let paymentMethodElement = null;
        let agreementElement = null;
        
        // 최대 5번 시도
        for (let i = 0; i < 5; i++) {
          paymentMethodElement = document.querySelector('#payment-method');
          agreementElement = document.querySelector('#agreement');
          
          if (paymentMethodElement && agreementElement) {
            break;
          }
          
          console.log(`[TossPayments] DOM 요소 확인 시도 ${i + 1}/5:`, {
            paymentMethod: !!paymentMethodElement,
            agreement: !!agreementElement
          });
          
          // 500ms 대기 후 재시도
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        console.log('[TossPayments] 최종 DOM 요소 확인:', {
          paymentMethod: !!paymentMethodElement,
          agreement: !!agreementElement
        });
        
        if (!paymentMethodElement || !agreementElement) {
          console.error('[TossPayments] DOM 요소를 찾을 수 없습니다');
          setError('결제 UI 영역을 찾을 수 없습니다. 페이지를 새로고침해주세요.');
          return;
        }

        // 토스페이먼츠 SDK 확인
        console.log('[TossPayments] window.TossPayments:', !!window.TossPayments);
        if (!window.TossPayments) {
          console.error('[TossPayments] SDK가 로드되지 않았습니다');
          setError('Toss Payments SDK가 로드되지 않았습니다. 네트워크 연결을 확인해주세요.');
          return;
        }

        // 토스페이먼츠 SDK 초기화
        console.log('[TossPayments] SDK 초기화 시작...');
        const tossPayments = window.TossPayments(clientKey);
        console.log('[TossPayments] SDK 초기화 완료');

        // 결제위젯 인스턴스 생성
        console.log('[TossPayments] 위젯 인스턴스 생성 시작...');
        const widgets = tossPayments.widgets({
          customerKey: customerKey
        });
        console.log('[TossPayments] 위젯 인스턴스 생성 완료');

        widgetsRef.current = widgets;

        // 결제 금액 설정 (렌더링 전에 반드시 호출)
        console.log('[TossPayments] 금액 설정 시작...');
        await widgets.setAmount({
          currency: 'KRW',
          value: amount
        });
        console.log('[TossPayments] 금액 설정 완료:', amount);

        // 결제 수단 UI 렌더링
        console.log('[TossPayments] 결제 수단 UI 렌더링 시작...');
        const paymentMethodWidget = await widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT'
        });
        console.log('[TossPayments] 결제 수단 UI 렌더링 완료');

        paymentMethodWidgetRef.current = paymentMethodWidget;

        // 결제수단 선택 이벤트
        paymentMethodWidget.on('paymentMethodSelect', (selectedMethod: any) => {
          console.log('[TossPayments] 선택된 결제수단:', selectedMethod);
          setSelectedPaymentMethod(selectedMethod?.code || null);
        });

        // 이용약관 UI 렌더링
        console.log('[TossPayments] 이용약관 UI 렌더링 시작...');
        const agreementWidget = await widgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT'
        });
        console.log('[TossPayments] 이용약관 UI 렌더링 완료');

        agreementWidgetRef.current = agreementWidget;

        console.log('[TossPayments] 모든 위젯 렌더링 완료');
        setIsReady(true);
      } catch (err: any) {
        console.error('[TossPayments] 초기화 오류:', err);
        console.error('[TossPayments] 에러 상세:', {
          message: err?.message,
          code: err?.code,
          stack: err?.stack,
          name: err?.name
        });
        setError(`결제 위젯 초기화에 실패했습니다: ${err?.message || '알 수 없는 오류'}`);
      }
    };

    initializeWidget();
  }, [isSdkLoaded, amount, customerKey, orderId]);

  // 결제 요청
  const handlePayment = async () => {
    if (!widgetsRef.current) {
      alert('결제 위젯이 준비되지 않았습니다. 잠시만 기다려주세요.');
      return;
    }

    try {
      console.log('[TossPayments] 결제 요청 시작');

      const paymentRequest = {
        orderId: orderId,
        orderName: orderName,
        successUrl: window.location.origin + '/checkout/success',
        failUrl: window.location.origin + '/checkout/fail',
        customerEmail: 'customer@totalo.com',
        customerName: lang === 'en' ? 'Totalo Customer' : '토타로 고객',
        customerMobilePhone: '01012341234'
      };

      console.log('[TossPayments] 결제 요청 정보:', paymentRequest);

      await widgetsRef.current.requestPayment(paymentRequest);
    } catch (err: any) {
      console.error('[TossPayments] 결제 요청 오류:', err);

      if (err.code === 'PAY_PROCESS_CANCELED') {
        alert(lang === 'en' ? 'Payment was canceled.' : '결제를 취소하셨습니다.');
      } else if (err.code === 'PAY_PROCESS_ABORTED') {
        alert(lang === 'en' ? 'Payment failed. Please try again.' : '결제가 실패했습니다. 다시 시도해주세요.');
      } else if (err.code === 'REJECT_CARD_COMPANY') {
        alert(lang === 'en' ? 'Card was rejected. Please check your card information.' : '카드사에서 거절했습니다. 카드 정보를 확인해주세요.');
      } else {
        alert((lang === 'en' ? 'Payment failed: ' : '결제에 실패했습니다: ') + (err?.message || '알 수 없는 오류'));
      }
    }
  };

  // ID가 생성되지 않았으면 로딩 표시
  if (!customerKey || !orderId) {
    return (
      <section className="min-h-screen bg-bg text-textPrimary py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-surface border border-line rounded-xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-textPrimary font-semibold text-lg mb-2">
              {lang === "en" ? "Initializing..." : "초기화 중..."}
            </p>
            <p className="text-textSecondary">
              {lang === "en" ? "Please wait a moment" : "잠시만 기다려주세요"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-bg text-textPrimary py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-red-600 font-bold text-xl mb-2">❌ 오류 발생</h2>
            <p className="text-red-500">{error}</p>
            <p className="text-sm text-red-400 mt-4">
              환경변수를 확인하세요: <code className="bg-red-100 px-2 py-1 rounded">NEXT_PUBLIC_TOSS_CLIENT_KEY</code>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-bg text-textPrimary py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            {lang === "en" ? "Toss Payments Widget v2" : "토스페이먼츠 결제위젯 v2"}
          </h1>
          <p className="text-textSecondary text-lg">
            {lang === "en"
              ? "Test payment integration with Toss Payments SDK v2"
              : "토스페이먼츠 SDK v2를 사용한 결제위젯 테스트"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 로딩 상태 표시 */}
          {!isReady && (
            <div className="lg:col-span-3 mb-6">
              <div className="bg-surface border border-line rounded-xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-textPrimary font-semibold text-lg mb-2">
                  {lang === "en" ? "Loading Payment Widget..." : "결제 위젯 로딩 중..."}
                </p>
                <p className="text-textSecondary mb-4">
                  {lang === "en" ? "Please wait a moment" : "잠시만 기다려주세요"}
                </p>
                <div className="text-sm text-textSecondary">
                  <p>SDK 로드: {isSdkLoaded ? "✅ 완료" : "⏳ 대기 중"}</p>
                  <p>클라이언트 키: ✅ 설정됨 (하드코딩)</p>
                </div>
              </div>
            </div>
          )}
          
          {/* 주문 정보 */}
          <aside className="lg:col-span-1">
            <div className="bg-surface border border-line rounded-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">
                {lang === "en" ? "Order Summary" : "주문 요약"}
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">
                    {lang === "en" ? "Order ID" : "주문번호"}
                  </span>
                  <span className="font-mono text-xs">{orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-textSecondary">
                    {lang === "en" ? "Product" : "상품명"}
                  </span>
                  <span className="font-semibold">{orderName}</span>
                </div>
                {selectedPaymentMethod && (
                  <div className="flex justify-between text-sm">
                    <span className="text-textSecondary">
                      {lang === "en" ? "Payment Method" : "결제수단"}
                    </span>
                    <span className="font-semibold text-accent">{selectedPaymentMethod}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-line pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-textSecondary font-medium">
                    {lang === "en" ? "Total Amount" : "총 결제금액"}
                  </span>
                  <span className="font-bold text-3xl text-accent">
                    ₩{amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* 결제 위젯 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 결제 수단 */}
            <div className="bg-surface border border-line rounded-xl overflow-hidden">
              <div className="bg-surface/50 px-6 py-4 border-b border-line">
                <h3 className="font-bold text-lg">
                  {lang === "en" ? "Payment Method" : "결제 수단"}
                </h3>
              </div>
              <div className="p-4">
                <div id="payment-method" />
              </div>
            </div>

            {/* 이용약관 */}
            <div className="bg-surface border border-line rounded-xl overflow-hidden">
              <div className="bg-surface/50 px-6 py-4 border-b border-line">
                <h3 className="font-bold text-lg">
                  {lang === "en" ? "Terms & Conditions" : "이용약관"}
                </h3>
              </div>
              <div className="p-4">
                <div id="agreement" />
              </div>
            </div>

            {/* 결제 버튼 */}
            <button
              onClick={handlePayment}
              disabled={!selectedPaymentMethod}
              className="w-full py-6 text-xl font-bold text-white bg-accent rounded-xl hover:bg-accent/90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {selectedPaymentMethod
                ? lang === "en" ? "Pay Now" : "결제하기"
                : lang === "en" ? "Select Payment Method" : "결제수단을 선택해주세요"}
            </button>

            {/* 테스트 안내 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💳</span>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">
                    {lang === "en" ? "Test Payment" : "테스트 결제"}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {lang === "en"
                      ? "This is a test environment. No actual charges will be made."
                      : "테스트 환경입니다. 실제 결제가 발생하지 않습니다."}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    {lang === "en"
                      ? "Test Card: 4242-4242-4242-4242"
                      : "테스트 카드: 4242-4242-4242-4242"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}