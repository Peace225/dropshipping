import Link from "next/link";
import { ArrowLeft, Package, Clock, CheckCircle2, ChevronRight, Eye } from "lucide-react";

export default function CommandesPage() {
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
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#6E857B]/15 text-[#333333] mb-2">
            Suivi des commandes
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
            Mes commandes AURAE
          </h1>
          <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">
            Retrouvez l'historique de vos achats et suivez l'acheminement de vos colis en temps réel.
          </p>
        </div>

        {/* Liste des commandes */}
        <div className="space-y-4">
          
          {/* Commande 1 (En cours) */}
          <div className="bg-white p-6 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#6E857B]/15 flex items-center justify-center text-[#6E857B] flex-shrink-0 mt-1">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="font-extrabold text-sm sm:text-base text-[#333333]">
                    Commande #AUR-8492
                  </h2>
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3 h-3" />
                    En cours de livraison
                  </span>
                </div>
                <p className="text-xs text-[#333333]/70 font-medium mb-2">
                  Passée le 10 septembre 2026 • 2 articles
                </p>
                <p className="text-xs sm:text-sm text-[#333333]/80 font-medium">
                  Huile Prévention & Correction Vergetures Bio, Coussin de Grossesse XXL
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-[#333333]/10">
              <div className="text-right hidden sm:block">
                <span className="block text-xs text-[#333333]/60 font-medium">Total</span>
                <span className="text-base font-extrabold text-[#333333]">102,00 €</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#333333] hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Suivre</span>
              </button>
            </div>
          </div>

          {/* Commande 2 (Livrée) */}
          <div className="bg-white p-6 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5EBE6] flex items-center justify-center text-[#333333] flex-shrink-0 mt-1">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="font-extrabold text-sm sm:text-base text-[#333333]">
                    Commande #AUR-7931
                  </h2>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Livrée le 24 août 2026
                  </span>
                </div>
                <p className="text-xs text-[#333333]/70 font-medium mb-2">
                  Passée le 20 août 2026 • 1 article
                </p>
                <p className="text-xs sm:text-sm text-[#333333]/80 font-medium">
                  Nid d'Ange & Gigoteuse Cocon Coton Bio
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-[#333333]/10">
              <div className="text-right hidden sm:block">
                <span className="block text-xs text-[#333333]/60 font-medium">Total</span>
                <span className="text-base font-extrabold text-[#333333]">52,00 €</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-[#333333]/15 hover:bg-[#333333]/5 text-[#333333] text-xs font-bold transition-all"
              >
                <span>Détails</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}