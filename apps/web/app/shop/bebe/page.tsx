"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Truck,
  RotateCcw,
  Heart,
  Star,
  Package,
  Baby,
  BedDouble,
  Droplets,
  Utensils,
  Moon,
  Shield
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client safe - n'explose pas si env manquant
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const CATEGORIES = [
  { id: "Tous", label: "Tous", icon: Sparkles },
  { id: "LITERIE — Matelas & draps assortis", label: "LITERIE", short: "Matelas & kits", icon: BedDouble },
  { id: "LINGE DE LIT — Draps housse seuls", label: "LINGE DE LIT", short: "Draps seuls", icon: Package },
  { id: "CHANGE & ACCESSOIRES", label: "CHANGE", short: "Tapis & accessoires", icon: Baby },
  { id: "BAIN", label: "BAIN", short: "Bain & toilette", icon: Droplets },
  { id: "REPAS & CHAISE HAUTE", label: "REPAS", short: "Chaise haute", icon: Utensils },
  { id: "SOMMEIL & CONFORT", label: "SOMMEIL", short: "Confort & plan incliné", icon: Moon },
];

const PLACEHOLDER = "https://www.lamaisonenchiffon.com/img/p/1/6/7/9/7/16797.jpg";

const IMAGE_MAP_BBLA: Record<string, string> = {
  "SKU-KITBIO40X80M2": "https://www.lamaisonenchiffon.com/img/p/1/6/7/9/7/16797.jpg",
  "SKU-KIT32X72ABC": "https://www.lamaisonenchiffon.com/img/p/8/7/5/3/8753.jpg",
  "SKU-MAT50X100": "https://www.lamaisonenchiffon.com/img/p/1/6/7/9/8/16798.jpg",
  "SKU-DRAP40X80BIO": "https://www.lamaisonenchiffon.com/img/p/8/7/5/4/8754.jpg",
  "SKU-TLVBL": "https://www.lamaisonenchiffon.com/img/p/1/5/5/9/0/15590.jpg",
  "SKU-BUM26": "https://www.lamaisonenchiffon.com/img/p/1/4/5/5/1/14551.jpg",
  "SKU-CHAISEPU": "https://www.lamaisonenchiffon.com/img/p/1/5/5/9/0/15590.jpg",
  "SKU-PLANINCL": "https://www.lamaisonenchiffon.com/img/p/1/7/0/7/8/17078.jpg",
  "SKU-KIT60X120": "https://www.lamaisonenchiffon.com/img/p/8/7/5/3/8753.jpg",
  "SKU-HOUSSALANGER": "https://www.lamaisonenchiffon.com/img/p/8/7/5/4/8754.jpg",
  "SKU-DRAP32X72": "https://www.lamaisonenchiffon.com/img/p/8/7/5/4/8754.jpg",
  "SKU-MATBAMB3272": "https://www.lamaisonenchiffon.com/img/p/1/6/7/9/7/16797.jpg",
  "SKU-MATENDUIT": "https://www.lamaisonenchiffon.com/img/p/1/7/0/7/8/17078.jpg",
};

