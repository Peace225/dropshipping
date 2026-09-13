import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, ShieldCheck, Heart, Sparkles, Check, ShoppingBag, Truck, RefreshCw } from "lucide-react";

export default function CoussinGrossessePage() {
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
          <div className="relative bg-[#6E857B]/15 rounded-3xl overflow-hidden p-8 flex items-center justify-center border border-[#333333]/10 shadow-sm min-h-[380px] sm:min-h-[480px]">
            <Image
              src="/images/slide-7.jpg"
              alt="Coussin de Grossesse & Allaitement XXL"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6"
              priority
            />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#333333] shadow-sm uppercase tracking-wider">
              Confort & Sommeil
            </span>
            <span className="absolute bottom-4 left-4 bg-[#6E857B] text-white px-3 py-1 rounded-md text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-current" />
              Indispensable Nuits
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
                  5.0 (94 avis vérifiés)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#333333] tracking-tight leading-tight">
                Coussin de Grossesse & Allaitement XXL
              </h1>

              <p className="text-xl sm:text-2xl font-extrabold text-[#333333] mt-3">
                65,00 € <span className="text-xs font-normal text-[#333333]/60">TVA incluse</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed">
              Conçu pour épouser parfaitement les formes de votre corps, ce coussin XXL soulage les tensions lombaires, soutient le ventre qui s'arrondit et cale les jambes pendant la grossesse. Il se transforme ensuite en un accessoire idéal et sécurisant pour caler bébé lors de l'allaitement.
            </p>

            {/* Points clés de réassurance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-[#333333]/10 text-xs text-[#333333] font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
                <span>Housse 100% Coton Bio certifié Oeko-Tex</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
                <span>Rembourrage silencieux et moelleux</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
                <span>Déhoussable et lavable en machine à 30°C</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
                <span>Fabrication respectueuse de l'environnement</span>
              </div>
            </div>

            {/* Bouton d'action / Panier */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#333333]/10">
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#333333] hover:bg-black text-white font-bold text-sm sm:text-base transition-all active:scale-95 shadow-md"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Ajouter au panier • 65,00 €</span>
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
                <span>Retours faciles sous 30 jours si non utilisé</span>
              </div>
            </div>

          </div>
        </div>

        {/* Section Utilisation & Entretien */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#333333] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#6E857B]" />
              Multi-usages & Évolutif
            </h2>
            <ul className="space-y-3 text-xs sm:text-sm text-[#333333]/80 font-medium">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#6E857B] mt-0.5 flex-shrink-0" />
                <span><strong>Pendant la grossesse :</strong> Offre un soutien optimal pour dormir sur le côté (recommandé par les sages-femmes).</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#6E857B] mt-0.5 flex-shrink-0" />
                <span><strong>Pendant l'allaitement :</strong> Se noue ou se place autour de la taille pour maintenir bébé à la bonne hauteur et soulager vos bras.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#6E857B] mt-0.5 flex-shrink-0" />
                <span><strong>Pour bébé :</strong> Crée un petit nid douillet et sécurisé lorsqu'il commence à s'asseoir.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#333333] mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#6E857B] fill-current" />
              Entretien & Qualité
            </h2>
            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed mb-4">
              La housse en coton bio s'enlève très facilement grâce à une fermeture éclair invisible. Lavable en machine à 30°C pour une hygiène irréprochable au quotidien.
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-[#6E857B]/20 text-[#333333] text-xs font-bold">
              Certifié sans substances nocives (Standard 100 by OEKO-TEX).
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}