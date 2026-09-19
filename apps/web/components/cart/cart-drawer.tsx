"use client";

import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  if (!isOpen) return null;

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
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#333333]/10 bg-[#F5EBE6]/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#6E857B]" />
              <h2 className="text-base font-bold font-serif text-[#333333]">
                Mon Panier <span className="text-xs font-sans font-normal text-[#6E857B]">({totalItems})</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#333333]/60 hover:text-[#333333] hover:bg-white transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Liste des articles */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F5EBE6] flex items-center justify-center text-[#6E857B] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-[#333333] mb-1">Votre panier est vide</p>
                <p className="text-xs text-[#333333]/60 max-w-xs mb-6">
                  Ajoutez des articles pour commencer vos achats.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full bg-[#6E857B] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5b7067] transition-all"
                >
                  Découvrir nos produits
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-[#333333]/10 bg-white shadow-sm"
                >
                  <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-[#F5EBE6]/40 border border-[#333333]/10">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-[#6E857B]">{item.category}</p>
                    <h3 className="text-xs font-semibold text-[#333333] line-clamp-1">{item.name}</h3>
                    <p className="text-xs font-bold text-[#333333] mt-1">{item.price.toFixed(2)} €</p>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#333333]/40 hover:text-red-500 transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-[#333333]/20 rounded-full overflow-hidden bg-white text-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-[#F5EBE6] text-[#333333]"
                        aria-label="Moins"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-[#333333]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-[#F5EBE6] text-[#333333]"
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
            <div className="border-t border-[#333333]/10 px-6 py-4 bg-[#F5EBE6]/30 space-y-3">
              <div className="flex justify-between text-xs text-[#333333]/80">
                <span>Sous-total</span>
                <span className="font-bold">{totalPrice.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-xs text-[#333333]/80">
                <span>Livraison</span>
                <span className="font-semibold">{totalPrice >= 60 ? "Offerte" : "5,00 €"}</span>
              </div>
              <div className="border-t border-[#333333]/10 pt-2 flex justify-between text-sm font-bold text-[#333333]">
                <span>Total</span>
                <span>{(totalPrice >= 60 ? totalPrice : totalPrice + 5).toFixed(2)} €</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-full border border-[#6E857B] text-[#6E857B] text-center text-xs font-semibold uppercase tracking-wider hover:bg-[#6E857B] hover:text-white transition-all"
                >
                  Voir le panier
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-full bg-[#6E857B] text-white text-center text-xs font-semibold uppercase tracking-wider hover:bg-[#5b7067] transition-all shadow-sm"
                >
                  Commander
                </Link>
              </div>

              <button
                onClick={clearCart}
                className="w-full text-center text-[10px] text-red-500 hover:underline pt-1"
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