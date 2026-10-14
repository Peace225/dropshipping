import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "../styles/globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/context/cart-context";
import AiChatDrawer from "@/components/ai/ai-chat-drawer";
import { ConditionalAiChat } from "@/components/ai/conditional-ai-chat";
import OneSignalECLOSIA from "@/components/OneSignalECLOSIA";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = "https://eclosia.shop";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF7F2",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ECLOSIA — Bien-être Maternité & Bébé | France",
  description:
    "Plateforme intelligente de santé maternelle et de puériculture en France. Accompagnement par IA, soins experts, communauté et essentiels pour mamans et bébés.",
  generator: "Next.js",
  applicationName: "ECLOSIA",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
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
  authors: [{ name: "ECLOSIA Team", url: siteUrl }],
  creator: "ECLOSIA",
  publisher: "ECLOSIA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "ECLOSIA — Bien-être Maternité & Bébé",
    description:
      "La référence du bien-être maternel et infantile en France. Soins experts, accompagnement intelligent et essentiels pour bébés et mamans.",
    url: siteUrl,
    siteName: "ECLOSIA",
    images: [
      {
        url: "/og-image.jpg",
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
    description:
      "Plateforme de santé maternelle et puériculture assistée par IA en France.",
    images: ["/twitter-image.jpg"],
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
  other: {
    "geo.region": "FR",
    "geo.placename": "France",
    "geo.position": "46.227638;2.213749",
    ICBM: "46.227638, 2.213749",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <body
        className={`${inter.className} h-full bg-aurae-nude text-aurae-charcoal antialiased selection:bg-aurae-rose/30`}
      >
        {/* Meta Pixel Code */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1079327448061757');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1079327448061757&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        <OneSignalECLOSIA />
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