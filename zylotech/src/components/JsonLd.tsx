import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  schema: Record<string, unknown> | Record<string, unknown>[];
}

export default function JsonLd({ schema }: JsonLdProps) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

// ── Pre-built schemas ──────────────────────────────────────────────

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://zylotechhub.com/#organization",
  name: "Zylo Tech Solutions",
  url: "https://zylotechhub.com",
  logo: "https://zylotechhub.com/zylo-logo.png",
  description:
    "Digital products for pastors, crypto traders, and programmers in Ghana and West Africa.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Accra",
    addressCountry: "GH",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["English"],
    email: "hello@zylotech.com",
  },
  // NOTE: the business phone number is intentionally NOT included in structured data
  // (contactPoint.telephone / sameAs) so search crawlers and scrapers can't harvest it.
  sameAs: [
    "https://t.me/PLACEHOLDER",
  ],
  founder: [
    {
      "@type": "Person",
      name: "Anthony Enchia",
      jobTitle: "Computer Programmer & Crypto Trader",
      worksFor: { "@id": "https://zylotechhub.com/#organization" },
    },
    {
      "@type": "Person",
      name: "Emmanuel Obeng",
      jobTitle: "Social Media Manager & Crypto Trader",
      worksFor: { "@id": "https://zylotechhub.com/#organization" },
    },
  ],
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://zylotechhub.com/#website",
  url: "https://zylotechhub.com",
  name: "Zylo Tech Solutions",
  publisher: { "@id": "https://zylotechhub.com/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://zylotechhub.com/blog?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export function productSchema(p: {
  title: string;
  description: string;
  price: string;
  selarLink: string;
  category: string;
}) {
  const ghsAmount = p.price.replace("GHS ", "");
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description,
    brand: { "@type": "Brand", name: "Zylo Tech Solutions" },
    category: p.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "GHS",
      price: ghsAmount,
      availability: "https://schema.org/InStock",
      url: p.selarLink,
      seller: { "@id": "https://zylotechhub.com/#organization" },
    },
  };
}

export function articleSchema(post: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    url: `https://zylotechhub.com/blog/${post.slug}`,
    image: `https://zylotechhub.com/og-image.png`,
    author: { "@id": "https://zylotechhub.com/#organization" },
    publisher: { "@id": "https://zylotechhub.com/#organization" },
    articleSection: post.category,
    inLanguage: "en-GH",
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}
