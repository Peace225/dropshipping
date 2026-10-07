"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MetricsCard } from "@/components/admin/metrics-card";
import { getSupabase } from "@/lib/supabase/client";
import Link from "next/link";
import { Bell, ShoppingBag, UserPlus, Euro, Eye, Package } from "lucide-react";

export default function AdminPage() {
  const supabase = getSupabase();

  const [stats, setStats] = useState({
    ca: 0,
    orders: 0,
    clients: 0,
    flash: 2,
    newOrders: 0,
    newClients: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

      // 1. Commandes
      const { data: orders, count: ordersCount } = await supabase
        .from("orders")
        .select("id, total_amount, status, created_at, customer_email", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(5);

      const { count: newOrdersCount } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .gte("created_at", yesterday);

      // 2. Clients (profiles)
      const { count: clientsCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      const { data: newUsers, count: newClientsCount } = await supabase
        .from("profiles")
        .select("id, email, created_at", { count: "exact" })
        .gte("created_at", yesterday)
        .order("created_at", { ascending: false })
        .limit(5);

      // 3. CA
      const { data: caData } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("status", "paid");

      const totalCA = caData?.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0) || 0;

      setStats({
        ca: totalCA,
        orders: ordersCount || 0,
        clients: clientsCount || 0,
        flash: 2,
        newOrders: newOrdersCount || 0,
        newClients: newClientsCount || 0,
      });
      setRecentOrders(orders || []);
      setRecentUsers(newUsers || []);
      setLoading(false);
    }
    fetchData();

    // Canal statique : Supabase gère le multiplexing automatiquement si plusieurs onglets sont ouverts
    const channel = supabase
      .channel('admin-notifs-room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []); // <-- Tableau de dépendances vide respecté

  const totalNotifs = stats.newOrders + stats.newClients;

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* HEADER AVEC NOTIFICATIONS */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#333333]">
              Tableau de bord
            </h1>
            <p className="text-xs text-[#333333]/60 mt-1">
              Bienvenue eclosia66@eclosia.shop — espace super admin ECLOSIA.
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-3 bg-white border border-[#333333]/10 rounded-2xl hover:bg-gray-50 transition-all"
            >
              <Bell className="w-5 h-5 text-[#333333]" />
              {totalNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {totalNotifs}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-[#333333]/10 shadow-xl z-50 overflow-hidden">
                <div className="p-4 border-b border-[#333333]/10 flex justify-between items-center">
                  <p className="text-xs font-bold uppercase">Notifications (24h)</p>
                  <span className="text-[10px] bg-[#6E857B] text-white px-2 py-0.5 rounded-full">{totalNotifs} nouveau</span>
                </div>
                <div className="max-h-96 overflow-y-auto divide-y divide-[#333333]/5">
                  {stats.newOrders > 0 && (
                    <div className="p-3 flex gap-3 bg-[#F5EBE6]/30">
                      <div className="w-8 h-8 bg-[#6E857B] rounded-full flex items-center justify-center shrink-0"><ShoppingBag className="w-4 h-4 text-white" /></div>
                      <div>
                        <p className="text-xs font-bold">{stats.newOrders} nouvelle(s) commande(s)</p>
                        <p className="text-[10px] text-[#333333]/60">À traiter dans Commandes</p>
                      </div>
                    </div>
                  )}
                  {stats.newClients > 0 && (
                    <div className="p-3 flex gap-3 bg-[#E8C5C8]/20">
                      <div className="w-8 h-8 bg-[#D4A396] rounded-full flex items-center justify-center shrink-0"><UserPlus className="w-4 h-4 text-white" /></div>
                      <div>
                        <p className="text-xs font-bold">{stats.newClients} nouvel(le)s inscrit(e)s</p>
                        <p className="text-[10px] text-[#333333]/60">Bienvenue à vérifier</p>
                      </div>
                    </div>
                  )}
                  {totalNotifs === 0 && (
                    <div className="p-6 text-center text-xs text-[#333333]/50">Aucune nouvelle activité aujourd'hui</div>
                  )}
                  {recentOrders.slice(0,3).map((o:any) => (
                    <Link key={o.id} href={`/admin/commandes`} className="p-3 flex gap-3 hover:bg-gray-50 block">
                      <Euro className="w-4 h-4 text-[#333333]/40 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium truncate">Commande {o.id.slice(0,8)} — {Number(o.total_amount).toFixed(2)}€</p>
                        <p className="text-[10px] text-[#333333]/50">{new Date(o.created_at).toLocaleString('fr-FR')} — {o.status}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/admin/commandes" className="block p-3 text-center text-xs font-bold text-[#6E857B] hover:bg-gray-50 border-t">Voir tout</Link>
              </div>
            )}
          </div>
        </div>

        {/* ALERTES HAUT DE PAGE SI NOUVEAUTES */}
        {totalNotifs > 0 && (
          <div className="grid sm:grid-cols-2 gap-3">
            {stats.newOrders > 0 && (
              <div className="bg-[#333333] text-white p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Package className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-bold">{stats.newOrders} commandes en attente</p>
                    <p className="text-xs text-white/60">Dernières 24h</p>
                  </div>
                </div>
                <Link href="/admin/commandes" className="bg-white text-[#333333] px-4 py-2 rounded-xl text-xs font-bold">Traiter</Link>
              </div>
            )}
            {stats.newClients > 0 && (
              <div className="bg-[#6E857B] text-white p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><UserPlus className="w-5 h-5" /></div>
                  <div>
                    <p className="text-sm font-bold">{stats.newClients} nouveaux clients</p>
                    <p className="text-xs text-white/70">Maman & Bébé</p>
                  </div>
                </div>
                <Link href="/admin/clients" className="bg-white text-[#6E857B] px-4 py-2 rounded-xl text-xs font-bold">Voir</Link>
              </div>
            )}
          </div>
        )}

        {/* METRICS DYNAMIQUES */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricsCard title="Chiffre d'Affaires" value={loading? "..." : `${stats.ca.toFixed(2)} €`} iconName="dollar" trend={stats.newOrders>0?`+${stats.newOrders}`:"0"} trendDirection="up" description="Total payé" />
          <MetricsCard title="Commandes" value={loading? "..." : `${stats.orders}`} iconName="shopping" trend={stats.newOrders>0?`+${stats.newOrders} (24h)`:"+0"} trendDirection={stats.newOrders>0?"up":"down"} description="dont en attente" />
          <MetricsCard title="Clients Inscrits" value={loading? "..." : `${stats.clients}`} iconName="users" trend={stats.newClients>0?`+${stats.newClients}`:"+0"} trendDirection="up" description="Maman & Bébé" />
          <MetricsCard title="Ventes Flash" value={`${stats.flash} Actives`} iconName="zap" description="Gestion en cours" />
        </div>

        {/* ACTIVITE RECENTE */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#333333]/10 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#333333]/70">Dernières commandes</h2>
              <Link href="/admin/commandes" className="text-xs font-bold text-[#6E857B] flex items-center gap-1"><Eye className="w-3 h-3" /> Voir tout</Link>
            </div>
            <div className="space-y-3">
              {recentOrders.length===0? <p className="text-xs text-[#333333]/50">Aucune commande pour l'instant — tes 18 produits ECLOSIA (SKU-BUM1, KITBIO40X80M2...) arrivent bientôt.</p> :
                recentOrders.map((o:any) => (
                  <div key={o.id} className="flex justify-between items-center p-3 bg-[#FAFAFA] rounded-xl">
                    <div>
                      <p className="text-xs font-bold">{o.customer_email || "Client"}</p>
                      <p className="text-[10px] text-[#333333]/60">{new Date(o.created_at).toLocaleDateString('fr-FR')} — {o.status}</p>
                    </div>
                    <p className="text-xs font-extrabold">{Number(o.total_amount).toFixed(2)}€</p>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="rounded-2xl border border-[#333333]/10 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#333333]/70">Nouveaux inscrits</h2>
              <Link href="/admin/clients" className="text-xs font-bold text-[#6E857B] flex items-center gap-1"><Eye className="w-3 h-3" /> Voir tout</Link>
            </div>
            <div className="space-y-3">
              {recentUsers.length===0? <p className="text-xs text-[#333333]/50">Pas de nouvel inscrit sur les dernières 24h.</p> :
                recentUsers.map((u:any) => (
                  <div key={u.id} className="flex justify-between items-center p-3 bg-[#FAFAFA] rounded-xl">
                    <div>
                      <p className="text-xs font-bold">{u.email}</p>
                      <p className="text-[10px] text-[#333333]/60">Inscrit {new Date(u.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className="text-[10px] bg-[#F5EBE6] px-2 py-1 rounded-full font-bold">Nouveau</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#333333]/10 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#333333]/70 mb-2">ECLOSIA — Boutique Maman & Bébé Française</h2>
          <p className="text-xs text-[#333333]/50 leading-relaxed">
            18 produits actifs (58 variantes) : Culottes Bumbuns So Protect 25,90€ (SKU-BUM1...), Matelas 40x80 Bio 74,90€ (SKU-KITBIO40X80M2), Maillots Bébé 17,90€. Livraison 10€ Point Relais. Oeko-Tex, Coton Bio.
          </p>
        </div>
      </main>
    </div>
  );
}