"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock3, Star, ShoppingBag, Search, Check, Zap, X, Sparkles, ShieldCheck, Truck, MapPin, Heart } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useCart } from "@/context/cart-context";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const PLACEHOLDER = "https://www.lamaisonenchiffon.com/img/p/1/6/7/9/7/16797.jpg";

function cleanImageUrl(raw?: string) {
  if (!raw) return PLACEHOLDER;
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  if (first.startsWith("http://") || first.startsWith("https://")) return first;
  if (first.startsWith("/")) return `https://www.lamaisonenchiffon.com${first}`;
  return PLACEHOLDER;
}

function getMarketingShort(p:any){
  const s = (p.slug + " " + p.name).toLowerCase();
  if(s.includes("50x100")) return "Matelas respirant + 3 draps ultra-doux + 2 alèses. Le kit qui sauve les nuits.";
  if(s.includes("40x80") || s.includes("40x90")) return "Le trio qui sauve les nuits. 3 draps coton doux + alèse.";
  if(s.includes("32x72")) return "Lot de 3 draps housse couffin ultra-doux. Lavable 60°, OEKO-TEX.";
  if(s.includes("60x120")) return "3 draps housse + 2 alèses imperméables. Coton doux qui tient.";
  if(s.includes("90x190")) return "Matelas enfant déhoussable, mémoire de forme, anti-acariens.";
  if(s.includes("culotte") || s.includes("couche") || s.includes("bumbuns")) return "Lavable, Oeko-Tex, fabrication UE. Douce et respirante.";
  if(s.includes("tapis") || s.includes("langer")) return "Nomade, pliable, imperméable. Fabriqué en France 🇫🇷.";
  if(s.includes("coussin")) return "Confortable, s'essuie d'un coup d'éponge. Fabriqué en France 🇫🇷.";
  return "OEKO-TEX • Fabriqué France/UE • Lavable 60°";
}

function LiveCountdown({ endsAt }: { endsAt: string | Date }) {
  const [timeLeft, setTimeLeft] = useState({ h: 1, m: 59, s: 41, expired: false });
  useEffect(() => {
    const target = new Date(endsAt).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0, expired: true }); return; }
      setTimeLeft({ h: Math.floor(diff/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000), expired: false });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  if (timeLeft.expired) return <span className="text-xs font-bold text-red-400">Expiré</span>;
  return (
    <div className="flex items-center gap-1">
      <span className="bg-white text-[#333333] px-1.5 py-1 rounded-md font-mono text-xs font-extrabold">{String(timeLeft.h).padStart(2,"0")}</span>
      <span className="text-white/60">:</span>
      <span className="bg-white text-[#333333] px-1.5 py-1 rounded-md font-mono text-xs font-extrabold">{String(timeLeft.m).padStart(2,"0")}</span>
      <span className="text-white/60">:</span>
      <span className="bg-[#D4A396] text-white px-1.5 py-1 rounded-md font-mono text-xs font-extrabold">{String(timeLeft.s).padStart(2,"0")}</span>
    </div>
  );
}

