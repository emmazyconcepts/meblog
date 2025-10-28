import Head from "next/head";
import { AuthProvider } from "../contexts/AuthContext";
import "../styles/globals.css";
import { DefaultSeo } from "next-seo";

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* <Head>
        <meta
          name="description"
          content="Essential safety guides, legal rights information, and health resources for sex workers."
        />
        <meta
          property="og:image"
          content="https://meetanescortblog.vercel.app/logo.png"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <DefaultSeo
        openGraph={{
          type: "website",
          locale: "en_US",
          url: "https://meetanescort.info",
          site_name: "MeetAnEscort",
          title: "MeetAnEscort - Safety Resources for Sex Workers",
          description:
            "Essential safety guides, legal rights information, and health resources for sex workers.",
          images: [
            {
              url: "https://meetanescortblog.vercel.app/logo.png",
              width: 1200,
              height: 630,
              alt: "MeetAnEscort Logo",
            },
          ],
        }}
        twitter={{
          handle: "@meetanescort",
          site: "@meetanescort",
          cardType: "summary_large_image",
        }}
      />

      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
