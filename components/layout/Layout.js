import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children, meta = {} }) {
  const defaultMeta = {
    title: "MeetAnEscort - Safety Resources for Sex Workers",
    description:
      "Educational resources and safety guides for sex workers. Empowering through knowledge and community support.",
    keywords:
      "sex worker safety, escort resources, safety tips, community support",
    ...meta,
  };

  return (
    <>
      <Head>
        <title>{defaultMeta.title}</title>
        <meta name="description" content={defaultMeta.description} />
        <meta name="keywords" content={defaultMeta.keywords} />
        <meta property="og:title" content={defaultMeta.title} />
        <meta property="og:description" content={defaultMeta.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={defaultMeta.title} />
        <meta name="twitter:description" content={defaultMeta.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
        <Header />
        <main className="pt-20">{children}</main>
        <Footer />
      </div>
    </>
  );
}
