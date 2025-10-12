"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    TossPayments: any;
  }
}

export default function SimplePaymentPage() {
  const [status, setStatus] = useState("초기화 중...");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    addLog("페이지 로드 시작");
    
    // SDK 수동 로드
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v2/standard';
    script.onload = () => {
      addLog("SDK 로드 완료");
      setStatus("SDK 로드 완료");
      
      // SDK 테스트
      setTimeout(() => {
        try {
          addLog("SDK 초기화 테스트 시작");
          
          const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
          if (!clientKey) {
            throw new Error("클라이언트 키가 없습니다");
          }
          
          addLog(`클라이언트 키: ${clientKey.substring(0, 20)}...`);
          
          if (!window.TossPayments) {
            throw new Error("TossPayments가 로드되지 않았습니다");
          }
          
          const tossPayments = window.TossPayments(clientKey);
          addLog("TossPayments 인스턴스 생성 성공");
          
          const customerKey = 'test_customer_' + Date.now();
          const widgets = tossPayments.widgets({ customerKey });
          addLog("위젯 인스턴스 생성 성공");
          
          setStatus("✅ 모든 테스트 통과!");
          addLog("🎉 모든 테스트 통과!");
          
        } catch (err: any) {
          addLog(`❌ 오류: ${err?.message || '알 수 없는 오류'}`);
          setStatus(`❌ 오류: ${err?.message || '알 수 없는 오류'}`);
        }
      }, 1000);
    };
    
    script.onerror = () => {
      addLog("SDK 로드 실패");
      setStatus("SDK 로드 실패");
    };
    
    document.head.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">간단한 토스페이먼츠 테스트</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">상태</h2>
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-lg font-medium">{status}</p>
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

        <div className="mt-6 space-x-4">
          <a 
            href="/payments/test" 
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            결제 테스트 페이지
          </a>
          <a 
            href="/payments/debug" 
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            디버깅 페이지
          </a>
        </div>
      </div>
    </div>
  );
}
