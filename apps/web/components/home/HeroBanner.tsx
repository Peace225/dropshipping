"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    badge: "Douceur Certifiée OEKO-TEX",
    title: "Le Cocon Parfait pour les Nuits de Bébé",
    subtitle: "Draps housse en bambou, coton bio et matelas respirants pour un sommeil paisible dès la naissance. Expédition rapide partout en France.",
    buttonText: "Créer son cocon",
    buttonLink: "/shop/bebe",
    badgeBg: "bg-[#E8C5C8] text-[#333333]",
    image: "/images/ber.jpg",
  },
  {
    id: 2,
    badge: "Puériculture Écoresponsable",
    title: "Équipements & Accessoires Bébé",
    subtitle: "Sélection haut de gamme certifiée OEKO-TEX, testée et approuvée par les parents en France.",
    buttonText: "Découvrir la collection",
    buttonLink: "/shop/bebe",
    badgeBg: "bg-[#6E857B] text-white",
    image: "/images/banner-1.jpg",
  },
  {
    id: 3,
    badge: "Indispensables du Quotidien",
    title: "L'Art du Change & du Confort Bébé",
    subtitle: "Des matières saines, imperméables et ultra-douces pensées pour protéger la peau délicate des tout-petits.",
    buttonText: "Découvrir les accessoires",
    buttonLink: "/shop/bebe",
    badgeBg: "bg-[#D4A396] text-white",
    image: "/images/bars.jpg",
  },
  {
    id: 4,
    badge: "Assistance IA Puériculture 24/7",
    title: "Votre Conseillère Bébé IA Personnalisée",
    subtitle: "Réponses instantanées pour choisir la bonne taille de matelas, de draps housse et d'accessoires pour votre bébé.",
    buttonText: "Tester l'IA gratuitement",
    buttonLink: "/ai-chat",
    badgeBg: "bg-[#333333] text-white",
    image: "/images/barr.jpg",
  },
  {
    id: 5,
    badge: "Livraison 24/48h France Métropolitaine",
    title: "Nouveautés Puériculture & Éveil",
    subtitle: "Livraison gratuite dès 89€ d'achats à Paris, Lyon, Marseille et toute la France.",
    buttonText: "Commander maintenant",
    buttonLink: "/shop/bebe",
    badgeBg: "bg-[#6E857B] text-white",
    image: "/images/banner-7.jpg",
  },
  {
    id: 6,
    badge: "Linge de Lit Bébé Confort",
    title: "Lots de Draps Housse & Alèses Imperméables",
    subtitle: "Des kits pratiques et respirants pensés pour accompagner toutes les nuits de votre bébé.",
    buttonText: "Voir la collection",
    buttonLink: "/shop/bebe",
    badgeBg: "bg-[#D4A396] text-white",
    image: "/images/banner-9.jpg",
  },
  {
    id: 7,
    badge: "Repas & Quotidien Serein",
    title: "Coussins de Chaise Haute & Accessoires",
    subtitle: "Tout le nécessaire pour installer bébé confortablement au quotidien et en toute sécurité.",
    buttonText: "Découvrir",
    buttonLink: "/shop/bebe",
    badgeBg: "bg-[#6E857B] text-white",
    image: "/images/banner-5.jpg",
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
      className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-3 sm:pt-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotions et actualités ECLOSIA"
    >
      <div className="relative overflow-hidden rounded-[18px] sm:rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#333333]/10 h-[360px] sm:h-[380px] md:h-[440px] flex items-center group">
        
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
              {/* L'image de fond - Optimisée pour le responsive */}
              <div 
                className="absolute inset-0 bg-cover bg-[75%_center] md:bg-center" 
                style={{ backgroundImage: `url(${slide.image})` }} 
              />

              {/* Le dégradé : Plein écran opaque sur mobile (bg-white/95) pour une lecture parfaite, s'efface sur grand écran */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/90 to-white/40 sm:to-transparent w-full sm:w-[85%] md:w-[65%]" />

              {/* Contenu textuel - Padding latéral renforcé sur mobile (px-11) pour ne jamais chevaucher les flèches */}
              <div className="w-full h-full flex flex-col items-start justify-center px-11 sm:px-16 md:px-20 z-20 max-w-full sm:max-w-xl md:max-w-2xl relative">
                
                <div className="flex items-center mb-2.5 sm:mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wider shadow-sm ${slide.badgeBg}`}>
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate max-w-[220px] sm:max-w-none">{slide.badge}</span>
                  </span>
                </div>

                <h2 className="text-[20px] sm:text-3xl md:text-[40px] font-extrabold text-[#333333] leading-[1.15] sm:leading-tight tracking-tight mb-2.5 sm:mb-4 text-balance">
                  {slide.title}
                </h2>

                <p className="text-[11px] sm:text-sm md:text-base font-medium text-[#333333]/80 line-clamp-3 mb-4 sm:mb-6 leading-relaxed max-w-[95%] sm:max-w-full">
                  {slide.subtitle}
                </p>

                <Link
                  href={slide.buttonLink}
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-[12px] sm:rounded-2xl bg-[#333333] hover:bg-black text-white font-bold text-[11px] sm:text-xs transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                >
                  <span>{slide.buttonText}</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>

              </div>
            </article>
          );
        })}

        {/* Boutons de navigation - Repositionnés et optimisés pour le touch mobile */}
        <button
          onClick={prevSlide}
          className="absolute left-1.5 sm:left-4 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 hover:bg-white text-[#333333] backdrop-blur-md shadow-md border border-[#333333]/10 transition-all active:scale-95 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Diapositive précédente"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-1.5 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 hover:bg-white text-[#333333] backdrop-blur-md shadow-md border border-[#333333]/10 transition-all active:scale-95 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Diapositive suivante"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Indicateurs de pagination (Petits points en bas) */}
        <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/60 shadow-sm">
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