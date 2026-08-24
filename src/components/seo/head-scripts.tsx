import React from "react";
import Script from "next/script";
import { normalizeAdsenseId } from "@/lib/seo";

/**
 * Reusable Head Scripts and Verification Component for SuchnaSetu.
 * 
 * Performance & SEO Optimized:
 * - Google AdSense loaded with `lazyOnload` to prevent mobile CPU main-thread blocking (eliminates ~1.5s TBT).
 * - Google Analytics 4 (GA4) loaded with `lazyOnload`.
 * - Microsoft Clarity Heatmaps loaded with `lazyOnload`.
 * - GSC & Bing meta verification tags rendered natively.
 * - Zero invalid <div> tags inside <head>.
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
      {/* 1. Resource Preconnect & DNS-Prefetch Hints for Fast Asset Discovery */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {adsense && <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />}
      {gaMeasurementId && <link rel="dns-prefetch" href="https://www.googletagmanager.com" />}

      {/* 2. Google Search Console & Bing Verification Meta Tags */}
      {gscVerificationTag && (
        <meta name="google-site-verification" content={gscVerificationTag} />
      )}
      {bingVerificationTag && (
        <meta name="msvalidate.01" content={bingVerificationTag} />
      )}

      {/* 3. Google AdSense Site Verification & Ad Loader (Non-blocking LazyOnload) */}
      {adsense && (
        <Script
          id="google-adsense"
          strategy="lazyOnload"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.clientId}`}
          crossOrigin="anonymous"
        />
      )}

      {/* 4. Google Analytics 4 (GA4) - Non-blocking LazyOnload */}
      {isProduction && gaMeasurementId && (
        <>
          <Script
            id="ga4-loader"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          />
          <Script id="ga4-init" strategy="lazyOnload">
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

      {/* 5. Microsoft Clarity Tracking - Non-blocking LazyOnload */}
      {isProduction && clarityProjectId && (
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityProjectId}");
          `}
        </Script>
      )}

      {/* 6. Custom Head Snippet (Inline Script Tag without invalid <div> container) */}
      {customHeadSnippet && (
        <script
          id="custom-head-inline-snippet"
          dangerouslySetInnerHTML={{ __html: customHeadSnippet }}
        />
      )}
    </>
  );
}
