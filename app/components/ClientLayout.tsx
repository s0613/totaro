"use client";

import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const needsHeaderSpacer = pathname?.startsWith("/payments");
  return (
    <>
      {/* Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-lg border-b border-line">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 369 367"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
            >
              <path
                d="M183.473 366.583L0.446289 327.112V41.8849L92.0202 61.1978L42.3673 72.3027V294.522L278.188 345.822L183.473 366.583Z"
                fill="currentColor"
                className="text-accent"
              />
              <path
                d="M185.527 0L368.554 39.5915V324.698L276.98 305.385L326.633 294.28V72.182L90.812 20.7614L185.527 0Z"
                fill="currentColor"
                className="text-accent"
              />
            </svg>
            <span className="text-lg font-bold text-textPrimary tracking-tight">
              totaro
            </span>
          </Link>
          <div className="flex items-center gap-10">
            <a
              href="/payments/test"
              className="text-sm font-medium text-textPrimary hover:text-accent transition-colors duration-200"
            >
              Payment
            </a>
            <a
              href="/vision"
              className="text-sm font-medium text-textPrimary hover:text-accent transition-colors duration-200"
            >
              Vision
            </a>
            <a
              href="#contact"
              className="text-sm font-semibold text-bg bg-accent hover:bg-accent/90 transition-colors duration-200 px-5 py-2.5 rounded-lg"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>
      {needsHeaderSpacer && <div className="h-20" />}
      
      <LanguageSwitcher />
      <ThemeToggle />
      {children}
    </>
  );
}
