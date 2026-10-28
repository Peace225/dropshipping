"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://eclosia.shop/#organization",
        "name": "ECLOSIA",
        "url": "https://eclosia.shop",
        "logo": "https://eclosia.shop/images/logo.png",
        "legalName": "Guy-Mars Karamba Mamadou",
        "identifier": "104232756",
        "sameAs": [
          "https://www.instagram.com/eclosia.shop",
          "https://www.facebook.com/eclosia.shop"
        ],
        "knowsAbout": [
          "accessoires et literie bébé",
          "matelas berceau et draps bio",
          "bien-être et confort infantile",
          "puériculture écoresponsable"
        ]
      },
      {
        "@type": "OnlineStore",
        "@id": "https://eclosia.shop/#onlinestore",
        "name": "ECLOSIA",
        "image": "https://eclosia.shop/images/logo.png",
        "url": "https://eclosia.shop",
        "telephone": "+33769238511",
        "email": "contact@eclosia.shop",
        "priceRange": "€€",
        "currenciesAccepted": "EUR",
        "paymentAccepted": "Carte bancaire, Visa, Mastercard",
        "areaServed": {
          "@type": "Country",
          "name": "France"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://eclosia.shop/#website",
        "url": "https://eclosia.shop",
        "name": "ECLOSIA",
        "publisher": {
          "@id": "https://eclosia.shop/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://eclosia.shop/shop?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://eclosia.shop/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Quels sont les frais et délais de livraison ECLOSIA ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "La livraison standard est de 10,00 € en France métropolitaine (délai de 2 à 4 jours ouvrables), et elle est offerte dès 89,00 € d'achats."
            }
          },
          {
            "@type": "Question",
            "name": "Comment fonctionne votre conseillère IA Puériculture ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Notre assistante IA intégrée est disponible 24/7 sur notre plateforme pour répondre à vos questions sur le sommeil, l'équipement et le confort de votre bébé."
            }
          }
        ]
      }
    ]
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setStatus("success");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <footer className="bg-[#333333] text-[#F5EBE6] pt-10 sm:pt-14 pb-6 sm:pb-8" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-8 sm:mb-10">
            
            <div className="space-y-3">
              <Link href="/" className="inline-flex items-center gap-2.5 group" title="ECLOSIA - Accueil Puériculture">
                <img 
                  src="/images/logo.png" 
                  alt="Logo ECLOSIA - Boutique Puériculture & Bébé" 
                  className="h-6 sm:h-7 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-lg sm:text-xl font-bold font-serif tracking-wider text-white">ECLOSIA</span>
              </Link>
              <p className="text-[11px] sm:text-[12px] text-[#F5EBE6]/70 leading-relaxed">
                Boutique puériculture & bébé écoresponsable. Spécialiste des articles de soin, matelas, linge de lit en coton bio et bambou certifiés OEKO-TEX.
              </p>
              
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-[#F5EBE6]/60">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6E857B] shrink-0" />
                  <span>France</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-[#F5EBE6]/60">
                  <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6E857B] shrink-0" />
                  <a href="tel:+33769238511" className="hover:text-white transition-colors">
                    +33 7 69 23 85 11 (Lun-Ven : 09h-18h)
                  </a>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-[#F5EBE6]/60">
                  <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6E857B] shrink-0" />
                  <a href="mailto:contact@eclosia.shop" className="hover:text-white transition-colors underline underline-offset-2">
                    contact@eclosia.shop
                  </a>
                </div>
              </div>
            </div>

            <nav aria-label="Navigation secondaire du site">
              <h4 className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-wider text-white mb-2.5 sm:mb-3">Navigation</h4>
              <ul className="space-y-1 text-[11px] sm:text-[12px] text-[#F5EBE6]/70">
                <li><Link href="/shop/bebe" className="block py-0.5 hover:text-[#6E857B] transition-colors">Boutique & Essentiels Bébé</Link></li>
                <li><Link href="/ai-chat" className="block py-0.5 hover:text-[#6E857B] transition-colors">Conseillère IA Puériculture 24/7</Link></li>
                <li><Link href="/community" className="block py-0.5 hover:text-[#6E857B] transition-colors">Espace Conseils Parents</Link></li>
                <li><Link href="/about" className="block py-0.5 hover:text-[#6E857B] transition-colors">Notre Mission & Valeurs</Link></li>
              </ul>
            </nav>

            <nav aria-label="Informations légales et service client">
              <h4 className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-wider text-white mb-2.5 sm:mb-3">Informations & Légal</h4>
              <ul className="space-y-1 text-[11px] sm:text-[12px] text-[#F5EBE6]/70">
                <li><Link href="/cgv" className="block py-0.5 hover:text-[#6E857B] transition-colors">Conditions Générales de Vente (CGV)</Link></li>
                <li><Link href="/mentions-legales" className="block py-0.5 hover:text-[#6E857B] transition-colors">Mentions Légales</Link></li>
                <li><Link href="/privacy" className="block py-0.5 hover:text-[#6E857B] transition-colors">Politique de Confidentialité & RGPD</Link></li>
                <li><Link href="/retours" className="block py-0.5 hover:text-[#6E857B] transition-colors">Politique de Retours (20 jours)</Link></li>
                <li><Link href="/contact" className="block py-0.5 hover:text-[#6E857B] transition-colors">Contactez notre support</Link></li>
              </ul>
            </nav>

            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="text-[12px] sm:text-[13px] font-semibold uppercase tracking-wider text-white mb-2.5 sm:mb-3">Restez connecté</h4>
              <p className="text-[11px] sm:text-[12px] text-[#F5EBE6]/70 mb-2.5 sm:mb-3">Recevez nos guides d&apos;experts, conseils sommeil bébé et offres exclusives réservées à notre communauté.</p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse e-mail" 
                  required
                  aria-label="Votre adresse e-mail pour la newsletter"
                  className="px-3.5 py-2 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-[#F5EBE6]/40 text-[11px] sm:text-[12px] focus:outline-none focus:border-[#6E857B] w-full" 
                />
                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="px-3.5 py-2 rounded-full bg-[#6E857B] text-white text-[11px] sm:text-[12px] font-bold hover:bg-[#6E857B]/90 transition-all shadow-md active:scale-95 w-full disabled:opacity-50"
                >
                  {status === "loading" ? "Inscription..." : "S'inscrire à la newsletter"}
                </button>

                {status === "success" && (
                  <p className="text-[11px] text-green-400 mt-0.5 font-medium" role="status">
                    Merci ! Votre inscription a bien été enregistrée. 🎉
                  </p>
                )}

                {status === "error" && (
                  <p className="text-[11px] text-red-300 mt-0.5 font-medium" role="alert">
                    {errorMessage}
                  </p>
                )}
              </form>
            </div>

          </div>

          <div className="border-t border-white/10 pt-5 sm:pt-6 flex flex-col md:flex-row items-center justify-between text-[10px] sm:text-[11px] text-[#F5EBE6]/50 gap-2 text-center md:text-left">
            <p>© {new Date().getFullYear()} ECLOSIA (eclosia.shop) — Tous droits réservés.</p>
            <p className="flex items-center justify-center md:justify-end gap-1.5">
              Conçu avec <Heart className="w-3 h-3 text-[#6E857B] fill-[#6E857B]" /> pour le confort et l&apos;éveil des tout-petits.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}