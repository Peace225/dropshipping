"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight, Mail, MapPin, Package } from "lucide-react";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        // Fallback localStorage uniquement si pas d'order_id (dev)
        try {
          const saved = localStorage.getItem("final_order");
          if (saved) setOrder(JSON.parse(saved));
        } catch {}
        setLoading(false);
        return;
      }

      // VRAIE source: Supabase
      const { data: orderData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) {
        console.error("Erreur fetch order:", error);
        setLoading(false);
        return;
      }

      setOrder(orderData);

      // Fetch order_items (structure 8 colonnes)
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

      if (itemsData) setItems(itemsData);

      // Nettoyage
      localStorage.removeItem("cart");
      localStorage.removeItem("final_order");
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/20 via-white to-[#6E857B]/10 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6E857B] mx-auto mb-4"></div>
          <p className="text-[#333333] font-bold">Chargement de votre commande ECLOSIA...</p>
        </div>
      </div>
    );
  }

  // Si pas de commande
  if (!order && !orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/20 via-white to-[#6E857B]/10 py-12 px-4 flex items-center justify-center pt-24">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-[#333333]/10 p-8 text-center">
          <h2 className="text-xl font-extrabold text-[#333333] mb-4">Aucune commande trouvée</h2>
          <Link href="/shop" className="text-[#6E857B] font-bold hover:underline">Retour boutique</Link>
        </div>
      </div>
    );
  }

  const customerName = order 
    ? `${order.customer_firstname || ""} ${order.customer_lastname || ""}`.trim()
    : "";

  const historyEvents = [
    {
      status: "order_received",
      created_at: order?.created_at || new Date().toISOString(),
      description: `Commande ${order?.order_number || ""} enregistrée.`,
    },
    {
      status: "payment_confirmed",
      created_at: new Date().toISOString(),
      description: `Paiement validé - ${order?.payment_method || "Carte"} - ${order?.total_amount ? Number(order.total_amount).toFixed(2).replace(".", ",") : ""} €`,
    },
    {
      status: "processing",
      created_at: new Date().toISOString(),
      description: `Préparation en cours - Livraison ${order?.shipping_city || "standard"} via ${order?.shipping_method || "Standard"}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/20 via-white to-[#6E857B]/10 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center pt-24">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-sm border border-[#333333]/10 overflow-hidden">
                
        {/* En-tête */}
        <div className="bg-[#F5EBE6]/30 p-8 sm:p-10 text-center border-b border-[#333333]/10">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#6E857B]/10 mb-6 shadow-sm border border-[#6E857B]/20">
            <CheckCircle className="h-8 w-8 text-[#6E857B]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] mb-2">
            Merci {customerName ? customerName.split(" ")[0] : ""} !
          </h1>
          <p className="text-[#333333]/60 text-sm max-w-md mx-auto leading-relaxed">
            Votre commande <strong className="text-[#333333]">{order?.order_number}</strong> est confirmée. 
            Nous préparons vos articles avec soin.
          </p>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                    
          {/* Gauche */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-[#333333] border-b border-[#333333]/10 pb-3 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#6E857B]" /> Détails commande
              </h2>
              <ul className="space-y-3 text-sm text-[#333333]/80 font-medium">
                <li className="flex justify-between">
                  <span className="text-[#333333]/60">Numéro</span>
                  <span className="font-mono font-bold text-[#333333]">{order?.order_number || "--"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#333333]/60">Client</span>
                  <span className="font-bold text-[#333333]">{customerName || order?.customer_email || "Client ECLOSIA"}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#333333]/60 flex items-center gap-1"><MapPin className="w-3 h-3 text-[#6E857B]" /> Livraison</span>
                  <span className="font-bold text-[#333333]">
                    {order?.customer_city || ""} {order?.customer_postal_code ? `(${order.customer_postal_code})` : ""} - {order?.customer_country || "France"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#333333]/60">Méthode</span>
                  <span className="font-bold text-[#333333]">{order?.shipping_method || "Standard"} / {order?.payment_method || "Carte"}</span>
                </li>
                <li className="flex justify-between pt-3 border-t border-[#333333]/5 items-center">
                  <span className="font-extrabold text-sm text-[#333333]">Total TTC</span>
                  <span className="font-black text-lg text-[#333333]">
                    {order?.total_amount ? `${Number(order.total_amount).toFixed(2).replace(".", ",")} €` : "--"}
                  </span>
                </li>
                {order?.subtotal && (
                  <li className="flex justify-between text-xs text-[#333333]/50">
                    <span>Sous-total + livraison</span>
                    <span>{Number(order.subtotal).toFixed(2).replace(".", ",")}€ + {Number(order.shipping_fee || order.shipping_cost || 10).toFixed(2).replace(".", ",")}€</span>
                  </li>
                )}
              </ul>

              {/* Produits */}
              {items.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#333333]/10">
                  <h3 className="text-sm font-extrabold text-[#333333] mb-3">Articles ({items.length})</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {items.map((it: any) => (
                      <div key={it.id} className="flex justify-between text-xs sm:text-sm bg-[#F5EBE6]/20 p-2.5 rounded-xl border border-[#333333]/5">
                        <span className="truncate pr-2 font-medium text-[#333333]">{it.product_name} <span className="text-[#333333]/50">x{it.quantity}</span></span>
                        <span className="font-extrabold text-[#333333]">{Number(it.total_price).toFixed(2).replace(".", ",")} €</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#6E857B]/10 p-4 rounded-2xl flex gap-3 border border-[#6E857B]/20">
              <Mail className="w-5 h-5 text-[#6E857B] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#333333]/80 leading-relaxed font-medium">
                Facture envoyée à <strong>{order?.customer_email}</strong>. 
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Link href="/shop/maternite" className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#333333] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm">
                <ShoppingBag className="w-4 h-4" /> Boutique
              </Link>
              <Link href="/" className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white border border-[#333333]/15 hover:bg-[#333333]/5 text-[#333333] text-xs font-bold uppercase tracking-wider transition-colors group">
                Accueil <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Droite Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-[#333333]/10 shadow-sm flex flex-col justify-between">
            <OrderTimeline 
              currentStatusKey={order?.status === "processing" ? "processing" : "payment_confirmed"} 
              historyEvents={historyEvents} 
            />
            
            <div className="mt-8 p-4 bg-[#F5EBE6]/20 rounded-xl border border-[#333333]/5 text-xs text-center text-[#333333]/70 font-medium">
              <p>Une question concernant votre commande ?</p>
              <Link href="#" className="text-[#6E857B] hover:text-[#333333] hover:underline font-bold transition-colors mt-1 inline-block">
                Contactez notre support client ECLOSIA
              </Link>
              <p className="mt-2 text-[11px] text-[#333333]/50">Paiement sécurisé SSL • Normes ECLOSIA</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/20 via-white to-[#6E857B]/10 flex items-center justify-center">
        <p className="font-bold text-[#333333] animate-pulse">Chargement de votre confirmation de commande...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}