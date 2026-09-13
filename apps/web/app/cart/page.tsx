"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/15 py-8 flex flex-col justify-between">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6">
        
        {/* Retour à l'accueil */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil AURAE</span>
        </Link>

        {/* En-tête du panier */}
        <div className="bg-white p-8 rounded-3xl border border-[#333333]/10 shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#6E857B]/20 flex items-center justify-center text-[#6E857B]">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#333333] tracking-tight">
                Votre Panier AURAE
              </h1>
              <p className="text-xs sm:text-sm text-[#333333]/70 font-medium">
                0 article dans votre panier
              </p>
            </div>
          </div>

          {/* Panier vide (état par défaut) */}
          <div className="text-center py-12 border-t border-[#333333]/10">
            <p className="text-sm text-[#333333]/70 font-medium mb-6">
              Votre panier est actuellement vide. Découvrez nos sélections pour la maternité et la puériculture.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#333333] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              <span>Découvrir nos produits</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}