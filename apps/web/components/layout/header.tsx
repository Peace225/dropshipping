"use client"; // Indique que le composant est interactif et utilise des hooks

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, User, HelpCircle, Users, Sparkles, ShieldCheck, Truck, Percent } from "lucide-react";
import { useCart } from "@/context/cart-context"; // 1. Importation du hook du panier

export function Header() {
  const { totalItems } = useCart(); // 2. Récupération du nombre total d'articles

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AURAE",
    "url": "https://aurae.app",
    "logo": "https://aurae.app/og-image.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Paris",
      "addressRegion": "Île-de-France",
      "addressCountry": "FR"
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "France"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="sticky top-0 z-50 w-full shadow-md transition-all duration-300">
        
        {/* TopHeader Premium XXL */}
        <div className="bg-[#6E857B] text-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            
            {/* Annonce / Offre principale */}
            <div className="flex items-center justify-center sm:justify-start gap-2 font-medium tracking-wide">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8C5C8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#E8C5C8]" />
              <span>Bien-être Maternel & Puériculture d'Excellence - Livraison offerte dès 60€ d'achats en France</span>
            </div>

            {/* Liens secondaires du TopHeader */}
            <div className="flex items-center gap-6 text-[11px] font-medium text-white/90">
              <div className="flex items-center gap-1.5 hover:text-[#E8C5C8] transition-colors cursor-pointer">
                <Truck className="w-3.5 h-3.5 text-[#E8C5C8]" />
                <span>Suivi de commande</span>
              </div>
              <div className="hidden md:flex items-center gap-1.5 hover:text-[#E8C5C8] transition-colors cursor-pointer">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E8C5C8]" />
                <span>Garantie Sécurité & Authenticité</span>
              </div>
              <Link href="/shop" className="hidden lg:flex items-center gap-1 text-[#E8C5C8] hover:underline font-semibold">
                <Percent className="w-3 h-3" />
                <span>Offres du mois</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Main Header */}
        <div className="bg-[#F5EBE6]/95 backdrop-blur-md border-b border-[#333333]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
            
            {/* Logo avec Image et Texte */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group py-2" title="AURAE France - Bien-être & Puériculture">
                <div className="relative w-14 h-14 overflow-hidden rounded-full shadow-sm border border-[#6E857B]/20 transition-transform duration-300 group-hover:scale-105 bg-white flex items-center justify-center">
                    <Image
                        src="/images/logo.png"
                        alt="AURAE Logo"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        priority
                    />
                </div>
              <div className="flex flex-col transition-transform duration-300 group-hover:translate-x-0.5">
                <span className="text-2xl font-bold tracking-widest text-[#333333] font-serif leading-none">
                  AURAE
                </span>
                <span className="text-[9px] font-medium tracking-wider uppercase text-[#6E857B] transition-colors group-hover:text-[#D4A396] mt-1">
                  Maternité & Puériculture
                </span>
              </div>
            </Link>

            {/* Barre de recherche intelligente avec effet d'élévation */}
            <div className="flex-1 max-w-xl mx-2">
              <div className="relative flex items-center group">
                <span className="absolute left-3.5 text-[#333333]/50 transition-colors group-focus-within:text-[#6E857B]">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Rechercher un produit, une marque, un conseil..."
                  className="w-full pl-10 pr-28 py-2.5 bg-white/80 border border-[#333333]/10 rounded-full text-sm text-[#333333] placeholder-[#333333]/40 focus:outline-none focus:ring-2 focus:ring-[#6E857B] focus:bg-white transition-all duration-300 shadow-inner hover:border-[#6E857B]/40"
                />
                <button className="absolute right-1 px-4 py-1.5 bg-[#6E857B] hover:bg-[#5b7067] text-white text-xs font-semibold rounded-full transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95">
                  Rechercher
                </button>
              </div>
            </div>

            {/* Actions & Navigation avec animations de survol fluides */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              
              {/* Bouton Se connecter */}
              <Link
                href="/auth/connexion"
                className="flex items-center gap-1.5 text-xs font-medium text-[#333333] hover:text-[#6E857B] transition-all duration-200 px-3.5 py-2 rounded-full hover:bg-white/80 hover:shadow-sm hover:-translate-y-0.5"
              >
                <User className="w-4 h-4 text-[#333333]" />
                <span className="hidden sm:inline">Se connecter</span>
              </Link>

              {/* Bouton Communauté */}
              <Link
                href="/community"
                className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-[#333333] hover:text-[#6E857B] transition-all duration-200 px-3.5 py-2 rounded-full hover:bg-white/80 hover:shadow-sm hover:-translate-y-0.5"
              >
                <Users className="w-4 h-4 text-[#6E857B] transition-transform duration-300 hover:scale-110" />
                <span>Communauté</span>
              </Link>

              {/* Bouton Aide */}
              <button className="flex items-center gap-1.5 text-xs font-medium text-[#333333] hover:text-[#6E857B] transition-all duration-200 px-3 py-2 rounded-full hover:bg-white/80 hover:shadow-sm hover:-translate-y-0.5">
                <HelpCircle className="w-4 h-4 text-[#6E857B]" />
                <span className="hidden sm:inline">Aide</span>
              </button>

              {/* Panier Premium en Vert Sauge */}
              <Link
                href="/cart"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#6E857B] text-white hover:bg-[#5b7067] transition-all duration-300 relative shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                aria-label="Panier"
              >
                <ShoppingBag className="w-4 h-4 text-white transition-transform duration-300 hover:rotate-12" />
                <span className="text-xs font-medium hidden md:inline">Panier</span>
                {/* 3. Affichage dynamique du nombre total d'articles */}
                <span className="w-4 h-4 rounded-full bg-white text-[#6E857B] text-[10px] flex items-center justify-center font-bold shadow-inner">
                  {totalItems}
                </span>
              </Link>

            </div>
          </div>
        </div>
      </header>
    </>
  );
}