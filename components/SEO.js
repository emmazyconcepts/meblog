import Head from "next/head";
import { useRouter } from "next/router";

export default function SEO({
  title = "Meetanescort - Safety Resources for Sex Workers",
  description = "Essential safety guides, legal rights information, and health resources for sex workers. Stay safe with expert advice and community support.",
  canonical,
  ogImage = "https://meetanescort.info/images/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  keywords = "sex worker safety, escort safety, harm reduction, safety tips, legal rights, health resources, sex work safety",
  author = "Meetanescort",
  publishedTime,
  modifiedTime,
  schema,
  noindex = false,
  nofollow = false,
}) {
  const router = useRouter();
  const currentUrl = `https://meetanescort.info${router.asPath}`;

  // Primary keywords for the site
  const primaryKeywords = [
    "sex worker safety",
    "escort safety",
    "harm reduction",
    "safety tips for sex workers",
    "legal rights for sex workers",
    "health resources for escorts",
    "sex work safety guide",
    "escort safety protocols",
    "sex worker rights",
    "safety equipment for sex workers",
    "emergency contacts for escorts",
    "sex work legal advice",
    "health and wellness for sex workers",
    "safety planning for escorts",
    "risk assessment for sex work",
  ];

  // Default schema for organization
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Meetanescort",
    url: "https://meetanescort.info",
    logo: "https://meetanescort.info/images/logo.png",
    description: "Safety resources and education for sex workers",
    sameAs: [
      "https://twitter.com/meetanescort",
      "https://instagram.com/meetanescort",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@meetanescort.info",
      contactType: "customer service",
    },
  };

  const metaKeywords = keywords || primaryKeywords.join(", ");

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author} />
      <meta
        name="robots"
        content={`${noindex ? "noindex" : "index"}, ${
          nofollow ? "nofollow" : "follow"
        }`}
      />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={canonical || currentUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Meetanescort" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@meetanescort" />
      <meta name="twitter:creator" content="@meetanescort" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Article Specific */}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === "article" && (
        <meta property="article:author" content={author} />
      )}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema || defaultSchema),
        }}
      />
    </Head>
  );
}
