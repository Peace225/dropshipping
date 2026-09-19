import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { MetricsCard } from "@/components/admin/metrics-card";
import { DollarSign, ShoppingBag, Users, Zap } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />
      
      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#333333]">
            Tableau de bord
          </h1>
          <p className="text-xs text-[#333333]/60 mt-1">
            Bienvenue sur l'espace de gestion et de contrôle AURAE.
          </p>
        </div>

        {/* Grille des cartes de métriques */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricsCard
            title="Chiffre d'Affaires"
            value="14 250 €"
            icon={DollarSign}
            trend="+12%"
            trendDirection="up"
            description="vs mois dernier"
          />
          <MetricsCard
            title="Commandes"
            value="128"
            icon={ShoppingBag}
            trend="+5.4%"
            trendDirection="up"
            description="en cours de traitement"
          />
          <MetricsCard
            title="Clients Inscrits"
            value="1 420"
            icon={Users}
            trend="+8%"
            trendDirection="up"
            description="Maman & Bébé"
          />
          <MetricsCard
            title="Ventes Flash"
            value="2 Actives"
            icon={Zap}
            description="Gestion en cours"
          />
        </div>

        {/* Section secondaire (Vous pourrez y ajouter vos tableaux récents ou graphiques plus tard) */}
        <div className="rounded-2xl border border-[#333333]/10 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#333333]/70 mb-4">
            Activité récente de la plateforme
          </h2>
          <p className="text-xs text-[#333333]/50">
            Les données de vos ventes et de vos univers Maman & Bébé s'afficheront ici en temps réel.
          </p>
        </div>
      </main>
    </div>
  );
}