const MOCK_13_BBLA = [
  { id: "1", sku: "SKU-KITBIO40X80M2", name: "Matelas 40x80 + 3 draps housse coton bio + 2 alèses bio", slug: "matelas-40x80-3-draps-housse-coton-bio-2-aleses-bio", price: 74.9, rubrique: "LITERIE — Matelas & draps assortis", image_url: IMAGE_MAP_BBLA["SKU-KITBIO40X80M2"], brand: "Easy Dort", description: "Matelas 40x80 + 2 Alèses Coton Bio. Matière : Bambou. 40x80 cm. Imperméable. Fabriqué en UE." },
  { id: "2", sku: "SKU-KIT32X72ABC", name: "Matelas Couffin 32x72 + 3 draps housse bio", slug: "matelas-couffin-32x72-3-draps-housse-bio", price: 54.9, rubrique: "LITERIE — Matelas & draps assortis", image_url: IMAGE_MAP_BBLA["SKU-KIT32X72ABC"], brand: "Easy Dort", description: "Matelas Couffin 32x72 Bambou + 3 draps. Lavable 60°." },
  { id: "3", sku: "SKU-MAT50X100", name: "Matelas 50x100 + 3 draps housse coton + 2 alèses", slug: "matelas-50x100-3-draps-housse-coton-2-aleses", price: 89.9, rubrique: "LITERIE — Matelas & draps assortis", image_url: IMAGE_MAP_BBLA["SKU-MAT50X100"], brand: "Easy Dort", description: "Matelas 50x100 respirant + 3 draps + 2 alèses imperméables." },
  { id: "4", sku: "SKU-KIT60X120", name: "Matelas 60x120 + 3 Draps BIO blanc + 2 Alèses BIO", slug: "matelas-60x120-3-draps-bio-blanc-2-aleses-bio", price: 99.9, rubrique: "LITERIE — Matelas & draps assortis", image_url: IMAGE_MAP_BBLA["SKU-KIT60X120"], brand: "Easy Dort", description: "Matelas de voyage 60x120 + 3 draps + 2 alèses." },
  { id: "5", sku: "SKU-MATBAMB3272", name: "Matelas Couffin 32x72 Bambou (seul)", slug: "matelas-couffin-32x72-bambou-seul", price: 39.9, rubrique: "LITERIE — Matelas & draps assortis", image_url: IMAGE_MAP_BBLA["SKU-MATBAMB3272"], brand: "Easy Dort", description: "Matelas Couffin Bambou seul, sans linge." },
  { id: "6", sku: "SKU-DRAP40X80BIO", name: "3 draps housse 40x80 Coton BIO + 2 alèses", slug: "3-draps-housse-40x80-coton-bio-2-aleses", price: 29.9, rubrique: "LINGE DE LIT — Draps housse seuls", image_url: IMAGE_MAP_BBLA["SKU-DRAP40X80BIO"], brand: "Easy Dort", description: "Lot de 3 draps housse 40x80 Coton BIO + 2 alèses imperméables." },
  { id: "7", sku: "SKU-DRAP32X72", name: "Drap housse 32x72 Couffin Coton (lot de 3)", slug: "drap-housse-32x72-couffin-coton-lot-de-3", price: 15.9, rubrique: "LINGE DE LIT — Draps housse seuls", image_url: IMAGE_MAP_BBLA["SKU-DRAP32X72"], brand: "Easy Dort", description: "Drap housse 32x72 Coton (lot de 3)." },
  { id: "8", sku: "SKU-TLVBL", name: "Tapis à langer nomade (plusieurs coloris)", slug: "tapis-a-langer-nomade-plusieurs-coloris", price: 16.9, rubrique: "CHANGE & ACCESSOIRES", image_url: IMAGE_MAP_BBLA["SKU-TLVBL"], brand: "Bumbuns", description: "Tapis à langer nomade 50x70 : éponge + PUL imperméable. Fabriqué en France." },
  { id: "9", sku: "SKU-HOUSSALANGER", name: "Housse matelas à langer Coton Bio (lot de 3)", slug: "housse-matelas-a-langer-coton-bio-lot-de-3", price: 18.9, rubrique: "CHANGE & ACCESSOIRES", image_url: IMAGE_MAP_BBLA["SKU-HOUSSALANGER"], brand: "Bumbuns", description: "Housse matelas à langer Coton Bio (lot de 3)." },
  { id: "10", sku: "SKU-MATENDUIT", name: "Matelas à langer Coton Enduit (7 coloris)", slug: "matelas-a-langer-coton-enduit-7-coloris", price: 32.9, rubrique: "CHANGE & ACCESSOIRES", image_url: IMAGE_MAP_BBLA["SKU-MATENDUIT"], brand: "Bumbuns", description: "Matelas à langer Coton Enduit (7 coloris) 50x70." },
  { id: "11", sku: "SKU-BUM26", name: "Maillot de bain / couche de bain Bumbuns (S/M/L)", slug: "maillot-de-bain-couche-de-bain-bumbuns-s-m-l", price: 17.9, rubrique: "BAIN", image_url: IMAGE_MAP_BBLA["SKU-BUM26"], brand: "Bumbuns", description: "Maillot de bain bébé Bumbuns S/M/L - Couche de bain lavable." },
  { id: "12", sku: "SKU-CHAISEPU", name: "Coussin de chaise bébé PU - Animaux", slug: "coussin-de-chaise-bebe-pu-animaux", price: 36.9, rubrique: "REPAS & CHAISE HAUTE", image_url: IMAGE_MAP_BBLA["SKU-CHAISEPU"], brand: "Bumbuns", description: "Coussin de chaise haute bébé PU. Fabriqué en France." },
  { id: "13", sku: "SKU-PLANINCL", name: "Plan incliné anti-reflux 10° (3 tailles)", slug: "plan-incline-anti-reflux-10-3-tailles", price: 19.9, rubrique: "SOMMEIL & CONFORT", image_url: IMAGE_MAP_BBLA["SKU-PLANINCL"], brand: "Eclosia", description: "Plan incliné bébé anti-reflux 10° en bambou - 3 tailles." },
];

