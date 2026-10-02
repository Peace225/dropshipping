"use client";

import { useState, useEffect } from "react";
import { Truck, MapPin, Zap } from "lucide-react";

interface ShippingOption {
  id: string;
  name: string;
  delay: string;
  price: number;
  icon: typeof Truck;
}

interface ShippingSelectorProps {
  selectedShippingId?: string;
  onSelectShipping?: (option: ShippingOption) => void;
}

// Tarifs mis à jour (Standard à 10€ comme demandé)
const shippingOptions: ShippingOption[] = [
  {
    id: "standard",
    name: "Livraison Standard à domicile",
    delay: "7 à 10 jours ouvrés",
    price: 10.00, 
    icon: Truck,
  },
  {
    id: "relay",
    name: "Point Relais Colis",
    delay: "7 à 10 jours ouvrés",
    price: 7.90,
    icon: MapPin,
  },
  {
    id: "express",
    name: "Livraison Express",
    delay: "24 à 48 heures",
    price: 15.00,
    icon: Zap,
  },
];

export function ShippingSelector({
  selectedShippingId = "standard",
  onSelectShipping,
}: ShippingSelectorProps) {
  const [activeId, setActiveId] = useState(selectedShippingId);

  // Synchronisation au premier chargement depuis le localStorage si présent
  useEffect(() => {
    const savedId = localStorage.getItem("selected_shipping_id");
    if (savedId) {
      setActiveId(savedId);
      const found = shippingOptions.find((opt) => opt.id === savedId);
      if (found && onSelectShipping) {
        onSelectShipping(found);
      }
    }
  }, []);

  const handleSelect = (option: ShippingOption) => {
    setActiveId(option.id);

    // Sauvegarde dans le localStorage pour le bloc de validation
    localStorage.setItem("selected_shipping_id", option.id);
    localStorage.setItem("selected_shipping_name", option.name);
    localStorage.setItem("selected_shipping_price", option.price.toString());

    if (onSelectShipping) {
      onSelectShipping(option);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-extrabold text-[#333333] mb-1">
          Mode de livraison
        </h2>
        <p className="text-xs sm:text-sm text-[#333333]/60">
          Sélectionnez votre mode d'expédition (Abidjan et expédition nationale).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {shippingOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = activeId === option.id;

          return (
            <label
              key={option.id}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? "border-[#333333] bg-[#333333]/5 shadow-sm"
                  : "border-[#333333]/15 bg-white hover:border-[#333333]/30 hover:bg-[#333333]/5"
              }`}
            >
              <div className="flex items-center gap-4">
                <input 
                  type="radio" 
                  name="shipping_method" 
                  checked={isSelected} 
                  onChange={() => handleSelect(option)} 
                  className="accent-[#333333] w-4 h-4 cursor-pointer shrink-0" 
                />
                
                <div
                  className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                    isSelected
                      ? "bg-[#333333] text-white shadow-sm"
                      : "bg-[#F5EBE6]/50 text-[#333333]/60 border border-[#333333]/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                
                <div>
                  <p className="text-sm font-bold text-[#333333]">{option.name}</p>
                  <p className="text-xs text-[#333333]/60 mt-0.5">{option.delay}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-2">
                <span className="text-sm font-extrabold text-[#333333] whitespace-nowrap bg-white px-3 py-1.5 rounded-lg border border-[#333333]/10 shadow-sm">
                  {option.price === 0 ? "Offerte" : `${option.price.toFixed(2).replace(".", ",")} €`}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}