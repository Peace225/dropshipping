"use client";

import { useState } from "react";
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

const shippingOptions: ShippingOption[] = [
  {
    id: "standard",
    name: "Livraison Standard à domicile",
    delay: "3 à 5 jours ouvrés",
    price: 5.00,
    icon: Truck,
  },
  {
    id: "relay",
    name: "Point Relais Colis",
    delay: "3 à 4 jours ouvrés",
    price: 3.50,
    icon: MapPin,
  },
  {
    id: "express",
    name: "Livraison Express",
    delay: "24 à 48 heures",
    price: 12.00,
    icon: Zap,
  },
];

export function ShippingSelector({
  selectedShippingId = "standard",
  onSelectShipping,
}: ShippingSelectorProps) {
  const [activeId, setActiveId] = useState(selectedShippingId);

  const handleSelect = (option: ShippingOption) => {
    setActiveId(option.id);
    if (onSelectShipping) {
      onSelectShipping(option);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold font-serif text-[#333333]">
          Mode de livraison
        </h3>
        <span className="text-xs text-[#333333]/60">Expédition France</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {shippingOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = activeId === option.id;

          return (
            <div
              key={option.id}
              onClick={() => handleSelect(option)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "border-[#6E857B] bg-[#6E857B]/5 shadow-sm"
                  : "border-[#333333]/10 bg-white hover:border-[#333333]/30"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`p-2.5 rounded-lg transition-colors ${
                    isSelected
                      ? "bg-[#6E857B] text-white"
                      : "bg-[#333333]/5 text-[#333333]/70"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#333333]">{option.name}</p>
                  <p className="text-xs text-[#333333]/60">{option.delay}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#333333] whitespace-nowrap">
                  {option.price === 0 ? "Offerte" : `${option.price.toFixed(2)} €`}
                </span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-[#6E857B] bg-[#6E857B] text-white"
                      : "border-[#333333]/20 bg-transparent"
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}