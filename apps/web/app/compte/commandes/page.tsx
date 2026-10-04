"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Package, Truck, ShoppingBag, ArrowRight, Calendar, MapPin, Eye } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PLACEHOLDER = "https://via.placeholder.com/400x400/F5EBE6/333333?text=ECLOSIA";

// Tes 8 images réelles validées dans Supabase (screenshots 16.39.xx)
function getCleanImage(raw?: string, slug?: string){
  const s = (slug||"").toLowerCase();
  if(s.includes("40x80")) return "https://www.lamaisonenchiffon.com/img/p/1/6/7/3/9/16739.jpg";
  if(s.includes("32x72") && s.includes("bambou")) return "https://www.lamaisonenchiffon.com/img/p/1/6/7/2/8/16728.jpg";
  if(s.includes("32x72")) return "https://www.lamaisonenchiffon.com/img/p/1/6/7/2/8/16728.jpg";
  if(s.includes("50x100")) return "https://www.lamaisonenchiffon.com/img/p/1/6/7/9/7/16797.jpg";
  if(s.includes("60x120")) return "https://www.lamaisonenchiffon.com/img/p/1/6/7/9/9/16799.jpg";
  if(s.includes("tapis") && s.includes("langer")) return "https://www.lamaisonenchiffon.com/img/p/1/5/8/0/2/15802.jpg";
  if(s.includes("matelas") && s.includes("langer")) return "https://www.lamaisonenchiffon.com/img/p/3/8/6/5/3865.jpg";
  if(s.includes("housse") && s.includes("langer")) return "https://www.lamaisonenchiffon.com/img/p/8/7/5/4/8754.jpg";
  if(s.includes("drap") && s.includes("32x72")) return "https://www.lamaisonenchiffon.com/img/p/8/7/5/4/8754.jpg";
  if(s.includes("plan") && s.includes("inclin")) return "https://www.lamaisonenchiffon.com/img/p/3/8/4/3/3843.jpg";
  if(s.includes("coussin") && s.includes("chaise")) return "https://www.lamaisonenchiffon.com/img/p/1/6/9/7/2/16972.jpg";
  if(s.includes("maillot") && s.includes("bain")) return "https://www.lamaisonenchiffon.com/img/p/1/4/5/2/8/14528.jpg";

  if(!raw) return PLACEHOLDER;
  // FIX pipe: "8754.jpg|https://..."
  let first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  if(!first.startsWith("http") && raw.includes("http")){
    const m = raw.match(/https:\/\/[^|\s]+/);
    if(m) return m[0];
  }
  return first.startsWith("http") ? first : PLACEHOLDER;
}