export default function VentesFlashPage8() {
  const { addItem } = useCart() as any;
  const [flashProducts, setFlashProducts] = useState<any[]>([]);
  const [flashEndsAt, setFlashEndsAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tous les produits");
  const [searchQuery, setSearchQuery] = useState("");
  const [debug, setDebug] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: flash } = await supabase.from("flash_sales").select("ends_at").eq("is_active", true).order("created_at", {ascending:false}).limit(1).maybeSingle();
        setFlashEndsAt(flash?.ends_at || new Date(Date.now()+2*3600000).toISOString());

        // 1. Cherche d'abord les produits explicitement marqués en vente flash
        const { data: prods, error } = await supabase
          .from("products")
          .select("id, name, slug, price, promo_price, stock, description, brand, manufacturer_id, rubrique, category_bebe_id, image_url")
          .eq("is_flash_sale", true)
          .eq("is_active", true)
          .limit(8);

        if (error) {
          setDebug(`Erreur Supabase: ${error.message}`);
          setLoading(false);
          return;
        }

        // 2. Si aucun produit n'est tagué "Vente Flash", on pioche directement dans nos 13 produits officiels Bébé
        if (!prods || prods.length === 0) {
          const { data: fallback } = await supabase
            .from("products")
            .select("id, name, slug, price, promo_price, stock, brand, manufacturer_id, rubrique, category_bebe_id, image_url")
            .eq("is_active", true)
            .in("rubrique", [
              "LITERIE — Matelas & draps assortis",
              "CHANGE & ACCESSOIRES",
              "LINGE DE LIT — Draps housse seuls",
              "BAIN",
              "REPAS & CHAISE HAUTE",
              "SOMMEIL & CONFORT"
            ])
            .limit(8);

          if (fallback && fallback.length > 0) {
            await formatProducts(fallback);
            return;
          }
          setLoading(false);
          return;
        }

        await formatProducts(prods);
      } catch(e:any){
        setDebug(`Exception: ${e.message}`);
        setLoading(false);
      }
    }

    async function formatProducts(prods:any[]){
      const productIds = prods.map(p=>p.id);
      const manufIds = [...new Set(prods.map(p=>p.manufacturer_id).filter(Boolean))];

      let imagesByProduct: Record<string, any[]> = {};
      if (productIds.length>0){
        const { data: imgs } = await supabase.from("product_images").select("product_id, image_url, is_primary, position").in("product_id", productIds).order("position");
        if (imgs) {
          for (const img of imgs){
            if (!imagesByProduct[img.product_id]) imagesByProduct[img.product_id]=[];
            imagesByProduct[img.product_id].push(img);
          }
        }
      }

      let manufById: Record<string, any> = {};
      if (manufIds.length>0){
        const { data: manufs } = await supabase.from("manufacturers").select("id, label_fr, flag_emoji").in("id", manufIds);
        if (manufs) manufs.forEach(m=>{ manufById[m.id]=m; });
      }

      const formatted = prods.map((item: any) => {
        const imgs = imagesByProduct[item.id] || [];
        const sorted = [...imgs].sort((a:any,b:any)=> (b.is_primary?1:0) - (a.is_primary?1:0) || a.position-b.position);
        const raw = sorted[0]?.image_url ?? item.image_url ?? "";
        const imageUrl = cleanImageUrl(raw);
        
        const original = Number(item.price);
        const promo = Number(item.promo_price || (original*0.9).toFixed(2));
        const manuf = item.manufacturer_id ? manufById[item.manufacturer_id] : null;
        const fab = manuf?.label_fr || item.brand || "Fabriqué en France/UE";
        const flag = manuf?.flag_emoji || "🇫🇷 🇪🇺";
        const rub = (item.rubrique || "BÉBÉ").split("—")[0].trim().toUpperCase();

        return {
          id: item.id, name: item.name, slug: item.slug,
          price: `${promo.toFixed(2).replace(".",",")} €`, numericPrice: promo,
          oldPrice: `${original.toFixed(2).replace(".",",")} €`,
          discount: `-10%`, image: imageUrl,
          detailUrl: `/shop/bebe/${item.slug}`,
          stockLeft: Math.floor((item.stock||40)*0.35), stockTotal: item.stock||40,
          reviewsCount: Math.floor(Math.random()*40)+22,
          category: /maman/i.test(item.rubrique||"") ? "Maman" : "Bébé",
          shortDesc: getMarketingShort(item),
          fabrication: fab, flag, rubrique: rub
        };
      });
      setFlashProducts(formatted);
      setLoading(false);
    }

    fetchData();
  }, []);

  const filtered = useMemo(()=>flashProducts.filter(p=>{
    if(selectedCategory!=="Tous les produits" && p.category!==selectedCategory) return false;
    if(searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }),[flashProducts,selectedCategory,searchQuery]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAFAFA] via-white to-[#F5EBE6]/30 pt-24 text-[#333333]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* HERO FLASH */}
        <div className="mb-8 overflow-hidden rounded-[24px] border border-[#333333]/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4A396]/20 rounded-full blur-[60px] -mr-32 -mt-32 pointer-events-none"></div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-gradient-to-r from-[#333333] via-[#333333] to-[#3D3D3D] p-5 sm:p-6 text-white relative">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4A396] shadow-[0_0_20px_rgba(212,163,150,0.5)]"><Zap className="h-6 w-6 fill-current"/></span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-extrabold text-[18px] sm:text-[20px] tracking-tight">Vente Flash -10%</h2>
                  <span className="hidden sm:inline-flex items-center gap-1 bg-[#6E857B] px-2.5 py-0.5 rounded-full text-[10px] font-bold"><ShieldCheck className="w-3 h-3"/> OEKO-TEX</span>
                </div>
                <p className="text-[12px] text-white/70 mt-1 flex items-center gap-2"><span>{filtered.length} pépites Maman & Bébé</span><span className="w-1 h-1 bg-white/30 rounded-full"></span><span>🇫🇷 🇪🇺 Fabriqué France/UE</span></p>
              </div>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 border border-white/10 backdrop-blur">
              <Clock3 className="h-5 w-5 text-[#D4A396]"/><div className="flex flex-col"><span className="text-[10px] uppercase font-bold tracking-widest text-white/60">Termine dans</span><div className="mt-1">{flashEndsAt && <LiveCountdown endsAt={flashEndsAt}/>}</div></div>
            </div>
          </div>
          <div className="bg-[#F5EBE6]/40 px-5 py-3 flex flex-wrap items-center gap-3 text-[11px] font-bold text-[#333333]/70">
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-[#6E857B]"/>Livraison rapide dès 10,00 €</span>
            <span className="w-px h-3 bg-[#333333]/15 hidden sm:block"></span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#6E857B]"/>OEKO-TEX & Fabriqué France/UE</span>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 rounded-[20px] border border-[#333333]/10 bg-white p-5 shadow-sm">
              <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#F5EBE6] via-[#F5EBE6] to-[#E8C5C8]/30 p-4 border border-[#D4A396]/20">
                <div className="flex items-center gap-2 mb-2"><Sparkles className="h-4 w-4 text-[#D4A396]"/><span className="text-xs font-extrabold uppercase tracking-wide">Univers ECLOSIA</span></div>
                <p className="text-[11px] text-[#333333]/70 leading-relaxed">8 pépites Bébé à prix flash -10%. Coton BIO, bambou naturel, fabrication France/UE.</p>
              </div>
              <div className="relative mb-6">
                <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Rechercher..." className="w-full rounded-xl border border-[#333333]/15 py-2.5 pl-9 pr-8 text-xs font-medium focus:outline-none focus:border-[#333333]"/>
                <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-[#333333]/40"/>
                {searchQuery && <button onClick={()=>setSearchQuery("")} className="absolute right-3 top-3"><X className="w-3.5 h-3.5 text-[#333333]/50"/></button>}
              </div>
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#333333]/50 mb-3">Filtrer par univers</h3>
              <div className="space-y-1.5">
                {["Tous les produits","Bébé","Maman"].map(cat=>{
                  const active = selectedCategory===cat;
                  return <button key={cat} onClick={()=>setSelectedCategory(cat)} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-bold transition-all ${active?"bg-[#333333] text-white shadow-md":"bg-[#F9F6F4] border border-[#333333]/5 text-[#333333] hover:bg-[#F5EBE6]"}`}><span className="flex items-center gap-2.5"><span className={`h-2 w-2 rounded-full ${active?"bg-[#D4A396]":"bg-[#333333]/20"}`}/>{cat}</span>{active && <Check className="h-4 w-4 text-[#D4A396]"/>}</button>
                })}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? <div className="py-20 text-center animate-pulse text-xs font-bold text-[#333333]/50">Chargement des produits flash...</div>
            : filtered.length===0 ? (
              <div className="py-20 bg-white rounded-[20px] border border-dashed text-center">
                <p className="font-bold">Aucun produit flash</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {filtered.map(product=>{
                  const pct = Math.round(((product.stockTotal-product.stockLeft)/product.stockTotal)*100);
                  return (
                    <article key={product.id} className="group relative flex flex-col overflow-hidden rounded-[20px] border border-[#333333]/10 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)] hover:-translate-y-1.5 transition-all duration-500">
                      
                      {/* BADGES EN HAUT DE L'IMAGE (Drapeau + Rubrique + -10%) */}
                      <span className="absolute left-3 top-3 z-20 rounded-full bg-[#333333] px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">
                        {product.discount}
                      </span>
                      
                      <span className="absolute top-3 left-14 z-20 rounded-full bg-white/95 backdrop-blur border border-[#333333]/10 px-2 py-1 text-[9px] font-bold flex items-center gap-1 shadow-sm text-[#333333]">
                        <span>{product.flag}</span>
                        <span className="truncate max-w-[70px]">{product.fabrication.split(" ").slice(0,2).join(" ")}</span>
                      </span>

                      <span className="absolute right-3 top-3 z-20 rounded-full bg-white/95 backdrop-blur border border-[#333333]/10 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#333333] shadow-sm">
                        {product.rubrique}
                      </span>

                      <span className="absolute bottom-3 right-3 z-20 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center border border-[#333333]/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-4 h-4 text-[#333333]"/>
                      </span>
                      
                      <Link href={product.detailUrl} className="relative block aspect-square bg-gradient-to-b from-[#F5EBE6]/40 via-[#F5EBE6]/20 to-white p-5">
                        <Image src={product.image} alt={product.name} fill unoptimized className="object-contain p-2 mix-blend-multiply group-hover:scale-[1.08] transition-transform duration-700"/>
                      </Link>

                      <div className="p-4 flex flex-col flex-grow">
                        <Link href={product.detailUrl} className="font-extrabold text-[13px] leading-snug line-clamp-2 hover:text-[#6E857B] transition-colors text-[#333333]">
                          {product.name}
                        </Link>
                        
                        <p className="text-[11px] text-[#333333]/60 mt-1.5 line-clamp-2 leading-relaxed">
                          {product.shortDesc}
                        </p>
                        
                        <div className="mt-2.5 flex items-center gap-1 text-amber-500">
                          {Array.from({length:4}).map((_,i)=><Star key={i} className="w-3 h-3 fill-current"/>)}
                          <Star className="w-3 h-3 text-gray-200"/>
                          <span className="ml-1 text-[10px] text-[#333333]/50 font-medium">({product.reviewsCount})</span>
                        </div>

                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="font-extrabold text-[18px] text-[#333333]">{product.price}</span>
                          <span className="text-xs line-through text-[#333333]/40">{product.oldPrice}</span>
                        </div>

                        <div className="mt-3">
                          <div className="mb-1.5 flex justify-between text-[10px] font-bold">
                            <span className="text-[#333333]/60">Stock flash</span>
                            <span className="text-[#D4A396]">{product.stockLeft} restants</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#333333]/10">
                            <div className="h-full bg-gradient-to-r from-[#D4A396] to-[#C48A7D]" style={{width:`${pct}%`}}/>
                          </div>
                        </div>

                        <button 
                          onClick={()=>addItem && addItem({
                            id:product.id,
                            name:product.name,
                            slug:product.slug,
                            price:product.numericPrice,
                            priceFormatted:product.price,
                            image:product.image,
                            quantity:1,
                            is_flash_sale:true
                          })} 
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#333333] hover:bg-black py-2.5 text-xs font-extrabold text-white shadow-sm transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="h-4 w-4"/>Ajouter • -10%
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}