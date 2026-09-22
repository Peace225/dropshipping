import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/context/cart-context";
import AiChatDrawer from "@/components/ai/ai-chat-drawer";
import { ConditionalAiChat } from "@/components/ai/conditional-ai-chat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ECLOSIA — Bien-être Maternité & Bébé | France",
  description: "Plateforme intelligente de santé maternelle et de puériculture en France. Accompagnement par IA, soins experts, communauté et essentiels pour mamans et bébés.",
  generator: "Next.js",
  applicationName: "ECLOSIA",
  referrer: "origin-when-cross-origin",
  
  // 👉 Configuration de votre logo personnalisé dans l'onglet
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" }
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  keywords: [
    "santé maternelle France",
    "bien-être bébé",
    "produits maman et bébé",
    "puériculture en ligne",
    "conseillère IA maternité",
    "maternité et post-partum",
    "coffret maternité",
    "ECLOSIA",
  ],
  authors: [{ name: "ECLOSIA Team", url: "https://eclosia.app" }],
  creator: "ECLOSIA",
  publisher: "ECLOSIA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://eclosia.app"),
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "ECLOSIA — Bien-être Maternité & Bébé",
    description: "La référence du bien-être maternel et infantile en France. Soins experts, accompagnement intelligent et essentiels pour bébés et mamans.",
    url: "https://eclosia.app",
    siteName: "ECLOSIA",
    images: [
      {
        url: "https://eclosia.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ECLOSIA Bien-être Maternité & Bébé France",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ECLOSIA — Bien-être Maternité & Bébé",
    description: "Plateforme de santé maternelle et puériculture assistée par IA en France.",
    images: ["https://eclosia.app/twitter-image.jpg"],
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
    "geo.region": "FR",
    "geo.placename": "France",
    "geo.position": "46.227638;2.213749",
    "ICBM": "46.227638, 2.213749",
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
        <CartProvider>
          <div id="app-root" className="min-h-full flex flex-col relative">
            <Header />
            
            <main className="flex-1">{children}</main>
            
            <Footer />
            
            <ConditionalAiChat>
              <AiChatDrawer />
            </ConditionalAiChat>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}