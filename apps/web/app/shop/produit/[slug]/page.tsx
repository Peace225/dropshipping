import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, ShoppingBag, ShieldCheck, Sparkles, Truck, RefreshCw } from "lucide-react";

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/10 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fil d'Ariane / Retour */}
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la boutique</span>
        </Link>

        {/* Grille principale du produit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-12">
          
          {/* Visuel du produit */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm flex items-center justify-center relative min-h-[350px] sm:min-h-[450px]">
            <span className="absolute top-4 left-4 bg-[#6E857B]/15 text-[#333333] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Maternité & Soins
            </span>
            <div className="relative w-full h-72 sm:h-96">
              <Image
                src="/images/slide-3.png"
                alt="Huile Prévention & Correction Vergetures Bio"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Informations et actions */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col justify-between">
            <div>
              {/* Note et avis */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-[#333333]/70 font-bold">4.9 / 5 (48 avis)</span>
              </div>

              {/* Titre */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight mb-3">
                Huile Prévention & Correction Vergetures Bio
              </h1>

              {/* Prix */}
              <div className="text-2xl font-extrabold text-[#333333] mb-4">
                34,00 €
              </div>

              {/* Description courte */}
              <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed mb-6">
                Formulée spécialement pour accompagner la peau pendant et après la grossesse. Cette huile sèche bio nourrit intensément, améliore l'élasticité cutanée et aide à prévenir l'apparition des vergetures tout en respectant la sensibilité de la maman et de bébé.
              </p>

              {/* Caractéristiques clés */}
              <div className="space-y-2 mb-8 border-t border-b border-[#333333]/10 py-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#333333]">
                  <Sparkles className="w-4 h-4 text-[#6E857B]" />
                  <span>100% d'origine naturelle et certifiée BIO</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#333333]">
                  <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
                  <span>Compatible grossesse et allaitement (sans huiles essentielles risquées)</span>
                </div>
              </div>
            </div>

            {/* Bouton d'ajout au panier */}
            <div className="space-y-4">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#333333] hover:bg-black text-white font-extrabold text-sm transition-all shadow-md active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Ajouter au panier • 34,00 €</span>
              </button>

              {/* Avantages livraison / retours */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-[#333333]/70 font-medium">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#6E857B]" />
                  <span>Livraison gratuite dès 60 €</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#6E857B]" />
                  <span>Retours sous 30 jours</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}