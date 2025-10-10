import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-bg py-24 px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-12"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          홈으로 돌아가기
        </Link>

        <h1 className="text-5xl font-bold text-textPrimary mb-8">
          이용약관
        </h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              제1조 (목적)
            </h2>
            <p className="text-textSecondary leading-relaxed">
              본 약관은 totalo(이하 "회사"라 합니다)가 제공하는 모든 서비스(이하 "서비스"라 합니다)의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              제2조 (정의)
            </h2>
            <ul className="list-disc list-inside text-textSecondary space-y-3 ml-4">
              <li>
                <strong className="text-textPrimary">"서비스"</strong>란 회사가 제공하는 B2B 수출 마케팅 솔루션을 의미합니다.
              </li>
              <li>
                <strong className="text-textPrimary">"회원"</strong>이란 회사와 서비스 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.
              </li>
              <li>
                <strong className="text-textPrimary">"아이디(ID)"</strong>란 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인하는 문자와 숫자의 조합을 의미합니다.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              제3조 (약관의 효력 및 변경)
            </h2>
            <p className="text-textSecondary leading-relaxed mb-4">
              1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력을 발생합니다.
            </p>
            <p className="text-textSecondary leading-relaxed mb-4">
              2. 회사는 필요하다고 인정되는 경우 본 약관을 변경할 수 있으며, 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 서비스 화면에 그 적용일자 7일 전부터 공지합니다.
            </p>
            <p className="text-textSecondary leading-relaxed">
              3. 회원은 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 이용계약을 해지할 수 있습니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              제4조 (서비스의 제공 및 변경)
            </h2>
            <p className="text-textSecondary leading-relaxed mb-4">
              1. 회사는 다음과 같은 서비스를 제공합니다:
            </p>
            <ul className="list-disc list-inside text-textSecondary space-y-2 ml-4 mb-4">
              <li>B2B 웹사이트 제작 및 관리</li>
              <li>AEO/SEO/GEO 최적화 서비스</li>
              <li>타겟 마케팅 및 광고 운영</li>
              <li>바이어 CRM 관리</li>
              <li>기타 회사가 정하는 서비스</li>
            </ul>
            <p className="text-textSecondary leading-relaxed">
              2. 회사는 서비스의 내용을 변경할 경우에는 변경 내용과 제공일자를 명시하여 현재 서비스를 제공하고 있는 화면에 그 제공일 이전 7일부터 공지합니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              제5조 (서비스의 중단)
            </h2>
            <p className="text-textSecondary leading-relaxed">
              회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다. 이 경우 회사는 회원에게 통지합니다. 다만, 회사가 사전에 통지할 수 없는 부득이한 사유가 있는 경우 사후에 통지할 수 있습니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              제6조 (회원의 의무)
            </h2>
            <ul className="list-disc list-inside text-textSecondary space-y-3 ml-4">
              <li>회원은 관계법령, 본 약관의 규정, 이용안내 및 서비스상에 공지한 주의사항 등을 준수하여야 합니다.</li>
              <li>회원은 회사의 사전 승낙 없이 서비스를 이용하여 영업활동을 할 수 없으며, 그 영업활동의 결과에 대해 회사는 책임을 지지 않습니다.</li>
              <li>회원은 서비스 이용과 관련하여 다음 각 호의 행위를 하여서는 안됩니다:
                <ul className="list-circle list-inside ml-6 mt-2 space-y-2">
                  <li>타인의 정보 도용</li>
                  <li>회사가 게시한 정보의 변경</li>
                  <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                  <li>회사 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              제7조 (저작권의 귀속 및 이용제한)
            </h2>
            <p className="text-textSecondary leading-relaxed mb-4">
              1. 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.
            </p>
            <p className="text-textSecondary leading-relaxed">
              2. 회원은 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              제8조 (분쟁해결)
            </h2>
            <p className="text-textSecondary leading-relaxed mb-4">
              1. 회사는 회원이 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
            </p>
            <p className="text-textSecondary leading-relaxed">
              2. 회사와 회원간 발생한 분쟁에 관한 소송은 대한민국 법을 준거법으로 하며, 회사의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.
            </p>
          </section>

          <div className="bg-surface border border-line rounded-lg p-6 mt-12">
            <h3 className="text-xl font-bold text-textPrimary mb-4">
              문의사항
            </h3>
            <p className="text-textSecondary mb-2">
              본 약관에 대한 문의사항이 있으시면 아래로 연락 주시기 바랍니다.
            </p>
            <p className="text-textSecondary">
              <strong className="text-textPrimary">이메일:</strong> support@totalo.com
            </p>
          </div>

          <div className="text-sm text-textSecondary/60 pt-8 border-t border-line mt-12">
            시행일: 2025년 10월 10일
          </div>
        </div>
      </div>
    </main>
  );
}
