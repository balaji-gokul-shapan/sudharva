import "./globals.css";
import { Exo_2, Fraunces } from "next/font/google";
import LayoutChrome from "./components/LayoutChrome";
import Providers from "./providers";

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
  title: "Sudharva Marathon",
  description:
    "Join Sudharva Marathon and take a stride for health, the environment, and education.",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

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
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased selection:bg-accent selection:text-accent-foreground">
        <Providers>
          <a
            href="#main-content"
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

