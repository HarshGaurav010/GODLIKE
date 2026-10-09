import type { Metadata } from "next";
import { Source_Sans_3, Barlow_Condensed } from "next/font/google";
import { LanguageProvider } from "@/components/content/LanguageProvider";
import { loadUi } from "@/content/loaders";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
