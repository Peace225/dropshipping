"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Sparkles, Star, ShoppingBag, ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const CATEGORIES = [
  "Tous",
  "Matelas & Sommeil",
  "Couches Lavables",
  "Toilette & Change",
  "Repas & Chaises Hautes",
  "Baignade Bébé"
];

// On assigne la catégorie selon le vrai contenu de la base
function assignCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("couche") || n.includes("culotte") || n.includes("so protect")) return "Couches Lavables";
  if (n.includes("bain") || n.includes("maillot")) return "Baignade Bébé";
  if (n.includes("chaise") || n.includes("coussin de chaise")) return "Repas & Chaises Hautes";
  if (n.includes("langer") || n.includes("tapis de fond") || n.includes("nomade")) return "Toilette & Change";
  if (n.includes("matelas") || n.includes("drap") || n.includes("alèse") || n.includes("alese") || n.includes("plan incliné")) return "Matelas & Sommeil";
  return "Matelas & Sommeil"; // Fallback logique pour l'univers bébé
}

function normalizeKey(name: string): string {
  return name.toLowerCase()
    .replace(/\(.*?\)/g, "") // enlève (Taille S) ou (Lot de 6)
    .replace(/taille\s+[a-z0-9\/]+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

const PLACEHOLDER = "https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/placeholder-bebe.jpg";

function cleanImageUrl(raw?: string): string {
  if (!raw) return PLACEHOLDER;
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  return first || PLACEHOLDER;
}

export default function BebeShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: cat } = await supabase.from("categories").select("id").ilike("slug", "%bebe%").single();
      if (!cat) { setLoading(false); return; }

      const { data } = await supabase
        .from("products")
        .select(`id, name, slug, description, price, image_url, is_active, sku, product_images(image_url, is_primary, position)`)
        .eq("category_id", cat.id)
        .eq("is_active", true) // On prend strictement la sélection activée
        .order("name");

      if (data) {
        const map = new Map<string, any>();
        
        data.forEach((p: any) => {
          const key = normalizeKey(p.name);
          
          if (!map.has(key)) {
            // Logique sécurisée pour l'image
            const sortedImgs = (p.product_images || []).sort((a: any, b: any) => a.position - b.position);
            let rawImg = sortedImgs.find((i: any) => i.is_primary)?.image_url || sortedImgs[0]?.image_url || p.image_url;
            
            map.set(key, {
              id: p.id,
              name: p.name.replace(/\s*\(.*?\)/g, "").trim(),
              category: assignCategory(p.name),
              price: `${Number(p.price || 0).toFixed(2).replace(".", ",")} €`,
              reviewsCount: Math.floor(Math.random() * 80) + 20,
              image: cleanImageUrl(rawImg),
              slug: `/shop/bebe/${p.slug}`,
              badge: "Oeko-Tex",
              description: p.description || `${p.name} • Certifié Oeko-Tex`
            });
          }
        });
        setProducts(Array.from(map.values()));
      }
      setLoading(false);
    })();
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    CATEGORIES.forEach(k => {
      c[k] = k === "Tous" ? products.length : products.filter(p => p.category === k).length;
    });
    return c;
  }, [products]);

  const filtered = selectedCategory === "Tous" ? products : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 mt-16">
        <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/75 hover:text-[#333333] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4"/> Retour à l'accueil
        </Link>

        {/* HERO SECTION */}
        <div className="bg-gradient-to-r from-[#F5EBE6] via-[#DCE4E0]/60 to-[#F5EBE6] rounded-3xl p-6 sm:p-10 border border-[#333333]/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#6E857B] text-white mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5"/> Univers Bébé
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] tracking-tight leading-tight mb-3">
              L'essentiel pour grandir en toute sécurité
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed">
              Une sélection exclusive ECLOSIA de {products.length} références indispensables.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#333333]/10 shadow-sm text-xs sm:text-sm font-medium min-w-[260px]">
            <div className="flex items-center gap-2 text-[#333333]"><ShieldCheck className="w-4 h-4 text-[#6E857B]"/><span>Certifié Oeko-Tex & Sans substances nocives</span></div>
            <div className="flex items-center gap-2 text-[#333333]"><ShieldCheck className="w-4 h-4 text-[#6E857B]"/><span>{products.length} produits uniques</span></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR FILTRES */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-[#333333]/10 shadow-sm p-4 sm:p-5">
              <h3 className="text-base font-extrabold text-[#333333] mb-4 px-2">Filtrer par univers</h3>
              <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden">
                {CATEGORIES.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setSelectedCategory(c)} 
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === c ? "bg-[#333333] text-white shadow-sm" : "text-[#333333]/75 bg-[#F9F6F4] lg:bg-transparent border border-[#333333]/5 hover:bg-[#333333]/5"}`}
                  >
                    <span className="text-left leading-tight">{c}</span>
                    <span className="flex items-center gap-1.5 ml-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${selectedCategory === c ? "bg-white/20 text-white" : "bg-[#333333]/10 text-[#333333]"}`}>{counts[c] || 0}</span>
                      {selectedCategory === c && <ChevronRight className="hidden lg:block w-4 h-4 opacity-70"/>}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GRILLE PRODUITS */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-white rounded-2xl border border-[#333333]/10 animate-pulse"/> )}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-[#333333]/20">
                <p className="font-extrabold text-[#333333]/40 text-lg mb-2">Aucun produit</p>
                <p className="text-sm font-medium text-[#333333]/40">dans la catégorie {selectedCategory}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(product => (
                  <div key={product.id} className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                    <Link href={product.slug} className="relative block w-full aspect-square bg-[#6E857B]/5 overflow-hidden flex items-center justify-center p-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"/>
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-[#333333] shadow-sm border border-[#333333]/5">
                        {product.category}
                      </span>
                      <span className="absolute bottom-3 left-3 bg-[#333333] text-white px-2.5 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1.5 shadow-sm">
                        <Sparkles className="w-3 h-3 text-[#6E857B]"/>{product.badge}
                      </span>
                    </Link>
                    <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1 mb-2 text-amber-500">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current"/>) }
                          <span className="text-xs text-[#333333]/60 font-medium ml-1">({product.reviewsCount})</span>
                        </div>
                        <Link href={product.slug}>
                          <h3 className="font-extrabold text-[#333333] text-sm leading-snug line-clamp-2 hover:underline hover:text-[#6E857B] transition-colors">{product.name}</h3>
                        </Link>
                        <p className="text-xs text-[#333333]/60 mt-1.5 line-clamp-2 leading-relaxed font-medium">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-[#333333]/10 mt-auto">
                        <span className="font-extrabold text-xl text-[#333333]">{product.price}</span>
                        <Link href={product.slug} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#333333] text-white text-xs font-bold hover:bg-black transition-colors shadow-sm">
                          <ShoppingBag className="w-4 h-4"/>Voir
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}