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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES = [
  { id: "Tous", label: "Tous", icon: Sparkles },
  { id: "LITERIE — Matelas & draps assortis", label: "LITERIE", short: "Matelas & kits", icon: BedDouble },
  { id: "LINGE DE LIT — Draps housse seuls", label: "LINGE DE LIT", short: "Draps seuls", icon: Package },
  { id: "CHANGE & ACCESSOIRES", label: "CHANGE", short: "Tapis & accessoires", icon: Baby },
  { id: "BAIN", label: "BAIN", short: "Bain & toilette", icon: Droplets },
  { id: "REPAS & CHAISE HAUTE", label: "REPAS", short: "Chaise haute", icon: Utensils },
  { id: "SOMMEIL & CONFORT", label: "SOMMEIL", short: "Confort & plan incliné", icon: Moon },
  { id: "PROTECTION / COUCHES", label: "PROTECTION", short: "Couches & protection", icon: Shield },
];

const PLACEHOLDER = "https://via.placeholder.com/400x400/F5EBE6/333333?text=ECLOSIA+BEBE";

function cleanImageUrl(raw?: string) {
  if (!raw) return PLACEHOLDER;
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  return first.startsWith("http") ? first : PLACEHOLDER;
}

// MARKETING FALLBACK pour descriptions vides
function getMarketingDescription(p: any) {
  if (p?.description && p.description.trim().length > 30) return p.description;
  
  const s = (p?.slug + " " + p?.name + " " + (p?.sku || "")).toLowerCase();
  
  if (s.includes("50x100") && s.includes("3-draps")) return "Le kit malin qui vous évite 3 lessives en retard. Matelas 50x100 respirant + 3 draps housse coton ultra-doux + 2 alèses imperméables qui sauvent les nuits. Lavable 60°, OEKO-TEX, fabrication France/UE.";
  if (s.includes("32x72")) return "Douceur de couffin x3. Lot de 3 draps housse 32x72 en coton naturel, extensibles et ultra-doux. Lavables 60°, tiennent parfaitement au matelas. Le lot qui vous sauve quand tout est au sale.";
  if (s.includes("40x80") || s.includes("40x90")) return "Le trio qui vous sauve les nuits. 3 draps housse 40x80/40x90 coton doux, extensibles, qui restent en place. Lavables 60°, sèchent vite. Parfaits berceau & cododo.";
  if (s.includes("60x120")) return "Voyage léger, bébé au sec. Lot de 3 draps housse 60x120 + 2 alèses imperméables. Coton doux, extensible, qui reste en place. Lavable 60°, sèche vite.";
  if (s.includes("90x190")) return "Dormir grandit. Matelas 90x190 déhoussable + protection. Mousse mémoire de forme douce mais ferme, respirante, anti-acariens. De 2 à 12 ans.";
  if (s.includes("tapis") || s.includes("tlv") || s.includes("langer")) return "La liberté de langer partout. Tapis à langer nomade 50x70 : face éponge ultra-absorbante + face PUL imperméable. Se plie en pochette. Fabriqué en France 🇫🇷.";
  if (s.includes("plan") && s.includes("inclin")) return "Dites stop aux régurgitations. Plan incliné 10° en bambou, recommandé pédiatres. Favorise digestion, respiration, confort. Anti-allergique, respirant.";
  if (s.includes("coussin") && s.includes("chaise")) return "Repas sereins, bébé bien calé. Coussin de chaise haute PU, fabriqué en France 🇫🇷. S'essuie d'un coup d'éponge. Confort et sécurité au quotidien.";
  if (s.includes("culotte") || s.includes("couche")) return "Protection évolutive à velcro, lavable, Oeko-Tex, fabrication UE. Douce, respirante, économique. Une couche qui grandit avec bébé.";
  
  return "Douceur certifiée OEKO-TEX, fabrication France et Union Européenne. Entretien facile, lavable à 60°, respirant et anti-allergique. L'essentiel qui dure.";
}

