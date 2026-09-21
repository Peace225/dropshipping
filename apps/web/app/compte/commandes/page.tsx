"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Package, Truck, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CommandesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getOrders() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
      setLoading(false);
    }
    getOrders();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#333333]/10 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#333333]/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#333333]">Mes Commandes</h1>
          <p className="text-xs text-[#333333]/60 mt-1">Historique et suivi de vos achats.</p>
        </div>
        <Link 
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#333333] hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
        >
          <ShoppingBag className="w-4 h-4 text-[#6E857B]" />
          <span>Nouvel achat</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[#333333]/60">Chargement...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#333333]/15 rounded-3xl p-6 bg-[#F5EBE6]/10">
          <Package className="w-12 h-12 text-[#333333]/30 mx-auto mb-3" />
          <p className="text-sm font-bold text-[#333333]">Aucune commande enregistrée</p>
          <Link href="/shop" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#6E857B] text-white text-xs font-bold rounded-2xl shadow-md">
            <span>Explorer la boutique</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 sm:p-5 rounded-2xl border border-[#333333]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white shadow-sm">
              <div>
                <p className="text-xs font-black text-[#333333]">Commande #{order.order_number || order.id.slice(0, 8)}</p>
                <p className="text-[10px] text-[#333333]/60">{new Date(order.created_at).toLocaleDateString("fr-FR")}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F5EBE6] text-[#333333] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#6E857B]" />
                  {order.status || "En préparation"}
                </span>
                <span className="text-sm font-black text-[#6E857B]">{Number(order.total_amount || 0).toFixed(2)} €</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}