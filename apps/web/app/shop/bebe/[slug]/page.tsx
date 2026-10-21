"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck, RotateCcw, Heart, Zap, Clock, ChevronRight, ChevronLeft, Package, ShoppingCart, Truck, ZoomIn, Check } from "lucide-react";

import { getSupabase } from "@/lib/supabase/client";
import { useCart } from "@/context/cart-context";

const PLACEHOLDER = "https://via.placeholder.com/600x600/F5EBE6/333333?text=ECLOSIA+BEBE";

function cleanImageUrl(raw?: string){
  if(!raw) return PLACEHOLDER;
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  return first.startsWith("http") ? first : PLACEHOLDER;
}

// Tailles spécifiques uniquement pour le Plan Incliné
const PLAN_INCLINE_SIZES = [
  { key: "30x35", label: "30x35 cm pour Berceau / Landau bébé", price: 19.90 },
  { key: "60x35", label: "60x35 cm pour Lit bébé 60x120 cm", price: 23.90 },
  { key: "70x35", label: "70x35 cm pour Lit bébé 70x140 cm", price: 24.90 }
];

// Les 6 coloris du Tapis à langer nomade (sans blanc)
const TAPIS_LANGER_COLORS = [
  { key: "vert-anis", label: "Vert anis", hex: "#9AB833", image: "https://www.lamaisonenchiffon.com/img/p/1/5/8/0/2/15802.jpg" },
  { key: "gris", label: "Gris anthracite", hex: "#374151", image: "https://www.lamaisonenchiffon.com/img/p/1/7/6/0/1760.jpg" },
  { key: "orange", label: "Orange", hex: "#C2593F", image: "https://www.lamaisonenchiffon.com/img/p/1/5/7/9/9/15799.jpg" },
  { key: "bleu-ciel", label: "Bleu", hex: "#2B6CB0", image: "https://www.lamaisonenchiffon.com/img/p/1/5/8/0/0/15800.jpg" },
  { key: "bleu-marine", label: "Bleu marine", hex: "#1A365D", image: "https://www.lamaisonenchiffon.com/img/p/1/5/8/0/1/15801.jpg" },
  { key: "violet", label: "Violet", hex: "#6B46C1", image: "https://www.lamaisonenchiffon.com/img/p/1/5/8/0/3/15803.jpg" },
];

// Les 7 coloris exacts du Matelas à langer bébé 45x70 cm Coton enduit (corrigés)
const MATELAS_LANGER_COLORS = [
  { key: "gris-clair", label: "Gris clair", hex: "#D1D5DB", border: true, image: "https://www.lamaisonenchiffon.com/img/p/1/5/5/7/1/15571.jpg" },
  { key: "anthracite", label: "Gris anthracite", hex: "#374151", image: "https://www.lamaisonenchiffon.com/img/p/1/5/5/6/8/15568.jpg" },
  { key: "camel", label: "Camel", hex: "#8C6239", image: "https://www.lamaisonenchiffon.com/img/p/1/5/5/7/2/15572.jpg" },
  { key: "terracotta", label: "Terracotta", hex: "#C2593F", image: "https://www.lamaisonenchiffon.com/img/p/1/5/5/6/7/15567.jpg" }, // <-- Corrigé ici en Terracotta
  { key: "bleu-canard", label: "Bleu canard", hex: "#0F4C5C", image: "https://www.lamaisonenchiffon.com/img/p/1/5/5/6/6/15566.jpg" },
  { key: "bleu-detail", label: "Bleu canard (Détail)", hex: "#164E63", image: "https://www.lamaisonenchiffon.com/img/p/1/5/5/8/9/15589.jpg" },
  { key: "ensemble", label: "Vue d'ensemble", hex: "#6E857B", image: "https://www.lamaisonenchiffon.com/img/p/3/8/6/5/3865.jpg" },
];

