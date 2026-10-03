'use client'

import Link from "next/link";
import { Heart, MapPin } from "lucide-react";

export function Footer() {
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
      "addressLocality": "France",
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
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "$$",
    "description": "Plateforme sécurisée de bien-être maternel et infantile propulsée par l'IA, soutenant les mamans en France."
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <footer className="bg-[#333333] text-[#F5EBE6] pt-10 sm:pt-16 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grille : 1 col (mobile), 2 cols (tablette), 4 cols (PC) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10 sm:mb-12">
            
            {/* Colonne 1 : À propos avec Logo Image & Texte */}
            <div className="space-y-3 sm:space-y-4">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <img 
                  src="/images/logo.png" 
                  alt="ECLOSIA Logo" 
                  className="h-7 sm:h-8 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-xl sm:text-2xl font-bold font-serif tracking-wider text-white">ECLOSIA</span>
              </Link>
              <p className="text-[13px] sm:text-sm text-[#F5EBE6]/70 leading-relaxed">
                Plateforme sécurisée de bien-être maternel et infantile, accompagnant les mamans avec des soins experts, une communauté bienveillante et des essentiels rigoureusement sélectionnés.
              </p>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#F5EBE6]/60">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6E857B]" />
                <span>Basé à Paris, France</span>
              </div>
            </div>

            {/* Colonne 2 : Navigation rapide */}
            <div>
              <h4 className="text-[13px] sm:text-sm font-semibold uppercase tracking-wider text-white mb-3 sm:mb-4">Navigation</h4>
              <ul className="space-y-1 sm:space-y-2.5 text-[13px] sm:text-sm text-[#F5EBE6]/70">
                <li><Link href="/shop" className="block py-1 hover:text-[#6E857B] transition-colors">Boutique & Essentiels</Link></li>
                <li><Link href="/ai-chat" className="block py-1 hover:text-[#6E857B] transition-colors">Conseillère IA</Link></li>
                <li><Link href="/community" className="block py-1 hover:text-[#6E857B] transition-colors">Communauté Maternité</Link></li>
                <li><Link href="/about" className="block py-1 hover:text-[#6E857B] transition-colors">Notre Mission</Link></li>
              </ul>
            </div>

            {/* Colonne 3 : Support & Légal Français */}
            <div>
              <h4 className="text-[13px] sm:text-sm font-semibold uppercase tracking-wider text-white mb-3 sm:mb-4">Informations & Légal</h4>
              <ul className="space-y-1 sm:space-y-2.5 text-[13px] sm:text-sm text-[#F5EBE6]/70">
                <li><Link href="/cgv" className="block py-1 hover:text-[#6E857B] transition-colors">Conditions Générales de Vente</Link></li>
                <li><Link href="/mentions-legales" className="block py-1 hover:text-[#6E857B] transition-colors">Mentions Légales</Link></li>
                <li><Link href="/privacy" className="block py-1 hover:text-[#6E857B] transition-colors">Politique de Confidentialité</Link></li>
                <li><Link href="/retours" className="block py-1 hover:text-[#6E857B] transition-colors">Politique de Retours (30 jours)</Link></li>
                <li><Link href="/contact" className="block py-1 hover:text-[#6E857B] transition-colors">Contactez-nous</Link></li>
              </ul>
            </div>

            {/* Colonne 4 : Newsletter */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="text-[13px] sm:text-sm font-semibold uppercase tracking-wider text-white mb-3 sm:mb-4">Restez connectée</h4>
              <p className="text-[13px] sm:text-sm text-[#F5EBE6]/70 mb-3 sm:mb-4">Inscrivez-vous à notre newsletter pour recevoir nos conseils d'experts et nos offres exclusives.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2.5 sm:gap-2">
                <input 
                  type="email" 
                  placeholder="Votre adresse e-mail" 
                  required
                  className="px-4 py-2.5 sm:py-3 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-[#F5EBE6]/40 text-[13px] sm:text-sm focus:outline-none focus:border-[#6E857B] w-full" 
                />
                <button type="submit" className="px-4 py-2.5 sm:py-3 rounded-full bg-[#6E857B] text-white text-[13px] sm:text-sm font-bold hover:bg-[#6E857B]/90 transition-all shadow-md active:scale-95 w-full">
                  S'inscrire
                </button>
              </form>
            </div>
          </div>

          {/* Copyright & bas de page */}
          <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] sm:text-xs text-[#F5EBE6]/50 gap-3 text-center md:text-left">
            <p>© {new Date().getFullYear()} ECLOSIA. Tous droits réservés.</p>
            <p className="flex items-center justify-center md:justify-end gap-1.5">
              Conçu avec <Heart className="w-3.5 h-3.5 text-[#6E857B] fill-[#6E857B]" /> pour les mamans en France.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}