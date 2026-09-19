"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

export function CheckoutForm() {
  const router = useRouter();
  
  // Note : Assurez-vous d'exporter "items" (ou votre liste de produits) depuis useCart 
  // pour que Stripe sache quoi facturer.
  const { items, totalPrice, calculatedShippingFee } = useCart(); 
  const finalTotal = totalPrice + calculatedShippingFee;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. On envoie les données du client et son panier à notre future route API Next.js
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: items, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création de la session Stripe");
      }

      // 2. Stripe nous renvoie une URL de paiement sécurisée, on y redirige le client
      if (data.url) {
        window.location.href = data.url; 
      }

    } catch (error) {
      console.error("Erreur lors de la validation du paiement:", error);
      alert("Impossible d'initialiser le paiement. Veuillez réessayer.");
      setIsLoading(false); // On arrête le loader uniquement en cas d'erreur
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Colonne de gauche : Formulaire d'adresse et de contact */}
      <div className="lg:col-span-7 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#333333]/10 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#333333] mb-1">
            Informations de livraison
          </h2>
          <p className="text-xs text-[#333333]/60">
            Veuillez entrer vos coordonnées pour l'expédition de votre commande en France.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-1">
              Prénom
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#333333]/20 focus:outline-none focus:border-[#6E857B] text-sm text-[#333333]"
              placeholder="Ex: Marie"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-1">
              Nom
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#333333]/20 focus:outline-none focus:border-[#6E857B] text-sm text-[#333333]"
              placeholder="Ex: Dupont"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#333333]/20 focus:outline-none focus:border-[#6E857B] text-sm text-[#333333]"
              placeholder="marie.dupont@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#333333]/20 focus:outline-none focus:border-[#6E857B] text-sm text-[#333333]"
              placeholder="06 12 34 56 78"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-1">
            Adresse postale
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[#333333]/20 focus:outline-none focus:border-[#6E857B] text-sm text-[#333333]"
            placeholder="123 rue de la Paix"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-1">
              Code postal
            </label>
            <input
              type="text"
              name="postalCode"
              required
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#333333]/20 focus:outline-none focus:border-[#6E857B] text-sm text-[#333333]"
              placeholder="75001"
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-1">
              Ville
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#333333]/20 focus:outline-none focus:border-[#6E857B] text-sm text-[#333333]"
              placeholder="Paris"
            />
          </div>
        </div>
      </div>

      {/* Colonne de droite : Récapitulatif et Validation Paiement */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#333333]/10 shadow-sm space-y-6 sticky top-6">
          <h3 className="text-lg font-bold font-serif text-[#333333] border-b border-[#333333]/10 pb-4">
            Validation de la commande
          </h3>

          <div className="space-y-3 text-sm text-[#333333]/80">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span className="font-semibold text-[#333333]">{totalPrice.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison</span>
              <span className="font-semibold text-[#333333]">
                {calculatedShippingFee === 0 ? "Offerte" : `${calculatedShippingFee.toFixed(2)} €`}
              </span>
            </div>
            <div className="border-t border-[#333333]/10 pt-3 flex justify-between items-center text-base font-bold text-[#333333]">
              <span>Total à payer</span>
              <span className="text-xl font-serif">{finalTotal.toFixed(2)} €</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 px-4 rounded-xl bg-[#6E857B] hover:bg-[#5b7067] text-white text-[12.5px] sm:text-[12.5px] font-extrabold uppercase tracking-wide leading-tight transition-all shadow-sm hover:shadow-md inline-flex flex-nowrap items-center justify-center gap-2 whitespace-nowrap group active:scale-[0.97] disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
                <span className="whitespace-nowrap">Redirection...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 shrink-0 opacity-80" />
                <span className="whitespace-nowrap">Procéder au paiement</span>
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-[#333333]/60 pt-2">
            <Lock className="w-3.5 h-3.5 text-[#6E857B]" />
            <span>Paiement 100% sécurisé et chiffré SSL</span>
          </div>
        </div>
      </div>
    </form>
  );
}