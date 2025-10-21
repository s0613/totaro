import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import ClientLayout from "./components/ClientLayout";
import Analytics from "./components/Analytics";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/schemas";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://totaro.com'),
  title: "TOTARO - Complete B2B Export Solutions",
  description: "AI-powered B2B export platform: websites, AEO/SEO/GEO, targeted marketing, and buyer management. Transform your global business.",
  keywords: ["B2B export", "AI export platform", "global marketing", "buyer management", "AEO", "SEO", "GEO"],
  authors: [{ name: "TOTARO" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://totaro.com",
    siteName: "TOTARO",
    title: "TOTARO - Complete B2B Export Solutions",
    description: "AI-powered B2B export platform: websites, AEO/SEO/GEO, targeted marketing, and buyer management. Transform your global business.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TOTARO - Complete B2B Export Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TOTARO - Complete B2B Export Solutions",
    description: "AI-powered B2B export platform: websites, AEO/SEO/GEO, targeted marketing, and buyer management. Transform your global business.",
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

// Global JSON-LD data
const organizationData = organizationJsonLd({
  name: "TOTARO",
  url: "https://totaro.com",
  logo: "https://totaro.com/logo.png",
  sameAs: [
    "https://www.linkedin.com/company/totaro",
    "https://twitter.com/totaro_ai",
    "https://github.com/totaro-ai",
  ],
});

const websiteData = websiteJsonLd({
  url: "https://totaro.com",
  searchUrl: "https://totaro.com/search",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
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
        
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7V429MPZ1Q"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7V429MPZ1Q');
            `,
          }}
        />
        {/* End Google Analytics 4 */}
        
        <JsonLd data={organizationData} />
        <JsonLd data={websiteData} />
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
