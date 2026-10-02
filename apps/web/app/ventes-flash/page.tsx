"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock3,
  Star,
  ShoppingBag,
  SlidersHorizontal,
  ChevronDown,
  Search,
  Check,
  Zap,
  X,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "@/context/cart-context";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const FLASH_SLOTS = [
  { id: "current", label: "En ce moment", status: "Termine dans", active: true },
  { id: "slot-1", label: "Aujourd'hui 18:00", status: "À venir", active: false },
  { id: "slot-2", label: "Demain 09:00", status: "À venir", active: false },
];

const CATEGORIES = ["Tous les produits", "Bébé", "Maman"];

// Composant interne de compte à rebours réel
function LiveCountdown({ endsAt }: { endsAt: string | Date }) {
  const [timeLeft, setTimeLeft] = useState({ h: 1, m: 46, s: 53, expired: false });

  useEffect(() => {
    const target = new Date(endsAt).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ h: 0, m: 0, s: 0, expired: true });
        return;
      }
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        expired: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (timeLeft.expired) return <span className="text-xs font-bold text-red-400">Expiré</span>;

  return (
    <span className="font-mono text-sm font-bold tracking-wider text-white">
      {String(timeLeft.h).padStart(2, "0")}h : {String(timeLeft.m).padStart(2, "0")}m : {String(timeLeft.s).padStart(2, "0")}s
    </span>
  );
}

