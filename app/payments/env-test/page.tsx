"use client";

import { useEffect, useState } from "react";

export default function EnvTestPage() {
  const [envStatus, setEnvStatus] = useState<any>({});

  useEffect(() => {
    const checkEnv = () => {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      setEnvStatus({
        clientKey: clientKey ? `${clientKey.substring(0, 20)}...` : '없음',
        hasClientKey: !!clientKey,
        timestamp: new Date().toLocaleTimeString()
      });
    };

    checkEnv();
    const interval = setInterval(checkEnv, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">환경변수 테스트</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">현재 상태</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">클라이언트 키:</span>
              <span className={`px-2 py-1 rounded text-sm ${envStatus.hasClientKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {envStatus.clientKey || '없음'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">마지막 확인:</span>
              <span className="text-sm text-gray-600">{envStatus.timestamp}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">브라우저에서 확인</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <div>브라우저 개발자 도구 콘솔에서 다음을 실행하세요:</div>
            <div className="mt-2">
              <div>console.log('NEXT_PUBLIC_TOSS_CLIENT_KEY:', process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY);</div>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <a 
            href="/payments/test" 
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            결제 테스트 페이지
          </a>
          <a 
            href="/payments/simple" 
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            간단한 테스트
          </a>
        </div>
      </div>
    </div>
  );
}
