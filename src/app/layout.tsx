import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Inter } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";
import "./globals.css";

/* Three roles, no more. A heavy grotesk shouts every headline, a neutral one
   carries prose so it does not compete, and mono carries anything that is a
   quantity or an address. */
const display = Archivo({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE.domain}`),
  title: {
    default: `${SITE.wordmark} · open a coin for any TikTok`,
    template: `%s · ${SITE.wordmark}`,
  },
  description: SITE.tagline,
  openGraph: {
    title: `${SITE.wordmark} · open a coin for any TikTok`,
    description: SITE.tagline,
    siteName: SITE.wordmark,
    type: "website",
  },
  twitter: { card: "summary_large_image", creator: SITE.handle },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
