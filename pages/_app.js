import Head from "next/head";
import { AuthProvider } from "../contexts/AuthContext";
import "../styles/globals.css";

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

      <Head>
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="MeetAnEscort - Blog, Safety Resources & Education for Sex Workers"
        />
        <meta
          property="og:description"
          content="Essential safety guides, legal rights information, and health resources for sex workers."
        />
        <meta
          property="og:image"
          content="https://meetanescortblog.vercel.app/logo.png"
        />
        <meta property="og:url" content="https://meetanescort.info" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MeetAnEscort" />
        <meta
          name="twitter:description"
          content="Safety resources and education for sex workers."
        />
        <meta
          name="twitter:image"
          content="https://meetanescortblog.vercel.app/logo.png"
        />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
