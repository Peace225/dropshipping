"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, CreditCard } from "lucide-react";

interface PaymentOptionsProps {
  selectedMethod?: string;
  onSelectMethod?: (methodId: string) => void;
}

const paymentMethods = [
  {
    id: "card",
    name: "Carte bancaire",
    description: "Paiement sécurisé par Visa, Mastercard, CB",
    logos: [
      { name: "Visa", src: "/images/payments/visa.jpg" },
      { name: "Mastercard", src: "/images/payments/mastercard.jpg" },
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

  useEffect(() => {
    const saved = localStorage.getItem("selected_payment_method");
    if (saved) {
      setActiveMethod(saved);
      if (onSelectMethod) onSelectMethod(saved);
    }
  }, []);

  const handleSelect = (id: string, name: string) => {
    setActiveMethod(id);
    localStorage.setItem("selected_payment_method", id);
    localStorage.setItem("selected_payment_name", name);

    if (onSelectMethod) {
      onSelectMethod(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#333333] mb-1">
            Mode de paiement
          </h2>
          <p className="text-xs sm:text-sm text-[#333333]/60">
            Sélectionnez votre méthode de paiement sécurisée.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#6E857B] font-bold bg-[#6E857B]/10 px-3 py-1.5 rounded-full shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Sécurisé</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {paymentMethods.map((method) => {
          const isSelected = activeMethod === method.id;

          return (
            <div key={method.id} className="space-y-3">
              <label
                onClick={() => handleSelect(method.id, method.name)}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#333333] bg-[#333333]/5 shadow-sm"
                    : "border-[#333333]/15 bg-white hover:border-[#333333]/30 hover:bg-[#333333]/5"
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 w-full">
                  <input 
                    type="radio" 
                    name="payment_method" 
                    checked={isSelected} 
                    onChange={() => handleSelect(method.id, method.name)} 
                    className="accent-[#333333] w-4 h-4 mt-0.5 sm:mt-0 cursor-pointer" 
                  />

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#333333]">{method.name}</p>
                        <p className="text-xs text-[#333333]/60 mt-0.5">{method.description}</p>
                      </div>

                      <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-[#333333]/10 w-fit shrink-0 shadow-sm">
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
              </label>

              {/* Affichage conditionnel avec l'identité visuelle ECLOSIA */}
              {isSelected && method.id === "card" && (
                <div className="p-5 rounded-2xl bg-[#F5EBE6]/30 border border-[#333333]/10 text-xs text-[#333333]/80 space-y-2.5 transition-all">
                  <div className="flex items-center gap-2 font-bold text-[#333333] text-sm">
                    <CreditCard className="w-4 h-4 text-[#6E857B]" />
                    <span>Saisie sécurisée de la carte</span>
                  </div>
                  <p className="leading-relaxed">
                    En cliquant sur <strong>"Procéder au paiement en ligne"</strong>, vous serez redirigé vers notre interface de paiement Stripe chiffrée de bout en bout (SSL) pour saisir votre numéro de carte en toute sécurité. Aucune donnée bancaire n'est stockée sur nos serveurs.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}