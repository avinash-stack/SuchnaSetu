import React from "react";
import Script from "next/script";
import { normalizeAdsenseId } from "@/lib/seo";

/**
 * Reusable Head Scripts and Verification Component for SuchnaSetu.
 * 
 * Supports:
 * - Google AdSense site verification & auto-ads (`NEXT_PUBLIC_ADSENSE_CLIENT_ID`)
 * - Google Analytics 4 (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)
 * - Microsoft Clarity Heatmaps (`NEXT_PUBLIC_CLARITY_PROJECT_ID`)
 * - Google Search Console & Webmaster verification meta tags (`NEXT_PUBLIC_GSC_VERIFICATION_TAG`, `NEXT_PUBLIC_BING_VERIFICATION_TAG`)
 * - Arbitrary Custom Head Snippet (`NEXT_PUBLIC_CUSTOM_HEAD_SNIPPET`)
 */
export function HeadScripts() {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_ENABLE_SCRIPTS_DEV === "true";

  const adsense = normalizeAdsenseId(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID);
  const gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_GA_ID ||
    "G-GPENK8HFEH";
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const gscVerificationTag = process.env.NEXT_PUBLIC_GSC_VERIFICATION_TAG;
  const bingVerificationTag = process.env.NEXT_PUBLIC_BING_VERIFICATION_TAG;
  const customHeadSnippet = process.env.NEXT_PUBLIC_CUSTOM_HEAD_SNIPPET;

  return (
    <>
      {/* 1. Google AdSense Site Verification & Ad Loader (SSR Static Script) */}
      {adsense && (
        <script
          id="google-adsense"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.clientId}`}
          crossOrigin="anonymous"
        />
      )}

      {/* 2. Google Search Console Verification Meta Tag */}
      {gscVerificationTag && (
        <meta name="google-site-verification" content={gscVerificationTag} />
      )}

      {/* 3. Bing Webmaster Tools Verification Meta Tag */}
      {bingVerificationTag && (
        <meta name="msvalidate.01" content={bingVerificationTag} />
      )}

      {/* 4. Google Analytics 4 (GA4) - Production only */}
      {isProduction && gaMeasurementId && (
        <>
          <Script
            id="ga4-loader"
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* 5. Microsoft Clarity Tracking - Production only */}
      {isProduction && clarityProjectId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityProjectId}");
          `}
        </Script>
      )}

      {/* 6. Custom Head Snippet (Raw Script / Tag Injection) */}
      {customHeadSnippet && (
        <div
          id="custom-head-snippet-container"
          dangerouslySetInnerHTML={{ __html: customHeadSnippet }}
        />
      )}
    </>
  );
}
