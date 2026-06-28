import Image from 'next/image';
import Script from 'next/script';
import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/sanity';
import ArticleGrid from '@/components/ArticleGrid';
import Footer from '@/components/Footer';
import PartnershipInquiry from '@/components/PartnershipInquiry';

export const metadata: Metadata = {
  title: '相信閱讀｜聚焦誌：ESG 永續議題深度媒體',
  description: '相信閱讀是台灣 ESG 永續議題深度媒體，出版實體雜誌《FOCUS 聚焦誌》於誠品、博客來販售。報導碳費、ESG 報告、TNFD 自然風險等永續趨勢，讓複雜議題變成讀得懂的故事。',
  keywords: '相信閱讀, FOCUS聚焦誌, ESG, 永續, 碳費, 潮永續, 永續列車, 永續媒體',
  openGraph: {
    title: '相信閱讀｜聚焦誌 - ESG 永續議題深度媒體',
    description: '把複雜的永續議題，說成你讀得懂的故事',
    url: 'https://www.focus-esg.com',
    siteName: '相信閱讀 Read & Believe',
    images: [{ url: 'https://www.focus-esg.com/focus-share-v2.jpg', width: 1200, height: 630 }],
    locale: 'zh_TW',
    type: 'website',
  },
};

const seoSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "相信閱讀｜聚焦誌",
  "alternateName": ["FOCUS聚焦誌", "潮永續", "永續列車", "Read & Believe"],
  "url": "https://www.focus-esg.com",
  "description": "ESG 永續議題深度媒體，出版《FOCUS 聚焦誌》實體雜誌"
};

export default async function Home() {
  const articles = await getAllArticles();

  return (
    <>
      <Script id="seo-schema" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(seoSchema)}
      </Script>

      <main className="relative min-h-screen bg-black text-white font-sans">
        <div className="fixed inset-0 z-0 opacity-30">
          <video autoPlay muted loop playsInline className="h-full w-full object-cover">
            <source src="/bg-video.mp4" type="video/mp4" />
          </video>
        </div>

        <nav className="relative z-50 p-6 md:p-10 max-w-7xl mx-auto flex justify-between items-center">
          <div className="relative h-10 w-40">
            <Image src="/brand-logo.png" alt="相信閱讀 聚焦誌" fill className="object-contain" priority />
          </div>
          <div className="relative h-12 w-48">
            <Image src="/right-logo.png" alt="合作單位" fill className="object-contain" priority unoptimized />
          </div>
        </nav>

        <ArticleGrid articles={articles} />

        <PartnershipInquiry />

        <Footer />
      </main>
    </>
  );
}
