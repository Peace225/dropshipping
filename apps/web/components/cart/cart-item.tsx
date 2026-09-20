"use client";

import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem as CartItemType } from "@/context/cart-context";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Informations du produit (Image, Catégorie, Nom, Prix unitaire) */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 p-1 flex items-center justify-center">
          <Image 
            src={item.image} 
            alt={item.name} 
            fill 
            unoptimized
            className="object-contain mix-blend-multiply p-1" 
          />
        </div>
        <div className="min-w-0">
          {item.category && (
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
              {item.category}
            </p>
          )}
          <h3 className="text-xs sm:text-sm font-bold text-[#333333] line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm font-extrabold text-[#333333] mt-1">
            {Number(item.price).toFixed(2)} €
          </p>
        </div>
      </div>

      {/* Contrôles de quantité et bouton de suppression */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        {/* Sélecteur de quantité (+ / -) */}
        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white shadow-sm">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="p-2 hover:bg-gray-100 text-[#333333] transition-colors cursor-pointer"
            aria-label="Diminuer la quantité"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 sm:px-4 text-xs font-bold text-[#333333]">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-2 hover:bg-gray-100 text-[#333333] transition-colors cursor-pointer"
            aria-label="Augmenter la quantité"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bouton pour supprimer l'article */}
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 cursor-pointer"
          aria-label="Supprimer le produit"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}