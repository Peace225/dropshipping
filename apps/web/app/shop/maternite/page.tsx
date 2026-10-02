"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Sparkles, Star, ShoppingBag, ArrowLeft, ShieldCheck, ChevronRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PLACEHOLDER = "https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/placeholder-maman.jpg";

function cleanImageUrl(raw?: string): string {
  if (!raw) return PLACEHOLDER;
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  return first || PLACEHOLDER;
}

// Catégorisation basée sur vos produits Maman réels
function assignMamanCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("coussinet") || n.includes("allaitement")) return "Allaitement";
  if (n.includes("serviette") || n.includes("hygiénique") || n.includes("hygienique") || n.includes("nuit") || n.includes("jour") || n.includes("protège-slip") || n.includes("protege")) return "Hygiène Post-Partum";
  if (n.includes("carré") || n.includes("démaquillant") || n.includes("bambou") || n.includes("carre")) return "Accessoires Zéro Déchet";
  return "Soins & Hygiène Maman";
}

export default function MaternityShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [products, setProducts] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>(["Tous"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: cat, error: catErr } = await supabase
          .from("categories")
          .select("id, slug, name")
          .eq("slug", "maman")
          .maybeSingle();

        if (catErr || !cat) {
          console.error("Erreur catégorie ou introuvable", catErr);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("products")
          .select(`id, name, slug, price, description, is_active, sku, product_images ( image_url, is_primary, position )`)
          .eq("category_id", cat.id)
          .eq("is_active", true)
          .order("name");

        if (error) {
          console.error(error.message);
          setLoading(false);
          return;
        }

        const formattedData = (data || []).map((product: any) => {
          const images = [...(product.product_images ?? [])].sort((a: any, b: any) => a.position - b.position);
          const rawImage = images.find((img: any) => img.is_primary)?.image_url ?? images[0]?.image_url ?? product.image_url;
          const finalImage = cleanImageUrl(rawImage);

          return {
            id: product.id,
            name: product.name.replace(/\s*\(.*?\)/g, "").trim(),
            category: assignMamanCategory(product.name),
            price: `${Number(product.price).toFixed(2).replace(".", ",")} €`,
            rating: 5,
            reviewsCount: Math.floor(Math.random() * 80) + 20,
            image: finalImage,
            imagesCount: images.length,
            slug: `/shop/maternite/${product.slug}`,
            badge: "Oeko-Tex",
            description: product.description || `${product.name} • Certifié sans substances nocives`,
          };
        });

        const uniqueCategories = Array.from(new Set(formattedData.map((p) => p.category))).sort();
        setProducts(formattedData);
        setCategoriesList(["Tous", ...uniqueCategories]);
      } catch (e: any) {
        console.error(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    categoriesList.forEach(k => {
      c[k] = k === "Tous" ? products.length : products.filter(p => p.category === k).length;
    });
    return c;
  }, [products, categoriesList]);

  const filteredProducts = useMemo(() => {
    return selectedCategory === "Tous" ? products : products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 mt-16">
        <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/75 hover:text-[#333333] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
        
        {/* HERO SECTION */}
        <div className="bg-gradient-to-r from-[#F5EBE6] via-[#E8C5C8]/30 to-[#F5EBE6] rounded-3xl p-6 sm:p-10 border border-[#333333]/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E8C5C8] text-[#333333] mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Univers Maman
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] tracking-tight leading-tight mb-3">
              Prendre soin de vous, de la grossesse au post-partum
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed">
              Une sélection exclusive de produits d'hygiène et d'allaitement lavables, durables et certifiés.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#333333]/10 shadow-sm text-xs sm:text-sm font-medium min-w-[260px]">
            <div className="flex items-center gap-2 text-[#333333]"><ShieldCheck className="w-4 h-4 text-[#E8C5C8] fill-current" /><span>Solutions Lavables & Durables</span></div>
            <div className="flex items-center gap-2 text-[#333333]"><ShieldCheck className="w-4 h-4 text-[#E8C5C8] fill-current" /><span>Certifié Oeko-Tex Standard 100</span></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTRES */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-[#333333]/10 shadow-sm p-4 sm:p-5">
              <h3 className="text-base font-extrabold text-[#333333] mb-4 px-2">Filtrer par univers</h3>
              <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden">
                {categoriesList.map((cat, idx) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedCategory(cat)} 
                      className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${isActive ? "bg-[#333333] text-white shadow-sm" : "text-[#333333]/75 bg-[#F9F6F4] lg:bg-transparent border border-[#333333]/5 hover:bg-[#333333]/5"}`}
                    >
                      <span className="text-left leading-tight">{cat}</span>
                      <span className="flex items-center gap-1.5 ml-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${isActive ? "bg-white/20 text-white" : "bg-[#333333]/10 text-[#333333]"}`}>{counts[cat] || 0}</span>
                        {isActive && <ChevronRight className="hidden lg:block w-4 h-4 opacity-70" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* GRILLE PRODUITS */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <div key={i} className="h-72 bg-white rounded-2xl border border-[#333333]/10 animate-pulse" />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-[#333333]/20">
                <p className="font-extrabold text-[#333333]/40 text-lg mb-2">Aucun produit</p>
                <p className="text-sm font-medium text-[#333333]/40">dans la catégorie {selectedCategory}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
                    
                    <Link href={product.slug} className="relative w-full aspect-square bg-[#E8C5C8]/10 overflow-hidden flex items-center justify-center p-6 block">
                      <Image 
                        src={product.image} 
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-contain p-6 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" 
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-[#333333] shadow-sm border border-[#333333]/5">
                        {product.category}
                      </span>
                      <span className="absolute bottom-3 left-3 bg-[#333333] text-white px-2.5 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1.5 shadow-sm">
                        <Sparkles className="w-3 h-3 text-[#E8C5C8]" />{product.badge}
                      </span>
                      {product.imagesCount > 1 && (
                        <span className="absolute top-3 right-3 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                          +{product.imagesCount - 1}
                        </span>
                      )}
                    </Link>
                    
                    <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1 mb-2 text-amber-500">
                          {[...Array(product.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                          <span className="text-xs text-[#333333]/60 font-medium ml-1">({product.reviewsCount})</span>
                        </div>
                        <Link href={product.slug}>
                          <h3 className="font-extrabold text-[#333333] text-sm leading-snug line-clamp-2 hover:underline hover:text-[#E8C5C8] transition-colors">{product.name}</h3>
                        </Link>
                        <p className="text-xs text-[#333333]/60 mt-1.5 line-clamp-2 leading-relaxed font-medium">{product.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-[#333333]/10 mt-auto">
                        <span className="font-extrabold text-xl text-[#333333]">{product.price}</span>
                        <Link href={product.slug} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#333333] text-white font-bold text-xs hover:bg-black transition-colors shadow-sm">
                          <ShoppingBag className="w-4 h-4" />Voir
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