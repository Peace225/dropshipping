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
    description: "Paiement sécurisé par Visa, Mastercard",
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#333333]">
          Mode de paiement en ligne
        </h3>
        <div className="flex items-center gap-1 text-xs text-green-700 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Sécurisé par Stripe</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {paymentMethods.map((method) => {
          const isSelected = activeMethod === method.id;

          return (
            <div key={method.id} className="space-y-3">
              <div
                onClick={() => handleSelect(method.id, method.name)}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-orange-500 bg-orange-50/30 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 w-full">
                  <div
                    className={`w-5 h-5 mt-0.5 sm:mt-0 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                      isSelected
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300 bg-transparent"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-[#333333]">{method.name}</p>
                        <p className="text-xs text-gray-500">{method.description}</p>
                      </div>

                      <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 w-fit">
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

              {/* Affichage conditionnel : si "Carte bancaire" est sélectionné, on invite le client à renseigner sa carte sur la page sécurisée Stripe */}
              {isSelected && method.id === "card" && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold text-[#333333]">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                    <span>Saisie sécurisée de la carte</span>
                  </div>
                  <p>
                    En cliquant sur <strong>"Procéder au paiement en ligne"</strong>, vous serez redirigé vers notre interface de paiement Stripe chiffrée pour saisir votre numéro de carte, votre date d'expiration et votre code CVC en toute sécurité. Stripe vérifiera instantanément si votre compte est approvisionné et opérationnel.
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