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
  metadataBase: new URL('https://koreanacorn.com'),
  title: "Korean Acorn - Premium Korean Products",
  description: "Discover premium Korean products and services. Quality guaranteed.",
  keywords: ["Korean products", "premium", "quality", "Korea"],
  authors: [{ name: "Korean Acorn" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://koreanacorn.com",
    siteName: "Korean Acorn",
    title: "Korean Acorn - Premium Korean Products",
    description: "Discover premium Korean products and services. Quality guaranteed.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Korean Acorn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Korean Acorn - Premium Korean Products",
    description: "Discover premium Korean products and services. Quality guaranteed.",
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
  name: "Korean Acorn",
  url: "https://koreanacorn.com",
  logo: "https://koreanacorn.com/logo.png",
  sameAs: [
    "https://www.facebook.com/koreanacorn",
    "https://www.instagram.com/koreanacorn",
    "https://twitter.com/koreanacorn",
  ],
});

const websiteData = websiteJsonLd({
  url: "https://koreanacorn.com",
  searchUrl: "https://koreanacorn.com/search",
});

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
