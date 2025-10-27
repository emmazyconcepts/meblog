import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { useRouter } from "next/router";

export default function Layout({ children, meta = {} }) {
  const router = useRouter();
  const currentUrl = `https://meetanescort.info${router.asPath}`;

  // Default meta with comprehensive SEO
  const defaultMeta = {
    title: "MeetAnEscort - Blog, Safety Resources & Education for Sex Workers",
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
        <title>
          MeetAnEscort - Blog, Safety Resources & Education for Sex Workers
        </title>
        <meta
          name="title"
          content="MeetAnEscort - Blog, Safety Resources & Education for Sex Workers"
        />
        <meta
          name="description"
          content="Essential safety guides, legal rights information, and health resources for sex workers. Stay safe with expert advice, emergency contacts, and community support."
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://meetanescortblog.vercel.app/"
        />
        <meta
          property="og:title"
          content="MeetAnEscort - Blog, Safety Resources & Education for Sex Workers"
        />
        <meta
          property="og:description"
          content="Essential safety guides, legal rights information, and health resources for sex workers. Stay safe with expert advice, emergency contacts, and community support."
        />
        <meta
          property="og:image"
          content="https://metatags.io/images/meta-tags.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://meetanescortblog.vercel.app/"
        />
        <meta
          property="twitter:title"
          content="MeetAnEscort - Blog, Safety Resources & Education for Sex Workers"
        />
        <meta
          property="twitter:description"
          content="Essential safety guides, legal rights information, and health resources for sex workers. Stay safe with expert advice, emergency contacts, and community support."
        />
        <meta
          property="twitter:image"
          content="https://metatags.io/images/meta-tags.png"
        />

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
