import Head from "next/head";
import { AuthProvider } from "../contexts/AuthContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Essential safety guides, legal rights information, and health resources for sex workers."
        />
        <meta
          property="og:image"
          content="https://meetanescortblog.vercel.app/logo.png"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
