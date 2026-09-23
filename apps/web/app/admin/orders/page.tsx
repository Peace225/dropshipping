"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createClient } from "@supabase/supabase-js";
import { ShoppingBag, Truck, CheckCircle2, Clock, Eye, Save, Loader2 } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminOrdersManagementPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Charger les commandes
  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur chargement commandes:", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Mettre à jour le statut ou le numéro de suivi
  const handleUpdateOrder = async (id: string, newStatus: string, trackingNumber: string) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        tracking_number: trackingNumber,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      alert("Erreur lors de la mise à jour : " + error.message);
    } else {
      alert("Commande mise à jour avec succès !");
      fetchOrders();
    }
    setUpdatingId(null);
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#333333]">
            Gestion & Suivi des Commandes
          </h1>
          <p className="text-xs text-[#333333]/60 mt-1">
            Gérez les expéditions en flux tendu et associez les numéros de suivi de vos fournisseurs.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-[#6E857B]" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-xs text-gray-500 py-10 text-center">Aucune commande enregistrée pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[#333333]/60 uppercase tracking-wider bg-gray-50/50">
                    <th className="p-3 font-bold">N° Commande</th>
                    <th className="p-3 font-bold">Client</th>
                    <th className="p-3 font-bold">Total</th>
                    <th className="p-3 font-bold">Statut Logistique</th>
                    <th className="p-3 font-bold">Numéro de suivi</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <OrderRow 
                      key={order.id} 
                      order={order} 
                      onUpdate={handleUpdateOrder} 
                      isUpdating={updatingId === order.id} 
                    />
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

// Composant interne pour gérer l'état local de chaque ligne modifiable
function OrderRow({ order, onUpdate, isUpdating }: { order: any; onUpdate: any; isUpdating: boolean }) {
  const [status, setStatus] = useState(order.status || "pending");
  const [tracking, setTracking] = useState(order.tracking_number || "");

  return (
    <tr className="hover:bg-gray-50">
      <td className="p-3 font-bold text-[#333333]">{order.order_number}</td>
      <td className="p-3">
        <p className="font-semibold text-[#333333]">{order.customer_firstname} {order.customer_lastname}</p>
        <p className="text-[11px] text-gray-400">{order.customer_email}</p>
      </td>
      <td className="p-3 font-extrabold text-[#333333]">{Number(order.total_amount).toFixed(2)} €</td>
      
      {/* Sélecteur de statut */}
      <td className="p-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs bg-white font-medium focus:outline-none focus:border-[#6E857B]"
        >
          <option value="pending">En attente</option>
          <option value="processing">Préparation en cours</option>
          <option value="shipped">Expédiée (Fournisseur)</option>
          <option value="delivered">Livrée</option>
        </select>
      </td>

      {/* Saisie du numéro de suivi */}
      <td className="p-3">
        <input
          type="text"
          placeholder="Entrer le suivi..."
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs w-full max-w-[160px] focus:outline-none focus:border-[#6E857B]"
        />
      </td>

      {/* Bouton d'enregistrement */}
      <td className="p-3 text-right space-x-2">
        <button
          onClick={() => onUpdate(order.id, status, tracking)}
          disabled={isUpdating}
          className="px-3 py-1.5 bg-[#6E857B] text-white rounded-lg hover:bg-[#5a6e66] transition-colors font-bold inline-flex items-center gap-1 disabled:opacity-50"
        >
          {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Enregistrer
        </button>
      </td>
    </tr>
  );
}