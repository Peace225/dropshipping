"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, User, HelpCircle, Users, Sparkles, ShieldCheck, Truck, Percent, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Poppins } from "next/font/google";
import { createClient } from "@supabase/supabase-js";

const logoFont = Poppins({ subsets: ["latin"], weight: ["700", "800"] });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export function Header() {
  const { totalItems } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ avatar_url: string | null, full_name: string | null } | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        const { data } = await supabase.from("users").select("avatar_url, full_name").eq("id", session.user.id).single();
        if (data) setProfile(data);
      }
    }
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { data } = await supabase.from("users").select("avatar_url, full_name").eq("id", session.user.id).single();
        if (data) setProfile(data);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setIsSearching(true);
    setShowDropdown(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchQuery }),
      });
      const data = await response.json();
      setResults(data || []);
    } catch (error) {
      console.error("Erreur de recherche IA:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ECLOSIA",
    "url": "https://eclosia.app",
    "logo": "https://eclosia.app/og-image.jpg",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="sticky top-0 z-50 w-full shadow-md transition-all duration-300 relative">
        
        {/* TopHeader Premium */}
        <div className="bg-[#6E857B] text-white text-[10px] sm:text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-between gap-2">
            <div className="flex items-center gap-2 font-medium tracking-wide text-center">
              <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8C5C8] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white"></span>
              </span>
              <Sparkles className="hidden sm:block w-3.5 h-3.5 text-[#E8C5C8] shrink-0" />
              <span className="line-clamp-1 sm:line-clamp-none">
                <span className="hidden sm:inline">Bien-être Maternel & Puériculture d'Excellence - </span>
                Livraison offerte dès 60€ d'achats en France
              </span>
            </div>
            <div className="hidden md:flex items-center gap-5 text-xs font-medium text-white/90">
              <div className="flex items-center gap-1.5 hover:text-[#E8C5C8] transition-colors cursor-pointer"><Truck className="w-3.5 h-3.5 text-[#E8C5C8]" />Suivi de commande</div>
              <div className="flex items-center gap-1.5 hover:text-[#E8C5C8] transition-colors cursor-pointer"><ShieldCheck className="w-3.5 h-3.5 text-[#E8C5C8]" />Sécurité & Authenticité</div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-[#F5EBE6]/95 backdrop-blur-md border-b border-[#333333]/10">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 md:py-0 md:h-20 flex flex-wrap items-center justify-between gap-y-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group order-1">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 overflow-hidden rounded-full shadow-sm border border-[#6E857B]/20 bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Image src="/images/logo.png" alt="ECLOSIA Logo" fill className="object-cover transition-transform duration-500 group-hover:scale-110" priority />
              </div>
              <div className="flex flex-col transition-transform duration-300 group-hover:translate-x-0.5">
                <span className={`text-[1.65rem] sm:text-[1.90rem] font-extrabold tracking-tight text-[#333333] leading-none ${logoFont.className}`}>ECLOSIA</span>
                <span className="hidden sm:block text-[10px] sm:text-xs font-bold tracking-wider uppercase text-[#6E857B] mt-1 transition-colors group-hover:text-[#D4A396]">Maternité & Puériculture</span>
              </div>
            </Link>

            {/* Actions & Navigation */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0 order-2 md:order-3">
              {user ? (
                <Link href="/compte" className="flex items-center gap-2 text-xs font-bold text-[#333333] p-1.5 pr-3 rounded-full bg-white/80 shadow-sm border border-[#333333]/10 hover:bg-white transition-all duration-200">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-[#6E857B]/20 flex items-center justify-center shrink-0">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-[#6E857B]" />
                    )}
                  </div>
                  <span className="hidden lg:inline max-w-[100px] truncate">{profile?.full_name ? profile.full_name.split(' ')[0] : "Mon Compte"}</span>
                </Link>
              ) : (
                <Link href="/auth/connexion" className="flex items-center gap-1.5 text-xs font-medium text-[#333333] hover:text-[#6E857B] transition-all duration-200 p-2 sm:px-3.5 sm:py-2 rounded-full hover:bg-white/80 hover:shadow-sm">
                  <User className="w-5 h-5 sm:w-4 sm:h-4 text-[#333333]" />
                  <span className="hidden lg:inline">Se connecter</span>
                </Link>
              )}

              <Link href="/community" className="hidden md:flex items-center gap-1.5 text-xs font-medium text-[#333333] hover:text-[#6E857B] transition-all duration-200 px-3.5 py-2 rounded-full hover:bg-white/80 hover:shadow-sm">
                <Users className="w-4 h-4 text-[#6E857B]" />
                <span className="hidden lg:inline">Communauté</span>
              </Link>
              
              <button className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#333333] hover:text-[#6E857B] transition-all duration-200 px-3 py-2 rounded-full hover:bg-white/80 hover:shadow-sm">
                <HelpCircle className="w-4 h-4 text-[#6E857B]" />
                <span className="hidden lg:inline">Aide</span>
              </button>

              <Link href="/cart" className="flex items-center gap-1.5 sm:gap-2 pl-2.5 pr-2 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#6E857B] text-white hover:bg-[#5b7067] transition-all duration-300 relative shadow-sm hover:shadow-md active:scale-95">
                <ShoppingBag className="w-4 h-4 text-white" />
                <span className="text-xs font-medium hidden sm:inline">Panier</span>
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#6E857B] text-[10px] flex items-center justify-center font-bold shadow-inner">{totalItems}</span>
              </Link>
            </div>

            {/* Barre de Recherche IA */}
            <div className="w-full order-3 md:order-2 md:flex-1 max-w-xl mx-0 md:mx-4 lg:mx-8 relative" ref={searchContainerRef}>
              <form onSubmit={handleSearch} className="relative flex items-center group">
                <span className="absolute left-3.5 text-[#333333]/50 transition-colors group-focus-within:text-[#6E857B] pointer-events-none z-10">
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-[#6E857B]" /> : <Search className="w-4 h-4" />}
                </span>
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  onFocus={() => { if(searchQuery) setShowDropdown(true) }} 
                  placeholder="Posez une question, cherchez un besoin..." 
                  className="w-full pl-10 pr-14 sm:pr-32 py-2.5 bg-white/80 border border-[#333333]/10 rounded-full text-sm text-[#333333] placeholder-[#333333]/40 focus:outline-none focus:ring-2 focus:ring-[#6E857B] focus:bg-white transition-all duration-300 shadow-inner hover:border-[#6E857B]/40" 
                />
                <button 
                  type="button" 
                  onClick={handleSearch} 
                  disabled={isSearching || !searchQuery.trim()} 
                  className="absolute right-1 z-10 flex items-center justify-center w-8 h-8 sm:w-auto sm:px-4 sm:py-1.5 bg-[#6E857B] hover:bg-[#5b7067] text-white text-xs font-semibold rounded-full transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="hidden sm:inline pointer-events-none">Rechercher</span>
                  <ArrowRight className="sm:hidden w-4 h-4 pointer-events-none" />
                </button>
              </form>

              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#333333]/10 overflow-hidden z-50">
                  {isSearching ? (
                    <div className="p-8 text-center text-sm font-medium text-[#333333]/60 flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#6E857B]" />
                      L'IA analyse votre besoin...
                    </div>
                  ) : results.length > 0 ? (
                    <ul className="max-h-96 overflow-y-auto p-2">
                      {results.map((product) => (
                        <li key={product.id}>
                          <Link 
                            href={`/shop/product/${product.slug}`} 
                            onClick={() => setShowDropdown(false)} 
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F5EBE6]/50 transition-colors group"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-[#333333] group-hover:text-[#6E857B] transition-colors line-clamp-1">{product.name}</span>
                              <span className="text-xs text-[#333333]/60 line-clamp-1 mt-0.5">{product.description}</span>
                            </div>
                            <span className="text-sm font-bold text-[#333333] shrink-0 ml-4">{Number(product.price).toFixed(2)} €</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : searchQuery.trim() ? (
                    <div className="p-8 text-center text-sm font-medium text-[#333333]/60">
                      Aucun produit trouvé pour "{searchQuery}".
                    </div>
                  ) : null}
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
}