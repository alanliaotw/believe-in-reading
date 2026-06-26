import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: '聚焦誌 FOCUS｜相信閱讀 Read & Believe 官方網站',
  description: '聚焦誌（FOCUS）是相信閱讀 Read & Believe 出版的 ESG 永續議題深度雜誌，於誠品、博客來販售。報導碳費、ESG 報告書、TNFD 自然風險，讓複雜永續議題變成讀得懂的故事。',
  keywords: '聚焦誌, FOCUS聚焦誌, 相信閱讀, Read and Believe, ESG, 永續, 碳費, 永續媒體, ESG雜誌',
  openGraph: {
    title: '聚焦誌 FOCUS｜相信閱讀 Read & Believe 官方網站',
    description: '聚焦誌（FOCUS）ESG 永續議題深度雜誌，把複雜的永續議題說成你讀得懂的故事。',
    url: 'https://www.focus-esg.com',
    siteName: '聚焦誌 FOCUS｜相信閱讀 Read & Believe',
    images: [{ url: 'https://www.focus-esg.com/focus-share-v2.jpg', width: 1200, height: 630 }],
    locale: 'zh_TW',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-ZC4CEY655E" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-ZC4CEY655E');`}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}