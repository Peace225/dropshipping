"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

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
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4 sm:pt-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotions et actualités ECLOSIA"
    >
      <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#333333]/10 h-[340px] sm:h-[380px] md:h-[440px] flex items-center group">
        
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <article
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* L'image de fond - Optimisée pour le responsive (focus sur la droite en mobile) */}
              <div 
                className="absolute inset-0 bg-cover bg-[75%_center] md:bg-center" 
                style={{ backgroundImage: `url(${slide.image})` }} 
              />

              {/* Le dégradé : w-full sur mobile pour assurer la lisibilité du texte, se réduit sur grand écran */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/20 sm:to-transparent w-full sm:w-[85%] md:w-[65%]" />

              {/* Contenu textuel - Marges internes ajustées (pl-10 pr-10) pour ne pas toucher les flèches sur mobile */}
              <div className="w-full h-full flex flex-col items-start justify-center pl-10 pr-10 sm:px-16 md:px-20 z-20 max-w-[100%] sm:max-w-xl md:max-w-2xl relative">
                
                <div className="flex items-center mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm ${slide.badgeBg}`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="line-clamp-1">{slide.badge}</span>
                  </span>
                </div>

                <h2 className="text-[22px] sm:text-3xl md:text-[40px] font-extrabold text-[#333333] leading-[1.15] sm:leading-tight tracking-tight mb-3 sm:mb-4 text-balance">
                  {slide.title}
                </h2>

                <p className="text-[12px] sm:text-sm md:text-base font-medium text-[#333333]/80 line-clamp-3 mb-5 sm:mb-6 leading-relaxed max-w-[95%] sm:max-w-full">
                  {slide.subtitle}
                </p>

                <Link
                  href={slide.buttonLink}
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-[14px] sm:rounded-2xl bg-[#333333] hover:bg-black text-white font-bold text-[11px] sm:text-xs transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                >
                  <span>{slide.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>

              </div>
            </article>
          );
        })}

        {/* Boutons de navigation - Discrets sur mobile, visibles au survol sur PC */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 z-30 p-2 sm:p-2.5 rounded-full bg-white/90 hover:bg-white text-[#333333] backdrop-blur-md shadow-sm border border-[#333333]/5 transition-all active:scale-95 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Diapositive précédente"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-white/90 hover:bg-white text-[#333333] backdrop-blur-md shadow-sm border border-[#333333]/5 transition-all active:scale-95 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Diapositive suivante"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Indicateurs de pagination (Petits points en bas) */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/50 shadow-sm">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-5 h-1.5 sm:w-6 sm:h-2 bg-[#333333]"
                  : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#333333]/30 hover:bg-[#333333]/60"
              }`}
              aria-label={`Aller à la diapositive ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}