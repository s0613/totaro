"use client";

import Link from "next/link";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-lg border-b border-line">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="TOTARO" className="w-8 h-8" />
            <span className="text-lg font-bold text-textPrimary tracking-tight">
              TOTARO
            </span>
          </Link>
          <div className="flex items-center gap-10">
            <a
              href="/vision"
              className="text-sm font-medium text-textPrimary hover:text-accent transition-colors duration-200"
            >
              Vision
            </a>
            <a
              href="/web"
              className="text-sm font-medium text-textPrimary hover:text-accent transition-colors duration-200"
            >
              Web
            </a>
            <a
              href="/inquiry"
              className="text-sm font-semibold text-bg bg-accent hover:bg-accent/90 transition-colors duration-200 px-5 py-2.5 rounded-lg"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>
      
      {children}
    </>
  );
}
