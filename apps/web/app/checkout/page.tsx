"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, ShieldCheck, ShoppingBag, CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { ShippingSelector } from "@/components/checkout/shipping-selector";
import { PaymentOptions } from "@/components/checkout/payment-options";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart() || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localItems, setLocalItems] = useState<any[]>([]);

  // État pour stocker et synchroniser les informations du formulaire de livraison
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  // États pour le mode de paiement et le mode de livraison sélectionnés
  const [selectedPaymentName, setSelectedPaymentName] = useState("Carte bancaire");
  const [selectedShippingName, setSelectedShippingName] = useState("Livraison Standard à domicile");
  const [shippingPrice, setShippingPrice] = useState<number>(5.00);

  // Charger les articles, l'adresse, le mode de livraison et le paiement depuis le localStorage au premier rendu
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart") || localStorage.getItem("panier");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setLocalItems(parsed);
        } else if (parsed.items && Array.isArray(parsed.items)) {
          setLocalItems(parsed.items);
        }
      }

      const savedAddress = localStorage.getItem("shipping_address");
      if (savedAddress) {
        setShippingAddress(JSON.parse(savedAddress));
      }

      const savedPaymentName = localStorage.getItem("selected_payment_name");
      if (savedPaymentName) {
        setSelectedPaymentName(savedPaymentName);
      }

      const savedShippingName = localStorage.getItem("selected_shipping_name");
      if (savedShippingName) {
        setSelectedShippingName(savedShippingName);
      }

      const savedShippingPrice = localStorage.getItem("selected_shipping_price");
      if (savedShippingPrice) {
        setShippingPrice(parseFloat(savedShippingPrice));
      }
    } catch (e) {
      console.error("Erreur de lecture du localStorage", e);
    }
  }, []);
  
  // Fonction de mise à jour des champs transmise au formulaire
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updated = { ...shippingAddress, [e.target.name]: e.target.value };
    setShippingAddress(updated);
    localStorage.setItem("shipping_address", JSON.stringify(updated));
  };

  // Gestion du changement de mode de paiement
  const handlePaymentSelect = (methodId: string) => {
    const name = methodId === "apple-google-pay" ? "Apple Pay / Google Pay" : "Carte bancaire";
    setSelectedPaymentName(name);
    localStorage.setItem("selected_payment_method", methodId);
    localStorage.setItem("selected_payment_name", name);
  };

  // Gestion du changement de mode de livraison
  const handleShippingSelect = (option: any) => {
    setSelectedShippingName(option.name);
    setShippingPrice(option.price);
    localStorage.setItem("selected_shipping_id", option.id);
    localStorage.setItem("selected_shipping_name", option.name);
    localStorage.setItem("selected_shipping_price", option.price.toString());
  };
  
  // On combine le contexte et le localStorage pour être sûr d'avoir les articles
  const contextItems = cart.items ?? cart.cart ?? cart.products ?? [];
  const items = contextItems.length > 0 ? contextItems : localItems;

  const totalPrice = items.reduce((sum: number, item: any) => sum + (Number(item.price) * Number(item.quantity || 1)), 0);
  
  // Calcul final basé sur le prix de livraison sélectionné
  const finalTotal = totalPrice + (items.length > 0 ? shippingPrice : 0);

  // Fonction déclenchée lors du clic sur le paiement : envoie les données à l'API pour générer la session Stripe
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: shippingAddress,
        items: items,
        total: finalTotal,
        shippingCost: shippingPrice,
        shippingMethod: selectedShippingName,
        paymentMethod: selectedPaymentName,
      };

      // Sauvegarde locale pour la page de succès
      localStorage.setItem("final_order", JSON.stringify(orderPayload));

      // Appel de l'API pour créer la session Stripe et insérer dans Supabase
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'initialisation du paiement Stripe.");
      }

      // Redirection vers la page de paiement sécurisée de Stripe
      if (data.url) {
        window.location.href = data.url;
      } else {
        router.push("/checkout/success");
      }
    } catch (error: any) {
      console.error("Erreur lors de la validation de la commande", error);
      alert(error.message || "Une erreur est survenue. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleProceedToPayment} className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* En-tête avec bouton de retour */}
        <div className="flex items-center justify-between">
          <Link
            href="/shop/maternite"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#333333]/70 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la boutique</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-green-700 font-semibold bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            <span>Paiement 100% sécurisé SSL</span>
          </div>
        </div>

        {/* Titre de la page */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333]">
            Finaliser votre commande
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Complétez vos informations de livraison et choisissez votre mode de paiement pour valider votre commande.
          </p>
        </div>

        {/* Si le panier est vide */}
        {items.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-[#333333]">Votre panier est vide</h2>
            <p className="text-sm text-gray-500">Vous devez ajouter des articles avant de passer commande.</p>
            <Link
              href="/shop/maternite"
              className="inline-block py-3 px-6 rounded-xl bg-orange-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-all shadow-sm"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ==========================================================
                COLONNE GAUCHE : FORMULAIRES & OPTIONS
            ========================================================== */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Bloc Informations de livraison */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">1</div>
                  <h2 className="text-base font-extrabold text-[#333333]">Informations de livraison</h2>
                </div>
                <CheckoutForm formData={shippingAddress} onChange={handleAddressChange} />
              </div>

              {/* 2. Bloc Mode de livraison */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">2</div>
                  <h2 className="text-base font-extrabold text-[#333333]">Mode de livraison</h2>
                </div>
                <ShippingSelector onSelectShipping={handleShippingSelect} />
              </div>

              {/* 3. Bloc Mode de paiement en ligne */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">3</div>
                  <h2 className="text-base font-extrabold text-[#333333]">Mode de paiement en ligne</h2>
                </div>
                <PaymentOptions onSelectMethod={handlePaymentSelect} />
              </div>

            </div>

            {/* ==========================================================
                COLONNE DROITE : RÉSUMÉ & VALIDATION (Sticky)
            ========================================================== */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              
              {/* Bloc : Articles dans votre panier */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#333333] border-b border-gray-100 pb-3 flex justify-between items-center">
                  <span>Articles dans votre panier</span>
                  <span className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-0.5 rounded-full">
                    {items.length} {items.length > 1 ? "articles" : "article"}
                  </span>
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item: any, idx: number) => (
                    <div key={item.id || idx} className="flex items-center justify-between gap-3 text-sm py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-xl border border-gray-100 bg-gray-50 p-1 shrink-0" />
                        )}
                        <div>
                          <p className="font-bold text-[#333333] text-xs line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-gray-500">
                            Qté : {item.quantity} {item.delivery?.city ? `• ${item.delivery.city}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className="font-extrabold text-xs text-[#333333] whitespace-nowrap">
                        {(Number(item.price) * Number(item.quantity || 1)).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloc : Validation de la commande & Calcul des prix réels */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                <h3 className="text-base font-extrabold text-[#333333] border-b border-gray-100 pb-3">
                  Validation de la commande
                </h3>

                <div className="space-y-2.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Sous-total articles</span>
                    <span className="font-bold text-[#333333]">{totalPrice.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="truncate pr-2 max-w-[180px]">Livraison ({selectedShippingName})</span>
                    <span className="font-bold text-orange-600 whitespace-nowrap">
                      {shippingPrice === 0 ? "Offerte" : `${shippingPrice.toFixed(2)} €`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-50 pt-2">
                    <span>Mode de paiement</span>
                    <span className="font-bold text-[#333333]">{selectedPaymentName}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="block font-extrabold text-sm text-[#333333]">Total à payer</span>
                    <span className="text-[10px] text-gray-400">TVA incluse</span>
                  </div>
                  <span className="text-2xl font-black text-[#333333]">
                    {finalTotal.toFixed(2)} €
                  </span>
                </div>

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-orange-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Redirection vers Stripe...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Procéder au paiement en ligne</span>
                    </>
                  )}
                </button>

                <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 text-center">
                  <Lock className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>Paiement 100% sécurisé et chiffré SSL</span>
                </div>

                <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Garantie Qualité</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>Transactions sécurisées</span>
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