import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import ClientLayout from "./components/ClientLayout";
import Analytics from "./components/Analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "totalo - 팀 없이, 수출을 한 번에",
  description: "B2B 홈페이지, AEO/SEO/GEO, 타겟 마케팅, 바이어 관리까지 토탈로.",
  keywords: ["B2B", "export", "AEO", "SEO", "GEO", "Korean manufacturers", "global buyers", "수출", "바이어"],
  authors: [{ name: "totalo" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://totalo.com",
    siteName: "totalo",
    title: "totalo - 팀 없이, 수출을 한 번에",
    description: "B2B 홈페이지, AEO/SEO/GEO, 타겟 마케팅, 바이어 관리까지 토탈로.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "totalo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "totalo - 팀 없이, 수출을 한 번에",
    description: "B2B 홈페이지, AEO/SEO/GEO, 타겟 마케팅, 바이어 관리까지 토탈로.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://totalo.com/#organization",
      name: "totalo",
      url: "https://totalo.com",
      logo: "https://totalo.com/logo.png",
      description: "AI-powered B2B export solution for Korean manufacturers",
    },
    {
      "@type": "WebSite",
      "@id": "https://totalo.com/#website",
      url: "https://totalo.com",
      name: "totalo",
      publisher: {
        "@id": "https://totalo.com/#organization",
      },
      inLanguage: ["ko", "en"],
    },
    {
      "@type": "WebPage",
      "@id": "https://totalo.com/#webpage",
      url: "https://totalo.com",
      name: "totalo - 팀 없이, 수출을 한 번에",
      isPartOf: {
        "@id": "https://totalo.com/#website",
      },
      description: "B2B 홈페이지, AEO/SEO/GEO, 타겟 마케팅, 바이어 관리까지 토탈로.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-bg text-textPrimary transition-colors duration-300">
        <Analytics />
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
