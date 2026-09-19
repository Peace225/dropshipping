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
  ChevronRight,
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
  
  // État pour gérer l'ouverture des sous-menus (ex: Produits)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Produits: true, // Ouvert par défaut pour plus de visibilité
  });

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Structure du menu latéral
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
          href: "#", // Pas de lien direct car c'est un bouton déroulant
          icon: Package,
          subItems: [
            {
              title: "Maman (Grossesse & Post-Partum)",
              href: "/admin/produits/maman",
            },
            {
              title: "Bébé (Soins & Tendresse)",
              href: "/admin/produits/bebe",
            },
          ],
        },
        {
          title: "Commandes",
          href: "/admin/commandes",
          icon: ShoppingBag,
          badge: "12",
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
          badge: "En cours",
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
    <aside className="sticky top-0 flex h-screen w-72 flex-col justify-between border-r border-[#333333]/10 bg-white p-4 shrink-0 font-sans">
      <div className="space-y-6 overflow-y-auto pr-1">
        {/* LOGO & BRANDING HEADER */}
        <div className="flex items-center justify-between px-2 pt-2 pb-4 border-b border-[#333333]/10">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#333333] text-white shadow-sm">
              <Zap className="h-5 w-5 text-[#D4A396] fill-current" />
            </span>
            <div>
              <span className="block text-base font-bold tracking-tight text-[#333333]">
                AURAE
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

        {/* GROUPES DE NAVIGATION */}
        <nav className="space-y-5">
          {navigation.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#333333]/50">
                {group.groupLabel}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  // On vérifie si l'URL courante correspond à l'item principal ou à un de ses sous-menus
                  const isActive = pathname === item.href || (hasSubItems && item.subItems?.some(sub => pathname.startsWith(sub.href)));
                  const isOpen = openMenus[item.title];
                  const Icon = item.icon;

                  return (
                    <div key={item.title}>
                      {hasSubItems ? (
                        /* BOUTON AVEC SOUS-MENU (ACCORDÉON) */
                        <button
                          onClick={() => toggleMenu(item.title)}
                          className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                            isActive || isOpen
                              ? "bg-gray-50 text-[#333333]"
                              : "text-[#333333]/70 hover:bg-[#F5EBE6]/60 hover:text-[#333333]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={`h-4 w-4 transition-colors ${
                                isActive || isOpen ? "text-[#D4A396]" : "text-[#333333]/60 group-hover:text-[#333333]"
                              }`}
                            />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform duration-200 text-[#333333]/60 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      ) : (
                        /* LIEN SIMPLE */
                        <Link
                          href={item.href}
                          className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                            isActive
                              ? "bg-[#333333] text-white shadow-sm"
                              : "text-[#333333]/70 hover:bg-[#F5EBE6]/60 hover:text-[#333333]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={`h-4 w-4 transition-colors ${
                                isActive ? "text-[#D4A396]" : "text-[#333333]/60 group-hover:text-[#333333]"
                              }`}
                            />
                            <span>{item.title}</span>
                          </div>
                          {item.badge ? (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          ) : (
                            <ChevronRight
                              className={`h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 ${
                                isActive ? "text-white opacity-100" : "text-[#333333]/40"
                              }`}
                            />
                          )}
                        </Link>
                      )}

                      {/* AFFICHAGE DES SOUS-MENUS SI OUVERT */}
                      {hasSubItems && isOpen && (
                        <div className="mt-1 ml-4 flex flex-col space-y-0.5 border-l border-[#333333]/10 pl-3">
                          {item.subItems?.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={`rounded-lg px-3 py-2 text-[11px] font-medium transition-all ${
                                  isSubActive
                                    ? "bg-[#333333]/5 text-[#333333] font-bold"
                                    : "text-[#333333]/60 hover:bg-gray-50 hover:text-[#333333]"
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
        </nav>
      </div>

      {/* PIED DU SIDEBAR : PROFIL ADMIN & DÉCONNEXION */}
      <div className="border-t border-[#333333]/10 pt-4 space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-[#FAFAFA] p-2.5 border border-[#333333]/5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A396]/30 font-bold text-[#333333] text-xs">
              AD
            </div>
            <div className="overflow-hidden text-left">
              <p className="truncate text-xs font-bold text-[#333333]">
                Admin Aurae
              </p>
              <p className="truncate text-[10px] text-[#333333]/60">
                admin@aurae.com
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