export const dynamic = "force-dynamic";
export const revalidate = 0;
import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, ShoppingBag, ArrowRight } from "lucide-react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { MaternityCareSection } from "@/components/home/MaternityCareSection";
import { BabyCareSection } from "@/components/home/BabyCareSection";
import HomeComponent from "@/components/home/HomeComponent";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "AURAE",
    "image": "https://aurae.app/og-image.jpg",
    "@id": "https://aurae.app",
    "url": "https://aurae.app",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Abidjan",
      "addressRegion": "Abidjan Autonomous District",
      "addressCountry": "CI"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 5.3600,
      "longitude": -4.0083
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
      "https://facebook.com/aurae",
      "https://instagram.com/aurae"
    ],
    "priceRange": "$$",
    "description": "Secure, AI-powered maternal and baby wellness platform supporting mothers in Abidjan and Côte d'Ivoire with expert care, community, and curated essentials."
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

        {/* Section Soins Maman & Grossesse */}
        <MaternityCareSection />

        {/* Section Soins & Cocon de Bébé */}
        <BabyCareSection />

        <HomeComponent />

      </main>
    </>
  );
}