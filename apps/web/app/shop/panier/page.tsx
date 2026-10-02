"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, ShoppingBag, ShieldCheck, ArrowRight, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/cart-context";

const PLACEHOLDER = "https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/placeholder.jpg";

function cleanImageUrl(raw?: string): string {
  if (!raw) return PLACEHOLDER;
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  if (!first) return PLACEHOLDER;
  if (first.startsWith("http")) return first;
  const f = first.split("/").pop() || first;
  return `https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/${f}`;
}

function formatPrice(n: number) {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

function getUniversLabel(slug?: string, name?: string): string {
  if (!slug && !name) return "ECLOSIA";
  const s = (slug || "").toLowerCase();
  const nn = (name || "").toLowerCase();
  if (s.includes("bebe") || s.includes("culotte") || s.includes("matelas") || s.includes("gigoteuse") || s.includes("maillot") || nn.includes("culotte") || nn.includes("matelas") || nn.includes("bébé")) {
    return "Univers Bébé";
  }
  if (s.includes("maman") || s.includes("allaitement") || s.includes("serviette") || s.includes("carré") || s.includes("démaquillant") || nn.includes("allaitement") || nn.includes("serviette")) {
    return "Univers Maman";
  }
  return "ECLOSIA";
}

export default function CartPage() {
  const cartCtx = useCart() as any;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const items = (cartCtx?.items || cartCtx?.cart || []) as any[];

  // Calculs avec livraison stricte à 10 €
  const { subtotal, shipping, total, totalQty } = useMemo(() => {
    const sub = items.reduce((sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
    const ship = sub > 0 ? 10 : 0; // Toujours 10€ si le panier n'est pas vide
    return { 
      subtotal: sub, 
      shipping: ship, 
      total: sub + ship, 
      totalQty: items.reduce((s: number, it: any) => s + (Number(it.quantity) || 1), 0) 
    };
  }, [items]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/20 via-white to-[#6E857B]/10 flex items-center justify-center pt-20">
        <p className="animate-pulse font-bold text-[#333333]">Chargement du panier...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/20 via-white to-[#6E857B]/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Continuer mes achats
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight mb-2">
          Votre Panier ECLOSIA
        </h1>
        
        <p className="text-xs sm:text-sm text-[#333333]/60 mb-8 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#6E857B]" />
          {totalQty} article{totalQty > 1 ? "s" : ""} • Paiement 100% sécurisé
        </p>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#333333]/10 p-10 sm:p-16 text-center shadow-sm">
            <ShoppingBag className="w-14 h-14 mx-auto mb-4 text-[#333333]/15" />
            <h2 className="text-xl font-extrabold text-[#333333] mb-2">Votre panier est vide</h2>
            <p className="text-sm text-[#333333]/60 mb-8">Découvrez nos univers Bébé & Maman, 100% lavables et certifiés Oeko-Tex.</p>
            <div className="flex justify-center gap-3">
              <Link href="/shop/bebe" className="px-6 py-3 rounded-full bg-[#333333] text-white font-bold text-sm hover:bg-black transition-colors">Univers Bébé</Link>
              <Link href="/shop/maman" className="px-6 py-3 rounded-full bg-white border border-[#333333]/10 text-[#333333] font-bold text-sm hover:bg-gray-50 transition-colors">Univers Maman</Link>
            </div>
            <button onClick={() => { if (typeof window !== "undefined") { localStorage.clear(); window.location.reload(); } }} className="mt-8 text-[10px] text-[#333333]/30 hover:text-[#333333]/60 underline transition-colors">
              Réinitialiser les cookies du panier
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Liste des articles */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item: any) => {
                const univers = getUniversLabel(item.slug, item.name);
                const img = cleanImageUrl(item.image || item.image_url);
                const slugOnly = (item.slug || "").split("/").pop() || item.slug;
                const linkHref = univers.includes("Bébé") ? `/shop/bebe/${slugOnly}` : `/shop/maman/${slugOnly}`;
                
                return (
                  <div key={item.id} className="bg-white p-4 sm:p-6 rounded-2xl border border-[#333333]/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="relative w-20 h-20 bg-[#6E857B]/5 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 border border-[#333333]/5">
                        <img 
                          src={img} 
                          alt={item.name} 
                          className="w-full h-full object-contain p-1 mix-blend-multiply" 
                          loading="lazy" 
                        />
                      </div>
                      
                      <div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1 ${univers.includes("Bébé") ? "bg-[#6E857B]/10 text-[#6E857B]" : "bg-[#333333]/5 text-[#333333]"}`}>
                          {univers}
                        </span>
                        <Link href={linkHref}>
                          <h2 className="font-extrabold text-sm sm:text-[15px] text-[#333333] hover:text-black line-clamp-2 leading-snug transition-colors">
                            {item.name}
                          </h2>
                        </Link>
                        {item.delivery && (
                          <p className="text-[11px] text-[#333333]/60 mt-1">
                            {item.delivery.city} • {item.delivery.method === "relais" ? "Point Relais" : "À domicile"}
                          </p>
                        )}
                        <p className="text-xs font-bold text-[#333333] mt-1">{formatPrice(Number(item.price))}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#333333]/5">
                      <div className="flex items-center border border-[#333333]/15 rounded-full px-2 py-1 bg-white">
                        <button 
                          onClick={() => cartCtx.updateQuantity(item.id, Number(item.quantity) - 1)} 
                          aria-label="Diminuer" 
                          className="p-1.5 hover:text-black text-[#333333]/60 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#333333] min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => cartCtx.updateQuantity(item.id, Number(item.quantity) + 1)} 
                          aria-label="Augmenter" 
                          className="p-1.5 hover:text-black text-[#333333]/60 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <span className="font-extrabold text-[#333333] text-sm min-w-[70px] text-right">
                        {formatPrice(Number(item.price) * Number(item.quantity))}
                      </span>
                      
                      <button 
                        onClick={() => {
                          if (cartCtx?.removeItem) cartCtx.removeItem(item.id);
                          if (cartCtx?.remove) cartCtx.remove(item.id);
                        }} 
                        aria-label="Supprimer" 
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                  </div>
                );
              })}
            </div>

            {/* Récapitulatif et bouton de validation */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col gap-6 sticky top-24">
              <h2 className="text-lg font-extrabold text-[#333333] border-b border-[#333333]/10 pb-4">
                Récapitulatif
              </h2>
              
              <div className="flex flex-col gap-3 text-xs sm:text-sm font-medium text-[#333333]/80">
                <div className="flex justify-between">
                  <span>Sous-total ({totalQty} articles)</span>
                  <span className="font-bold text-[#333333]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Livraison</span>
                  <span className="font-bold text-[#333333]">{formatPrice(shipping)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-[#333333]/10 text-base sm:text-lg font-extrabold text-[#333333]">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              <Link href="/checkout" className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#333333] hover:bg-black text-white font-bold text-sm transition-all active:scale-95 shadow-md text-center mt-2">
                <span>Passer la commande</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <button onClick={() => cartCtx.clear()} className="text-xs text-[#333333]/50 hover:text-[#333333] underline text-center transition-colors">
                Vider le panier
              </button>
              
              <div className="flex items-center gap-2 pt-2 text-[11px] text-[#333333]/60 font-medium justify-center text-center">
                <ShieldCheck className="w-4 h-4 text-[#6E857B] shrink-0" />
                <span>Paiement sécurisé & crypté SSL</span>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}