export default function BebeProductDetailPage() {
  const [supabase] = useState(() => getSupabase());

  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const cart = useCart() as any;
  const [product, setProduct] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [locations, setLocations] = useState<Record<string, any[]>>({});
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  
  const [deliveryMethod, setDeliveryMethod] = useState<"rapide"|"standard">("standard");
  const [debugMsg, setDebugMsg] = useState("");

  // État pour la taille (uniquement pour le plan incliné)
  const [selectedSizeKey, setSelectedSizeKey] = useState<string>("30x35");

  // État pour la couleur (pour le tapis à langer nomade ou le matelas à langer 45x70)
  const [selectedColorKey, setSelectedColorKey] = useState<string>("");
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollSlider = (dir: "left" | "right") => {
    if(sliderRef.current) sliderRef.current.scrollBy({ left: dir==="left"?-250:250, behavior:"smooth" });
  };
  
  // Tarifs et délais dynamiques selon le mode de livraison choisi
  const activeDeliveryPriceStr = deliveryMethod === "rapide" ? "15,00 €" : "10,00 €";
  const activeDeliveryDelayStr = deliveryMethod === "rapide" ? "2 à 3 jours ouvrés" : "3 à 5 jours ouvrés";
  
  // Vérifie le type de produit affiché
  const isPlanIncline = slug?.includes("plan-incline") || product?.slug?.includes("plan-incline");
  const isTapisLanger =
    slug?.includes("tapis-a-langer") ||
    product?.slug?.includes("tapis-a-langer") ||
    product?.name?.toLowerCase().includes("tapis à langer");
  const isMatelasLanger =
    !isTapisLanger &&
    !slug?.includes("housse") &&
    !product?.slug?.includes("housse") && (
      slug?.includes("matelas-a-langer") ||
      product?.slug?.includes("matelas-a-langer") ||
      product?.name?.toLowerCase().includes("matelas à langer")
    );

  // Palette de couleurs active selon le produit
  const activeColorPalette = isTapisLanger
    ? TAPIS_LANGER_COLORS
    : isMatelasLanger
    ? MATELAS_LANGER_COLORS
    : [];

  // Calcul du prix selon qu'il s'agit du plan incliné ou d'un autre produit standard
  const currentNumericPrice = isPlanIncline 
    ? (PLAN_INCLINE_SIZES.find(s => s.key === selectedSizeKey)?.price ?? 19.90)
    : Number(product?.price || 0);

  const currentPriceFormatted = `${currentNumericPrice.toFixed(2).replace(".",",")} €`;
  const currentOldPriceFormatted = `${(currentNumericPrice * 1.25).toFixed(2).replace(".",",")} €`;

  const handleColorSelect = (colorObj: { key: string; label: string; hex: string; image?: string }, index: number) => {
    setSelectedColorKey(colorObj.key);
    if (colorObj.image) {
      setMainImage(colorObj.image);
    } else if (product?.images?.[index]) {
      setMainImage(product.images[index]);
    }
  };

  const handleBuy = () => {
    if(!product) return;
    const sizeObj = isPlanIncline ? PLAN_INCLINE_SIZES.find(s => s.key === selectedSizeKey) : null;
    const colorObj = activeColorPalette.length > 0 ? activeColorPalette.find(c => c.key === selectedColorKey) || activeColorPalette[0] : null;
    
    let itemId = product.id;
    let itemName = product.name;

    if (sizeObj) {
      itemId = `${product.id}-${sizeObj.key}`;
      itemName = `${product.name} (${sizeObj.label})`;
    } else if (colorObj) {
      itemId = `${product.id}-${colorObj.key}`;
      itemName = `${product.name} (${colorObj.label})`;
    }

    const item = {
      id: itemId,
      name: itemName,
      slug: product.slug,
      price: currentNumericPrice,
      priceFormatted: currentPriceFormatted,
      image: mainImage,
      quantity: 1,
      size: sizeObj ? sizeObj.label : undefined,
      color: colorObj ? colorObj.label : undefined,
      brand: product.brand,
      fabrication: product.fabrication,
      fabricationFlag: product.fabricationFlag,
      delivery: { method: deliveryMethod, region: selectedRegion, city: selectedCity, priceStr: activeDeliveryPriceStr, delayStr: activeDeliveryDelayStr }
    };
    if (cart?.addItem) cart.addItem(item);
    else if (cart?.add) cart.add(item);
    const s = JSON.stringify([item]);
    localStorage.setItem("cart", s);
    localStorage.setItem("checkout_items", s);
    router.push("/checkout");
  };

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      setLoading(true);
      
      const selectQuery = "id, name, slug, price, description, image_url, sku, rubrique, brand, category_bebe_id, manufacturer_id, meta_title, meta_description, seo_keywords";

      let { data: prodSimple } = await supabase
        .from("products")
        .select(selectQuery)
        .eq("slug", slug)
        .maybeSingle();
        
      if (!prodSimple) {
        const baseSlug = slug.split("-sku-")[0];
        const { data: fallback } = await supabase
          .from("products")
          .select(selectQuery)
          .ilike("slug", `%${baseSlug}%`)
          .limit(1)
          .maybeSingle();
        if (fallback) prodSimple = fallback;
      }
      
      if (!prodSimple && slug.includes("32x72")) {
        const { data: fb2 } = await supabase
          .from("products")
          .select(selectQuery)
          .ilike("slug", `%32x72%`)
          .limit(1)
          .maybeSingle();
        if (fb2) prodSimple = fb2;
      }
      
      if (!prodSimple) {
        const { data: fb3 } = await supabase
          .from("products")
          .select(selectQuery)
          .ilike("name", `%32x72%`)
          .limit(1)
          .maybeSingle();
        if (fb3) prodSimple = fb3;
      }
      
      if (!prodSimple) {
        setDebugMsg("Le produit n'existe pas en base.");
        setLoading(false);
        return;
      }

      let fabFull = "Fabriqué en France • Certifié OEKO-TEX";
      let fabFlag = "🇫🇷";
      let fabShort = "FR";
      
      let catName = prodSimple.rubrique || "Bébé";
      if (prodSimple.category_bebe_id) {
        const { data: cat } = await supabase.from("categories_bebe").select("name").eq("id", prodSimple.category_bebe_id).maybeSingle();
        if (cat?.name) catName = cat.name;
      }
      
      let formattedImages: string[] = [];
      const { data: imgData } = await supabase.from("product_images").select("image_url, position").eq("product_id", prodSimple.id).order("position");
      if (imgData && imgData.length > 0) {
        formattedImages = imgData.map((i:any)=>cleanImageUrl(i.image_url));
      } else if (prodSimple.image_url) {
        const parts = prodSimple.image_url.includes("|") ? prodSimple.image_url.split("|") : [prodSimple.image_url];
        formattedImages = parts.map((p:string)=>cleanImageUrl(p));
      }
      
      if (formattedImages.length===0) formattedImages=[PLACEHOLDER];
      if (formattedImages.length===1) formattedImages = [formattedImages[0], formattedImages[0], formattedImages[0]];
      if (formattedImages.length===2) formattedImages = [...formattedImages, formattedImages[0]];
      
      setProduct({
        ...prodSimple,
        images: formattedImages,
        categoryName: catName,
        fabrication: fabFull,
        fabricationFlag: fabFlag,
        fabricationShort: fabShort,
        reviewsCount: Math.floor(Math.random()*80)+20
      });
      setMainImage(formattedImages[0]);

      // Synchroniser la couleur initiale selon le produit
      const prodIsTapis = slug?.includes("tapis-a-langer") || prodSimple.slug?.includes("tapis-a-langer") || prodSimple.name?.toLowerCase().includes("tapis à langer");
      const prodIsMatelasLanger = !prodIsTapis && !slug?.includes("housse") && !prodSimple.slug?.includes("housse") && (slug?.includes("matelas-a-langer") || prodSimple.slug?.includes("matelas-a-langer") || prodSimple.name?.toLowerCase().includes("matelas à langer"));

      if (prodIsTapis) {
        const match = TAPIS_LANGER_COLORS.find(c => c.image === formattedImages[0]) || TAPIS_LANGER_COLORS[0];
        setSelectedColorKey(match.key);
      } else if (prodIsMatelasLanger) {
        const match = MATELAS_LANGER_COLORS.find(c => c.image === formattedImages[0]) || MATELAS_LANGER_COLORS[6];
        setSelectedColorKey(match.key);
      }
      
      const { data: sugData } = await supabase
        .from("products")
        .select("id, name, slug, price, image_url, brand, rubrique, product_images(image_url, is_primary, position)")
        .eq("is_active", true)
        .neq("id", prodSimple.id)
        .limit(20);
        
      if (sugData) {
        const map = new Map();
        sugData.forEach((s:any)=>{
          const nameLow = (s.name || "").toLowerCase();
          const rubLow = (s.rubrique || "").toLowerCase();
          if (rubLow.includes("maman") || nameLow.includes("maman") || nameLow.includes("léopard") || nameLow.includes("felyna") || nameLow.includes("allaitement") || nameLow.includes("serviette")) return;

          const key = s.name ? s.name.trim() : s.id;
          if(!map.has(key)){
            const raw = s.product_images?.find((i:any)=>i.is_primary)?.image_url || s.product_images?.[0]?.image_url || s.image_url;
            map.set(key,{ 
               id: s.id, 
               name: s.name, 
               price: `${Number(s.price||0).toFixed(2).replace(".",",")} €`, 
               slug: `/shop/bebe/${s.slug}`, 
               image: cleanImageUrl(raw),
              fabrication: s.brand || "Certifié OEKO-TEX" 
             });
          }
        });
        setSuggestions(Array.from(map.values()).slice(0,8));
      }
      
      const { data: regionsData } = await supabase.from("regions").select("name, cities(name, relais_price, home_price)").order("name");
      if (regionsData){
        const loc:Record<string,any[]>={};
        regionsData.forEach((r:any)=>{ if(r.cities) loc[r.name]=r.cities; });
        setLocations(loc);
        const first=Object.keys(loc)[0];
        if(first){ setSelectedRegion(first); setSelectedCity(loc[first][0]?.name||""); }
      }
      setLoading(false);
    }
    fetchData();
  }, [slug, supabase]);

  useEffect(() => {
    if (!product) return;
    const originalTitle = "ECLOSIA - Puériculture & Essentiels Bébé";
    if (product.meta_title) document.title = product.meta_title;
    return () => { document.title = originalTitle; };
  }, [product]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><p className="font-bold animate-pulse text-[#333333]">Chargement...</p></div>;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20"><h1 className="text-2xl font-extrabold text-[#333333]">Produit introuvable</h1><Link href="/shop/bebe" className="px-6 py-2.5 bg-[#333333] text-white rounded-full font-bold text-sm">Retour boutique bébé</Link></div>;

  function getMarketingDescription(p:any){
    if(p?.description && p.description.trim().length > 30) return p.description;
    return "Offrez à votre bébé douceur et sécurité. Matériaux certifiés OEKO-TEX, fabrication soignée. Entretien facile, lavable à 60°, respirant et anti-allergique.";
  }

  // Nettoyage de la description pour éviter tout doublon d'affichage
  const rawDesc = getMarketingDescription(product);
  const descLines = (rawDesc || "").split("\n").map((l: string) => l.trim()).filter(Boolean);
  const resumeLine = descLines.find((l: string) => l.toLowerCase().includes("très pratique") || l.toLowerCase().includes("résumé")) || "";
  const bulletLines = descLines.filter((l: string) => l.startsWith("-") || l.startsWith("•"));
  const descText = descLines
    .filter((l: string) => l !== resumeLine && !l.startsWith("-") && !l.startsWith("•"))
    .join("\n\n");

  const activeColorObj = activeColorPalette.find(c => c.key === selectedColorKey) || activeColorPalette[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20 pb-16 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/shop/bebe" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333]"><ArrowLeft className="w-4 h-4"/><span>Retour à l&apos;univers Bébé</span></Link>
          <div className="text-xs font-bold text-[#6E857B] bg-[#6E857B]/10 px-3 py-1 rounded-full flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#6E857B]"></span>ECLOSIA Secure • {product.images.length} photos</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-9 bg-white rounded-2xl border border-[#333333]/10 shadow-sm flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-[45%] flex flex-col p-4 sm:p-6 border-b md:border-b-0 md:border-r border-[#333333]/5 bg-[#6E857B]/5">
              <div className="relative w-full aspect-square flex items-center justify-center mb-4 bg-white rounded-xl border border-[#333333]/5 p-4 group">
                <img src={mainImage} alt={product.name} className="w-full h-full object-contain p-4 mix-blend-multiply" />
                <button onClick={()=>setIsFavorite(!isFavorite)} className={`absolute top-3 right-3 p-2 cursor-pointer ${isFavorite?"text-red-500":"text-gray-400"}`}><Heart className={`w-6 h-6 ${isFavorite?"fill-current":""}`}/></button>
                <div className="absolute bottom-3 right-3 bg-[#333333] text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1"><ZoomIn className="w-3 h-3"/>{product.images.length} images</div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 mb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
                {product.images.map((imgUrl: string, idx: number)=>(
                  <button
                    key={idx}
                    onClick={() => {
                      setMainImage(imgUrl);
                      if (activeColorPalette.length > 0) {
                        const matched = activeColorPalette.find(c => c.image === imgUrl);
                        if (matched) setSelectedColorKey(matched.key);
                      }
                    }}
                    className={`relative aspect-square w-16 shrink-0 snap-start rounded-lg overflow-hidden border bg-white p-1 cursor-pointer ${mainImage===imgUrl?"border-[#333333] ring-2 ring-[#333333]/20":"border-[#333333]/10 hover:border-[#333333]/30"}`}
                  >
                    <img src={imgUrl} alt={`Vue ${idx+1}`} className="w-full h-full object-contain mix-blend-multiply" />
                    <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1 rounded-tl">{idx+1}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full md:w-[55%] flex flex-col p-4 sm:p-6">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-[#6E857B] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase">{product.categoryName}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#333333] leading-snug mb-3 mt-2">{product.name}</h1>
              <hr className="border-[#333333]/10 mb-4"/>
              
              {/* PRIX DYNAMIQUE */}
              <div className="flex items-center gap-3 mb-3">
                <p className="text-3xl font-extrabold text-[#333333]">{currentPriceFormatted}</p>
                <p className="text-base text-gray-400 line-through">{currentOldPriceFormatted}</p>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md">-20%</span>
              </div>

              {/* CHAMP DROPDOWN "CHOISISSEZ LA TAILLE :" (UNIQUEMENT POUR LE PLAN INCLINÉ) */}
              {isPlanIncline && (
                <div className="mb-4">
                  <label className="block text-xs font-extrabold text-[#333333] uppercase tracking-wider mb-2">
                    Choisissez la taille :
                  </label>
                  <select
                    value={selectedSizeKey}
                    onChange={(e) => setSelectedSizeKey(e.target.value)}
                    className="w-full text-sm border border-[#333333]/20 rounded-xl p-3 bg-white text-[#333333] font-semibold outline-none focus:border-[#333333] cursor-pointer shadow-sm"
                  >
                    {PLAN_INCLINE_SIZES.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label} — {opt.price.toFixed(2).replace(".", ",")} €
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg leading-none">{product.fabricationFlag}</span>
                <span className="text-xs italic font-bold text-[#6E857B]">{product.fabrication}</span>
              </div>
              <div className="bg-[#F9F6F4] rounded-xl p-4 mb-4 border border-[#333333]/5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-2 text-[#333333]"><ShieldCheck className="w-4 h-4 text-[#6E857B]"/> Description du produit</h3>
                {resumeLine && <p className="text-xs font-bold text-[#333333] mb-3">{resumeLine}</p>}
                <div className="text-xs text-[#333333]/80 leading-relaxed">
                  {descText && <p className="whitespace-pre-wrap mb-2">{descText}</p>}
                  {bulletLines.length > 0 && (
                    <ul className="list-disc list-inside space-y-1.5">
                      {bulletLines.map((b:string, i:number)=><li key={i}>{b.replace(/^[-•]\s*/,"")}</li>)}
                    </ul>
                  )}
                </div>

                {/* BLOC DE SÉLECTION DE COULEUR INTÉGRÉ DANS LA DESCRIPTION (POUR TAPIS À LANGER & MATELAS À LANGER) */}
                {activeColorPalette.length > 0 && activeColorObj && (
                  <div className="mt-4 pt-3 border-t border-[#333333]/10">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-bold text-[#333333]">Couleur :</span>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {activeColorPalette.map((c: any, index: number) => {
                          const isSelected = selectedColorKey === c.key;
                          return (
                            <button
                              key={c.key}
                              type="button"
                              onClick={() => handleColorSelect(c, index)}
                              title={c.label}
                              style={{ backgroundColor: c.hex }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                                c.border ? "border border-gray-300" : ""
                              } ${
                                isSelected ? "ring-2 ring-offset-2 ring-[#333333] scale-110" : "hover:scale-105 opacity-90 hover:opacity-100"
                              }`}
                            >
                              {isSelected && (
                                <Check className={`w-3.5 h-3.5 stroke-[3] ${c.key === "gris-clair" ? "text-[#333333]" : "text-white"}`} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <p className="text-xs font-bold text-[#333333] mt-2">{activeColorObj.label}</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-[#31A039] font-medium mb-1">En stock - Livraison en {activeDeliveryDelayStr}</p>
              <p className="text-xs text-[#333333]/80 mb-3">
                {deliveryMethod === "rapide"
                  ? `+ livraison rapide à `
                  : `+ livraison standard à `}
                <span className="font-bold">{activeDeliveryPriceStr}</span>
                {deliveryMethod === "standard" ? " (offerte dès 89 € d'achats)" : " (2 à 3 jours ouvrés)"}
              </p>
              <div className="flex items-center gap-1.5 mb-5 text-amber-500">{[...Array(4)].map((_,i)=><Star key={i} className="w-4 h-4 fill-current"/>)}<Star className="w-4 h-4 text-gray-300"/><span className="text-xs text-[#333333]/60 ml-1">({product.reviewsCount} avis)</span></div>
              <hr className="border-[#333333]/10 mb-5"/>
              <div className="mt-auto">
                <button onClick={handleBuy} className="w-full bg-[#333333] hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"><ShoppingCart className="w-5 h-5"/> J&apos;achète ({currentPriceFormatted})</button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#333333]/10 shadow-sm flex flex-col">
            <div className="p-4 border-b border-[#333333]/10 bg-[#6E857B]/5 rounded-t-2xl flex justify-between items-center"><h3 className="font-extrabold text-xs uppercase text-[#333333]">LIVRAISON & RETOURS</h3><span className="text-xs font-bold text-white bg-[#6E857B] px-2 py-0.5 rounded-md flex items-center gap-1">ECLOSIA <Truck className="w-3 h-3"/></span></div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button onClick={()=>setDeliveryMethod("rapide")} className={`flex flex-col items-center p-2.5 border rounded-xl text-xs font-bold cursor-pointer transition-colors ${deliveryMethod==="rapide"?"border-[#333333] bg-[#333333] text-white":"border-[#333333]/15 text-[#333333] bg-white hover:border-[#333333]/30"}`}><Zap className="w-4 h-4 mb-1"/><span>Livraison rapide</span></button>
                <button onClick={()=>setDeliveryMethod("standard")} className={`flex flex-col items-center p-2.5 border rounded-xl text-xs font-bold cursor-pointer transition-colors ${deliveryMethod==="standard"?"border-[#333333] bg-[#333333] text-white":"border-[#333333]/15 text-[#333333] bg-white hover:border-[#333333]/30"}`}><Clock className="w-4 h-4 mb-1"/><span>Livraison standard</span></button>
              </div>
              <select className="w-full text-sm border border-[#333333]/20 rounded-xl p-2.5 mb-3 bg-white text-[#333333] font-medium outline-none focus:border-[#333333] cursor-pointer" value={selectedRegion} onChange={(e)=>{const nr=e.target.value; setSelectedRegion(nr); setSelectedCity(locations[nr]?.[0]?.name||"");}}>{Object.keys(locations).map(r=><option key={r} value={r}>{r}</option>)}</select>
              <select className="w-full text-sm border border-[#333333]/20 rounded-xl p-2.5 mb-5 bg-white text-[#333333] font-medium outline-none focus:border-[#333333] cursor-pointer" value={selectedCity} onChange={e=>setSelectedCity(e.target.value)}>{(locations[selectedRegion]||[]).map((c:any)=><option key={c.name} value={c.name}>{c.name}</option>)}</select>
              <div className="border border-[#333333]/10 rounded-xl divide-y divide-[#333333]/10 bg-[#F9F6F4] text-[#333333]">
                <div className="p-3.5 flex gap-3">
                  <Package className="w-4 h-4 shrink-0 text-[#333333]"/>
                  <div>
                    <p className="text-xs font-extrabold mb-1">Livraison ({deliveryMethod === "rapide" ? "Rapide" : "Standard"})</p>
                    <p className="text-xs">
                      Frais: <span className="font-bold text-[#6E857B]">{activeDeliveryPriceStr}</span>
                      {deliveryMethod === "standard" && " (Offerte dès 89 €)"}
                    </p>
                    <p className="text-[10px] text-[#333333]/70">Délai : {activeDeliveryDelayStr}</p>
                  </div>
                </div>
                <div className="p-3.5 flex gap-3"><RotateCcw className="w-4 h-4 shrink-0 text-[#333333]"/><div><p className="text-xs font-extrabold mb-1">Retour</p><p className="text-xs text-[#333333]/70">20 jours pour changer d&apos;avis</p></div></div>
                <div className="p-3.5 flex gap-3"><ShieldCheck className="w-4 h-4 shrink-0 text-[#333333]"/><div><p className="text-xs font-extrabold mb-1">Garantie</p><p className="text-xs text-[#333333]/70">12 mois</p></div></div>
              </div>
            </div>
          </div>
        </div>
        {suggestions.length>0 && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#333333]/10 shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#333333]">Vous aimerez aussi</h2>
              <div className="flex gap-2">
                <button onClick={()=>scrollSlider("left")} className="w-8 h-8 rounded-full border border-[#333333]/15 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-[#333333]"><ChevronLeft className="w-4 h-4"/></button>
                <button onClick={()=>scrollSlider("right")} className="w-8 h-8 rounded-full border border-[#333333]/15 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-[#333333]"><ChevronRight className="w-4 h-4"/></button>
              </div>
            </div>
            <div ref={sliderRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
              {suggestions.map((item:any)=>(
                <Link key={item.id} href={item.slug} className="group border border-[#333333]/10 rounded-xl bg-white shrink-0 snap-start w-52 p-3 hover:shadow-md transition-all flex flex-col">
                  <div className="relative w-full aspect-square bg-[#6E857B]/10 rounded-lg overflow-hidden mb-3 p-3 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" onError={(e)=>{(e.target as HTMLImageElement).src=PLACEHOLDER}}/>
                  </div>
                  <h3 className="text-xs font-bold line-clamp-2 mb-1 group-hover:text-[#6E857B] text-[#333333]">{item.name}</h3>
                  <p className="text-[10px] text-[#6E857B] font-bold mb-1">{item.fabrication}</p>
                  <p className="font-extrabold text-sm mt-auto text-[#333333]">{item.price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}