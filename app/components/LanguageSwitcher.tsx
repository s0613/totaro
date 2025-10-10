"use client";

import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { trackLanguageChange } from "@/lib/analytics";

export default function LanguageSwitcher() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentLang = searchParams.get("lang") || "ko";

  const toggleLang = currentLang === "ko" ? "en" : "ko";
  const displayText = currentLang === "ko" ? "EN" : "KO";

  const handleLanguageChange = () => {
    trackLanguageChange(currentLang, toggleLang);
  };

  return (
    <Link
      href={`${pathname}?lang=${toggleLang}`}
      onClick={handleLanguageChange}
      className="fixed bottom-8 right-8 z-[60] px-5 py-3 bg-surface/90 backdrop-blur-lg border border-line rounded-full text-sm font-bold text-textPrimary hover:border-accent hover:bg-accent/10 transition-all shadow-lg"
    >
      {displayText}
    </Link>
  );
}
