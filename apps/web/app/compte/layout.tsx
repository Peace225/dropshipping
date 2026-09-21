"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Heart, 
  User, 
  Shield, 
  LogOut, 
  ChevronRight 
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/connexion");
        return;
      }
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setUserProfile(data || { 
        full_name: session.user.user_metadata?.full_name || "Client ECLOSIA", 
        email: session.user.email 
      });
    }
    loadUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/connexion");
    router.refresh();
  };

  const navItems = [
    { name: "Tableau", fullName: "Tableau de bord", href: "/compte", icon: LayoutDashboard },
    { name: "Commandes", fullName: "Mes Commandes", href: "/compte/commandes", icon: Package },
    { name: "Adresses", fullName: "Mes Adresses", href: "/compte/adresses", icon: MapPin },
    { name: "Favoris", fullName: "Mes Favoris", href: "/compte/favoris", icon: Heart },
    { name: "Profil", fullName: "Mon Profil", href: "/compte/profil", icon: User },
    { name: "Sécurité", fullName: "Sécurité", href: "/compte/securite", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/20 via-white to-[#6E857B]/5 py-6 sm:py-8 px-3 sm:px-6 lg:px-8 pb-28 md:pb-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
        
        {/* SIDEBAR DESKTOP (Masquée sur smartphone) */}
        <aside className="hidden md:block md:col-span-1">
          <div className="bg-white rounded-3xl p-5 border border-black/5 shadow-sm sticky top-28 space-y-6">
            
            {/* Profil résumé */}
            <div className="flex items-center gap-3 pb-5 border-b border-black/5">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#6E857B]/20 text-[#6E857B] flex items-center justify-center font-extrabold text-lg shrink-0">
                {userProfile?.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{userProfile?.full_name?.charAt(0).toUpperCase() || "E"}</span>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-extrabold truncate text-[#333333]">{userProfile?.full_name}</h2>
                <p className="text-[10px] text-black/60 truncate">{userProfile?.email}</p>
              </div>
            </div>

            {/* Menu Desktop */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#6E857B] text-white shadow-md shadow-[#6E857B]/20"
                        : "text-black/70 hover:bg-[#F5EBE6]/60 hover:text-[#333333]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#6E857B]"}`} />
                      <span>{item.fullName}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? "text-white" : "text-black/30"}`} />
                  </Link>
                );
              })}
            </nav>

            {/* Déconnexion */}
            <div className="pt-4 border-t border-black/5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENU DYNAMIQUE DES PAGES */}
        <main className="md:col-span-3">
          {children}
        </main>
      </div>

      {/* BARRE DE NAVIGATION MOBILE FIXÉE EN BAS (Visible partout sur smartphone) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#333333]/10 px-2 py-2 shadow-2xl">
        <div className="grid grid-cols-6 gap-1 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                  isActive
                    ? "text-[#6E857B] font-extrabold bg-[#F5EBE6]/70"
                    : "text-black/60 font-medium hover:text-[#333333]"
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? "text-[#6E857B]" : "text-black/45"}`} />
                <span className="text-[9px] tracking-tight truncate max-w-[48px]">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}