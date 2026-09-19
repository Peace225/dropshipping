"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, ShieldCheck, ShoppingBag, CreditCard, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { ShippingSelector } from "@/components/checkout/shipping-selector";
import { PaymentOptions } from "@/components/checkout/payment-options";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart() || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const items = cart.items ?? cart.cart ?? cart.products ?? [];
  const totalPrice = cart.totalPrice ?? cart.total ?? 0;
  const shippingCost = 5.00; // Frais de port fixes ou dynamiques
  const finalTotal = totalPrice + (items.length > 0 ? shippingCost : 0);

  // Fonction déclenchée lors du clic sur "Procéder au paiement"
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Ici, tu peux ajouter la validation des champs du formulaire
      // 2. Enregistrer la commande en base de données (ex: Supabase) avec un statut "pending"
      // 3. Appeler ton API de paiement (ex: Stripe) pour générer la session de paiement

      // Simulation d'un appel API (ex: 1.5 seconde)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirection vers la page de succès ou la passerelle de paiement sécurisée
      router.push("/checkout/success"); // ou l'URL de Stripe renvoyée par ton backend
      
    } catch (error) {
      console.error("Erreur lors de la validation de la commande", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleProceedToPayment} className="min-h-screen bg-[#F5EBE6]/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* En-tête avec bouton de retour */}
        <div className="flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#333333]/70 hover:text-[#6E857B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au panier</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#6E857B] font-semibold bg-[#6E857B]/10 px-3 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            <span>Paiement sécurisé SSL</span>
          </div>
        </div>

        {/* Titre de la page */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#333333]">
            Finaliser votre commande
          </h1>
          <p className="text-sm text-[#333333]/60 mt-1">
            Complétez vos informations de livraison pour procéder au paiement sécurisé en ligne.
          </p>
        </div>

        {/* Si le panier est vide */}
        {items.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#333333]/10 text-center space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#6E857B]/10 text-[#6E857B] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#333333]">Votre panier est vide</h2>
            <p className="text-sm text-[#333333]/60">Vous devez ajouter des articles avant de passer commande.</p>
            <Link
              href="/boutique"
              className="inline-block py-3 px-6 rounded-xl bg-[#6E857B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#5b7067] transition-all"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Colonne Gauche : Formulaire de livraison & Options */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#333333]/10 shadow-sm">
                <CheckoutForm />
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#333333]/10 shadow-sm">
                <ShippingSelector />
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#333333]/10 shadow-sm">
                <PaymentOptions />
              </div>
            </div>

            {/* Colonne Droite : Validation de la commande & Résumé */}
            <div className="lg:col-span-5 space-y-6 sticky top-6">
              
              {/* Bloc Résumé des articles */}
              <div className="bg-white p-6 rounded-2xl border border-[#333333]/10 shadow-sm space-y-4">
                <h3 className="text-base font-bold font-serif text-[#333333] border-b border-[#333333]/10 pb-3 flex justify-between items-center">
                  <span>Articles dans votre panier</span>
                  <span className="text-xs bg-[#6E857B]/10 text-[#6E857B] px-2.5 py-1 rounded-full font-sans">
                    {items.length} {items.length > 1 ? "articles" : "article"}
                  </span>
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-[#333333]/10" />
                        )}
                        <div>
                          <p className="font-semibold text-[#333333] text-xs line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-[#333333]/60">Qté : {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-[#333333] whitespace-nowrap">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloc Validation de la commande & Bouton Paiement */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#333333]/10 shadow-sm space-y-6">
                <h3 className="text-lg font-bold font-serif text-[#333333] border-b border-[#333333]/10 pb-4">
                  Validation de la commande
                </h3>

                <div className="space-y-3 text-sm text-[#333333]/80">
                  <div className="flex justify-between">
                    <span>Sous-total articles</span>
                    <span className="font-semibold text-[#333333]">{totalPrice.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison (France)</span>
                    <span className="font-semibold text-[#333333]">{shippingCost.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#333333]/10 flex justify-between items-center">
                  <div>
                    <span className="block font-bold text-base text-[#333333]">Total à payer</span>
                    <span className="text-[10px] text-[#333333]/60">TVA incluse</span>
                  </div>
                  <span className="text-2xl font-black font-serif text-[#333333]">
                    {finalTotal.toFixed(2)} €
                  </span>
                </div>

                {/* Bouton de soumission connecté */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-[#6E857B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#5b7067] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Traitement en cours...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Procéder au paiement en ligne</span>
                    </>
                  )}
                </button>

                <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#333333]/60 text-center">
                  <Lock className="w-3.5 h-3.5 text-[#6E857B] shrink-0" />
                  <span>Paiement 100% sécurisé et chiffré SSL</span>
                </div>

                <div className="pt-4 border-t border-[#333333]/10 grid grid-cols-2 gap-2 text-[11px] text-[#333333]/60">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#6E857B] shrink-0" />
                    <span>Garantie Qualité</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Lock className="w-3.5 h-3.5 text-[#6E857B] shrink-0" />
                    <span>Paiement chiffré</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </form>
  );
}