import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AURAE — Maternal & Baby Wellness | Abidjan",
  description: "A secure, AI-powered maternal and baby wellness platform supporting mothers in Abidjan and worldwide with expert care, community, and curated essentials.",
  generator: "Next.js",
  applicationName: "AURAE",
  referrer: "origin-when-cross-origin",
  keywords: [
    "maternal wellness", 
    "baby care", 
    "AI wellness platform", 
    "mothers support", 
    "Abidjan", 
    "Côte d'Ivoire", 
    "santé maternelle", 
    "bien-être bébé"
  ],
  authors: [{ name: "AURAE Team", url: "https://aurae.app" }],
  creator: "AURAE",
  publisher: "AURAE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aurae.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "fr-FR": "/fr",
    },
  },
  openGraph: {
    title: "AURAE — Maternal & Baby Wellness",
    description: "A secure, AI-powered maternal and baby wellness platform supporting mothers with expert care, community, and curated essentials from Abidjan.",
    url: "https://aurae.app",
    siteName: "AURAE",
    images: [
      {
        url: "https://aurae.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AURAE Maternal & Baby Wellness",
      },
    ],
    locale: "fr_CI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURAE — Maternal & Baby Wellness",
    description: "AI-powered maternal and baby wellness platform supporting mothers with expert care, community, and curated essentials.",
    images: ["https://aurae.app/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
  },
  other: {
    "geo.region": "CI-AB",
    "geo.placename": "Abidjan",
    "geo.position": "5.3600;-4.0083",
    "ICBM": "5.3600, -4.0083",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} h-full bg-aurae-nude text-aurae-charcoal antialiased selection:bg-aurae-rose/30`}>
        <div id="app-root" className="min-h-full flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}