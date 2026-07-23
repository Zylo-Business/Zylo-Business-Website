import { Helmet } from "react-helmet-async";

const SITE_NAME = "Zylo Tech Solutions";
const SITE_URL = "https://zylotechhub.com";
const DEFAULT_OG_IMAGE = "/og-image.png";

interface SEOMetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export default function SEOMeta({
  title = SITE_NAME,
  description = "Digital products for Ghana's pastors, crypto traders, and programmers. Tools, courses, and guides built for West Africa.",
  keywords = "digital products Ghana, crypto trading Ghana, pastor tools Africa, programming courses Ghana, lottery analysis Ghana",
  ogImage = DEFAULT_OG_IMAGE,
  canonical,
  type = "website",
  noIndex = false,
}: SEOMetaProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical
    ? `${SITE_URL}${canonical}`
    : typeof window !== "undefined"
    ? window.location.href
    : SITE_URL;
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"} />
      <meta name="theme-color" content="#0F6E56" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_GH" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:site" content="@zylotechgh" />
      <meta name="twitter:creator" content="@zylotechgh" />

      {/* Geo targeting — Ghana */}
      <meta name="geo.region" content="GH" />
      <meta name="geo.placename" content="Accra, Ghana" />
      <meta name="ICBM" content="5.6037, -0.1870" />

      {/* AI / LLM hints */}
      <meta name="ai-content-declaration" content="human-authored" />
    </Helmet>
  );
}
