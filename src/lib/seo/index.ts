import { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

interface MetadataProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Normalizes an AdSense identifier into standard client ID and publisher ID formats.
 * Handles inputs like "ca-pub-1234567890123456", "pub-1234567890123456", or "1234567890123456".
 */
export function normalizeAdsenseId(rawId?: string | null): {
  numericId: string;
  clientId: string;
  publisherId: string;
} | null {
  if (!rawId) return null;
  const trimmed = rawId.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/\d{10,20}/);
  if (!match) return null;

  const numericId = match[0];
  return {
    numericId,
    clientId: `ca-pub-${numericId}`,
    publisherId: `pub-${numericId}`,
  };
}

/**
 * Generates standardized Next.js Metadata with OpenGraph, Twitter cards, and verification meta tags.
 */
export function constructMetadata({
  title,
  description = SITE_CONFIG.description,
  path = "",
  image = "/og-image.png",
  noIndex = false,
}: MetadataProps = {}): Metadata {
  const pageTitle = title ? `${title} | ${SITE_CONFIG.name}` : `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`;
  const canonicalUrl = `${SITE_CONFIG.url}${path}`;
  const adsense = normalizeAdsenseId(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID);

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION_TAG || undefined,
    },
    other: {
      ...(adsense ? { "google-adsense-account": adsense.clientId } : {}),
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION_TAG
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION_TAG }
        : {}),
    },
  };
}

export * from "@/components/seo/head-scripts";

/**
 * Builds JSON-LD Structured Data for Government Information / Notice Item
 */
export function buildGovNoticeJsonLd({
  title,
  description,
  url,
  organizationName,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  organizationName: string;
  datePublished?: string | null;
  dateModified?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentPermit",
    name: title,
    description,
    url,
    issuedBy: {
      "@type": "GovernmentOrganization",
      name: organizationName,
    },
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
  };
}
