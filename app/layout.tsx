import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "totalo - 팀 없이, 수출을 한 번에",
  description: "B2B 홈페이지, AEO/SEO/GEO, 타겟 마케팅, 바이어 관리까지 토탈로.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="antialiased bg-bg text-textPrimary">{children}</body>
    </html>
  );
}
