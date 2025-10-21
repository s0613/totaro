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
  title: "TOTARO - 팀 없이, 수출을 한 번에",
  description: "B2B 홈페이지, AEO/SEO/GEO, 타겟 마케팅, 바이어 관리까지 토탈로.",
  keywords: ["B2B", "export", "AEO", "SEO", "GEO", "Korean manufacturers", "global buyers", "수출", "바이어"],
  authors: [{ name: "TOTARO" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://totaro.com",
    siteName: "TOTARO",
    title: "TOTARO - 팀 없이, 수출을 한 번에",
    description: "B2B 홈페이지, AEO/SEO/GEO, 타겟 마케팅, 바이어 관리까지 토탈로.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TOTARO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TOTARO - 팀 없이, 수출을 한 번에",
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
      "@id": "https://totaro.com/#organization",
      name: "TOTARO",
      url: "https://totaro.com",
      logo: "https://totaro.com/logo.png",
      description: "AI-powered B2B export solution for Korean manufacturers",
    },
    {
      "@type": "WebSite",
      "@id": "https://totaro.com/#website",
      url: "https://totaro.com",
      name: "TOTARO",
      publisher: {
        "@id": "https://totaro.com/#organization",
      },
      inLanguage: ["ko", "en"],
    },
    {
      "@type": "WebPage",
      "@id": "https://totaro.com/#webpage",
      url: "https://totaro.com",
      name: "TOTARO - 팀 없이, 수출을 한 번에",
      isPartOf: {
        "@id": "https://totaro.com/#website",
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
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MBFSQ6BC');`,
          }}
        />
        {/* End Google Tag Manager */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-bg text-textPrimary transition-colors duration-300">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MBFSQ6BC"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Analytics />
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
