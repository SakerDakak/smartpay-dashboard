import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";

// Initialize fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Head>
          <title>لوحة تحكم سمارت باي</title>
          <meta name="description" content="لوحة تحكم سمارت باي" />
          <link rel="icon" href="/favicon.ico" />
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="direction" content="rtl" />
        </Head>
        <div
          dir="rtl"
          className={`
            ${geistSans.variable} 
            ${geistMono.variable} 
            bg-grey-50 dark:bg-grey-900 
            text-grey-900 dark:text-white
            antialiased 
            min-h-screen
            rtl
          `}
        >
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
