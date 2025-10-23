"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // 메뉴가 열려있을 때 ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-lg border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="TOTARO" 
              width={32} 
              height={32} 
              className="w-8 h-8"
              priority
            />
            <span className="text-lg font-bold text-textPrimary tracking-tight">
              TOTARO
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1"
            aria-label="메뉴 열기/닫기"
          >
            <span
              className={`block w-6 h-0.5 bg-textPrimary transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-textPrimary transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-textPrimary transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={closeMenu}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-lg border-b border-line transition-all duration-300 z-50 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="px-4 py-6 space-y-4">
            <a
              href="/vision"
              onClick={closeMenu}
              className="block text-base font-medium text-textPrimary hover:text-accent transition-colors duration-200 py-2"
            >
              Vision
            </a>
            <a
              href="/web"
              onClick={closeMenu}
              className="block text-base font-medium text-textPrimary hover:text-accent transition-colors duration-200 py-2"
            >
              Web
            </a>
            <a
              href="/inquiry"
              onClick={closeMenu}
              className="block text-base font-semibold text-bg bg-accent hover:bg-accent/90 transition-colors duration-200 px-5 py-3 rounded-lg text-center"
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