function cleanImageUrl(raw: any, sku?: string) {
  if (!raw || (typeof raw === "string" && raw.trim() === "")) {
    if (sku && IMAGE_MAP_BBLA[sku]) return IMAGE_MAP_BBLA[sku];
    return PLACEHOLDER;
  }
  if (typeof raw === "object") raw = (raw as any).image_url || "";
  if (typeof raw !== "string") return PLACEHOLDER;
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  if (first.startsWith("http")) return first;
  if (sku && IMAGE_MAP_BBLA[sku]) return IMAGE_MAP_BBLA[sku];
  return PLACEHOLDER;
}

export default function BebeShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        // Si env manquant -> mock direct, pas de blocage
        if (!supabase) {
          console.warn("Supabase env manquant, fallback mock");
          if (mounted) {
            setProducts(MOCK_13_BBLA.map((p:any)=>({
              ...p,
              detailUrl: `/shop/bebe/${p.slug}`,
              priceFormatted: `${p.price.toFixed(2).replace(".",",")} €`,
              oldPrice: `${(p.price*1.25).toFixed(2).replace(".",",")} €`,
              category: p.rubrique,
              image: cleanImageUrl(p.image_url, p.sku),
              fabrication: "Fabriqué France/UE 🇫🇷 🇪🇺",
              flag: "🇫🇷",
              reviews: 24
            })));
          }
          return;
        }

        const { data, error } = await supabase
          .from("products")
          .select("id, name, slug, description, price, image_url, sku, rubrique, brand")
          .eq("is_active", true)
          .order("price", { ascending: true });

        if (error) {
          console.error("Supabase error", error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn("0 produits actifs, fallback mock");
          if (mounted) {
            setProducts(MOCK_13_BBLA.map((p:any)=>({
              ...p,
              detailUrl: `/shop/bebe/${p.slug}`,
              priceFormatted: `${p.price.toFixed(2).replace(".",",")} €`,
              oldPrice: `${(p.price*1.25).toFixed(2).replace(".",",")} €`,
              category: p.rubrique,
              image: cleanImageUrl(p.image_url, p.sku),
              fabrication: "Fabriqué France/UE 🇫🇷 🇪🇺",
              flag: "🇫🇷",
              reviews: 24
            })));
          }
          return;
        }

        const mapped = data.map((p: any) => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          slug: p.slug,
          detailUrl: `/shop/bebe/${p.slug}`,
          price: Number(p.price || 0),
          priceFormatted: `${Number(p.price || 0).toFixed(2).replace(".", ",")} €`,
          oldPrice: `${(Number(p.price || 0) * 1.25).toFixed(2).replace(".", ",")} €`,
          category: p.rubrique || "LITERIE — Matelas & draps assortis",
          image: cleanImageUrl(p.image_url, p.sku),
          description: p.description || "OEKO-TEX, lavable 60°, fabrication France/UE.",
          fabrication: p.brand ? `Fabriqué par ${p.brand}` : "Fabriqué France/UE 🇫🇷 🇪🇺",
          flag: "🇫🇷",
          brand: p.brand || "ECLOSIA",
          reviews: Math.floor(Math.random() * 80) + 12
        }));

        if (mounted) setProducts(mapped);

      } catch (e: any) {
        console.error("Bebe page crash", e);
        if (mounted) {
          setErrorMsg(e?.message || "Erreur Supabase - fallback affiché");
          // Fallback pour ne jamais rester bloqué sur Chargement...
          setProducts(MOCK_13_BBLA.map((p:any)=>({
            ...p,
            detailUrl: `/shop/bebe/${p.slug}`,
            priceFormatted: `${p.price.toFixed(2).replace(".",",")} €`,
            oldPrice: `${(p.price*1.25).toFixed(2).replace(".",",")} €`,
            category: p.rubrique,
            image: cleanImageUrl(p.image_url, p.sku),
            fabrication: "Fabriqué France/UE 🇫🇷 🇪🇺",
            flag: "🇫🇷",
            reviews: 24
          })));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const counts = useMemo(() => { 
    const c: Record<string, number> = {}; 
    CATEGORIES.forEach(k => { c[k.id] = k.id === "Tous" ? products.length : products.filter(p => p.category === k.id).length; }); 
    return c; 
  }, [products]);

  const filtered = selectedCategory === "Tous" ? products : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/40 via-white to-[#F5EBE6]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 mt-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6"><ArrowLeft className="w-4 h-4"/> Retour à l'accueil</Link>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <b>Debug:</b> {errorMsg} — Produits mock affichés. Vérifie <code>.env.local</code> et <code>is_active=true</code> dans Supabase.
          </div>
        )}

        {!SUPABASE_URL && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            <b>.env.local manquant:</b> NEXT_PUBLIC_SUPABASE_URL et ANON_KEY non définis. Ajoute-les puis restart <code>npm run dev</code>.
          </div>
        )}

        {/* HEADER MARKETING */}
        <div className="bg-gradient-to-r from-[#F5EBE6] via-[#E8DCC8] to-[#F5EBE6] rounded-[20px] sm:rounded-[24px] p-5 sm:p-10 border border-[#333333]/10 flex flex-col lg:flex-row justify-between gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#333333] text-white flex items-center gap-1"><Sparkles className="w-3.5 h-3.5"/> Univers Bébé</span>
              <span className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold bg-white border">{products.length} produits • OEKO-TEX</span>
            </div>
            <h1 className="text-[28px] sm:text-[32px] md:text-[42px] font-extrabold leading-[1.05] sm:leading-[0.95] text-[#333333] mb-4">L'essentiel pour<br/><span className="text-[#6E857B]">grandir en toute sécurité</span></h1>
            <p className="text-[13px] sm:text-[15px] text-[#333333]/75 mb-4 sm:mb-6 leading-relaxed">Matelas respirants, draps housse qui tiennent, alèses qui sauvent les nuits. <b>Coton BIO, bambou, France & UE.</b></p>
          </div>
          <div className="bg-white/90 p-4 sm:p-5 rounded-2xl border min-w-[280px] lg:min-w-[300px] flex flex-col gap-3 h-fit">
            <h3 className="font-extrabold text-xs sm:text-sm flex items-center gap-2"><Baby className="w-4 h-4 text-[#6E857B]"/> Pourquoi ECLOSIA ?</h3>
            <div className="space-y-2 text-[11px] sm:text-xs">
              <div className="flex gap-2 items-center"><ShieldCheck className="w-3.5 h-3.5 text-[#6E857B]"/>Matières sûres BIO GOTS</div>
              <div className="flex gap-2 items-center"><MapPin className="w-3.5 h-3.5 text-[#6E857B]"/>Fabrication France & UE</div>
              <div className="flex gap-2 items-center"><RotateCcw className="w-3.5 h-3.5 text-[#6E857B]"/>Retour 10j gratuits + garantie 12 mois</div>
            </div>
          </div>
        </div>

        {/* SCROLL HORIZONTAL DES FILTRES SUR MOBILE */}
        <div className="lg:hidden w-full overflow-x-auto pb-4 mb-2 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex gap-2 snap-x">
          {CATEGORIES.map(c => {
            const isActive = selectedCategory === c.id;
            return (
              <button 
                key={c.id} 
                onClick={() => setSelectedCategory(c.id)} 
                className={`snap-start shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap ${isActive ? "bg-[#333333] text-white" : "bg-white border border-[#333333]/10 text-[#333333]"}`}
              >
                {c.label} <span className={`text-[9px] px-1.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-black/5'}`}>{counts[c.id]||0}</span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTRES PC */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border p-5">
              <h3 className="font-extrabold text-sm mb-4">Filtrer par univers</h3>
              <div className="space-y-1.5">
                {CATEGORIES.map(c => {
                  const Icon = c.icon;
                  const isActive = selectedCategory === c.id;
                  return (
                    <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`w-full flex justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${isActive ? "bg-[#333333] text-white" : "bg-[#F9F6F4] border border-transparent hover:border-[#333333]/10 text-[#333333]"}`}>
                      <span className="flex items-center gap-2"><Icon className="w-4 h-4"/>{c.label}</span><span className={`text-[11px] px-2 rounded-full flex items-center ${isActive ? 'bg-white/20' : 'bg-black/10'}`}>{counts[c.id]||0}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            {loading ? (
              // Squelettes adaptés 1 colonne mobile / 3 pc
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (<div key={i} className="h-[380px] sm:h-[420px] bg-white rounded-[20px] border animate-pulse"/> ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 sm:py-20 bg-white rounded-2xl border border-dashed text-center">
                <p className="font-bold text-sm sm:text-base">Aucun produit dans cet univers</p>
                <button onClick={()=>setSelectedCategory("Tous")} className="mt-4 px-5 py-2.5 bg-[#333] text-white rounded-full text-xs font-bold">Voir tous les produits</button>
              </div>
            ) : (
              // GRID PRODUITS : 1 mobile / 2 tablette / 3 pc
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map((p: any) => (
                  <div key={p.id} className="group bg-white rounded-[16px] sm:rounded-[20px] border border-[#333333]/10 overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    
                    <Link href={p.detailUrl} className="relative w-full aspect-square bg-gradient-to-b from-[#F5EBE6]/40 to-white p-5 sm:p-7 block">
                      <img src={p.image} alt={p.name} loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-contain mix-blend-multiply sm:group-hover:scale-[1.03] transition-transform duration-500" onError={e => {(e.target as HTMLImageElement).src = PLACEHOLDER}}/>
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide border border-[#333333]/10 text-[#333333]">
                        {p.category.split("—")[0]}
                      </span>
                    </Link>
                    
                    <div className="p-4 sm:p-5 flex flex-col flex-grow gap-2 sm:gap-3">
                      <Link href={p.detailUrl} className="font-extrabold text-[13px] sm:text-[14px] leading-snug line-clamp-2 hover:text-[#6E857B] transition-colors min-h-[38px] sm:min-h-[42px]">
                        {p.name}
                      </Link>
                      
                      <p className="text-[11px] sm:text-[12px] text-[#333]/60 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-[#333333]/5 mt-auto">
                        <div>
                          <span className="font-extrabold text-[18px] sm:text-[20px] text-[#333333]">{p.priceFormatted}</span>
                          <div className="text-[9px] sm:text-[10px] text-[#6E857B] font-extrabold uppercase tracking-wide">En stock</div>
                        </div>
                        <Link href={p.detailUrl} className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#333333] hover:bg-black text-white text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95">
                          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4"/>
                          <span className="hidden sm:inline">Détails</span>
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