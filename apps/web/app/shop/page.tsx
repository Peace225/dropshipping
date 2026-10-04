"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Star, ShoppingBag, ChevronRight, ArrowLeft, ShieldCheck, Filter } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const PLACEHOLDER = "https://via.placeholder.com/600x600/F5EBE6/333333?text=ECLOSIA";

const IMAGE_OVERRIDE: Record<string, string> = {
  "matelas-40x80-3-draps-housse-coton-bio-2-al-ses-bio": "https://www.lamaisonenchiffon.com/img/p/1/6/7/3/9/16739.jpg",
  "matelas-couffin-32x72-3-draps-housse-bio": "https://www.lamaisonenchiffon.com/img/p/1/6/7/2/8/16728.jpg",
  "matelas-de-voyage-60x120-3-draps-2-al-ses": "https://www.lamaisonenchiffon.com/img/p/1/6/7/9/9/16799.jpg",
  "3-draps-housse-40x80": "https://www.lamaisonenchiffon.com/img/p/2/0/2/8/2028.jpg",
  "tapis-a-langer-nomade-plusieurs-coloris": "https://www.lamaisonenchiffon.com/img/p/1/5/8/0/2/15802.jpg",
  "matelas-a-langer-bebe-45x70-cm-coton": "https://www.lamaisonenchiffon.com/img/p/3/8/6/5/3865.jpg",
  "maillot-de-bain-bebe-bumbuns": "https://www.lamaisonenchiffon.com/img/p/1/4/5/2/8/14528.jpg",
  "plan-incline-bebe-anti-reflux": "https://www.lamaisonenchiffon.com/img/p/3/8/4/3/3843.jpg",
  "plan-inclin-b-b-anti-reflux-3-tailles": "https://www.lamaisonenchiffon.com/img/p/3/8/4/3/3843.jpg",
  "coussin-de-chaise-bebe-pu-animaux": "https://www.lamaisonenchiffon.com/img/p/1/6/9/7/2/16972.jpg",
};

function cleanImageUrl(raw?: string, slug?: string){
  if(slug && IMAGE_OVERRIDE[slug]) return IMAGE_OVERRIDE[slug];
  if(slug){
    for(const key in IMAGE_OVERRIDE){
      if(slug.includes(key) || key.includes(slug)) return IMAGE_OVERRIDE[key];
    }
  }
  if(!raw) return PLACEHOLDER;
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  return first.startsWith("http") ? first : PLACEHOLDER;
}

function getMarketingShort(name:string, slug:string){
  const s = (slug + " " + name).toLowerCase();
  if(s.includes("40x80")) return "Le kit qui sauve les nuits. Matelas respirant + 3 draps BIO + 2 alèses.";
  if(s.includes("32x72")) return "Lot de 3 draps housse couffin ultra-doux. Lavable 60°, OEKO-TEX.";
  if(s.includes("60x120")) return "3 draps housse + 2 alèses imperméables. Coton doux qui tient.";
  if(s.includes("tapis") && s.includes("langer")) return "Nomade, pliable, imperméable. Fabriqué en France 🇫🇷.";
  if(s.includes("matelas") && s.includes("langer")) return "45x70 cm Coton doux, lavable 60°. Confortable & respirant.";
  if(s.includes("maillot") && s.includes("bain")) return "Couche de bain lavable S/M/L - Bumbuns - Ne gonfle pas.";
  if(s.includes("plan") && s.includes("inclin")) return "10° anti-reflux - 3 tailles. Soulage coliques & régurgitations.";
  if(s.includes("coussin") && s.includes("chaise")) return "PU Animaux - S'essuie d'un coup d'éponge - OEKO-TEX.";
  if(s.includes("culotte") && s.includes("protection")) return "Lavable, Oeko-Tex, fabrication UE. Douce et respirante.";
  return "OEKO-TEX • Fabriqué France/UE • Lavable 60°";
}

const UNIVERSES = [
  { name: "Tous les produits", slug: "Tous" },
  { name: "Bébé", slug: "Bébé", categories: ["LITERIE", "CHANGE & ACCESSOIRES", "BAIN", "SOMMEIL", "REPAS"] },
  { name: "Maman", slug: "Maman", categories: ["Allaitement", "Hygiène féminine lavable", "Accessoires zéro déchet"] },
];

