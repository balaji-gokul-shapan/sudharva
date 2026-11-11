import "./globals.css";
import { Exo_2, Fraunces } from "next/font/google";
import LayoutChrome from "./components/LayoutChrome";
import Providers from "./providers";
import { SITE_URL } from "./seo";

const exo2 = Exo_2({
  variable: "--font-exo-2",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sudharva Marathon",
  description:
    "Join Sudharva Marathon in Chennai to run, support diabetes awareness, and build a healthier community.",
  openGraph: {
    title: "Sudharva Marathon",
    description:
      "Join Sudharva Marathon in Chennai to run, support diabetes awareness, and build a healthier community.",
    siteName: "Sudharva Marathon",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/image/cta/hero-banner.png",
        width: 1280,
        height: 720,
        alt: "Runners taking part in Sudharva Marathon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sudharva Marathon",
    description:
      "Join Sudharva Marathon in Chennai to run, support diabetes awareness, and build a healthier community.",
    images: ["/image/cta/hero-banner.png"],
  },
  icons: {
    icon: [
      {
        url: "/icon",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
    shortcut: "/icon",
    apple: "/apple-icon",
  },
};

const organizationJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Sudharva Marathon",
  url: SITE_URL,
  logo: `${SITE_URL}/image/cta/logo.png`,
  email: "sudharvarun@yahoo.com",
}).replace(/</g, "\\u003c");

const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||((!t||t==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
const preloaderInitScript = `(function(){try{var k="sudharva:hero-preloader-seen:v1";var s=sessionStorage.getItem(k)==="1";document.documentElement.setAttribute("data-hero-preloader",s?"seen":"new");}catch(e){document.documentElement.setAttribute("data-hero-preloader","new");}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${exo2.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: preloaderInitScript }} />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-accent selection:text-accent-foreground"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
        />
        <Providers>
          <a
            href="#main-content"
            suppressHydrationWarning
            className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:not-sr-only focus:rounded-md focus:bg-background focus:px-4 focus:py-3 focus:text-foreground focus:shadow-lg"
          >
            Skip to main content
          </a>
          <LayoutChrome>{children}</LayoutChrome>
        </Providers>
      </body>
    </html>
  );
}
