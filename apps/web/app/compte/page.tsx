"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Package, Sparkles, ArrowRight, Truck, Clock, CheckCircle, ShoppingBag, Eye, Gift, TrendingUp } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function EspaceClientPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth/connexion"); return; }

      const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single();
      setUserProfile(userData || { full_name: session.user.user_metadata?.full_name || "Client ECLOSIA", email: session.user.email });

      // Récupère les commandes
      const { data: ordersData } = await supabase.from("orders").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(5);
      setOrders(ordersData || []);
      setLoading(false);
    }
    getData();
  }, [router]);

  if (loading) {
    return <div className="py-20 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#6E857B] border-t-transparent animate-spin" /></div>;
  }

  const stats = {
    total: orders.length,
    enCours: orders.filter(o => o.status === 'processing' || o.status === 'shipped').length,
    totalSpent: orders.reduce((acc, o) => acc + Number(o.total_amount || o.total || 0), 0)
  };

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* Bannière Welcome */}
      <div className="bg-gradient-to-r from-[#6E857B] to-[#5b7067] rounded-3xl p-5 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-white/20 mb-3 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#E8C5C8]" />Espace Premium
          </span>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight">
            Hello {userProfile?.full_name?.split(' ')[0] || "Maman"} 👋
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
            Voici le suivi de vos commandes en ligne et vos avantages fidélité exclusifs.
          </p>
        </div>
      </div>

      {/* STATS RAPIDES */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] text-black/60 font-bold uppercase">
            <Package className="w-4 h-4 text-[#6E857B]" />Commandes
          </div>
          <p className="text-xl sm:text-2xl font-black mt-1 text-[#333333]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] text-black/60 font-bold uppercase">
            <Truck className="w-4 h-4 text-[#6E857B]" />En cours
          </div>
          <p className="text-xl sm:text-2xl font-black mt-1 text-[#333333]">{stats.enCours}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] text-black/60 font-bold uppercase">
            <TrendingUp className="w-4 h-4 text-[#6E857B]" />Dépensé
          </div>
          <p className="text-xl sm:text-2xl font-black mt-1 text-[#333333]">{stats.totalSpent.toFixed(2)}€</p>
        </div>
      </div>

      {/* COMMANDE EN COURS */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-black/5">
          <h2 className="font-bold text-sm sm:text-base flex items-center gap-2 text-[#333333]">
            <Clock className="w-5 h-5 text-[#6E857B]" />Commandes en ligne
          </h2>
          <Link href="/compte/commandes" className="text-xs font-bold text-[#6E857B] hover:underline">
            Voir l'historique →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-[#F5EBE6] rounded-3xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-[#6E857B]" />
            </div>
            <h3 className="font-bold text-sm text-[#333333]">Aucune commande pour le moment</h3>
            <p className="text-xs text-black/60 mt-1 max-w-xs mx-auto">
              Découvrez notre sélection maternité & bébé d'excellence, livraison offerte dès 60€.
            </p>
            <Link href="/shop" className="inline-flex mt-5 px-6 py-3 rounded-full bg-[#333333] text-white text-xs font-bold hover:bg-black transition-all">
              Commencer mes achats <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {orders.map((order) => (
              <div key={order.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F5EBE6]/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    {order.status === 'delivered' ? <CheckCircle className="w-6 h-6" /> : order.status === 'shipped' ? <Truck className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#333333]">
                      Commande #{order.id.slice(0, 8).toUpperCase()} • {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-[11px] text-black/60 mt-0.5">
                      {order.status === 'shipped' ? 'En transit - Arrivée prévue sous 48h' : order.status === 'delivered' ? 'Livrée' : 'En préparation'} • {Number(order.total_amount || order.total || 0).toFixed(2)}€
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Link href={`/compte/commandes`} className="px-4 py-2 rounded-full bg-[#333333] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-black">
                    <Eye className="w-3.5 h-3.5" />Suivre
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION INCITATIVE ACHAT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#E8C5C8]/40 to-[#F5EBE6] rounded-3xl p-5 sm:p-6 border border-black/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6 text-[#6E857B]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-[#333333]">Vous avez {Math.floor(stats.totalSpent / 10)} points fidélité</h3>
              <p className="text-xs text-black/60 mt-1 leading-relaxed">
                Plus que {(60 - (stats.totalSpent % 60)).toFixed(2)}€ pour débloquer un bon de 10€ + livraison gratuite.
              </p>
              <div className="w-full bg-black/10 h-2 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-[#6E857B] rounded-full" style={{ width: `${Math.min(100, ((stats.totalSpent % 60) / 60) * 100)}%` }} />
              </div>
              <Link href="/shop" className="inline-flex mt-4 text-xs font-bold text-[#6E857B] hover:underline">
                Compléter pour débloquer →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-[#333333] rounded-3xl p-5 sm:p-6 text-white relative overflow-hidden">
          <Sparkles className="absolute -right-6 -top-6 w-24 h-24 text-white/10" />
          <h3 className="font-bold text-sm relative z-10">Recommandé pour vous</h3>
          <p className="text-xs text-white/70 mt-1 relative z-10">Basé sur vos favoris et les essentiels de saison</p>
          <div className="flex gap-2 mt-4 relative z-10 flex-wrap">
            <Link href="/shop" className="px-4 py-2 rounded-full bg-white text-[#333333] text-xs font-bold hover:bg-[#F5EBE6]">Maternité</Link>
            <Link href="/shop" className="px-4 py-2 rounded-full bg-white/15 text-white text-xs font-bold hover:bg-white/25">Bébé</Link>
            <Link href="/shop" className="px-4 py-2 rounded-full bg-[#6E857B] text-white text-xs font-bold">Voir tout</Link>
          </div>
        </div>
      </div>

    </div>
  );
}