import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, ShieldCheck, Heart, Sparkles, Check, ShoppingBag, Truck, RefreshCw } from "lucide-react";

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fil d'Ariane / Retour */}
        <Link
          href="/shop/maternite"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux soins Maternité</span>
        </Link>

        {/* Grille principale du produit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Colonne Gauche : Image et Badges */}
          <div className="relative bg-[#E8C5C8]/20 rounded-3xl overflow-hidden p-8 flex items-center justify-center border border-[#333333]/10 shadow-sm min-h-[380px] sm:min-h-[480px]">
            <Image
              src="/images/slide-3.png"
              alt="Huile Prévention & Correction Vergetures Bio"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6"
              priority
            />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#333333] shadow-sm uppercase tracking-wider">
              Anti-vergetures
            </span>
            <span className="absolute bottom-4 left-4 bg-[#333333] text-white px-3 py-1 rounded-md text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              100% Naturel & Bio
            </span>
          </div>

          {/* Colonne Droite : Informations, Prix et Actions */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-1.5 text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs sm:text-sm text-[#333333]/70 font-bold ml-2">
                  5.0 (128 avis vérifiés)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#333333] tracking-tight leading-tight">
                Huile Prévention & Correction Vergetures Bio
              </h1>

              <p className="text-xl sm:text-2xl font-extrabold text-[#333333] mt-3">
                34,00 € <span className="text-xs font-normal text-[#333333]/60">TVA incluse</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed">
              Formulée spécifiquement pour les femmes enceintes, notre huile sèche associe des huiles végétales précieuses (argan, amande douce, rose musquée) pour stimuler l'élasticité de la peau, prévenir l'apparition des vergetures et apaiser les sensations de tiraillement.
            </p>

            {/* Points clés de réassurance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-[#333333]/10 text-xs text-[#333333] font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
                <span>Compatible 1er trimestre & Allaitement</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
                <span>Testé sous contrôle dermatologique</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
                <span>Sans huiles essentielles ni perturbateurs</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
                <span>Pénétration rapide, fini non gras</span>
              </div>
            </div>

            {/* Bouton d'action / Panier */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#333333]/10">
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#333333] hover:bg-black text-white font-bold text-sm sm:text-base transition-all active:scale-95 shadow-md"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Ajouter au panier • 34,00 €</span>
              </button>
            </div>

            {/* Informations de livraison et garanties */}
            <div className="flex flex-col gap-2.5 pt-2 text-xs text-[#333333]/70 font-medium">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#333333]" />
                <span>Expédition rapide en 24/48h • Gratuit dès 60€ d'achat</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#333333]" />
                <span>Retours faciles sous 30 jours si non ouvert</span>
              </div>
            </div>

          </div>
        </div>

        {/* Section Conseils d'utilisation & Ingrédients */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#333333] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E8C5C8]" />
              Conseils d'utilisation
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-[#333333]/80 font-medium">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#6E857B] mt-0.5 flex-shrink-0" />
                <span>Appliquez matin et soir dès le 1er mois de grossesse et jusqu'à 3 mois après l'accouchement.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#6E857B] mt-0.5 flex-shrink-0" />
                <span>Massez par mouvements circiculaires sur le ventre, les seins, les cuisses et les hanches.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#6E857B] mt-0.5 flex-shrink-0" />
                <span>Sa texture sèche permet de s'habiller immédiatement après application sans tacher les vêtements.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#333333] mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#E8C5C8] fill-current" />
              Composition 100% Clean
            </h2>
            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed mb-4">
              Ingrédients principaux : Huile de graines d'Helianthus Annuus (Tournesol), Huile de Prunus Amygdalus Dulcis (Amande douce), Huile de noyau d'Argania Spinosa, Extrait de Rose Musquée.
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-[#F5EBE6] text-[#333333] text-xs font-bold">
              99.9% des ingrédients sont d'origine naturelle.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}