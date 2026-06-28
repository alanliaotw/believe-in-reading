import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 🚀 就在這裡！把這段 SEO 代碼貼進去
export const metadata: Metadata = {
  metadataBase: new URL('https://www.focus-esg.com'),
  other: {
    'facebook-domain-verification': 'zdsbn5k7rit65s9fz1edntyi99rjvx',
  },
  title: '聚焦誌 Focus Journal | 官方網站 - 蔣本基教授指導',
  description: '聚焦誌官方網站，專注於永續發展、ESG趨勢、環境工程與社會責任報導。提供最專業、權威的深度觀點，引領企業與社會邁向淨零轉型。',
  keywords: '聚焦誌, 聚焦誌官方, 蔣本基, ESG報導, 永續發展, 環境工程',
  openGraph: {
    title: '聚焦誌 Focus Journal - 官方網站',
    description: '引領永續思維的深度媒體',
    url: 'https://www.focus-esg.com',
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
