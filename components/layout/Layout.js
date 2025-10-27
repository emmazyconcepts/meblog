import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { useRouter } from "next/router";

export default function Layout({ children, meta = {} }) {
  const router = useRouter();
  const currentUrl = `https://meetanescort.info${router.asPath}`;

  // Default meta with comprehensive SEO
  const defaultMeta = {
    title: "MeetAnEscort - Safety Resources & Education for Sex Workers",
    description:
      "Essential safety guides, legal rights information, and health resources for sex workers. Stay safe with expert advice, emergency contacts, and community support.",
    keywords:
      "sex worker safety, escort safety, harm reduction, safety tips, legal rights, health resources, emergency contacts, sex work safety guide",
    canonical: currentUrl,
    ogImage: "https://meetanescort.info/logo.png",
    ogType: "website",
    twitterCard: "summary_large_image",
    author: "MeetAnEscort",
    publishedTime: "",
    modifiedTime: "",
    noindex: false,
    nofollow: false,
    ...meta,
  };

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
    "client screening for sex workers",
    "sex work emergency protocols",
    "digital safety for escorts",
    "sex worker health resources",
    "escort business safety",
  ];

  // Default schema for organization
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MeetAnEscort",
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

  const metaKeywords = defaultMeta.keywords || primaryKeywords.join(", ");

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{defaultMeta.title}</title>
        <meta name="description" content={defaultMeta.description} />
        <meta name="keywords" content={metaKeywords} />
        <meta name="author" content={defaultMeta.author} />
        <meta
          name="robots"
          content={`${defaultMeta.noindex ? "noindex" : "index"}, ${
            defaultMeta.nofollow ? "nofollow" : "follow"
          }`}
        />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href={defaultMeta.canonical} />

        {/* Open Graph */}
        <meta property="og:title" content={defaultMeta.title} />
        <meta property="og:description" content={defaultMeta.description} />
        <meta property="og:image" content={defaultMeta.ogImage} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content={defaultMeta.ogType} />
        <meta property="og:site_name" content="MeetAnEscort" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content={defaultMeta.twitterCard} />
        <meta name="twitter:title" content={defaultMeta.title} />
        <meta name="twitter:description" content={defaultMeta.description} />
        <meta name="twitter:image" content={defaultMeta.ogImage} />
        <meta name="twitter:site" content="@meetanescort" />
        <meta name="twitter:creator" content="@meetanescort" />

        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />

        {/* Favicon */}
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
        {defaultMeta.publishedTime && (
          <meta
            property="article:published_time"
            content={defaultMeta.publishedTime}
          />
        )}
        {defaultMeta.modifiedTime && (
          <meta
            property="article:modified_time"
            content={defaultMeta.modifiedTime}
          />
        )}
        {defaultMeta.ogType === "article" && (
          <meta property="article:author" content={defaultMeta.author} />
        )}

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(defaultMeta.schema || defaultSchema),
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
        <Header />
        <main className="pt-20">{children}</main>
        <Footer />
      </div>
    </>
  );
}
