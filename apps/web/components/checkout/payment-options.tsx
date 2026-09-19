"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

interface PaymentOptionsProps {
  selectedMethod?: string;
  onSelectMethod?: (methodId: string) => void;
}

const paymentMethods = [
  {
    id: "card",
    name: "Carte bancaire",
    description: "Visa, Mastercard, Paypal",
    logos: [
      { name: "Visa", src: "/images/payments/visa.jpg" }, // Ou .svg selon ton fichier
      { name: "Mastercard", src: "/images/payments/mastercard.jpg" },
      { name: "CB", src: "/images/payments/paypal.jpg" },
    ],
  },
  {
    id: "apple-google-pay",
    name: "Apple Pay / Google Pay",
    description: "Paiement instantané et sécurisé en un clic",
    logos: [
      { name: "Apple Pay", src: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" },
      { name: "Google Pay", src: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" },
    ],
  },
];

export function PaymentOptions({ selectedMethod = "card", onSelectMethod }: PaymentOptionsProps) {
  const [activeMethod, setActiveMethod] = useState(selectedMethod);

  const handleSelect = (id: string) => {
    setActiveMethod(id);
    if (onSelectMethod) {
      onSelectMethod(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold font-serif text-[#333333]">
          Mode de paiement en ligne
        </h3>
        <div className="flex items-center gap-1 text-xs text-[#6E857B] font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Sécurisé</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {paymentMethods.map((method) => {
          const isSelected = activeMethod === method.id;

          return (
            <div
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "border-[#6E857B] bg-[#6E857B]/5 shadow-sm"
                  : "border-[#333333]/10 bg-white hover:border-[#333333]/30"
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5 w-full">
                {/* Radio button personnalisé à gauche */}
                <div
                  className={`w-5 h-5 mt-0.5 sm:mt-0 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                    isSelected
                      ? "border-[#6E857B] bg-[#6E857B] text-white"
                      : "border-[#333333]/20 bg-transparent"
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-[#333333]">{method.name}</p>
                      <p className="text-xs text-[#333333]/60">{method.description}</p>
                    </div>

                    {/* Vrais Logos en images */}
                    <div className="flex items-center gap-2 bg-white/80 px-2.5 py-1.5 rounded-lg border border-[#333333]/10 w-fit">
                      {method.logos.map((logo, idx) => (
                        <img
                          key={idx}
                          src={logo.src}
                          alt={logo.name}
                          className="h-5 w-auto object-contain max-h-5"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-2">
        <p className="text-[11px] text-[#333333]/50">
          Transactions cryptées et sécurisées par protocole SSL / Stripe.
        </p>
      </div>
    </div>
  );
}