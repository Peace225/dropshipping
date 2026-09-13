import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Heart, Sparkles, SlidersHorizontal, Star } from "lucide-react";

export default function BoutiquePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fil d'Ariane / Retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil AURAE</span>
        </Link>

        {/* En-tête de la Boutique */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#333333]/10 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#6E857B]/15 text-[#333333] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#6E857B]" />
              Catalogue Général AURAE
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] tracking-tight">
              Tous nos essentiels Maternité & Puériculture
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-2 max-w-2xl">
              Découvrez l'ensemble de nos collections pensées pour le bien-être des futures mamans et le confort de bébé, conçues en matières biologiques et éco-responsables.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-[#333333]/15 bg-white hover:bg-[#333333]/5 text-[#333333] font-bold text-xs sm:text-sm transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtrer les univers</span>
            </button>
          </div>
        </div>

        {/* Grille des produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Produit 1 */}
          <div className="bg-white p-5 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col justify-between group hover:border-[#333333]/30 transition-all">
            <div>
              <div className="relative w-full h-56 bg-[#E8C5C8]/20 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <Image
                  src="/images/slide-3.png"
                  alt="Huile Vergetures"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#333333] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Maternité
                </span>
              </div>
              <div className="flex items-center gap-1 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-[11px] text-[#333333]/60 font-bold ml-1">(48)</span>
              </div>
              <Link href="/shop/maternite/huile-vergetures">
                <h3 className="font-extrabold text-sm sm:text-base text-[#333333] hover:text-black line-clamp-1 mb-1">
                  Huile Prévention & Correction Vergetures Bio
                </h3>
              </Link>
              <p className="text-xs text-[#333333]/70 line-clamp-2 mb-4">
                Nourrit intensément et améliore l'élasticité de la peau pendant et après la grossesse.
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-[#333333]/10">
              <span className="text-base font-extrabold text-[#333333]">34,00 €</span>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#333333] hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* Produit 2 */}
          <div className="bg-white p-5 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col justify-between group hover:border-[#333333]/30 transition-all">
            <div>
              <div className="relative w-full h-56 bg-[#6E857B]/15 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <Image
                  src="/images/slide-8.jpg"
                  alt="Gigoteuse Cocon"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#333333] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Puériculture
                </span>
              </div>
              <div className="flex items-center gap-1 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-[11px] text-[#333333]/60 font-bold ml-1">(32)</span>
              </div>
              <Link href="/shop/puericulture/gigoteuse-cocon">
                <h3 className="font-extrabold text-sm sm:text-base text-[#333333] hover:text-black line-clamp-1 mb-1">
                  Nid d'Ange & Gigoteuse Cocon Coton Bio
                </h3>
              </Link>
              <p className="text-xs text-[#333333]/70 line-clamp-2 mb-4">
                Régulation thermique idéale (TOG 2.0) pour des nuits paisibles et enveloppantes.
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-[#333333]/10">
              <span className="text-base font-extrabold text-[#333333]">52,00 €</span>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#333333] hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

          {/* Produit 3 */}
          <div className="bg-white p-5 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col justify-between group hover:border-[#333333]/30 transition-all">
            <div>
              <div className="relative w-full h-56 bg-[#F5EBE6]/60 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <Image
                  src="/images/slide-1.png"
                  alt="Coussin de grossesse"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#333333] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Maternité
                </span>
              </div>
              <div className="flex items-center gap-1 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="text-[11px] text-[#333333]/60 font-bold ml-1">(64)</span>
              </div>
              <Link href="/shop/maternite/coussin-grossesse">
                <h3 className="font-extrabold text-sm sm:text-base text-[#333333] hover:text-black line-clamp-1 mb-1">
                  Coussin de Grossesse & Allaitement XXL
                </h3>
              </Link>
              <p className="text-xs text-[#333333]/70 line-clamp-2 mb-4">
                Soutien ergonomique d'exception pour soulager le dos et les jambes au quotidien.
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-[#333333]/10">
              <span className="text-base font-extrabold text-[#333333]">68,00 €</span>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#333333] hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Ajouter</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}