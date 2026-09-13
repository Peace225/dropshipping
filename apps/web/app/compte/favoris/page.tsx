import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, ShoppingBag, Trash2, Star } from "lucide-react";

export default function FavorisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/10 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fil d'Ariane / Retour */}
        <Link
          href="/compte"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à mon compte</span>
        </Link>

        {/* En-tête */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#E8C5C8]/30 text-[#333333] mb-2">
            Liste de souhaits
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
            Mes favoris AURAE
          </h1>
          <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">
            Retrouvez tous vos coups de cœur et essentiels de maternité et puériculture sauvegardés.
          </p>
        </div>

        {/* Grille des favoris */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Favori 1 */}
          <div className="bg-white p-5 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col justify-between group hover:border-[#333333]/30 transition-all">
            <div>
              <div className="relative w-full h-48 bg-[#E8C5C8]/20 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <Image
                  src="/images/slide-3.png"
                  alt="Huile Vergetures"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-rose-500 hover:bg-white shadow-sm transition-colors"
                  title="Retirer des favoris"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#333333]/5 text-[#333333] mb-1">
                Univers 1 : Maternité
              </span>
              <Link href="/shop/maternite/huile-vergetures">
                <h3 className="font-extrabold text-sm sm:text-base text-[#333333] hover:text-black line-clamp-1 mb-1">
                  Huile Prévention & Correction Vergetures Bio
                </h3>
              </Link>
              <p className="text-xs font-extrabold text-[#333333] mb-4">
                34,00 €
              </p>
            </div>

            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#333333] hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Ajouter au panier</span>
            </button>
          </div>

          {/* Favori 2 */}
          <div className="bg-white p-5 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col justify-between group hover:border-[#333333]/30 transition-all">
            <div>
              <div className="relative w-full h-48 bg-[#6E857B]/15 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <Image
                  src="/images/slide-8.jpg"
                  alt="Gigoteuse Cocon"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-rose-500 hover:bg-white shadow-sm transition-colors"
                  title="Retirer des favoris"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#333333]/5 text-[#333333] mb-1">
                Univers 2 : Puériculture
              </span>
              <Link href="/shop/puericulture/gigoteuse-cocon">
                <h3 className="font-extrabold text-sm sm:text-base text-[#333333] hover:text-black line-clamp-1 mb-1">
                  Nid d'Ange & Gigoteuse Cocon Coton Bio
                </h3>
              </Link>
              <p className="text-xs font-extrabold text-[#333333] mb-4">
                52,00 €
              </p>
            </div>

            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#333333] hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Ajouter au panier</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}