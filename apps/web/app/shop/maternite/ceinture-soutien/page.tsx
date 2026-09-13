import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, ShieldCheck, Heart, Sparkles, Check, ShoppingBag, Truck, RefreshCw } from "lucide-react";

export default function CeintureSoutienPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link
          href="/shop/maternite"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux soins Maternité</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          <div className="relative bg-[#E8C5C8]/20 rounded-3xl overflow-hidden p-8 flex items-center justify-center border border-[#333333]/10 shadow-sm min-h-[380px] sm:min-h-[480px]">
            <Image
              src="/images/slide-6.png"
              alt="Ceinture de Maintien & Soutien de Grossesse"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6"
              priority
            />
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#333333] shadow-sm uppercase tracking-wider">
              Maintien & Bien-être
            </span>
            <span className="absolute bottom-4 left-4 bg-[#333333] text-white px-3 py-1 rounded-md text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Anti-douleurs dos
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-1.5 text-amber-500 mb-2">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs sm:text-sm text-[#333333]/70 font-bold ml-2">
                  4.8 (45 avis vérifiés)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#333333] tracking-tight leading-tight">
                Ceinture de Maintien & Soutien de Grossesse
              </h1>

              <p className="text-xl sm:text-2xl font-extrabold text-[#333333] mt-3">
                39,00 € <span className="text-xs font-normal text-[#333333]/60">TVA incluse</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed">
              Soulagez efficacement vos lombaires et le bas du ventre. Cette ceinture ergonomique répartit le poids de manière optimale pour vous offrir un confort absolu tout au long de la journée.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-[#333333]/10 text-xs text-[#333333] font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
                <span>Maintien lombaire ajustable</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
                <span>Textile respirant et invisible sous les vêtements</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#333333]/10">
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#333333] hover:bg-black text-white font-bold text-sm sm:text-base transition-all active:scale-95 shadow-md"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Ajouter au panier • 39,00 €</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5 pt-2 text-xs text-[#333333]/70 font-medium">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#333333]" />
                <span>Expédition rapide en 24/48h • Gratuit dès 60€ d'achat</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#333333]" />
                <span>Retours faciles sous 30 jours</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}