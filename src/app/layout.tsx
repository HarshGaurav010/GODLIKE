import type { Metadata } from "next";
import { Source_Sans_3, Barlow_Condensed } from "next/font/google";
import { LanguageProvider } from "@/components/content/LanguageProvider";
import { loadUi } from "@/content/loaders";
import { INTRO } from "@/components/motion/motion-config";
import "./globals.css";

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});
const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const brand = loadUi().brand.pirate;
export const metadata: Metadata = {
  title: { default: `${brand} · A pirate parody`, template: `%s · ${brand}` },
  description:
    "A hackathon pirate parody of IIT (ISM) Dhanbad. Not affiliated with the institute.",
  robots: { index: false, follow: false },
};

/**
 * Runs before first paint so the intro overlay never flashes for returning
 * visitors or anyone who prefers reduced motion.
 */
const introScript = `(function(){var d=document.documentElement;try{var seen=${INTRO.oncePerSession}&&sessionStorage.getItem(${JSON.stringify(INTRO.storageKey)});d.dataset.intro=seen||matchMedia("(prefers-reduced-motion: reduce)").matches?"skip":"playing"}catch(e){d.dataset.intro="skip"}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
