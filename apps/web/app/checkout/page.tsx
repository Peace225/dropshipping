"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, ShoppingBag, CreditCard, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { ShippingSelector } from "@/components/checkout/shipping-selector";
import { PaymentOptions } from "@/components/checkout/payment-options";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localItems, setLocalItems] = useState<any[]>([]);
  
  const [selectedPaymentName, setSelectedPaymentName] = useState("Carte bancaire");
  const [selectedShippingName, setSelectedShippingName] = useState("Livraison Standard à domicile");
  
  // RÈGLE STRICTE ECLOSIA : La livraison est toujours à 10 €
  const [shippingPrice, setShippingPrice] = useState<number>(10.00);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart") || localStorage.getItem("panier");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setLocalItems(parsed);
        else if (parsed.items && Array.isArray(parsed.items)) setLocalItems(parsed.items);
      }
      
      const savedPaymentName = localStorage.getItem("selected_payment_name");
      if (savedPaymentName) setSelectedPaymentName(savedPaymentName);
      
      const savedShippingName = localStorage.getItem("selected_shipping_name");
      if (savedShippingName) setSelectedShippingName(savedShippingName);
      
      // On ignore le prix de livraison sauvegardé pour forcer à 10€
      // Mais si vous avez d'autres options (Express à 15€ par ex), on peut le récupérer
      const savedShippingPrice = localStorage.getItem("selected_shipping_price");
      if (savedShippingPrice) setShippingPrice(parseFloat(savedShippingPrice));
    } catch (e) {
      console.error("Erreur localStorage", e);
    }
  }, []);

  const handlePaymentSelect = (methodId: string) => {
    const name = methodId === "apple-google-pay" ? "Apple Pay / Google Pay" : "Carte bancaire";
    setSelectedPaymentName(name);
    localStorage.setItem("selected_payment_method", methodId);
    localStorage.setItem("selected_payment_name", name);
  };

  const handleShippingSelect = (option: any) => {
    setSelectedShippingName(option.name);
    setShippingPrice(option.price);
    localStorage.setItem("selected_shipping_id", option.id);
    localStorage.setItem("selected_shipping_name", option.name);
    localStorage.setItem("selected_shipping_price", option.price.toString());
  };

  const contextItems = Array.isArray(cart) ? cart : [];
  const items = contextItems.length > 0 ? contextItems : localItems;
  
  const totalPrice = items.reduce((sum: number, item: any) => sum + (Number(item.price) * Number(item.quantity || 1)), 0);
  // Frais de port sécurisé : si 0 article, 0€ de port. Sinon, on applique le shippingPrice.
  const finalTotal = totalPrice + (items.length > 0 ? shippingPrice : 0);

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let shippingAddress: any = {};
      try {
        const saved = localStorage.getItem("shipping_address");
        if (saved) shippingAddress = JSON.parse(saved);
      } catch {}
      
      if (!shippingAddress.firstName || !shippingAddress.email) {
        alert("Veuillez remplir vos informations de livraison.");
        setIsSubmitting(false);
        return;
      }
      
      const orderPayload = {
        customer: shippingAddress,
        items,
        total: finalTotal,
        shippingCost: shippingPrice,
        shippingMethod: selectedShippingName,
        paymentMethod: selectedPaymentName,
      };
      
      localStorage.setItem("final_order", JSON.stringify(orderPayload));
      
      // Simulation appel API Stripe
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Erreur Stripe");
      
      // Nettoyage avant redirection
      localStorage.removeItem("cart");
      localStorage.removeItem("panier");
      clearCart();
      
      if (data.url) window.location.href = data.url;
      else router.push("/shop/merci"); // Redirection vers votre page merci ECLOSIA
      
    } catch (error: any) {
      alert(error.message || "Une erreur est survenue");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleProceedToPayment} className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/20 via-white to-[#6E857B]/10 py-10 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/shop/panier" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour au panier
          </Link>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#6E857B] font-bold bg-[#6E857B]/10 border border-[#6E857B]/20 px-4 py-2 rounded-full shadow-sm w-fit">
            <Lock className="w-3.5 h-3.5" /> Paiement 100% sécurisé SSL
          </div>
        </div>
        
        {/* Titre */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333]">Finaliser votre commande</h1>
          <p className="text-xs sm:text-sm text-[#333333]/60 mt-1">Complétez vos informations de livraison et choisissez votre mode de paiement.</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#333333]/10 shadow-sm text-center max-w-xl mx-auto">
            <ShoppingBag className="w-12 h-12 mx-auto text-[#333333]/20 mb-4" />
            <h2 className="text-lg font-extrabold text-[#333333] mt-2">Votre panier est vide</h2>
            <Link href="/" className="inline-block mt-6 py-3.5 px-8 rounded-full bg-[#333333] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors shadow-sm">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Colonne de gauche (Formulaires) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Étape 1 : Adresse */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-[#333333]/10 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#333333] text-white flex items-center justify-center font-bold text-sm shadow-sm">1</div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#333333]">Informations de livraison</h2>
                </div>
                <CheckoutForm />
              </div>
              
              {/* Étape 2 : Livraison */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-[#333333]/10 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#333333] text-white flex items-center justify-center font-bold text-sm shadow-sm">2</div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#333333]">Mode de livraison</h2>
                </div>
                <ShippingSelector onSelectShipping={handleShippingSelect} />
              </div>
              
              {/* Étape 3 : Paiement */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-[#333333]/10 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#333333] text-white flex items-center justify-center font-bold text-sm shadow-sm">3</div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#333333]">Mode de paiement en ligne</h2>
                </div>
                <PaymentOptions onSelectMethod={handlePaymentSelect} />
              </div>

            </div>

            {/* Colonne de droite (Récapitulatif & Bouton) */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              
              {/* Liste Panier */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#333333] border-b border-[#333333]/10 pb-4 flex justify-between items-center">
                  <span>Panier</span>
                  <span className="text-[10px] bg-[#6E857B]/10 text-[#6E857B] border border-[#6E857B]/20 px-2.5 py-1 rounded-full shadow-sm">
                    {items.length} article{items.length > 1 ? "s" : ""}
                  </span>
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item: any, idx: number) => (
                    <div key={item.id || idx} className="flex items-center justify-between gap-3 text-sm py-3 border-b border-[#333333]/5 last:border-0">
                      <div className="flex items-center gap-3 flex-1">
                        <p className="font-bold text-[#333333] text-xs line-clamp-2 leading-snug">
                          {item.name} <span className="text-[#333333]/50 ml-1">x {item.quantity}</span>
                        </p>
                      </div>
                      <span className="font-extrabold text-[#333333] text-sm shrink-0">
                        {(Number(item.price) * Number(item.quantity || 1)).toFixed(2).replace(".", ",")} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validation Total */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm space-y-6">
                <h3 className="text-base font-extrabold text-[#333333] border-b border-[#333333]/10 pb-4">Validation</h3>
                
                <div className="space-y-3 text-xs sm:text-sm text-[#333333]/80 font-medium">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-bold text-[#333333]">{totalPrice.toFixed(2).replace(".", ",")} €</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Livraison ({selectedShippingName})</span>
                    <span className="font-bold text-[#333333]">{shippingPrice.toFixed(2).replace(".", ",")} €</span>
                  </div>
                </div>
                
                <div className="pt-5 border-t border-[#333333]/10 flex justify-between items-center">
                  <span className="font-extrabold text-sm text-[#333333]">Total à payer</span>
                  <span className="text-2xl font-black text-[#333333]">{finalTotal.toFixed(2).replace(".", ",")} €</span>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting || items.length === 0} 
                  className="w-full py-4 px-6 rounded-full bg-[#333333] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Traitement en cours...</>
                  ) : (
                    <><CreditCard className="w-4 h-4" /> Procéder au paiement</>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </form>
  );
}