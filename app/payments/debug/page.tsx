"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function PaymentDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const onSdkLoad = () => {
    addLog("✅ SDK 로드 완료");
    setIsSdkLoaded(true);
  };

  const onSdkError = (e: any) => {
    addLog(`❌ SDK 로드 실패: ${e?.message || '알 수 없는 오류'}`);
    setError("SDK 로드 실패");
  };

  useEffect(() => {
    addLog("🚀 페이지 로드 시작");
    addLog(`📋 환경변수: ${process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ? '설정됨' : '없음'}`);
    
    if (typeof window !== 'undefined') {
      addLog(`🌐 window.TossPayments: ${window.TossPayments ? '존재함' : '없음'}`);
    }
  }, []);

  useEffect(() => {
    if (!isSdkLoaded) return;

    const testInitialization = async () => {
      try {
        addLog("🔧 SDK 초기화 테스트 시작");
        
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!clientKey) {
          throw new Error("클라이언트 키가 없습니다");
        }

        addLog(`🔑 클라이언트 키: ${clientKey.substring(0, 20)}...`);

        if (!window.TossPayments) {
          throw new Error("TossPayments가 로드되지 않았습니다");
        }

        const tossPayments = window.TossPayments(clientKey);
        addLog("✅ TossPayments 인스턴스 생성 성공");

        const customerKey = 'test_customer_' + Date.now();
        addLog(`👤 고객 키: ${customerKey}`);

        const widgets = tossPayments.widgets({ customerKey });
        addLog("✅ 위젯 인스턴스 생성 성공");

        await widgets.setAmount({ currency: 'KRW', value: 1000 });
        addLog("✅ 금액 설정 성공");

        addLog("🎉 모든 테스트 통과!");

      } catch (err: any) {
        addLog(`❌ 초기화 실패: ${err?.message || '알 수 없는 오류'}`);
        setError(err?.message || '초기화 실패');
      }
    };

    testInitialization();
  }, [isSdkLoaded]);

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v2/standard"
        strategy="beforeInteractive"
        onLoad={onSdkLoad}
        onError={onSdkError}
      />

      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">토스페이먼츠 디버깅 페이지</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">상태</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">SDK 로드:</span>
                <span className={`px-2 py-1 rounded text-sm ${isSdkLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {isSdkLoaded ? '완료' : '대기 중'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">환경변수:</span>
                <span className={`px-2 py-1 rounded text-sm ${process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ? '설정됨' : '없음'}
                </span>
              </div>
              {error && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">에러:</span>
                  <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-800">{error}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">로그</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">로그가 없습니다...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <a 
              href="/payments/test" 
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              결제 테스트 페이지로 이동
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