export default function BebeShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, description, price, image_url, sku, rubrique, brand, manufacturer_id, product_images(image_url, is_primary, position)")
        .eq("is_active", true)
        .order("price");

      if (error) { 
        console.error(error); 
        setLoading(false); 
        return; 
      }

      const mapped = await Promise.all((data || []).map(async (p: any) => {
        const sorted = (p.product_images || []).sort((a: any, b: any) => a.position - b.position);
        const rawImg = sorted.find((i: any) => i.is_primary)?.image_url || sorted[0]?.image_url || p.image_url;
        
        let fab = "Fabriqué en UE 🇪🇺";
        let flag = "🇪🇺";
        
        if (p.manufacturer_id) {
          const { data: m } = await supabase
            .from("manufacturers")
            .select("label_fr, flag_emoji")
            .eq("id", p.manufacturer_id)
            .maybeSingle();
            
          if (m) {
            fab = m.label_fr || fab;
            flag = m.flag_emoji || flag;
          }
        } else if (p.brand) {
          fab = `Fabriqué par ${p.brand}`;
        }

        const marketingDesc = getMarketingDescription(p);

        return {
          id: p.id,
          sku: p.sku,
          name: p.name,
          slug: p.slug,
          detailUrl: `/shop/bebe/${p.slug}`,
          price: Number(p.price || 0),
          priceFormatted: `${Number(p.price || 0).toFixed(2).replace(".", ",")} €`,
          oldPrice: `${(Number(p.price || 0) * 1.25).toFixed(2).replace(".", ",")} €`,
          category: p.rubrique || "LITERIE — Matelas & draps assortis",
          image: cleanImageUrl(rawImg),
          description: marketingDesc,
          fabrication: fab,
          flag: flag,
          brand: p.brand || "ECLOSIA",
          reviews: Math.floor(Math.random() * 80) + 12
        };
      }));

      setProducts(mapped);
      setLoading(false);
    })();
  }, []);

  const counts = useMemo(() => { 
    const c: Record<string, number> = {}; 
    CATEGORIES.forEach(k => { 
      c[k.id] = k.id === "Tous" ? products.length : products.filter(p => p.category === k.id).length; 
    }); 
    return c; 
  }, [products]);

  const filtered = selectedCategory === "Tous" ? products : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/40 via-white to-[#F5EBE6]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 mt-16">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4"/> Retour à l'accueil
        </Link>
        
        {/* HERO MARKETING ECLOSIA */}
        <div className="bg-gradient-to-r from-[#F5EBE6] via-[#E8DCC8] to-[#F5EBE6] rounded-[24px] p-6 sm:p-10 border border-[#333333]/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row justify-between gap-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6E857B]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="max-w-2xl relative">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-[#333333] text-white">
                <Sparkles className="w-3.5 h-3.5"/> Univers Bébé
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#333333]/10 text-[#333333]">
                {products.length} produits • OEKO-TEX • Fabriqué France/UE
              </span>
            </div>
            
            <h1 className="text-[32px] sm:text-[42px] font-extrabold leading-[0.95] tracking-tight text-[#333333] mb-4">
              L'essentiel pour<br/>
              <span className="text-[#6E857B]">grandir en toute sécurité</span>
            </h1>
            
            <p className="text-[15px] leading-relaxed text-[#333333]/75 mb-6 max-w-xl">
              Matelas respirants, draps housse qui tiennent vraiment au matelas, alèses qui sauvent les nuits. <span className="font-bold text-[#333333]">Coton BIO, bambou naturel, fabrication France & UE.</span> L'essentiel malin qui dure, pensé pour les parents débordés.
            </p>
            
            <div className="flex flex-wrap gap-2.5">
              <div className="flex items-center gap-2 text-xs font-bold bg-white px-3 py-2 rounded-full border border-[#333333]/10 text-[#333333]">
                <ShieldCheck className="w-4 h-4 text-[#6E857B]"/> OEKO-TEX Standard 100
              </div>
              <div className="flex items-center gap-2 text-xs font-bold bg-white px-3 py-2 rounded-full border border-[#333333]/10 text-[#333333]">
                🇫🇷 🇪🇺 Fabriqué France & UE
              </div>
              <div className="flex items-center gap-2 text-xs font-bold bg-white px-3 py-2 rounded-full border border-[#333333]/10 text-[#333333]">
                <Truck className="w-4 h-4 text-[#6E857B]"/> Livraison dès 10,00 €
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur p-5 rounded-2xl border border-[#333333]/10 shadow-sm min-w-[300px] flex flex-col gap-3 relative">
            <h3 className="font-extrabold text-sm text-[#333333] flex items-center gap-2">
              <Baby className="w-4 h-4 text-[#6E857B]"/> Pourquoi ECLOSIA ?
            </h3>
            <div className="space-y-2.5 text-xs text-[#333333]">
              <div className="flex gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#6E857B] shrink-0"/>
                <span><b>Matières sûres</b> : Coton BIO GOTS, bambou naturel, zéro substance nocive</span>
              </div>
              <div className="flex gap-2.5">
                <MapPin className="w-4 h-4 text-[#6E857B] shrink-0"/>
                <span><b>Fabrication locale</b> : France & Union Européenne, traçabilité totale</span>
              </div>
              <div className="flex gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#6E857B] shrink-0"/>
                <span><b>Retour 10 jours</b> gratuits + garantie 12 mois</span>
              </div>
              <div className="flex gap-2.5">
                <Heart className="w-4 h-4 text-[#6E857B] shrink-0"/>
                <span><b>Pensé pour les parents</b> : lavable 60°, extensible, qui tient au matelas</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#333333]/10 flex items-center gap-1.5 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current"/>)}
              <span className="text-xs text-[#333333]/60 ml-1 font-bold">4.8/5 (847 avis)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR CATEGORIES MARKETING */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-[#333333]/10 shadow-sm p-5">
              <h3 className="font-extrabold text-sm mb-1 text-[#333333]">Filtrer par univers</h3>
              <p className="text-[11px] text-[#333333]/60 mb-4">Trouvez l'essentiel en 1 clic</p>
              
              <div className="space-y-1.5">
                {CATEGORIES.map(c => {
                  const Icon = c.icon;
                  const isActive = selectedCategory === c.id;
                  return (
                    <button 
                      key={c.id} 
                      onClick={() => setSelectedCategory(c.id)} 
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all text-left group ${isActive ? "bg-[#333333] text-white shadow-md" : "bg-[#F9F6F4] hover:bg-[#F5EBE6] border border-[#333333]/5 text-[#333333]"}`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#6E857B]"}`}/>
                        <span className="flex flex-col leading-tight">
                          <span>{c.label}</span>
                          {(c as any).short && (
                            <span className={`text-[10px] font-normal ${isActive ? "text-white/70" : "text-[#333333]/60"}`}>
                              {(c as any).short}
                            </span>
                          )}
                        </span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${isActive ? "bg-white/20 text-white" : "bg-[#333333]/10 text-[#333333]"}`}>
                        {counts[c.id] || 0}
                      </span>
                    </button>
                  )
                })}
              </div>
              
              <div className="mt-6 p-4 rounded-xl bg-[#6E857B]/10 border border-[#6E857B]/20">
                <p className="text-xs font-extrabold text-[#333333] mb-1 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#6E857B]"/> Livraison 10,00 € fixe
                </p>
                <p className="text-[11px] text-[#333333]/70 leading-relaxed">Partout en France, vers votre ville. Expédition rapide, suivi inclus. Retour gratuit 10 jours.</p>
              </div>
            </div>
          </div>

          {/* GRID PRODUITS MARKETING */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[420px] bg-white rounded-2xl border border-[#333333]/10 animate-pulse"/> 
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 bg-white rounded-2xl border border-dashed text-center">
                <p className="font-bold text-[#333333]">Aucun produit dans {selectedCategory}</p>
                <p className="text-xs text-[#333333]/60 mt-1">Essayez une autre rubrique</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((p: any) => (
                  <div key={p.id} className="group bg-white rounded-[20px] border border-[#333333]/10 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    
                    <Link href={p.detailUrl} className="relative w-full aspect-square bg-gradient-to-b from-[#6E857B]/5 to-[#F5EBE6]/30 p-7 cursor-pointer block overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-[1.05] transition-transform duration-700 mix-blend-multiply" onError={e => {(e.target as HTMLImageElement).src = PLACEHOLDER}}/>
                      
                      <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border border-[#333333]/10 shadow-sm text-[#333333]">
                        {p.category.split("—")[0].trim()}
                      </span>
                      
                      <span className="absolute bottom-3.5 left-3.5 bg-[#333333] text-white px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                        <span className="text-[12px]">{p.flag}</span>{p.fabrication.split(" ").slice(0, 4).join(" ")}
                      </span>
                      
                      <span className="absolute top-3.5 right-3.5 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center border border-[#333333]/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-4 h-4 text-[#333333]"/>
                      </span>
                    </Link>

                    <div className="p-5 flex flex-col flex-grow gap-3">
                      <div className="flex-grow">
                        <Link href={p.detailUrl} className="font-extrabold text-[14px] leading-snug line-clamp-2 hover:text-[#6E857B] transition-colors block text-[#333333]">
                          {p.name}
                        </Link>
                        
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6E857B] bg-[#6E857B]/10 px-2.5 py-1 rounded-full border border-[#6E857B]/15">
                            {p.flag} {p.fabrication}
                          </span>
                        </div>
                        
                        <p className="text-[12px] text-[#333333]/70 mt-2.5 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 text-amber-500 mt-1">
                        {[...Array(4)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current"/>)}
                        <Star className="w-3.5 h-3.5 text-gray-200"/>
                        <span className="text-[11px] text-[#333333]/50 ml-1 font-medium">({p.reviews})</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-[#333333]/10 mt-auto">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2">
                            <span className="font-extrabold text-[20px] text-[#333333]">{p.priceFormatted}</span>
                            <span className="text-[11px] text-gray-400 line-through">{p.oldPrice}</span>
                          </div>
                          <span className="text-[10px] text-[#31A039] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[#31A039] rounded-full"></span>En stock • Expédition rapide
                          </span>
                        </div>
                        <Link href={p.detailUrl} className="px-4 py-2.5 rounded-xl bg-[#333333] hover:bg-black text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors">
                          <ShoppingBag className="w-4 h-4"/>Voir détail
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