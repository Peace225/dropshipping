"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MetricsCard } from "@/components/admin/metrics-card";
import { BarChart3 } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";

// ✅ 1. Déplacé en dehors du composant : garanti d'être instancié une seule fois
const supabase = getSupabase();

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    ca: 0,
    panierMoyen: 0,
    totalOrders: 0,
    shippedOrders: 0,
    shippedRate: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);

      // Récupérer les commandes
      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount, status, customer_email");

      // Récupérer le nombre total d'inscrits
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      if (orders) {
        // ✅ 2. Filtrage strict sur les vraies valeurs en BDD (ex: 'cancelled')
        const paidOrders = orders.filter(o => o.status?.toLowerCase() !== 'cancelled');
        const totalCA = paidOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
        
        const totalOrders = paidOrders.length;
        const panierMoyen = totalOrders > 0 ? totalCA / totalOrders : 0;

        // ✅ 2. Filtrage strict sur 'shipped' et 'delivered' uniquement
        const shipped = paidOrders.filter(o =>
          ['shipped', 'delivered'].includes(o.status?.toLowerCase() || '')
        ).length;
        const shippedRate = totalOrders > 0 ? Math.round((shipped / totalOrders) * 100) : 0;

        // Taux de conversion (Acheteurs uniques divisés par le nombre total de comptes)
        const uniqueBuyers = new Set(paidOrders.map(o => o.customer_email).filter(Boolean)).size;
        const conversion = (usersCount && usersCount > 0) ? (uniqueBuyers / usersCount) * 100 : 0;

        setStats({
          ca: totalCA,
          panierMoyen,
          totalOrders,
          shippedOrders: shipped,
          shippedRate,
          conversionRate: conversion,
        });
      }
      setLoading(false);
    }

    fetchAnalytics();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />
      
      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-[#333333]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-[#6E857B]/10 text-[#6E857B]">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-[#333333]">
                Statistiques & Ventes
              </h1>
            </div>
            <p className="text-xs text-[#333333]/60">
              Analysez les performances globales de la boutique ECLOSIA et l'évolution des univers Maman & Bébé.
            </p>
          </div>
          <span className="px-4 py-2 bg-[#F5EBE6] text-[#333333] text-xs font-bold rounded-xl border border-[#333333]/5">
            Période : Globale
          </span>
        </div>

        {/* Cartes de métriques analytiques */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Chiffre d'Affaires Brut"
            value={loading ? "..." : `${stats.ca.toFixed(2)} €`}
            iconName="dollar"
            trend={stats.totalOrders > 0 ? "Ventes actives" : "En attente"}
            trendDirection="up"
            description="Total encaissé"
          />
          <MetricsCard
            title="Panier Moyen"
            value={loading ? "..." : `${stats.panierMoyen.toFixed(2)} €`}
            iconName="shopping"
            trend="Moyenne"
            trendDirection="up"
            description="par commande"
          />
          <MetricsCard
            title="Taux de Conversion"
            value={loading ? "..." : `${stats.conversionRate.toFixed(1)}%`}
            iconName="users"
            trend={`${stats.totalOrders} achats`}
            trendDirection="up"
            description="acheteurs / inscrits"
          />
          <MetricsCard
            title="Commandes Expédiées"
            value={loading ? "..." : `${stats.shippedOrders} / ${stats.totalOrders}`}
            iconName="zap"
            trend={loading ? "..." : `${stats.shippedRate}%`}
            trendDirection="up"
            description="taux de livraison"
          />
        </div>

        {/* Section Graphique / Analyse détaillée */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#333333]/10 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[#333333]">Répartition des Ventes par Univers</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Bébé (Soins & Tendresse)</span>
                  <span className="text-[#6E857B] font-bold">58%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-[#6E857B] h-full rounded-full" style={{ width: "58%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Maman (Grossesse & Post-Partum)</span>
                  <span className="text-[#D4A396] font-bold">42%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-[#D4A396] h-full rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#333333]/10 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#333333] mb-2">Performance Fournisseurs (Flux Tendu)</h2>
              <p className="text-xs text-gray-500">
                Suivi des délais d'acheminement et de transmission des numéros de suivi aux clients finaux.
              </p>
            </div>
            <div className="p-4 bg-[#FAFAFA] rounded-xl border border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-[#333333]">Délai moyen d'expédition attendu</span>
              <span className="text-xs font-extrabold text-[#6E857B] bg-emerald-50 px-2.5 py-1 rounded-lg">24 - 48h max</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}