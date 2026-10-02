"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Truck, Lock } from "lucide-react";
import { useCart } from "@/context/cart-context";

interface CartSummaryProps {
  onCheckout?: () => void;
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
  const router = useRouter();
  const { totalPrice } = useCart();
  
  // Livraison stricte à 10 € (0 € si le panier est vide)
  const shippingFee = totalPrice > 0 ? 10 : 0;
  const finalTotal = totalPrice + shippingFee;

  const handleCheckoutClick = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-[#333333]/10 bg-white shadow-sm space-y-6 h-fit">
      
      {/* En-tête propre avec badge bien aligné */}
      <div className="flex items-center justify-between pb-4 border-b border-[#333333]/10">
        <h2 className="text-lg font-extrabold text-[#333333] tracking-wide">
          Récapitulatif
        </h2>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6E857B]/10 border border-[#6E857B]/20 text-[#6E857B] text-[10px] font-bold uppercase tracking-wider shadow-sm">
          <Lock className="w-3 h-3" />
          <span>Sécurisé</span>
        </div>
      </div>

      {/* Lignes de calcul nettes */}
      <div className="space-y-3 text-sm text-[#333333]/80 font-medium">
        <div className="flex justify-between items-center">
          <span>Sous-total articles</span>
          <span className="font-bold text-[#333333] whitespace-nowrap">
            {totalPrice.toFixed(2).replace(".", ",")} €
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Expédition (Standard)</span>
          <span className="font-bold text-[#333333] whitespace-nowrap">
            {shippingFee.toFixed(2).replace(".", ",")} €
          </span>
        </div>

        {/* Total TTC avec alignement strict sur la même ligne */}
        <div className="border-t border-[#333333]/10 pt-4 flex justify-between items-center">
          <div>
            <span className="text-base font-extrabold text-[#333333]">Total TTC</span>
            <p className="text-[10px] text-[#333333]/50">TVA incluse</p>
          </div>
          <span className="text-2xl font-black text-[#333333] whitespace-nowrap flex items-baseline gap-1">
            {finalTotal.toFixed(2).replace(".", ",")} <span className="text-xl">€</span>
          </span>
        </div>
      </div>

      {/* Bouton de validation redirigeant vers /checkout */}
      <button
        onClick={handleCheckoutClick}
        disabled={totalPrice === 0}
        className="w-full py-4 px-6 rounded-xl bg-[#333333] hover:bg-black text-white text-[14px] sm:text-[15px] font-extrabold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2.5 group active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2"
      >
        <span className="text-center">Passer la commande</span>
        <ArrowRight className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" />
      </button>

      {/* Réassurance bas de bloc */}
      <div className="pt-4 border-t border-[#333333]/10 grid grid-cols-2 gap-2 text-[11px] text-[#333333]/60 font-medium">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#6E857B] shrink-0" />
          <span>Garantie Qualité</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <Lock className="w-3.5 h-3.5 text-[#6E857B] shrink-0" />
          <span>Paiement chiffré SSL</span>
        </div>
      </div>

    </div>
  );
}