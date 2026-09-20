"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

// 8 Bannières avec des images en arrière-plan (backgroundImage)
const SLIDES = [
  {
    id: 1,
    badge: "Offre Spéciale Naissance - France",
    title: "Coffrets Maternité & Naissance Premium",
    subtitle: "Jusqu'à -30% sur les soins bio et accessoires. Expédition rapide partout en France.",
    buttonText: "Profiter de l'offre",
    buttonLink: "/shop/coffrets",
    badgeBg: "bg-[#E8C5C8] text-[#333333]",
    image: "/images/banner.jpg",
  },
  {
    id: 2,
    badge: "Puériculture Écoresponsable",
    title: "Équipements Bébé & Portage Ergonomique",
    subtitle: "Sélection haut de gamme testée et approuvée par les mamans en France et en Europe.",
    buttonText: "Découvrir la collection",
    buttonLink: "/shop/puericulture",
    badgeBg: "bg-[#6E857B] text-white",
    image: "/images/banner-1.jpg",
  },
  {
    id: 3,
    badge: "Clean Beauty & Post-Partum",
    title: "Soins Naturels Visage & Corps Post-Partum",
    subtitle: "Formules 100% naturelles adaptées à l'allaitement. Fabriqué selon les normes strictes françaises.",
    buttonText: "Voir la gamme de soins",
    buttonLink: "/shop/soins",
    badgeBg: "bg-[#D4A396] text-white",
    image: "/images/banner-3.jpg",
  },
  {
    id: 4,
    badge: "Assistance IA Maternité 24/7",
    title: "Votre Conseillère Maternité IA Personnalisée",
    subtitle: "Réponses instantanées sur votre santé, l'allaitement et le bien-être de votre bébé.",
    buttonText: "Tester l'IA gratuitement",
    buttonLink: "/ai-chat",
    badgeBg: "bg-[#333333] text-white",
    image: "/images/banner-2.jpg",
  },
  {
    id: 5,
    badge: "Livraison 24/48h France Métropolitaine",
    title: "Nouveautés Puériculture & Jouets d'Éveil",
    subtitle: "Livraison gratuite dès 60€ d'achats à Paris, Lyon, Marseille et toute la France.",
    buttonText: "Commander maintenant",
    buttonLink: "/shop",
    badgeBg: "bg-[#6E857B] text-white",
    image: "/images/banner-7.jpg",
  },
  {
    id: 6,
    badge: "Mode Maternité Confort",
    title: "Vêtements de Grossesse & Allaitement",
    subtitle: "Des tenues élégantes et pratiques pensées pour vous accompagner tout au long de votre maternité.",
    buttonText: "Voir la collection",
    buttonLink: "/shop/vetements",
    badgeBg: "bg-[#D4A396] text-white",
    image: "/images/banner-9.jpg",
  },
  {
    id: 7,
    badge: "Allaitement Serein",
    title: "Accessoires & Coussins d'Allaitement Bio",
    subtitle: "Tout le nécessaire pour un allaitement confortable, naturel et en toute sérénité.",
    buttonText: "Découvrir",
    buttonLink: "/shop/allaitement",
    badgeBg: "bg-[#6E857B] text-white",
    image: "/images/banner-5.jpg",
  },
  {
    id: 8,
    badge: "Chambre Bébé",
    title: "Décoration & Mobilier Douillet",
    subtitle: "Créez un véritable cocon de douceur et de sécurité pour les premières nuits de votre bébé.",
    buttonText: "Aménager la chambre",
    buttonLink: "/shop/chambre",
    badgeBg: "bg-[#333333] text-white",
    image: "/images/banner-8.jpg",
  },
];

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % SLIDES.length);

  return (
    <section 
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotions et actualités AURAE"
    >
      <div className="relative overflow-hidden rounded-2xl shadow-lg border border-[#333333]/10 h-[280px] sm:h-[340px] md:h-[400px] flex items-center">
        
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <article
              key={slide.id}
              aria-hidden={!isActive}
              style={{ backgroundImage: `url(${slide.image})` }}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out flex items-center ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Overlay léger pour garantir une lisibilité parfaite du texte par-dessus l'image de fond */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:w-[75%] md:w-[65%]" />

              <div className="w-full h-full flex flex-col items-start justify-center px-6 sm:px-10 md:px-16 z-20 max-w-xl">
                
                <div className="flex items-center mb-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm ${slide.badgeBg}`}>
                    <Sparkles className="w-3 h-3" />
                    <span>{slide.badge}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold font-sans text-[#333333] leading-tight tracking-tight mb-2">
                  {slide.title}
                </h2>

                <p className="text-xs sm:text-sm md:text-base font-medium text-[#333333]/85 line-clamp-2 sm:line-clamp-none mb-4 leading-relaxed">
                  {slide.subtitle}
                </p>

                <Link
                  href={slide.buttonLink}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#333333] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                >
                  <span>{slide.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

              </div>
            </article>
          );
        })}

        {/* Boutons de navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-3 z-30 p-2 rounded-full bg-white/80 hover:bg-white text-[#333333] backdrop-blur-sm shadow-md transition-all active:scale-95"
          aria-label="Diapositive précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 z-30 p-2 rounded-full bg-white/80 hover:bg-white text-[#333333] backdrop-blur-sm shadow-md transition-all active:scale-95"
          aria-label="Diapositive suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicateurs de pagination */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-6 h-2 bg-[#333333]"
                  : "w-2 h-2 bg-[#333333]/30 hover:bg-[#333333]/60"
              }`}
              aria-label={`Aller à la diapositive ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}