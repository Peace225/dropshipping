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
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-base font-extrabold text-[#333333]">
                Mon Panier <span className="text-xs font-normal text-gray-500">({totalItems})</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-[#333333] hover:bg-white transition-colors cursor-pointer"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Liste des articles */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-extrabold text-[#333333] mb-1">Votre panier est vide</p>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  Ajoutez des articles pour commencer vos achats.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-all shadow-sm cursor-pointer"
                >
                  Découvrir nos produits
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 p-1 flex items-center justify-center">
                    <Image src={item.image} alt={item.name} fill unoptimized className="object-contain mix-blend-multiply" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">{item.category || "AURAE"}</p>
                    <h3 className="text-xs font-bold text-[#333333] line-clamp-1">{item.name}</h3>
                    <p className="text-xs font-extrabold text-[#333333] mt-1">{(Number(item.price)).toFixed(2)} €</p>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-3">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white text-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 text-[#333333] cursor-pointer"
                        aria-label="Moins"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-[#333333]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 text-[#333333] cursor-pointer"
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
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 space-y-3">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Sous-total</span>
                <span className="font-bold text-[#333333]">{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Livraison</span>
                <span className="font-semibold text-orange-600">{totalPrice >= 60 ? "Offerte" : "5,00 €"}</span>
              </div>
              <div className="border-t border-gray-200 pt-2.5 flex justify-between text-sm font-extrabold text-[#333333]">
                <span>Total</span>
                <span className="text-base">{(totalPrice >= 60 ? totalPrice : totalPrice + 5).toFixed(2)} €</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl border border-gray-300 text-[#333333] text-center text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all flex items-center justify-center"
                >
                  Voir le panier
                </Link>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl bg-orange-500 text-white text-center text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-all shadow-sm shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Commander</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={clearCart}
                className="w-full text-center text-[11px] text-red-500 hover:underline pt-1 cursor-pointer"
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