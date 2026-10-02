"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Lock, CreditCard, Truck, ShoppingBag, Trash2, Plus, Minus, Package } from "lucide-react";
import { useCart } from "@/context/cart-context";

const PLACEHOLDER = "https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/placeholder.jpg";

function cleanImageUrl(raw?: string): string {
  if (!raw) return PLACEHOLDER;
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  if (!first) return PLACEHOLDER;
  if (first.startsWith("http")) return first;
  const file = first.split("/").pop() || first;
  return `https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/${file}`;
}

function formatPrice(n: number) {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

function parseDeliveryPrice(str?: string): number {
  if (!str) return 0;
  const cleaned = str.replace("€", "").replace(",", ".").trim();
  const v = parseFloat(cleaned);
  return isNaN(v) ? 0 : v;
}

export default function CheckoutPage() {
  const router = useRouter();
  const cartCtx = useCart() as any;
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  
  // Formulaire
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Abidjan");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState<"card" | "momo">("card");
  const [isPaying, setIsPaying] = useState(false);

  // Charger le panier depuis le contexte
  useEffect(() => {
    const load = () => {
      try {
        let items: any[] = [];
        
        if (cartCtx?.items?.length) {
          items = cartCtx.items;
        } else if (cartCtx?.cart?.length) {
          items = cartCtx.cart;
        } else {
           const raw = localStorage.getItem("cart");
           if (raw) {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) items = parsed;
           }
        }
        
        const normalized = items.map((it: any) => ({
          id: it.id,
          name: it.name,
          slug: it.slug,
          price: Number(it.price) || 0,
          quantity: Number(it.quantity) || 1,
          image: cleanImageUrl(it.image || it.image_url),
          delivery: it.delivery || null,
        }));
        setCartItems(normalized);
      } catch (e) {
        console.error("Erreur panier:", e);
        setCartItems([]);
      } finally {
        setLoadingCart(false);
      }
    };
    load();
  }, [cartCtx]);

  // Calculs financiers avec livraison STRICTEMENT fixée à 10 €
  const { subtotal, deliveryTotal, total, totalQty } = useMemo(() => {
    const sub = cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
    let del = 0;
    const firstDel = cartItems.find((i) => i.delivery?.priceStr)?.delivery?.priceStr;
    
    if (firstDel) {
      del = parseDeliveryPrice(firstDel);
    } else {
      del = sub > 0 ? 10 : 0; // ICI : Toujours 10€ si le panier n'est pas vide
    }
    return { 
      subtotal: sub, 
      deliveryTotal: del, 
      total: sub + del, 
      totalQty: cartItems.reduce((s, i) => s + i.quantity, 0) 
    };
  }, [cartItems]);

  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) => {
      const next = prev.map((it) => it.id === id ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it).filter((it) => it.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(next));
      if (cartCtx?.updateQuantity) cartCtx.updateQuantity(id, next.find((i) => i.id === id)?.quantity);
      return next;
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      localStorage.setItem("cart", JSON.stringify(next));
      if (cartCtx?.removeItem) cartCtx.removeItem(id);
      if (cartCtx?.remove) cartCtx.remove(id);
      return next;
    });
  };

  const handlePay = async () => {
    if (cartItems.length === 0) return;
    if (!firstName || !lastName || !address || !city || !phone) {
      alert("Merci de remplir tous les champs obligatoires (*).");
      return;
    }
    
    setIsPaying(true);
    // Simulation paiement
    await new Promise((r) => setTimeout(r, 1200));
    
    alert(`Commande ECLOSIA validée !\n${totalQty} articles\nTotal: ${formatPrice(total)}\nPaiement: ${payment === "card" ? "Carte bancaire" : "Mobile Money"}`);
    
    // Vider le panier
    localStorage.removeItem("cart");
    localStorage.removeItem("panier");
    localStorage.removeItem("shopping_cart");
    localStorage.removeItem("checkout_items");
    
    if (cartCtx?.clear) cartCtx.clear();
    if (cartCtx?.clearCart) cartCtx.clearCart();
    
    router.push("/shop/merci");
  };

  if (loadingCart) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/20 via-white to-[#6E857B]/10 flex items-center justify-center py-20">
        <p className="font-bold text-[#333333] animate-pulse">Chargement du panier ECLOSIA...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/20 via-white to-[#6E857B]/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        <Link href="/shop/panier" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour au panier
        </Link>
        
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight mb-2">
          Validation de la Commande
        </h1>
        
        <p className="text-xs sm:text-sm text-[#333333]/60 mb-8 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
          {totalQty} article{totalQty > 1 ? "s" : ""} • Paiement 100% sécurisé
        </p>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#333333]/10 p-10 text-center shadow-sm">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-[#333333]/20" />
            <h2 className="font-extrabold text-lg text-[#333333] mb-2">Votre panier est vide</h2>
            <p className="text-sm text-[#333333]/60 mb-6">Ajoutez des produits depuis les univers Bébé ou Maman.</p>
            <div className="flex justify-center gap-3">
              <Link href="/shop/bebe" className="px-6 py-3 rounded-full bg-[#333333] hover:bg-black text-white font-bold text-sm transition-colors">Univers Bébé</Link>
              <Link href="/shop/maman" className="px-6 py-3 rounded-full bg-white border border-[#333333]/10 hover:bg-gray-50 text-[#333333] font-bold text-sm transition-colors">Univers Maman</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Formulaires */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
                <h2 className="text-base sm:text-lg font-extrabold text-[#333333] mb-5 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#6E857B]" /> 1. Adresse de livraison
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <label className="block font-bold text-[#333333] mb-1.5 ml-1">Prénom *</label>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="ex: Marie" className="w-full px-4 py-3.5 rounded-xl border border-[#333333]/15 focus:outline-none focus:border-[#6E857B] focus:ring-1 focus:ring-[#6E857B] placeholder:text-gray-400 transition-all" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#333333] mb-1.5 ml-1">Nom *</label>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="ex: Laurent" className="w-full px-4 py-3.5 rounded-xl border border-[#333333]/15 focus:outline-none focus:border-[#6E857B] focus:ring-1 focus:ring-[#6E857B] placeholder:text-gray-400 transition-all" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#333333] mb-1.5 ml-1">Adresse postale *</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Numéro et nom de rue" className="w-full px-4 py-3.5 rounded-xl border border-[#333333]/15 focus:outline-none focus:border-[#6E857B] focus:ring-1 focus:ring-[#6E857B] placeholder:text-gray-400 transition-all" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#333333] mb-1.5 ml-1">Ville *</label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex: Paris" className="w-full px-4 py-3.5 rounded-xl border border-[#333333]/15 focus:outline-none focus:border-[#6E857B] focus:ring-1 focus:ring-[#6E857B] placeholder:text-gray-400 transition-all" />
                  </div>
                  <div>
                    <label className="block font-bold text-[#333333] mb-1.5 ml-1">Téléphone *</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Pour le livreur" className="w-full px-4 py-3.5 rounded-xl border border-[#333333]/15 focus:outline-none focus:border-[#6E857B] focus:ring-1 focus:ring-[#6E857B] placeholder:text-gray-400 transition-all" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
                <h2 className="text-base sm:text-lg font-extrabold text-[#333333] mb-5 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#6E857B]" /> 2. Paiement Sécurisé
                </h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${payment === "card" ? "border-[#333333] bg-[#333333]/5" : "border-[#333333]/15 hover:bg-[#333333]/5"}`}>
                    <input type="radio" name="payment" checked={payment === "card"} onChange={() => setPayment("card")} className="accent-[#333333] w-4 h-4" />
                    <span className="text-xs sm:text-sm font-bold text-[#333333]">Carte bancaire (Visa, Mastercard)</span>
                    <Lock className="w-4 h-4 ml-auto text-[#6E857B]" />
                  </label>
                  <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${payment === "momo" ? "border-[#333333] bg-[#333333]/5" : "border-[#333333]/15 hover:bg-[#333333]/5"}`}>
                    <input type="radio" name="payment" checked={payment === "momo"} onChange={() => setPayment("momo")} className="accent-[#333333] w-4 h-4" />
                    <span className="text-xs sm:text-sm font-bold text-[#333333]">Mobile Money (Orange, MTN, Wave)</span>
                  </label>
                </div>
              </div>

              {/* Liste articles */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
                <h2 className="text-base sm:text-lg font-extrabold text-[#333333] mb-5 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#6E857B]" /> {totalQty} article{totalQty > 1 ? "s" : ""} dans votre commande
                </h2>
                <div className="flex flex-col divide-y divide-[#333333]/5">
                  {cartItems.map((it) => (
                    <div key={it.id} className="flex gap-4 py-5">
                      <div className="relative w-20 h-20 bg-[#6E857B]/5 rounded-xl border border-[#333333]/10 p-2 shrink-0 overflow-hidden">
                        <Image 
                          src={it.image} 
                          alt={it.name} 
                          fill
                          unoptimized
                          className="object-contain p-2 mix-blend-multiply" 
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link href={`/shop/${it.slug?.includes("bebe") || it.slug?.includes("matelas") || it.slug?.includes("culotte") ? "bebe" : "maman"}/${it.slug?.split("/").pop() || it.slug}`} className="font-bold text-[#333333] text-sm line-clamp-2 hover:underline">
                            {it.name}
                          </Link>
                          <p className="text-xs text-[#333333]/60 mt-1">
                            {it.delivery ? `${it.delivery.method === "relais" ? "Point Relais" : "À domicile"} - ${it.delivery.city || it.delivery.region} - ${it.delivery.priceStr}` : "Livraison Standard ECLOSIA"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(it.id, -1)} className="w-7 h-7 rounded-full border border-[#333333]/20 flex items-center justify-center hover:bg-[#333333] hover:text-white hover:border-[#333333] transition-colors"><Minus className="w-3 h-3" /></button>
                            <span className="text-sm font-bold text-[#333333] w-6 text-center">{it.quantity}</span>
                            <button onClick={() => updateQty(it.id, 1)} className="w-7 h-7 rounded-full border border-[#333333]/20 flex items-center justify-center hover:bg-[#333333] hover:text-white hover:border-[#333333] transition-colors"><Plus className="w-3 h-3" /></button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-extrabold text-sm text-[#333333]">{formatPrice(it.price * it.quantity)}</span>
                            <button onClick={() => removeItem(it.id)} className="text-red-400 hover:text-red-600 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Récapitulatif collant */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col gap-6 sticky top-24">
              <h2 className="text-lg font-extrabold text-[#333333] border-b border-[#333333]/10 pb-4">
                Résumé de la commande
              </h2>
              
              <div className="flex flex-col gap-3 text-xs sm:text-sm font-medium text-[#333333]/80">
                <div className="flex justify-between">
                  <span>Sous-total ({totalQty} articles)</span>
                  <span className="font-bold text-[#333333]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Livraison</span>
                  <span className="font-bold text-[#333333]">{formatPrice(deliveryTotal)}</span>
                </div>
                {cartItems[0]?.delivery && (
                  <div className="text-[11px] text-[#333333]/60 bg-[#F5EBE6]/30 p-2 rounded-lg mt-1 border border-[#333333]/5">
                    → {cartItems[0].delivery.method === "relais" ? "Point Relais" : "À domicile"} : {cartItems[0].delivery.city} - {cartItems[0].delivery.region}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-[#333333]/10 text-base sm:text-lg font-extrabold text-[#333333]">
                <span>Total à payer</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              <button 
                onClick={handlePay} 
                disabled={isPaying || cartItems.length === 0} 
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#333333] hover:bg-black text-white font-bold text-sm transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                <Lock className="w-4 h-4" />
                <span>{isPaying ? "Traitement en cours..." : `Payer ${formatPrice(total)}`}</span>
              </button>
              
              <div className="flex items-center gap-2 pt-2 text-[11px] text-[#333333]/60 font-medium justify-center text-center">
                <ShieldCheck className="w-4 h-4 text-[#6E857B] flex-shrink-0" />
                <span>Transactions cryptées SSL • Paiement sécurisé</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}