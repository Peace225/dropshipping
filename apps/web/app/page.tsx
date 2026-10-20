export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, ShoppingBag, ArrowRight } from "lucide-react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BabyCareSection } from "@/components/home/BabyCareSection";

export const metadata = {
  title: "ECLOSIA — Puériculture & Bébé | France",
  description: "Plateforme d'excellence dédiée à la puériculture et au sommeil de bébé. Retrouvez nos essentiels certifiés OEKO-TEX et sélectionnés avec soin.",
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ECLOSIA",
    "image": "https://eclosia.shop/og-image.jpg",
    "@id": "https://eclosia.shop",
    "url": "https://eclosia.shop",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "22 rue de la gerbe d'or",
      "postalCode": "95490",
      "addressLocality": "Vauréal",
      "addressRegion": "Île-de-France",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 49.0333,
      "longitude": 2.0333
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://facebook.com/eclosia",
      "https://instagram.com/eclosia"
    ],
    "priceRange": "$$",
    "description": "Plateforme e-commerce spécialisée dans la puériculture, offrant des articles de literie et accessoires d'excellence pour bébé."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 flex flex-col">
        
        {/* Carrousel des bannières */}
        <HeroBanner />

        {/* Grille des produits phares / indispensables */}
        <FeaturedProducts />

        {/* Section Soins & Cocon de Bébé */}
        <BabyCareSection />

      </main>
    </>
  );
}