export default function CommandesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItemsMap, setOrderItemsMap] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getOrders() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      setUser(session.user);

      // 1. Commandes de l'utilisateur
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("orders error", error);
        setLoading(false);
        return;
      }
      if (!ordersData || ordersData.length===0) { setOrders([]); setLoading(false); return; }
      setOrders(ordersData);

      // 2. Items de chaque commande + produit + image
      const orderIds = ordersData.map((o:any)=>o.id);
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*, products(id, name, slug, image_url, sku)")
        .in("order_id", orderIds);

      // 3. Optionnel: product_images primary si disponible
      const productIds = [...new Set((itemsData||[]).map((it:any)=>it.products?.id).filter(Boolean))];
      let imagesByProduct: Record<string, string> = {};
      if(productIds.length>0){
        const { data: imgs } = await supabase.from("product_images").select("product_id, image_url, is_primary").in("product_id", productIds).eq("is_primary", true);
        (imgs||[]).forEach((img:any)=>{ imagesByProduct[img.product_id]=img.image_url; });
      }

      const map: Record<string, any[]> = {};
      (itemsData||[]).forEach((it:any)=>{
        const prod = it.products;
        const rawImg = imagesByProduct[prod?.id] || prod?.image_url || "";
        const cleanImg = getCleanImage(rawImg, prod?.slug||"");
        const enriched = { ...it, cleanImage: cleanImg };
        if(!map[it.order_id]) map[it.order_id]=[];
        map[it.order_id].push(enriched);
      });
      setOrderItemsMap(map);
      setLoading(false);
    }
    getOrders();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#333333]/10 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#333333]/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#333333]">Mes Commandes</h1>
          <p className="text-xs text-[#333333]/60 mt-1">
            {user ? `Connecté: ${user.email} • ` : ""}Historique et suivi de vos achats ({orders.length} commandes).
          </p>
        </div>
        <Link href="/shop" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#333333] hover:bg-black text-white text-xs font-bold shadow-sm">
          <ShoppingBag className="w-4 h-4 text-[#6E857B]" />
          <span>Nouvel achat</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[#333333]/60">Chargement de vos commandes...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#333333]/15 rounded-3xl p-6 bg-[#F5EBE6]/10">
          <Package className="w-12 h-12 text-[#333333]/30 mx-auto mb-3" />
          <p className="text-sm font-bold text-[#333333]">Aucune commande enregistrée</p>
          <p className="text-[11px] text-[#333333]/60 mt-1">Tes 13 produits actifs t'attendent.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#6E857B] text-white text-xs font-bold rounded-2xl shadow-md">
            <span>Explorer la boutique</span><ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-[#333333]/10 bg-white shadow-sm overflow-hidden">
              {/* Header commande */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#F9F6F4]">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-black text-[#333333] flex items-center gap-2">
                    <Package className="w-4 h-4"/> Commande #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-[11px] text-[#333333]/60 flex items-center gap-2">
                    <Calendar className="w-3 h-3"/>{new Date(order.created_at).toLocaleDateString("fr-FR", { day:"2-digit", month:"long", year:"numeric"})}
                    {order.shipping_city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {order.shipping_city}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${order.status==="paid"||order.status==="livrée" ? "bg-green-100 text-green-700" : "bg-[#F5EBE6] text-[#333333]"}`}>
                    <Truck className="w-3.5 h-3.5 text-[#6E857B]" />{order.status || "En préparation"}
                  </span>
                  <span className="text-sm font-black text-[#6E857B]">{Number(order.total_amount || 0).toFixed(2).replace(".",",")} €</span>
                  <Link href={`/compte/commandes/${order.id}`} className="p-2 rounded-full bg-[#333333] text-white hover:bg-black"><Eye className="w-3.5 h-3.5"/></Link>
                </div>
              </div>

              {/* Produits de la commande - avec vraies images 16739, 16728, etc */}
              <div className="p-4 space-y-3">
                {(orderItemsMap[order.id]||[]).length===0 ? (
                  <p className="text-[11px] text-[#333333]/50">Détails produits non disponibles (order_items vide).</p>
                ) : (
                  orderItemsMap[order.id].map((item:any)=>(
                    <div key={item.id} className="flex gap-3 items-center p-2 rounded-xl hover:bg-[#F5EBE6]/20 transition-colors">
                      <div className="w-16 h-16 rounded-xl bg-[#F5EBE6]/40 p-1 flex items-center justify-center shrink-0 border border-[#333333]/5">
                        <img src={item.cleanImage} alt={item.products?.name} className="w-full h-full object-contain mix-blend-multiply" onError={(e)=>{(e.target as HTMLImageElement).src=PLACEHOLDER}}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#333333] line-clamp-1">{item.products?.name || item.product_name || "Produit ECLOSIA"}</p>
                        <p className="text-[10px] text-[#333333]/60">{item.products?.sku || item.sku} • Qté: {item.quantity||1}</p>
                      </div>
                      <p className="text-xs font-black text-[#333333]">{Number(item.unit_price || item.price || 0).toFixed(2).replace(".",",")} €</p>
                    </div>
                  ))
                )}
              </div>

              {/* Footer livraison 10€ */}
              <div className="px-4 py-3 bg-[#FAFAFA] border-t border-[#333333]/5 flex justify-between items-center text-[11px]">
                <span className="text-[#333333]/60">Livraison ECLOSIA • 10,00 € • 7-10 jours</span>
                <Link href="/shop" className="font-bold text-[#6E857B] hover:underline">Recommander →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
