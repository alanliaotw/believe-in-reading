import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 🚀 就在這裡！把這段 SEO 代碼貼進去
export const metadata: Metadata = {
  title: '聚焦誌 Focus Journal | 官方網站 - 蔣本基教授指導',
  description: '聚焦誌官方網站，專注於永續發展、ESG趨勢、環境工程與社會責任報導。提供最專業、權威的深度觀點，引領企業與社會邁向淨零轉型。',
  keywords: '聚焦誌, 聚焦誌官方, 蔣本基, ESG報導, 永續發展, 環境工程',
  openGraph: {
    title: '聚焦誌 Focus Journal - 官方網站',
    description: '引領永續思維的深度媒體',
    url: 'https://focus-esg.com', // 如果您有確定網址可以改這裡
    siteName: '聚焦誌 Focus Journal',
    images: [
      {
        url: '/brand-logo.png', 
        width: 800,
        height: 600,
      },
    ],
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