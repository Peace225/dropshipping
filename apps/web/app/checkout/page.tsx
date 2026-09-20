"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, ShoppingBag, CreditCard, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { ShippingSelector } from "@/components/checkout/shipping-selector";
import { PaymentOptions } from "@/components/checkout/payment-options";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localItems, setLocalItems] = useState<any[]>([]);
  const [selectedPaymentName, setSelectedPaymentName] = useState("Carte bancaire");
  const [selectedShippingName, setSelectedShippingName] = useState("Livraison Standard à domicile");
  const [shippingPrice, setShippingPrice] = useState<number>(5.00);

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
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur Stripe");
      if (data.url) window.location.href = data.url;
      else router.push("/checkout/success");
    } catch (error: any) {
      alert(error.message || "Une erreur est survenue");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleProceedToPayment} className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/shop/maternite" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#333333]/70 hover:text-orange-600">
            <ArrowLeft className="w-4 h-4" />Retour à la boutique
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-green-700 font-semibold bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5" />Paiement 100% sécurisé SSL
          </div>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333]">Finaliser votre commande</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Complétez vos informations de livraison et choisissez votre mode de paiement.</p>
        </div>
        {items.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border text-center max-w-xl mx-auto">
            <ShoppingBag className="w-6 h-6 mx-auto text-orange-500" />
            <h2 className="font-extrabold mt-2">Votre panier est vide</h2>
            <Link href="/shop/maternite" className="inline-block mt-4 py-3 px-6 rounded-xl bg-orange-500 text-white text-xs font-bold uppercase">Découvrir la boutique</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 sm:p-7 rounded-2xl border shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b pb-3"><div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">1</div><h2 className="text-base font-extrabold">Informations de livraison</h2></div>
                <CheckoutForm />
              </div>
              <div className="bg-white p-6 sm:p-7 rounded-2xl border shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b pb-3"><div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">2</div><h2 className="text-base font-extrabold">Mode de livraison</h2></div>
                <ShippingSelector onSelectShipping={handleShippingSelect} />
              </div>
              <div className="bg-white p-6 sm:p-7 rounded-2xl border shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b pb-3"><div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">3</div><h2 className="text-base font-extrabold">Mode de paiement en ligne</h2></div>
                <PaymentOptions onSelectMethod={handlePaymentSelect} />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider border-b pb-3 flex justify-between"><span>Panier</span><span className="text-xs bg-orange-50 text-orange-600 border px-2.5 py-0.5 rounded-full">{items.length} articles</span></h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item: any, idx: number) => (
                    <div key={item.id || idx} className="flex items-center justify-between gap-3 text-sm py-2 border-b last:border-0">
                      <div className="flex items-center gap-3"><p className="font-bold text-xs line-clamp-1">{item.name} x {item.quantity}</p></div>
                      <span className="font-extrabold text-xs">{(Number(item.price) * Number(item.quantity || 1)).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 sm:p-7 rounded-2xl border shadow-sm space-y-5">
                <h3 className="text-base font-extrabold border-b pb-3">Validation</h3>
                <div className="space-y-2.5 text-xs text-gray-600">
                  <div className="flex justify-between"><span>Sous-total</span><span className="font-bold text-[#333333]">{totalPrice.toFixed(2)} €</span></div>
                  <div className="flex justify-between"><span>Livraison ({selectedShippingName})</span><span className="font-bold text-orange-600">{shippingPrice === 0 ? "Offerte" : `${shippingPrice.toFixed(2)} €`}</span></div>
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="font-extrabold text-sm">Total à payer</span>
                  <span className="text-2xl font-black">{finalTotal.toFixed(2)} €</span>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-4 px-6 rounded-xl bg-orange-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-600 flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Redirection...</> : <><CreditCard className="w-4 h-4" />Procéder au paiement</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
