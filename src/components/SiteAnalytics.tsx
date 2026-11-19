'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'

// GA4 資源「相信閱讀 focus-esg.com」（alanliao.tw 帳號下 alan-liao.com 帳戶）
const GA_ID = 'G-ZC4CEY655E'

/** 流量分析：Google Analytics 4 + Vercel Web Analytics，後台 /studio 不計。 */
export default function SiteAnalytics() {
  const pathname = usePathname()
  if (pathname?.startsWith('/studio')) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
      <Analytics />
    </>
  )
}
