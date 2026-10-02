import Link from "next/link";
import { ShoppingBag, Heart, Sparkles, ShieldCheck, Star, Truck } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { ProductSection } from "./ProductSection";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const PLACEHOLDER = "https://via.placeholder.com/400x400/F5EBE6/333333?text=ECLOSIA+BEBE";

function cleanImageUrl(raw?: string) { 
  if(!raw) return PLACEHOLDER; 
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim(); 
  return first.startsWith("http") ? first : PLACEHOLDER; 
}

function normalizeKey(name: string): string {
  return name.toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/coton mixte|bio|blanc|mixte/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getProductFamily(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("matelas")) return "matelas";
  if (n.includes("drap")) return "drap";
  if (n.includes("alèse") || n.includes("alese") || n.includes("protège")) return "alese";
  if (n.includes("couche") || n.includes("culotte") || n.includes("protect")) return "couche";
  if (n.includes("coussin") || n.includes("chaise")) return "repas_chaise";
  if (n.includes("bain") || n.includes("bumbuns")) return "bain";
  if (n.includes("tapis")) return "tapis";
  if (n.includes("plan")) return "plan_incline";
  return "autre";
}

// MARKETING FALLBACK descriptions
function getMarketingShort(p: any) {
  const s = ((p.slug || "") + " " + (p.name || "")).toLowerCase();
  if(s.includes("50x100")) return "Matelas respirant + 3 draps ultra-doux + 2 alèses. Le kit qui sauve les nuits.";
  if(s.includes("32x72")) return "Lot de 3 draps housse couffin ultra-doux. Lavable 60°, OEKO-TEX.";
  if(s.includes("60x120")) return "3 draps housse + 2 alèses. Coton doux, extensible, qui tient au matelas.";
  if(s.includes("matelas")) return "Matelas respirant, déhoussable, anti-acariens. OEKO-TEX, fabrication UE.";
  if(s.includes("drap")) return "Coton BIO doux, extensible, qui reste en place. Lavable 60°.";
  if(s.includes("culotte") || s.includes("couche")) return "Lavable, Oeko-Tex, fabrication UE. Douce et respirante.";
  if(s.includes("coussin")) return "Fabriqué en France 🇫🇷. S'essuie d'un coup d'éponge.";
  if(s.includes("tapis") || s.includes("nomade")) return "Nomade, pliable, imperméable. Fabriqué en France.";
  return "OEKO-TEX • Fabriqué France/UE • Lavable 60°";
}

