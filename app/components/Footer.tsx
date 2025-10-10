interface FooterProps {
  content: {
    copyright: string;
    privacy: string;
    terms: string;
  };
}

export default function Footer({ content }: FooterProps) {
  return (
    <footer className="bg-surface border-t border-line py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 369 367"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M278.188 99.5822L141.552 168.264L95.4028 145.571L232.28 77.0103L278.188 99.5822Z"
                fill="#5BA4FF"
              />
              <path
                d="M95.4028 145.571V191.198L141.552 214.494V168.264L95.4028 145.571Z"
                fill="#E9ECEF"
              />
              <path
                d="M232.522 214.494V260L186.856 282.451V236.221L232.522 214.494Z"
                fill="#E9ECEF"
              />
            </svg>
            <span className="text-lg font-bold text-textPrimary">totaro</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a
              href="/legal/privacy"
              className="text-sm text-textSecondary hover:text-accent transition-colors"
            >
              {content.privacy}
            </a>
            <a
              href="/legal/terms"
              className="text-sm text-textSecondary hover:text-accent transition-colors"
            >
              {content.terms}
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-textSecondary">{content.copyright}</div>
        </div>
      </div>
    </footer>
  );
}