export default function GlobalShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUniverse, setSelectedUniverse] = useState("Tous");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchAllProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, description, price, is_featured, sku, rubrique, image_url, brand, manufacturer_id")
        .eq("is_active", true)
        .order("name", { ascending: true });
        
      if (error) {
        console.error("Erreur boutique:", error);
        setLoading(false);
        return;
      }

      const productIds = (data || []).map((p:any)=>p.id);
      let imagesByProduct: Record<string, any> = {};
      if(productIds.length>0){
        const { data: imgs } = await supabase.from("product_images").select("product_id, image_url, is_primary, position").in("product_id", productIds).order("position");
        if(imgs){
          for(const img of imgs){
            if(!imagesByProduct[img.product_id]) imagesByProduct[img.product_id]=[];
            imagesByProduct[img.product_id].push(img);
          }
        }
      }

      const manufIds = [...new Set((data||[]).map((p:any)=>p.manufacturer_id).filter(Boolean))];
      let manufById: Record<string, any> = {};
      if(manufIds.length>0){
        const { data: manufs } = await supabase.from("manufacturers").select("id, label_fr, flag_emoji").in("id", manufIds);
        if(manufs) manufs.forEach((m:any)=>{ manufById[m.id]=m; });
      }

      const formatted = (data || []).map((product:any) => {
        const imgs = imagesByProduct[product.id] || [];
        const sorted = [...imgs].sort((a:any,b:any)=>a.position-b.position);
        const raw = sorted.find((i:any)=>i.is_primary)?.image_url ?? sorted[0]?.image_url ?? product.image_url ?? "";
        const imageUrl = cleanImageUrl(raw, product.slug);
                
        const nameLow = product.name.toLowerCase();
        const rubLow = (product.rubrique||"").toLowerCase();
        const isMaman = rubLow.includes("maman") || nameLow.includes("serviette hygiénique") || nameLow.includes("carrés démaquillants") || nameLow.includes("coussinet d'allaitement");
        const universe = isMaman ? "Maman" : "Bébé";
        const targetFolder = universe.toLowerCase();
                
        const categoryName = product.rubrique?.split("—")[0]?.trim() || (isMaman ? "Maman" : "Bébé");
        const manuf = product.manufacturer_id ? manufById[product.manufacturer_id] : null;

        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          universe,
          categoryName,
          price: `${Number(product.price).toFixed(2).replace(".", ",")} €`,
          numericPrice: Number(product.price),
          rating: 5,
          reviewsCount: Math.floor(Math.random() * 40) + 22,
          image: imageUrl,
          slug: `/shop/${targetFolder}/${product.slug}`,
          badge: product.is_featured ? "Coup de cœur" : (universe==="Bébé" ? "Essentiel Bébé" : "Essentiel Maman"),
          description: getMarketingShort(product.name, product.slug),
          longDesc: product.description,
          fabrication: manuf?.label_fr || "Fabriqué France/UE",
          flag: manuf?.flag_emoji || "🇫🇷 🇪🇺",
        };
      });

      setProducts(formatted);
      setLoading(false);
    }
    fetchAllProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (selectedUniverse !== "Tous" && p.universe !== selectedUniverse) return false;
    if (selectedCategory !== "Tous") {
      if(!p.categoryName.toLowerCase().includes(selectedCategory.toLowerCase()) && p.categoryName !== selectedCategory) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/25 pt-20 sm:pt-28 pb-16">
      
      {/* Navigation retour */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#333333]/70 hover:text-[#333333]">
          <ArrowLeft className="w-4 h-4" /><span>Retour à l'accueil</span>
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bannière principale */}
        <div className="bg-gradient-to-r from-[#F5EBE6] via-[#DCE4E0]/50 to-[#F5EBE6] rounded-[24px] sm:rounded-[32px] p-5 sm:p-10 border border-[#333333]/10 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6 sm:mb-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#6E857B] text-white mb-3">
              <Sparkles className="w-3.5 h-3.5" />Boutique Officielle ECLOSIA - {products.length} produits
            </span>
            <h1 className="text-xl sm:text-4xl font-extrabold text-[#333333] tracking-tight mb-2">
              L'excellence pour la maternité et bébé
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed">
              Sélection rigoureuse d'essentiels pensés pour le confort, la sécurité et le bien-être de toute la famille.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-[#333333]/10 shadow-sm text-[11px] sm:text-xs text-[#333333] font-medium w-full lg:min-w-[260px]">
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#6E857B] shrink-0" /><span>Paiement 100% sécurisé</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#6E857B] shrink-0" /><span>Livraison 10,00 € - 7-10 jours</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#6E857B] shrink-0" /><span>OEKO-TEX • Fabriqué France/UE</span></div>
          </div>
        </div>

        {/* Bouton Filtres mobile */}
        <div className="flex lg:hidden mb-4">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#333333] text-white rounded-2xl text-xs font-bold shadow-sm"
          >
            <Filter className="w-4 h-4" />
            <span>{mobileFilterOpen ? "Masquer les filtres" : "Filtrer par univers et catégories"}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - desktop et mobile conditionnel */}
          <aside className={`w-full lg:w-72 shrink-0 ${mobileFilterOpen ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-28 bg-white rounded-3xl border border-[#333333]/10 p-5 sm:p-6 shadow-sm">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#333333] mb-6">
                Univers & Catégories ({products.length})
              </h3>
              <div className="flex flex-col gap-4">
                {UNIVERSES.map((uni) => {
                  const isUniverseActive = selectedUniverse === uni.slug;
                  return (
                    <div key={uni.slug} className="flex flex-col gap-1.5">
                      <button 
                        onClick={() => { setSelectedUniverse(uni.slug); setSelectedCategory("Tous"); setMobileFilterOpen(false); }}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${isUniverseActive && selectedCategory === "Tous" ? "bg-[#333333] text-white shadow-sm" : "bg-[#FAFAFA] text-[#333333] hover:bg-[#6E857B]/10"}`}
                      >
                        <span>{uni.name} ({uni.slug==="Tous"?products.length:products.filter(p=>p.universe===uni.slug).length})</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isUniverseActive ? "rotate-90" : ""}`} />
                      </button>
                      
                      {uni.categories && isUniverseActive && (
                        <div className="flex flex-col pl-4 gap-1 mt-1 border-l-2 border-[#333333]/10 ml-2">
                          <button 
                            onClick={() => { setSelectedCategory("Tous"); setMobileFilterOpen(false); }} 
                            className={`text-left py-1.5 px-2 rounded-lg text-xs font-medium ${selectedCategory === "Tous" ? "text-[#333333] font-bold bg-[#6E857B]/10" : "text-gray-500 hover:text-[#333333]"}`}
                          >
                            Toutes les catégories
                          </button>
                          {uni.categories.map((cat) => (
                            <button 
                              key={cat} 
                              onClick={() => { setSelectedCategory(cat); setMobileFilterOpen(false); }} 
                              className={`text-left py-1.5 px-2 rounded-lg text-xs font-medium ${selectedCategory === cat ? "text-[#333333] font-bold bg-[#6E857B]/10" : "text-gray-500 hover:text-[#333333]"}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Grille principale */}
          <main className="flex-1">
            
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#333333]/10 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E857B] block mb-1">Catalogue Actuel</span>
                <h2 className="text-lg sm:text-2xl font-extrabold text-[#333333] tracking-tight">
                  {selectedUniverse === "Tous" ? "Tous les produits" : `Univers ${selectedUniverse}`}
                  {selectedCategory !== "Tous" && <span className="text-gray-400 font-normal text-sm sm:text-base"> / {selectedCategory}</span>}
                </h2>
              </div>
              <p className="text-xs font-bold text-[#333333] bg-[#F5EBE6] px-4 py-2 rounded-full border border-[#333333]/5 self-stretch sm:self-auto text-center">
                {filteredProducts.length} article(s) sur {products.length}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-[#333333]/50 font-medium animate-pulse text-sm">Chargement des produits...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-[#333333]/10 shadow-sm px-4">
                <p className="text-gray-400 text-sm font-medium">Aucun produit dans cette catégorie.</p>
                <button 
                  onClick={()=>{setSelectedUniverse("Tous"); setSelectedCategory("Tous");}} 
                  className="mt-4 px-5 py-2.5 bg-[#333333] text-white rounded-full text-xs font-bold shadow-sm"
                >
                  Voir tous les produits ({products.length})
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group bg-white rounded-[24px] border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                    
                    <Link href={product.slug} className="relative block w-full h-[240px] sm:h-[280px] bg-[#F5EBE6]/40 overflow-hidden p-4 cursor-pointer flex items-center justify-center">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }} 
                        className="w-full h-full object-contain p-2 group-hover:scale-[1.05] transition-transform duration-700 mix-blend-multiply" 
                      />
                      <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold text-[#333333] shadow-sm uppercase tracking-wider z-10 flex items-center gap-1">
                        <span>{product.flag}</span>{product.universe}
                      </span>
                      <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-[#333333] text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-semibold tracking-wide flex items-center gap-1.5 shadow-sm z-10">
                        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{product.badge}
                      </span>
                      <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#F5EBE6] px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-bold text-[#333333]">
                        {product.categoryName}
                      </span>
                    </Link>

                    <div className="p-4 sm:p-6 flex flex-col flex-grow justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2 sm:mb-3 text-amber-500">
                          {[...Array(4)].map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-current" />))}
                          <Star className="w-3.5 h-3.5 text-gray-200" />
                          <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium ml-1">({product.reviewsCount})</span>
                        </div>
                        <Link href={product.slug}>
                          <h3 className="font-extrabold text-[#333333] text-[13px] sm:text-[14px] leading-tight group-hover:text-[#6E857B] transition-colors line-clamp-2 hover:underline">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-[11px] sm:text-xs text-[#333333]/60 mt-1.5 sm:mt-2 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-[#6E857B] font-bold mt-2">
                          {product.fabrication} • {product.sku}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-[#333333]/5 mt-2">
                        <span className="font-extrabold text-base sm:text-lg text-[#333333]">
                          {product.price}
                        </span>
                        <Link 
                          href={product.slug} 
                          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#333333] text-white hover:bg-black transition-colors active:scale-95 text-[11px] sm:text-xs font-bold"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Découvrir</span>
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}