export default function VentesFlashPage() {
  const { addItem } = useCart() as any;
  const [flashProducts, setFlashProducts] = useState<any[]>([]);
  const [flashEndsAt, setFlashEndsAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState("current");
  const [selectedCategory, setSelectedCategory] = useState("Tous les produits");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Les plus demandés");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // 1. Récupère la vente flash active et sa fin
      const { data: flash } = await supabase
        .from("flash_sales")
        .select("ends_at")
        .eq("slot_label", "En ce moment")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (flash?.ends_at) {
        setFlashEndsAt(flash.ends_at);
      } else {
        setFlashEndsAt(new Date(Date.now() + 2 * 3600000).toISOString());
      }

      // 2. Récupération des produits flash (-10%)
      const { data } = await supabase
        .from("products")
        .select(`
          id, name, slug, price, promo_price, flash_sale_ends_at, stock, description,
          categories ( name, slug ),
          product_images ( image_url, is_primary, position )
        `)
        .eq("is_flash_sale", true)
        .eq("is_active", true)
        .limit(8);

      if (data) {
        const formatted = data.map((item: any) => {
          const images = [...(item.product_images ?? [])].sort((a: any, b: any) => a.position - b.position);
          const raw = images.find((i: any) => i.is_primary)?.image_url ?? images[0]?.image_url ?? "";
          const imageUrl = raw.startsWith("http") ? raw : `/placeholder.jpg`;
          const original = Number(item.price);
          const promo = Number(item.promo_price || (original * 0.9).toFixed(2));
          const universe = item.categories?.slug === "bebe" || item.name.toLowerCase().includes("culotte") || item.name.toLowerCase().includes("maillot") || item.name.toLowerCase().includes("matelas") ? "Bébé" : "Maman";
          
          return {
            id: item.id,
            name: item.name,
            slug: item.slug,
            category: universe,
            universe,
            universeColor: universe === "Bébé" ? "bg-[#6E857B]" : "bg-[#E8C5C8]",
            universeText: universe === "Bébé" ? "text-white" : "text-[#333]",
            price: `${promo.toFixed(2).replace(".", ",")} €`,
            numericPrice: promo,
            oldPrice: `${original.toFixed(2).replace(".", ",")} €`,
            originalNumeric: original,
            discount: `-10%`,
            image: imageUrl,
            detailUrl: `/shop/${item.categories?.slug || "maternite"}/${item.slug}`,
            stockLeft: Math.floor((item.stock || 40) * 0.25),
            stockTotal: item.stock || 40,
            rating: 5,
            reviewsCount: Math.floor(Math.random() * 40) + 15,
            ends_at: item.flash_sale_ends_at || flash?.ends_at,
          };
        });
        setFlashProducts(formatted);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return flashProducts
      .filter((p) => {
        if (selectedCategory !== "Tous les produits" && p.category !== selectedCategory) return false;
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "Prix : Croissant") return a.numericPrice - b.numericPrice;
        if (sortBy === "Prix : Décroissant") return b.numericPrice - a.numericPrice;
        return 0;
      });
  }, [flashProducts, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("Tous les produits");
    setSearchQuery("");
    setSortBy("Les plus demandés");
  };

  const hasActiveFilters = selectedCategory !== "Tous les produits" || searchQuery !== "";

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24 text-[#333333]">
      <div className="border-b bg-white py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4A396] text-white">
              <Zap className="h-3.5 w-3.5 fill-current" />
            </span>
            <h1 className="text-xl font-bold">Ventes Flash ECLOSIA -10%</h1>
          </div>
          <nav className="text-xs text-[#333333]/50">
            <Link href="/">Accueil</Link> / <span className="font-semibold text-[#333]">Ventes Flash</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* BANNIÈRE TOP FLASH */}
        <div className="mb-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex flex-col items-center justify-between gap-4 bg-[#333333] p-4 text-white sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4A396]">
                <Zap className="h-4 w-4 fill-current" />
              </span>
              <div>
                <h2 className="font-bold">Vente Flash -10% en cours</h2>
                <p className="text-[11px] text-white/70">{filtered.length} produits sélectionnés • Stock limité</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2">
              <Clock3 className="h-4 w-4 text-[#D4A396]" />
              <span className="text-xs text-white/80">Termine dans :</span>
              {flashEndsAt && <LiveCountdown endsAt={flashEndsAt} />}
            </div>
          </div>
          
          <div className="flex overflow-x-auto border-b bg-[#F5EBE6]/50">
            {FLASH_SLOTS.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`flex min-w-[140px] flex-1 flex-col items-center border-b-2 px-4 py-3 ${
                  selectedSlot === slot.id ? "border-[#D4A396] bg-white font-bold" : "border-transparent text-[#333]/60"
                }`}
              >
                <span className="text-xs">{slot.label}</span>
                <span className="text-[10px] text-[#6E857B]">{slot.status}</span>
              </button>
            ))}
          </div>
        </div>

        {/* LAYOUT PRINCIPAL AVEC SIDEBAR */}
        <div className="flex gap-8">
          
          {/* ================= SIDEBAR CAPTIVANTE (Desktop & Mobile Drawer) ================= */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-72 transform overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 lg:static lg:z-0 lg:w-64 lg:shrink-0 lg:translate-x-0 lg:rounded-2xl lg:border lg:border-[#333333]/10 lg:p-5 lg:shadow-sm ${
              showMobileFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#333]">Filtres & Univers</h2>
              <button onClick={() => setShowMobileFilters(false)} className="rounded-lg p-1 text-[#333]/60 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* CARTE D'UNIVERS CAPTIVANTE */}
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#F5EBE6] to-[#E8C5C8]/30 p-4 border border-[#D4A396]/20">
              <div className="flex items-center gap-2 mb-2 text-[#333]">
                <Sparkles className="h-4 w-4 text-[#D4A396]" />
                <span className="text-xs font-bold uppercase tracking-wider">Univers ECLOSIA</span>
              </div>
              <p className="text-[11px] text-[#333]/70 leading-relaxed">
                Filtrez instantanément nos pépites pour Maman & Bébé à prix flash.
              </p>
            </div>

            {/* RECHERCHE RAPIDE DANS LA SIDEBAR */}
            <div className="mb-6">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#333]/60">Recherche</h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un article..."
                  className="w-full rounded-xl border border-[#333333]/15 bg-white py-2 pl-9 pr-8 text-xs text-[#333] placeholder-[#333]/40 focus:border-[#D4A396] focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#333]/40" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-2.5 text-[#333]/40 hover:text-[#333]">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <hr className="my-5 border-gray-100" />

            {/* CATEGORIES / UNIVERS EN SIDEBAR */}
            <div className="mb-6">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#333]/60">Filtrer par Univers</h3>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowMobileFilters(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#333] text-white shadow-md shadow-[#333]/10"
                          : "bg-gray-50 text-[#333]/80 hover:bg-[#F5EBE6]/60 hover:text-[#333]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${isActive ? "bg-[#D4A396]" : "bg-gray-300"}`} />
                        {cat}
                      </span>
                      {isActive && <Check className="h-3.5 w-3.5 text-[#D4A396]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BOUTON RESET FILTRES SI ACTIFS */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#D4A396] py-2.5 text-xs font-semibold text-[#333] transition-colors hover:bg-[#F5EBE6]/40"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[#D4A396]" /> Réinitialiser les filtres
              </button>
            )}
          </aside>

          {/* Overlay mobile pour fermer le tiroir de filtres */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setShowMobileFilters(false)} />
          )}

          {/* ================= CONTENEUR PRINCIPAL DES PRODUITS ================= */}
          <div className="min-w-0 flex-1">
            
            {/* BARRE DE CONTRÔLE (Bouton Filtre Mobile + Sélecteur de Tri) */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#333333]/15 bg-white px-4 py-2 text-xs font-semibold text-[#333] shadow-sm lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#D4A396]" />
                Filtres & Univers
                {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-[#D4A396]" />}
              </button>

              <p className="hidden text-xs text-[#333]/60 sm:block">
                Affichage de <span className="font-bold text-[#333]">{filtered.length}</span> produit(s) flash
              </p>

              <div className="ml-auto flex items-center gap-2">
                <span className="hidden text-xs text-[#333]/60 sm:inline">Trier par :</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-xl border border-[#333333]/15 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-[#333] focus:outline-none"
                  >
                    <option>Les plus demandés</option>
                    <option>Prix : Croissant</option>
                    <option>Prix : Décroissant</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[#333]/50" />
                </div>
              </div>
            </div>

            {/* GRILLE PRODUITS */}
            {loading ? (
              <div className="py-20 text-center">
                <p className="animate-pulse text-xs font-bold text-[#333]/60">Chargement de votre sélection flash...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#333]/15 bg-white p-12 text-center">
                <p className="text-sm font-semibold text-[#333]">Aucun produit ne correspond à votre filtre.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#333] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#D4A396]"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Voir tous les produits flash
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-3">
                {filtered.map((product) => {
                  const pct = Math.round(((product.stockTotal - product.stockLeft) / product.stockTotal) * 100);
                  return (
                    <article
                      key={product.id}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#333]/10 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <span className="absolute left-3 top-3 z-20 rounded-full bg-[#333] px-2.5 py-1 text-[9px] font-bold text-white">
                        {product.discount}
                      </span>
                      <span className={`absolute right-3 top-3 z-20 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${product.universeColor} ${product.universeText}`}>
                        {product.universe}
                      </span>
                      
                      <Link href={product.detailUrl} className="relative block aspect-square bg-[#F5EBE6]/45">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-contain p-5 transition-transform duration-700 group-hover:scale-105"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="min-h-[32px] text-xs font-semibold line-clamp-2">{product.name}</h3>
                        <div className="mt-2 flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current text-[#D4A396]" />
                          ))}
                          <span className="ml-1 text-[10px] text-[#333]/40">({product.reviewsCount})</span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="font-bold">{product.price}</span>
                          <span className="text-xs line-through text-[#333]/40">{product.oldPrice}</span>
                        </div>
                        <div className="mt-3">
                          <div className="mb-1 flex justify-between text-[10px]">
                            <span>Stock</span>
                            <span className="font-bold text-[#D4A396]">{product.stockLeft} restants</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#333]/10">
                            <div className="h-full bg-[#D4A396]" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            addItem &&
                            addItem({
                              id: product.id,
                              name: product.name,
                              slug: product.slug,
                              price: product.numericPrice,
                              original_price: product.originalNumeric,
                              priceFormatted: product.price,
                              image: product.image,
                              quantity: 1,
                              is_flash_sale: true,
                            })
                          }
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#333] py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#D4A396]"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" /> Ajouter
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}