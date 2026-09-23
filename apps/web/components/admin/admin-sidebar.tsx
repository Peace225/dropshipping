"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Zap,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Tag,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Layers,
} from "lucide-react";

interface NavSubItem {
  title: string;
  href: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  subItems?: NavSubItem[];
}

interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

export function AdminSidebar() {
  const pathname = usePathname();
  
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Produits: true,
  });

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Liens avec /admin/produits/... pour correspondre à votre dossier
  const navigation: NavGroup[] = [
    {
      groupLabel: "Vue d'ensemble",
      items: [
        { title: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
        { title: "Statistiques & Ventes", href: "/admin/analytics", icon: BarChart3 },
      ],
    },
    {
      groupLabel: "Boutique & Catalogues",
      items: [
        {
          title: "Produits",
          href: "#",
          icon: Package,
          subItems: [
            { title: "Gestion Catalogue", href: "/admin/produits" },
            { title: "Importer (CSV Fournisseur)", href: "/admin/import" },
            { title: "Maman (Grossesse)", href: "/admin/produits/maman" },
            { title: "Bébé (Soins)", href: "/admin/produits/bebe" },
          ],
        },
        {
          title: "Commandes",
          href: "/admin/commandes",
          icon: ShoppingBag,
          badge: "Suivi",
          badgeColor: "bg-[#6E857B] text-white",
        },
        { title: "Catégories", href: "/admin/categories", icon: Layers },
      ],
    },
    {
      groupLabel: "Marketing & Offres",
      items: [
        {
          title: "Ventes Flash",
          href: "/admin/ventes-flash",
          icon: Zap,
          badge: "Actif",
          badgeColor: "bg-[#D4A396] text-[#333333]",
        },
        { title: "Promotions & Coupons", href: "/admin/promotions", icon: Tag },
      ],
    },
    {
      groupLabel: "Gestion & Support",
      items: [
        { title: "Clients", href: "/admin/clients", icon: Users },
        { title: "Conseillère IA & Support", href: "/admin/support", icon: Sparkles },
      ],
    },
    {
      groupLabel: "Système",
      items: [
        { title: "Paramètres", href: "/admin/parametres", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="sticky top-0 h-screen w-72 bg-white border-r border-[#333333]/10 flex flex-col justify-between shrink-0 font-sans z-30">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex items-center justify-between px-2 pt-2 pb-4 border-b border-[#333333]/10">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#333333] text-white shadow-sm">
              <Zap className="h-5 w-5 text-[#D4A396] fill-current" />
            </span>
            <div>
              <span className="block text-base font-bold tracking-tight text-[#333333]">
                ECLOSIA
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E857B]">
                Super Admin
              </span>
            </div>
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F5EBE6] px-2 py-0.5 text-[9px] font-bold text-[#333333]">
            <ShieldCheck className="h-3 w-3 text-[#6E857B]" /> Pro
          </span>
        </div>

        <div className="space-y-6">
          {navigation.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#333333]/40">
                {group.groupLabel}
              </p>
              
              <div className="space-y-1">
                {group.items.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isActive = pathname === item.href || (hasSubItems && item.subItems?.some(sub => pathname.startsWith(sub.href)));
                  const isOpen = openMenus[item.title];
                  const Icon = item.icon;

                  return (
                    <div key={item.title}>
                      {hasSubItems ? (
                        <button
                          onClick={() => toggleMenu(item.title)}
                          className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                            isActive || isOpen
                              ? "bg-gray-50 text-[#333333]"
                              : "text-[#333333]/70 hover:bg-[#F5EBE6]/50 hover:text-[#333333]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`h-4 w-4 ${isActive || isOpen ? "text-[#D4A396]" : "text-[#333333]/60"}`} />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 text-[#333333]/60 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                            isActive
                              ? "bg-[#333333] text-white shadow-sm"
                              : "text-[#333333]/70 hover:bg-[#F5EBE6]/50 hover:text-[#333333]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`h-4 w-4 ${isActive ? "text-[#D4A396]" : "text-[#333333]/60"}`} />
                            <span>{item.title}</span>
                          </div>
                          {item.badge && (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )}

                      {hasSubItems && isOpen && (
                        <div className="mt-1 ml-4 flex flex-col space-y-1 border-l border-[#333333]/15 pl-3 py-1">
                          {item.subItems?.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
                                  isSubActive
                                    ? "bg-[#333333]/10 text-[#333333] font-bold"
                                    : "text-[#333333]/60 hover:text-[#333333] hover:bg-gray-50"
                                }`}
                              >
                                {sub.title}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-[#333333]/10 space-y-3 bg-white">
        <div className="flex items-center justify-between rounded-xl bg-[#FAFAFA] p-2.5 border border-[#333333]/5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A396]/30 font-bold text-[#333333] text-xs">
              AD
            </div>
            <div className="overflow-hidden text-left">
              <p className="truncate text-xs font-bold text-[#333333]">
                Admin Eclosia
              </p>
              <p className="truncate text-[10px] text-[#333333]/60">
                admin@eclosia.com
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert("Déconnexion...")}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}