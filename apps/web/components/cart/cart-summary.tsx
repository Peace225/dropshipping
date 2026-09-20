"use client";

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
    if (onCheckout) {
      onCheckout();
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-6 h-fit">
      
      {/* En-tête propre avec badge bien aligné */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h2 className="text-lg font-extrabold text-[#333333] tracking-wide">
          Récapitulatif
        </h2>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-wider">
          <Lock className="w-3 h-3" />
          <span>Sécurisé</span>
        </div>
      </div>

      {/* Barre de progression de la livraison offerte */}
      {totalPrice > 0 && (
        <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-[#333333]">
            <Truck className="w-4 h-4 text-orange-600 shrink-0" />
            {isFreeShippingUnlocked ? (
              <span className="text-orange-600 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Livraison offerte débloquée !
              </span>
            ) : (
              <span>
                Plus que <span className="font-extrabold text-orange-600">{(threshold - totalPrice).toFixed(2)} €</span> pour la <span className="font-bold">livraison offerte</span>
              </span>
            )}
          </div>
          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div 
              className="h-full bg-orange-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>
      )}

      {/* Lignes de calcul nettes */}
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <span>Sous-total articles</span>
          <span className="font-bold text-[#333333] whitespace-nowrap">{totalPrice.toFixed(2)} €</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Expédition (France)</span>
          <span className="font-bold text-[#333333] whitespace-nowrap">
            {calculatedShippingFee === 0 ? (
              <span className="text-orange-600 uppercase text-xs font-bold tracking-wide">Offerte</span>
            ) : (
              `${calculatedShippingFee.toFixed(2)} €`
            )}
          </span>
        </div>

        {/* Total TTC avec alignement strict sur la même ligne */}
        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
          <div>
            <span className="text-base font-extrabold text-[#333333]">Total TTC</span>
            <p className="text-[10px] text-gray-400">TVA incluse</p>
          </div>
          <span className="text-2xl font-black text-[#333333] whitespace-nowrap flex items-baseline gap-1">
            {finalTotal.toFixed(2)} <span className="text-xl">€</span>
          </span>
        </div>
      </div>

      {/* Bouton de validation redirigeant vers /checkout */}
      <button
        onClick={handleCheckoutClick}
        disabled={totalPrice === 0}
        className="w-full py-4 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[14px] sm:text-[15px] font-extrabold uppercase tracking-[0.08em] leading-none transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2.5 group active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      >
        <span className="text-center">Passer la commande</span>
        <ArrowRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" />
      </button>

      {/* Réassurance bas de bloc */}
      <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
          <span>Garantie Qualité</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <Lock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <span>Paiement chiffré</span>
        </div>
      </div>

    </div>
  );
}