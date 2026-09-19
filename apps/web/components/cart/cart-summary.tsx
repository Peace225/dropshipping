"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Sparkles, Truck, Lock } from "lucide-react";
import { useCart } from "@/context/cart-context";

interface CartSummaryProps {
  onCheckout?: () => void;
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
  const router = useRouter();
  const { totalPrice, calculatedShippingFee, freeShippingThreshold } = useCart();
  
  // Sécurisation au cas où le seuil serait indéfinis (évite le bug "NaN")
  const threshold = freeShippingThreshold ?? 150;
  const finalTotal = totalPrice + calculatedShippingFee;
  const progressToFreeShipping = Math.min((totalPrice / threshold) * 100, 100);
  const isFreeShippingUnlocked = totalPrice >= threshold;

  const handleCheckoutClick = () => {
    // Redirection directe garantie vers /checkout
    router.push("/checkout");
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-[#333333]/10 bg-white shadow-sm space-y-6 h-fit">
      
      {/* En-tête propre avec badge bien aligné */}
      <div className="flex items-center justify-between pb-4 border-b border-[#333333]/10">
        <h2 className="text-lg font-bold font-serif text-[#333333] tracking-wide">
          Récapitulatif
        </h2>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6E857B]/10 text-[#6E857B] text-[10px] font-bold uppercase tracking-wider">
          <Lock className="w-3 h-3" />
          <span>Sécurisé</span>
        </div>
      </div>

      {/* Barre de progression de la livraison offerte */}
      {totalPrice > 0 && (
        <div className="p-4 rounded-xl bg-[#F5EBE6]/40 border border-[#6E857B]/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-[#333333]">
            <Truck className="w-4 h-4 text-[#6E857B] shrink-0" />
            {isFreeShippingUnlocked ? (
              <span className="text-[#6E857B] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Livraison offerte débloquée !
              </span>
            ) : (
              <span>
                Plus que <span className="font-bold text-[#6E857B]">{(threshold - totalPrice).toFixed(2)} €</span> pour la <span className="font-semibold">livraison offerte</span>
              </span>
            )}
          </div>
          <div className="w-full h-2 rounded-full bg-[#333333]/10 overflow-hidden">
            <div 
              className="h-full bg-[#6E857B] transition-all duration-500 rounded-full"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>
      )}

      {/* Lignes de calcul nettes */}
      <div className="space-y-3 text-sm text-[#333333]/80">
        <div className="flex justify-between items-center">
          <span>Sous-total articles</span>
          <span className="font-semibold text-[#333333] whitespace-nowrap">{totalPrice.toFixed(2)} €</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Expédition (France)</span>
          <span className="font-semibold text-[#333333] whitespace-nowrap">
            {calculatedShippingFee === 0 ? (
              <span className="text-[#6E857B] uppercase text-xs font-bold tracking-wide">Offerte</span>
            ) : (
              `${calculatedShippingFee.toFixed(2)} €`
            )}
          </span>
        </div>

        {/* Total TTC avec alignement strict sur la même ligne */}
        <div className="border-t border-[#333333]/10 pt-4 flex justify-between items-center">
          <div>
            <span className="text-base font-bold text-[#333333]">Total TTC</span>
            <p className="text-[10px] text-[#333333]/50">TVA incluse</p>
          </div>
          <span className="text-2xl font-black font-serif text-[#333333] whitespace-nowrap flex items-baseline gap-1">
            {finalTotal.toFixed(2)} <span className="text-xl">€</span>
          </span>
        </div>
      </div>

      {/* Bouton de validation redirigeant vers /checkout */}
      <button
        onClick={handleCheckoutClick}
        disabled={totalPrice === 0}
        className="w-full py-5 px-6 rounded-xl bg-[#6E857B] hover:bg-[#5b7067] text-white text-[14px] sm:text-[15px] font-extrabold uppercase tracking-[0.08em] leading-none transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2.5 group active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none"
      >
        <span className="text-center">Passer la commande</span>
        <ArrowRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" />
      </button>

      {/* Réassurance bas de bloc */}
      <div className="pt-3 border-t border-[#333333]/10 grid grid-cols-2 gap-2 text-[11px] text-[#333333]/60">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#6E857B] shrink-0" />
          <span>Garantie Qualité</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <Lock className="w-3.5 h-3.5 text-[#6E857B] shrink-0" />
          <span>Paiement chiffré</span>
        </div>
      </div>

    </div>
  );
}