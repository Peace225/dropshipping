"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

// 8 Bannières avec des images distinctes (slide-1 à slide-8)
const SLIDES = [
  {
    id: 1,
    badge: "Offre Spéciale Naissance - France",
    title: "Coffrets Maternité & Naissance Premium",
    subtitle: "Jusqu'à -30% sur les soins bio et accessoires. Expédition rapide partout en France.",
    buttonText: "Profiter de l'offre",
    buttonLink: "/shop/coffrets",
    bgColor: "from-[#F5EBE6] via-[#E8C5C8]/40 to-[#F5EBE6]",
    badgeBg: "bg-[#E8C5C8] text-[#333333]",
    image: "/images/slide-1.jpg",
    altText: "Coffret Maternité Premium AURAE - Soins bio fabriqués en France",
  },
  {
    id: 2,
    badge: "Puériculture Écoresponsable",
    title: "Équipements Bébé & Portage Ergonomique",
    subtitle: "Sélection haut de gamme testée et approuvée par les mamans en France et en Europe.",
    buttonText: "Découvrir la collection",
    buttonLink: "/shop/puericulture",
    bgColor: "from-[#6E857B]/20 via-[#6E857B]/30 to-[#F5EBE6]",
    badgeBg: "bg-[#6E857B] text-white",
    image: "/images/slide-2.png",
    altText: "Équipements de puériculture et portage ergonomique AURAE France",
  },
  {
    id: 3,
    badge: "Clean Beauty & Post-Partum",
    title: "Soins Naturels Visage & Corps Post-Partum",
    subtitle: "Formules 100% naturelles adaptées à l'allaitement. Fabriqué selon les normes strictes françaises.",
    buttonText: "Voir la gamme de soins",
    buttonLink: "/shop/soins",
    bgColor: "from-[#F5EBE6] via-[#D4A396]/20 to-[#E8C5C8]/30",
    badgeBg: "bg-[#D4A396] text-white",
    image: "/images/slide-3.png",
    altText: "Soins cosmétiques naturels post-partum AURAE Paris France",
  },
  {
    id: 4,
    badge: "Assistance IA Maternité 24/7",
    title: "Votre Conseillère Maternité IA Personnalisée",
    subtitle: "Réponses instantanées sur votre santé, l'allaitement et le bien-être de votre bébé.",
    buttonText: "Tester l'IA gratuitement",
    buttonLink: "/ai-chat",
    bgColor: "from-[#6E857B]/30 via-[#F5EBE6] to-[#E8C5C8]/40",
    badgeBg: "bg-[#333333] text-white",
    image: "/images/slide-4.png",
    altText: "Assistant virtuel et conseils maternité IA AURAE France",
  },
  {
    id: 5,
    badge: "Livraison 24/48h France Métropolitaine",
    title: "Nouveautés Puériculture & Jouets d'Éveil",
    subtitle: "Livraison gratuite dès 60€ d'achats à Paris, Lyon, Marseille et toute la France.",
    buttonText: "Commander maintenant",
    buttonLink: "/shop",
    bgColor: "from-[#E8C5C8]/50 via-[#F5EBE6] to-[#6E857B]/20",
    badgeBg: "bg-[#6E857B] text-white",
    image: "/images/slide-5.jpg",
    altText: "Jouets d'éveil et puériculture livraison express France",
  },
  {
    id: 6,
    badge: "Mode Maternité Confort",
    title: "Vêtements de Grossesse & Allaitement",
    subtitle: "Des tenues élégantes et pratiques pensées pour vous accompagner tout au long de votre maternité.",
    buttonText: "Voir la collection",
    buttonLink: "/shop/vetements",
    bgColor: "from-[#F5EBE6] via-[#D4A396]/30 to-[#F5EBE6]",
    badgeBg: "bg-[#D4A396] text-white",
    image: "/images/slide-6.png",
    altText: "Vêtements de maternité et grossesse AURAE France",
  },
  {
    id: 7,
    badge: "Allaitement Serein",
    title: "Accessoires & Coussins d'Allaitement Bio",
    subtitle: "Tout le nécessaire pour un allaitement confortable, naturel et en toute sérénité.",
    buttonText: "Découvrir",
    buttonLink: "/shop/allaitement",
    bgColor: "from-[#6E857B]/25 via-[#F5EBE6] to-[#E8C5C8]/30",
    badgeBg: "bg-[#6E857B] text-white",
    image: "/images/slide-7.jpg",
    altText: "Accessoires d'allaitement et coussins bio AURAE",
  },
  {
    id: 8,
    badge: "Chambre Bébé",
    title: "Décoration & Mobilier Douillet",
    subtitle: "Créez un véritable cocon de douceur et de sécurité pour les premières nuits de votre bébé.",
    buttonText: "Aménager la chambre",
    buttonLink: "/shop/chambre",
    bgColor: "from-[#E8C5C8]/30 via-[#F5EBE6] to-[#D4A396]/20",
    badgeBg: "bg-[#333333] text-white",
    image: "/images/slide-8.jpg",
    altText: "Décoration et mobilier chambre bébé AURAE",
  },
];

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % SLIDES.length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "Bannières & Offres Maternité AURAE France",
    "areaServed": { "@type": "Country", "name": "France" },
    "provider": { "@type": "Organization", "name": "AURAE", "url": "https://aurae.app" },
    "itemListElement": SLIDES.map((slide, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Offer",
        "name": slide.title,
        "description": slide.subtitle,
        "url": `https://aurae.app${slide.buttonLink}`,
        "areaServed": "FR"
      }
    }))
  };

  return (
    <section 
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotions et actualités AURAE"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative overflow-hidden rounded-2xl shadow-lg border border-[#333333]/10 h-[280px] sm:h-[340px] md:h-[400px] flex items-center">
        
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <article
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center bg-gradient-to-r ${slide.bgColor} ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className="w-full h-full flex flex-row items-center justify-between px-6 sm:px-10 md:px-16">
                
                {/* Bloc Texte à gauche */}
                <div className="w-[55%] sm:w-[50%] flex flex-col items-start justify-center gap-2 md:gap-4 z-20 py-2">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-sm ${slide.badgeBg}`}>
                      <Sparkles className="w-2 h-2 md:w-3 md:h-3" />
                      <span className="truncate max-w-[110px] sm:max-w-none">{slide.badge}</span>
                    </span>
                  </div>

                  <h2 className="text-[15px] sm:text-2xl md:text-4xl lg:text-[40px] font-extrabold font-sans text-[#333333] leading-[1.15] tracking-tight">
                    {slide.title}
                  </h2>

                  <p className="text-[10px] sm:text-xs md:text-sm font-medium text-[#333333]/90 line-clamp-2 sm:line-clamp-none leading-snug">
                    {slide.subtitle}
                  </p>

                  <Link
                    href={slide.buttonLink}
                    className="mt-1 md:mt-2 inline-flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-[#333333] hover:bg-black text-white font-bold text-[9px] sm:text-xs md:text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                  >
                    <span>{slide.buttonText}</span>
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                  </Link>
                </div>

                {/* Bloc Image à droite (entièrement visible grâce à object-contain) */}
                <div className="w-[42%] sm:w-[45%] h-[80%] flex justify-center items-center relative z-10">
                  <div className="relative w-full h-full">
                    <Image
                      src={slide.image}
                      alt={slide.altText}
                      fill
                      sizes="(max-width: 768px) 45vw, 40vw"
                      className="object-contain object-right"
                      priority={index === 0}
                    />
                  </div>
                </div>

              </div>
            </article>
          );
        })}

        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 z-30 p-1.5 md:p-2.5 rounded-full bg-white/80 hover:bg-white text-[#333333] backdrop-blur-sm shadow-md transition-all active:scale-95"
          aria-label="Diapositive précédente"
        >
          <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 z-30 p-1.5 md:p-2.5 rounded-full bg-white/80 hover:bg-white text-[#333333] backdrop-blur-sm shadow-md transition-all active:scale-95"
          aria-label="Diapositive suivante"
        >
          <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
        </button>

        <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 md:gap-2 bg-white/50 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-white/40">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-4 h-1.5 md:w-8 md:h-2.5 bg-[#333333]"
                  : "w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-[#333333]/30 hover:bg-[#333333]/60"
              }`}
              aria-label={`Aller à la diapositive ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}