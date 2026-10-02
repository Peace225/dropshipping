"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  // FRAIS DE LIVRAISON FIXES À 10 € (si le panier n'est pas vide)
  const shippingFee = totalPrice > 0 ? 10 : 0;
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fond semi-transparent sombre */}
      <div
        className="absolute inset-0 bg-[#333333]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header du tiroir */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#333333]/10 bg-[#F5EBE6]/30">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#6E857B]" />
              <h2 className="text-base font-extrabold text-[#333333]">
                Mon Panier <span className="text-xs font-normal text-[#333333]/60">({totalItems})</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#333333]/40 hover:text-[#333333] hover:bg-white transition-colors cursor-pointer"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Liste des articles */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#6E857B]/10 flex items-center justify-center text-[#6E857B] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-extrabold text-[#333333] mb-1">Votre panier est vide</p>
                <p className="text-xs text-[#333333]/60 max-w-xs mb-6">
                  Ajoutez des articles pour commencer vos achats.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-[#333333] text-white text-xs font-bold transition-all shadow-sm hover:bg-black cursor-pointer"
                >
                  Continuer mes achats
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-2xl border border-[#333333]/10 bg-white shadow-sm"
                >
                  <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[#6E857B]/5 border border-[#333333]/5 p-2 flex items-center justify-center">
                    <Image src={item.image} alt={item.name} fill unoptimized className="object-contain mix-blend-multiply p-1" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#6E857B] mb-0.5">{item.category || "ECLOSIA"}</p>
                    <h3 className="text-xs font-bold text-[#333333] line-clamp-2 leading-snug">{item.name}</h3>
                    <p className="text-xs font-extrabold text-[#333333] mt-1.5">{(Number(item.price)).toFixed(2).replace(".", ",")} €</p>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-3 h-full py-1">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#333333]/40 hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-[#333333]/15 rounded-full overflow-hidden bg-white text-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-[#333333]/5 text-[#333333] cursor-pointer transition-colors"
                        aria-label="Moins"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-[#333333]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-[#333333]/5 text-[#333333] cursor-pointer transition-colors"
                        aria-label="Plus"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Total & Actions */}
          {cart.length > 0 && (
            <div className="border-t border-[#333333]/10 px-6 py-5 bg-white space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#333333]/70 font-medium">
                  <span>Sous-total</span>
                  <span className="font-bold text-[#333333]">{totalPrice.toFixed(2).replace(".", ",")} €</span>
                </div>
                <div className="flex justify-between text-xs text-[#333333]/70 font-medium">
                  <span>Livraison</span>
                  <span className="font-bold text-[#333333]">{shippingFee.toFixed(2).replace(".", ",")} €</span>
                </div>
              </div>
              
              <div className="border-t border-[#333333]/10 pt-3 flex justify-between text-sm font-extrabold text-[#333333]">
                <span>Total à payer</span>
                <span className="text-base">{finalTotal.toFixed(2).replace(".", ",")} €</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/shop/panier"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl border border-[#333333]/15 text-[#333333] text-center text-xs font-bold hover:bg-[#333333]/5 transition-colors flex items-center justify-center"
                >
                  Voir le panier
                </Link>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-[#333333] text-white text-center text-xs font-bold hover:bg-black transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Commander</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={clearCart}
                className="w-full text-center text-[10px] text-[#333333]/40 hover:text-[#333333] hover:underline pt-1 cursor-pointer transition-colors"
              >
                Vider le panier
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}