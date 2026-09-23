"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ShoppingBag, Eye, Loader2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Formatage des données pour le tableau
  const formattedOrders = orders.map((order: any) => ({
    id: order.id,
    orderNumber: order.order_number || `ECLOSIA-${String(order.id).slice(0, 6).toUpperCase()}`,
    customerName: `${order.customer_firstname || ""} ${order.customer_lastname || ""}`.trim() || order.customer_email || "Client inconnu",
    email: order.customer_email || "N/A",
    total: `${Number(order.total_amount || 0).toFixed(2).replace(".", ",")} €`,
    status: order.status || "pending",
    date: new Date(order.created_at).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  }));

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#333333]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-[#6E857B]/10 text-[#6E857B]">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-[#333333]">
                Gestion des Commandes
              </h1>
            </div>
            <p className="text-xs text-[#333333]/60">
              Suivez, filtrez et gérez toutes les commandes passées sur ECLOSIA.
            </p>
          </div>
          <span className="px-4 py-2 bg-[#F5EBE6] text-[#333333] text-xs font-bold rounded-xl border border-[#333333]/5 w-fit">
            {formattedOrders.length} commande(s) au total
          </span>
        </div>

        {/* Tableau des commandes */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/15 p-6">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-7 h-7 animate-spin text-[#6E857B]" />
            </div>
          ) : formattedOrders.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-sm font-medium text-gray-500">Aucune commande enregistrée pour le moment.</p>
              <p className="text-xs text-gray-400">Elles apparaîtront ici dès que vos clientes finaliseront un achat.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs text-[#333333]/70 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-bold">N° Commande</th>
                    <th className="px-4 py-3 font-bold">Client</th>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Total</th>
                    <th className="px-4 py-3 font-bold">Statut</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {formattedOrders.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-4 font-bold text-[#333333]">
                        {ord.orderNumber}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#333333]">{ord.customerName}</p>
                        <p className="text-xs text-gray-400">{ord.email}</p>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-600 font-medium">
                        {ord.date}
                      </td>
                      <td className="px-4 py-4 font-extrabold text-[#333333]">
                        {ord.total}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === "paid" || ord.status === "processing" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {ord.status === "paid" ? "Payée" : ord.status === "processing" ? "En préparation" : "En attente"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/admin/commandes/${ord.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#333333] text-white hover:bg-[#6E857B] transition-colors text-xs font-bold shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Détails</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}