export async function BabyCareSection() {
  // 1. REQUÊTE SANS JOINTURE pour éviter le crash lié aux Foreign Keys Supabase
  const { data: rawProducts, error } = await supabase
    .from("products")
    .select(`id, name, slug, price, description, image_url, brand, rubrique, manufacturer_id, product_images(image_url, is_primary, position)`)
    .eq("is_active", true)
    .limit(100); 

  if (error) {
    console.error("Erreur critique Supabase :", error);
    return <div className="p-8 text-center text-red-500 bg-red-50 m-4 rounded-xl border border-red-200">Erreur de base de données : {error.message}</div>;
  }

  if (!rawProducts || rawProducts.length === 0) {
    return <div className="p-8 text-center text-gray-500">Aucun produit bébé actif trouvé dans la base.</div>;
  }

  const map = new Map<string, any>();
  const usedImages = new Set<string>();
  const familyCounts = new Map<string, number>();

  // 2. FILTRAGE INTELLIGENT (on ne prend que 4 produits maximum)
  for (const p of rawProducts as any[]) {
    const key = normalizeKey(p.name);
    const family = getProductFamily(p.name);
    const currentFamilyCount = familyCounts.get(family) || 0;

    if (map.has(key) || (currentFamilyCount >= 2 && family !== "autre")) continue;

    const all = [...(p.product_images || [])]
      .sort((a:any, b:any) => (a.position || 0) - (b.position || 0))
      .map((i:any) => cleanImageUrl(i.image_url));

    if (p.image_url) all.unshift(cleanImageUrl(p.image_url));

    let img = all.find(u => !usedImages.has(u) && u !== PLACEHOLDER) || all[0] || PLACEHOLDER;
    
    // On n'ajoute pas le Placeholder dans les images "utilisées" pour ne pas bloquer les autres
    if (img !== PLACEHOLDER) usedImages.add(img);
    familyCounts.set(family, currentFamilyCount + 1);

    map.set(key, { ...p, image: img });

    if (map.size >= 4) break; // Stop la boucle dès qu'on a nos 4 produits !
  }

  const uniqueProductsData = Array.from(map.values());
  if (uniqueProductsData.length === 0) return null;

  // 3. RÉCUPÉRATION DES FABRICANTS UNIQUEMENT POUR CES 4 PRODUITS
  const finalProducts = await Promise.all(uniqueProductsData.map(async (p) => {
    let fab = "Fabriqué en UE";
    let flag = "🇪🇺";
    
    if (p.manufacturer_id) {
      const { data: m } = await supabase.from("manufacturers").select("label_fr, flag_emoji").eq("id", p.manufacturer_id).maybeSingle();
      if (m) {
        fab = m.label_fr || fab;
        flag = m.flag_emoji || flag;
      }
    } else if (p.brand && p.brand.toLowerCase() !== "eclosia") {
      fab = p.brand;
      flag = "";
    }

    return {
      id: p.id,
      name: p.name.replace(/\s*\(.*?\)/g, "").trim(),
      priceFormatted: `${Number(p.price).toFixed(2).replace(".", ",")} €`,
      oldPrice: `${(Number(p.price) * 1.25).toFixed(2).replace(".", ",")} €`,
      slug: p.slug,
      image: p.image,
      fabrication: fab,
      flag: flag,
      category: p.rubrique || "BÉBÉ",
      shortDesc: getMarketingShort(p),
      reviews: Math.floor(Math.random() * 80) + 12
    };
  }));

  return (
    <section className="relative py-12 sm:py-16 bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20 overflow-hidden">
      {/* Décors floutés ECLOSIA */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#6E857B]/10 rounded-full blur-[80px] -ml-48 -mt-48 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#E8DCC8]/40 rounded-full blur-[80px] -mr-48 -mb-48 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* HEADER MARKETING ECLOSIA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#333333] text-white text-xs font-extrabold uppercase tracking-wide mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5"/> Le Cocon de Bébé
            </div>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold leading-[0.95] tracking-tight text-[#333333]">
              Soins & Tendresse,<br/>
              <span className="text-[#6E857B]">certifiés Oeko-Tex®</span>
            </h2>
            <p className="text-sm text-[#333333]/70 mt-2.5 max-w-xl leading-relaxed">
              Une sélection délicate pensée pour les parents exigeants. <span className="font-bold text-[#333333]">Coton BIO, bambou naturel, fabrication France & UE.</span> Doux pour la peau de bébé, facile à entretenir pour vous.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#333333]">
              <span className="flex items-center gap-1.5 bg-white border border-[#333333]/10 px-3 py-1.5 rounded-full shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#6E857B]"/> OEKO-TEX
              </span>
              <span className="flex items-center gap-1.5 bg-white border border-[#333333]/10 px-3 py-1.5 rounded-full shadow-sm">
                🇫🇷 🇪🇺 France/UE
              </span>
            </div>
            <Link href="/shop/bebe" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#333333] hover:text-[#6E857B] group transition-colors mt-1">
              Voir tout l'univers Bébé
              <span className="w-7 h-7 rounded-full bg-[#333333] text-white flex items-center justify-center group-hover:bg-[#6E857B] transition-colors shadow-sm">→</span>
            </Link>
          </div>
        </div>

        {/* GRID 4 PRODUITS MARKETING */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {finalProducts.map((p: any) => (
            <div key={p.id} className="group bg-white rounded-[20px] border border-[#333333]/10 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full">
              
              <Link href={`/shop/bebe/${p.slug}`} className="relative w-full aspect-[4/3] sm:aspect-square bg-gradient-to-b from-[#6E857B]/5 via-[#F5EBE6]/20 to-[#F5EBE6]/30 p-5 sm:p-6 block overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.08] transition-transform duration-700" />
                
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-extrabold text-[#333333] uppercase tracking-wide border border-[#333333]/10 shadow-sm">
                  {p.category.split("—")[0].trim()}
                </span>
                
                <span className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center border border-[#333333]/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="w-4 h-4 text-[#333333]"/>
                </span>
                
                <span className="absolute bottom-3 left-3 bg-[#333333] text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  {p.flag && <span className="text-[11px]">{p.flag}</span>}
                  <span className="truncate max-w-[110px]">{p.fabrication.split(" ").slice(0, 3).join(" ")}</span>
                </span>
                
                <span className="absolute bottom-3 right-3 bg-white text-[#333333] px-2 py-1 rounded-md text-[10px] font-extrabold border border-[#333333]/10 shadow-sm">
                  -20%
                </span>
              </Link>

              <div className="p-4 flex flex-col flex-grow">
                <Link href={`/shop/bebe/${p.slug}`} className="font-extrabold text-[#333333] text-[13px] sm:text-sm leading-snug line-clamp-2 hover:text-[#6E857B] transition-colors">
                  {p.name}
                </Link>
                
                <p className="text-[11px] text-[#333333]/60 mt-1.5 line-clamp-2 leading-relaxed">
                  {p.shortDesc}
                </p>
                
                <div className="flex items-center gap-1 mt-2.5 text-amber-500">
                  {[...Array(4)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current"/>)}
                  <Star className="w-3 h-3 text-gray-200"/>
                  <span className="text-[10px] text-[#333333]/50 ml-1 font-medium">({p.reviews})</span>
                </div>

                <div className="mt-auto pt-3.5 flex items-center justify-between border-t border-[#333333]/5">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-extrabold text-[#333333] text-[16px]">{p.priceFormatted}</span>
                      <span className="text-[11px] text-gray-400 line-through">{p.oldPrice}</span>
                    </div>
                    <span className="text-[10px] text-[#31A039] font-bold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-[#31A039] rounded-full"></span>En stock
                    </span>
                  </div>
                  
                  <Link href={`/shop/bebe/${p.slug}`} className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-[#333333] text-white hover:bg-black transition-colors shrink-0 shadow-sm">
                    <ShoppingBag className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER TRUST BAR MARKETING */}
        <div className="mt-8 bg-white rounded-2xl border border-[#333333]/10 p-4 sm:p-5 flex flex-wrap justify-center sm:justify-between items-center gap-4 text-xs font-bold text-[#333333]/80 shadow-sm">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#6E857B]"/> Livraison dès 10,00 € • Expédition rapide
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#6E857B]"/> OEKO-TEX® & Fabriqué France/UE
          </span>
          <span className="hidden md:flex items-center gap-2">
            Retour gratuit 10 jours • Garantie 12 mois
          </span>
          <Link href="/shop/bebe" className="px-5 py-2.5 rounded-full bg-[#F9F6F4] text-[#333333] hover:bg-[#333333] hover:text-white transition-colors border border-[#333333]/5">
            Découvrir toute la collection →
          </Link>
        </div>
        
      </div>
    </section>
  );
}