"use client";

import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LanguageSwitcher />
      <ThemeToggle />
      {children}
    </>
  );
}
