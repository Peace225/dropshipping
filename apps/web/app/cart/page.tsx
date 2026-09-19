"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

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
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#6E857B]/20 flex items-center justify-center text-[#6E857B]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#333333] tracking-tight">
                  Votre Panier AURAE
                </h1>
                <p className="text-xs sm:text-sm text-[#333333]/70 font-medium">
                  {totalItems} {totalItems > 1 ? "articles" : "article"} dans votre panier
                </p>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Vider le panier
              </button>
            )}
          </div>

          {/* Contenu dynamique du panier */}
          {cart.length === 0 ? (
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
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-[#333333]/10 pt-6">
              {/* Liste des articles (2 colonnes) */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>

              {/* Récapitulatif (1 colonne) */}
              <div>
                <CartSummary
                  totalPrice={totalPrice}
                  onCheckout={() => alert("Redirection vers le paiement sécurisé...")}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}