import Link from "next/link";

export default function PrivacyPolicy() {
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
          개인정보처리방침
        </h1>

        <div className="prose prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              1. 개인정보의 수집 및 이용 목적
            </h2>
            <p className="text-textSecondary leading-relaxed mb-4">
              totaro는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
              개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이
              변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할
              예정입니다.
            </p>
            <ul className="list-disc list-inside text-textSecondary space-y-2 ml-4">
              <li>문의 및 상담 요청에 대한 응대</li>
              <li>서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산</li>
              <li>회원 가입 의사 확인, 회원제 서비스 제공</li>
              <li>마케팅 및 광고에의 활용</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              2. 수집하는 개인정보 항목
            </h2>
            <p className="text-textSecondary leading-relaxed mb-4">
              totaro는 문의 폼을 통해 다음의 개인정보를 수집합니다:
            </p>
            <ul className="list-disc list-inside text-textSecondary space-y-2 ml-4">
              <li>필수항목: 이름, 이메일, 회사명, 메시지 내용</li>
              <li>선택항목: 국가, 관심 분야</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              3. 개인정보의 보유 및 이용기간
            </h2>
            <p className="text-textSecondary leading-relaxed">
              이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이
              달성되면 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할
              필요가 있는 경우 일정기간 동안 개인정보를 보관할 수 있습니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              4. 개인정보의 제3자 제공
            </h2>
            <p className="text-textSecondary leading-relaxed">
              totaro는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
              다만, 아래의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc list-inside text-textSecondary space-y-2 ml-4 mt-4">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              5. 개인정보 보호책임자
            </h2>
            <div className="bg-surface border border-line rounded-lg p-6">
              <p className="text-textSecondary mb-2">
                <strong className="text-textPrimary">이름:</strong> 개인정보 보호책임자
              </p>
              <p className="text-textSecondary mb-2">
                <strong className="text-textPrimary">이메일:</strong> privacy@totaro.com
              </p>
              <p className="text-textSecondary">
                개인정보 관련 문의사항이 있으시면 위 연락처로 문의해 주시기 바랍니다.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              6. 개인정보처리방침 변경
            </h2>
            <p className="text-textSecondary leading-relaxed">
              본 개인정보처리방침은 2025년 10월 10일부터 적용됩니다. 법령, 정책 또는
              보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 시에는 변경사항의
              시행 7일 전부터 홈페이지를 통해 고지할 것입니다.
            </p>
          </section>

          <div className="text-sm text-textSecondary/60 pt-8 border-t border-line">
            최종 수정일: 2025년 10월 10일
          </div>
        </div>
      </div>
    </main>
  );
}
