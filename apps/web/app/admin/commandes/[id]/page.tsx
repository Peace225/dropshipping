"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Package, MapPin, CreditCard, 
  User, Mail, Phone, FileText, Truck, Save, Loader2, CheckCircle2 
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { OrderTimeline } from "@/components/orders/OrderTimeline";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("processing");
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!slug) return;

      // Recherche par ID (UUID) ou par numéro de commande (order_number)
      let query = supabase.from("orders").select("*");
      
      if (slug.length > 20) {
        query = query.eq("id", slug);
      } else {
        query = query.eq("order_number", slug);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error("Erreur chargement commande:", error);
      } else if (data) {
        setOrder(data);
        setNewStatus(data.status || "processing");
        setTrackingNumber(data.tracking_number || "");
      }
      setLoading(false);
    }

    fetchOrderDetails();
  }, [slug]);

  // Mettre à jour le statut logistique et le suivi
  const handleUpdateLogistics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setUpdating(true);
    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        tracking_number: trackingNumber,
        updated_at: new Date().toISOString()
      })
      .eq("id", order.id);

    if (error) {
      alert("Erreur lors de la mise à jour : " + error.message);
    } else {
      alert("Statut et suivi mis à jour avec succès !");
      // Mettre à jour l'état local
      setOrder({ ...order, status: newStatus, tracking_number: trackingNumber });
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FAFAFA]">
        <AdminSidebar />
        <main className="flex-1 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#6E857B]" />
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen bg-[#FAFAFA]">
        <AdminSidebar />
        <main className="flex-1 p-8 flex flex-col items-center justify-center gap-4">
          <p className="text-sm font-bold text-gray-500">Commande introuvable.</p>
          <Link href="/admin/orders" className="px-4 py-2 bg-[#333333] text-white rounded-xl text-xs font-bold">
            Retour à la liste
          </Link>
        </main>
      </div>
    );
  }

  // Historique des événements simulé ou issu de la commande
  const historyEvents = [
    { status: "order_received", created_at: order.created_at, description: "Commande validée par le client" },
    { status: "payment_confirmed", created_at: order.created_at, description: `Paiement validé (${order.payment_method || "Carte bancaire"})` },
    { status: order.status, created_at: order.updated_at || order.created_at, description: `Statut actuel : ${order.status}` },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* En-tête de navigation Administrateur */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-[#333333]/10">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/orders" 
                className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-transparent transition-colors text-[#333333]/70 hover:text-[#333333]"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-[#333333]">
                    Commande {order.order_number}
                  </h1>
                  <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg ${
                    order.status === "shipped" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-700"
                  }`}>
                    {order.status === "shipped" ? "EXPÉDIÉE" : "À PRÉPARER"}
                  </span>
                </div>
                <p className="text-sm text-[#333333]/60 mt-1">
                  Passée le {new Date(order.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.print()} 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#333333]/25 hover:border-[#333333]/50 rounded-xl text-sm font-semibold text-[#333333] transition-colors"
              >
                <FileText className="w-4 h-4" />
                Imprimer / Facture
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Colonne Principale : Gestion du statut et Articles */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* ACTION ADMIN : Mise à jour du statut logistique */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#6E857B]/30 overflow-hidden">
                <div className="bg-[#6E857B]/5 p-5 border-b border-[#6E857B]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#6E857B]" />
                    <h2 className="font-bold text-[#333333]">Suivi & Expédition Fournisseur</h2>
                  </div>
                </div>
                
                <form onSubmit={handleUpdateLogistics} className="p-5 flex flex-col sm:flex-row items-end gap-4">
                  <div className="w-full">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-2">
                      Statut de la commande
                    </label>
                    <select 
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#333333]/20 focus:outline-none focus:border-[#6E857B] text-sm text-[#333333] bg-white font-medium"
                    >
                      <option value="pending">En attente</option>
                      <option value="processing">Préparation en cours</option>
                      <option value="shipped">Expédiée (Fournisseur)</option>
                      <option value="delivered">Livrée au client</option>
                    </select>
                  </div>
                  
                  <div className="w-full">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-2">
                      Numéro de suivi du transporteur
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ex: TRK-9842310" 
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#333333]/20 focus:outline-none focus:border-[#6E857B] text-sm text-[#333333]"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={updating}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#6E857B] hover:bg-[#5b7067] text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Mettre à jour
                  </button>
                </form>
              </div>

              {/* Liste des articles commandés (stockés sous forme de tableau JSON dans Supabase) */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/10 overflow-hidden">
                <div className="p-5 border-b border-[#333333]/10">
                  <h2 className="font-bold text-[#333333]">Contenu de la commande</h2>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-[#333333]/60 uppercase bg-gray-50/50">
                      <tr>
                        <th className="px-5 py-3">Produit</th>
                        <th className="px-5 py-3 text-center">Quantité</th>
                        <th className="px-5 py-3 text-right">Prix Unitaire</th>
                        <th className="px-5 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {order.items && Array.isArray(order.items) ? (
                        order.items.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td className="px-5 py-4 font-medium text-[#333333] flex items-center gap-3">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-10 h-10 object-contain bg-gray-50 rounded p-1" />
                              )}
                              <span>{item.name}</span>
                            </td>
                            <td className="px-5 py-4 text-center font-semibold text-[#333333]">{item.quantity || 1}</td>
                            <td className="px-5 py-4 text-right text-[#333333]/80">{Number(item.price).toFixed(2)} €</td>
                            <td className="px-5 py-4 text-right font-medium text-[#333333]">
                              {(Number(item.price) * Number(item.quantity || 1)).toFixed(2)} €
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-5 py-4 text-center text-gray-400">Aucun détail d'article disponible.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-gray-50 p-5 border-t border-[#333333]/10 flex justify-end">
                  <div className="space-y-2 text-sm w-64">
                    <div className="flex justify-between text-[#333333]/80">
                      <span>Frais de port</span>
                      <span>{Number(order.shipping_cost || 0).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-[#333333] pt-3 border-t border-gray-200 mt-2">
                      <span>Total payé</span>
                      <span>{Number(order.total_amount).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suivi Logistique Interne */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/10 p-6">
                <OrderTimeline currentStatusKey={order.status} historyEvents={historyEvents} />
              </div>

            </div>

            {/* Colonne Latérale : Client, Livraison et Paiement */}
            <div className="space-y-6">
              
              {/* Profil Client */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/10 overflow-hidden">
                <div className="p-5 border-b border-[#333333]/10 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#6E857B]" />
                  <h2 className="font-bold text-[#333333]">Client</h2>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="font-bold text-[#333333] text-lg">
                      {order.customer_firstname} {order.customer_lastname}
                    </p>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                    <a href={`mailto:${order.customer_email}`} className="flex items-center gap-3 text-[#333333]/80 hover:text-[#6E857B]">
                      <Mail className="w-4 h-4" /> {order.customer_email}
                    </a>
                    {order.customer_phone && (
                      <a href={`tel:${order.customer_phone}`} className="flex items-center gap-3 text-[#333333]/80 hover:text-[#6E857B]">
                        <Phone className="w-4 h-4" /> {order.customer_phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Adresse d'expédition */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/10 overflow-hidden">
                <div className="p-5 border-b border-[#333333]/10 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#6E857B]" />
                  <h2 className="font-bold text-[#333333]">Adresse d'expédition</h2>
                </div>
                <div className="p-5">
                  <address className="not-italic text-xs text-[#333333] space-y-1">
                    <p className="font-bold">{order.customer_firstname} {order.customer_lastname}</p>
                    <p>{order.customer_address}</p>
                    <p>{order.customer_postal_code} {order.customer_city}</p>
                    <p className="font-semibold pt-1">{order.customer_country || "France"}</p>
                  </address>
                </div>
              </div>

              {/* Détails du Paiement */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#333333]/10 overflow-hidden">
                <div className="p-5 border-b border-[#333333]/10 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#6E857B]" />
                  <h2 className="font-bold text-[#333333]">Détails du paiement</h2>
                </div>
                <div className="p-5 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]/60">Statut</span>
                    <span className="px-2 py-0.5 font-bold bg-emerald-50 text-emerald-700 rounded uppercase">
                      {order.status === "paid" || order.status === "processing" || order.status === "shipped" ? "Payé" : order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]/60">Méthode</span>
                    <span className="font-medium text-[#333333]">{order.payment_method || "Carte bancaire"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#333333]/60">Mode de livraison</span>
                    <span className="font-medium text-[#333333]">{order.shipping_method || "Standard"}</span>
                  </div>
                  {order.tracking_number && (
                    <div className="pt-3 border-t border-gray-100">
                      <span className="block text-gray-400 mb-1">Numéro de suivi saisi</span>
                      <code className="block bg-gray-50 p-2 rounded text-[#333333] font-bold">
                        {order.tracking_number}
                      </code>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}