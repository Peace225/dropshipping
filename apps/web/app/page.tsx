export const dynamic = "force-dynamic";
export const revalidate = 0;
import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, ShoppingBag, ArrowRight } from "lucide-react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { MaternityCareSection } from "@/components/home/MaternityCareSection";
import { BabyCareSection } from "@/components/home/BabyCareSection";
import HomeComponent from "@/components/home/HomeComponent";

export const metadata = {
  title: "ECLOSIA | Maternité, Puériculture & Bien-être Maman & Bébé",
  description: "Plateforme d'excellence dédiée à la maternité et à la puériculture basée à Paris. Retrouvez nos essentiels, notre conseillère IA et des produits sélectionnés avec soin pour maman et bébé.",
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ECLOSIA",
    "image": "https://eclosia.app/og-image.jpg",
    "@id": "https://eclosia.app",
    "url": "https://eclosia.app",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Paris",
      "addressRegion": "Île-de-France",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.8566,
      "longitude": 2.3522
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
    "description": "Plateforme e-commerce spécialisée dans la maternité et le bien-être de bébé, offrant des articles de puériculture d'excellence et un accompagnement sur mesure depuis Paris, France."
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