import Link from "next/link";
import { LayoutDashboard, ShoppingBag, MessageSquare, Users, Settings, LogOut, MapPin } from "lucide-react";

export function Sidebar() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "AURAE Dashboard France",
    "description": "Espace personnel sécurisé et tableau de bord de bien-être maternel pour les mères en France.",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Accueil",
          "item": "https://aurae.app"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Dashboard France",
          "item": "https://aurae.app/dashboard"
        }
      ]
    },
    "spatialCoverage": {
      "@type": "AdministrativeArea",
      "name": "France"
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Orders & Essentials", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "AI Wellness Chats", href: "/dashboard/chats", icon: MessageSquare },
    { label: "Community", href: "/dashboard/community", icon: Users },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <aside 
        className="w-64 bg-white border-r border-aurae-charcoal/5 flex flex-col h-screen sticky top-0"
        aria-label="Tableau de bord France - Espace Maternité"
      >
        <div className="p-6 border-b border-aurae-charcoal/5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif tracking-wider text-aurae-charcoal" title="AURAE France Dashboard">
            AURAE <span className="text-xs font-sans font-normal text-aurae-rose">France</span>
          </Link>
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-aurae-pink text-aurae-rose font-medium">
            <MapPin className="w-3 h-3" />
            FR
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-aurae-charcoal/80 hover:bg-aurae-pink hover:text-aurae-charcoal transition-colors"
              >
                <Icon className="w-5 h-5 text-aurae-rose" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-aurae-charcoal/5">
          <button
            onClick={() => {}}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}