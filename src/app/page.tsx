import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/sanity';
import ArticleGrid from '@/components/ArticleGrid';
import Footer from '@/components/Footer';
import PartnershipInquiry from '@/components/PartnershipInquiry';

export const revalidate = 0;

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
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.focus-esg.com/#organization",
      "name": "相信閱讀國際股份有限公司",
      "alternateName": ["相信閱讀", "Read & Believe"],
      "url": "https://www.focus-esg.com",
      "logo": "https://www.focus-esg.com/brand-logo.png",
      "description": "台灣 ESG 永續議題深度媒體，發行《FOCUS 聚焦誌》實體雜誌。",
      "telephone": "+886-2-2767-2688",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "八德路三段2號6樓",
        "addressLocality": "松山區",
        "addressRegion": "臺北市",
        "postalCode": "10558",
        "addressCountry": "TW"
      },
      "sameAs": [
        "https://www.facebook.com/readnbelieve.focus/",
        "https://www.instagram.com/read.n.believe/"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.focus-esg.com/#website",
      "name": "相信閱讀｜聚焦誌",
      "alternateName": ["FOCUS聚焦誌", "聚焦誌", "潮永續", "永續列車", "Read & Believe"],
      "url": "https://www.focus-esg.com",
      "description": "ESG 永續議題深度媒體，出版《FOCUS 聚焦誌》實體雜誌",
      "inLanguage": "zh-TW",
      "publisher": { "@id": "https://www.focus-esg.com/#organization" }
    },
    {
      "@type": "Periodical",
      "@id": "https://www.focus-esg.com/#periodical",
      "name": "FOCUS 聚焦誌",
      "alternateName": ["聚焦誌", "Focus Journal"],
      "url": "https://www.focus-esg.com",
      "description": "《FOCUS 聚焦誌》是相信閱讀國際股份有限公司發行的 ESG 永續議題實體雜誌，每季於誠品、博客來等通路上架，報導碳費、ESG 報告、TNFD 自然風險等永續趨勢。",
      "inLanguage": "zh-TW",
      "publisher": { "@id": "https://www.focus-esg.com/#organization" }
    }
  ]
};

export default async function Home() {
  const articles = await getAllArticles();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seoSchema) }}
      />

      <main className="relative min-h-screen bg-black text-white font-sans">
        <h1 className="sr-only">
          相信閱讀《FOCUS 聚焦誌》｜ESG 永續議題深度媒體
        </h1>
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
