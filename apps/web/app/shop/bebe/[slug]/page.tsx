"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck, RotateCcw, Heart, MapPin, Home, ChevronRight, ChevronLeft, Package, ShoppingCart, Truck, ZoomIn } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { useCart } from "@/context/cart-context";

const PLACEHOLDER = "https://via.placeholder.com/600x600/F5EBE6/333333?text=ECLOSIA+BEBE";

function cleanImageUrl(raw?: string){
  if(!raw) return PLACEHOLDER;
  const first = raw.includes("|")? raw.split("|")[0].trim() : raw.trim();
  return first.startsWith("http")? first : PLACEHOLDER;
}

export default function BebeProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const cart = useCart() as any;
  const supabase = getSupabase();

  const [product, setProduct] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [locations, setLocations] = useState<Record<string, any[]>>({});
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"relais"|"domicile">("relais");
  const [debugMsg, setDebugMsg] = useState("");
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (dir: "left" | "right") => {
    if(sliderRef.current) sliderRef.current.scrollBy({ left: dir==="left"?-250:250, behavior:"smooth" });
  };

  const activeDeliveryPriceStr = "10,00 €";

  const handleBuy = () => {
    if(!product) return;
    const item = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      priceFormatted: product.priceFormatted,
      image: mainImage,
      quantity: 1,
      brand: product.brand,
      fabrication: product.fabrication,
      fabricationFlag: product.fabricationFlag,
      delivery: { method: deliveryMethod, region: selectedRegion, city: selectedCity, priceStr: activeDeliveryPriceStr }
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

      let { data: prodSimple, error } = await supabase
        .from("products")
        .select("id, name, slug, price, description, image_url, sku, rubrique, brand, category_bebe_id, manufacturer_id")
        .eq("slug", slug)
        .maybeSingle();

      if (!prodSimple) {
        const baseSlug = slug.split("-sku-")[0];
        const { data: fallback } = await supabase
          .from("products")
          .select("id, name, slug, price, description, image_url, sku, rubrique, brand, category_bebe_id, manufacturer_id")
          .ilike("slug", `%${baseSlug}%`)
          .limit(1)
          .maybeSingle();
        if (fallback) prodSimple = fallback;
      }

      if (!prodSimple && slug.includes("32x72")) {
        const { data: fb2 } = await supabase
          .from("products")
          .select("id, name, slug, price, description, image_url, sku, rubrique, brand, category_bebe_id, manufacturer_id")
          .ilike("slug", `%32x72%`)
          .limit(1)
          .maybeSingle();
        if (fb2) prodSimple = fb2;
      }

      if (error &&!prodSimple) {
        console.error("Introuvable", error, slug);
      }

      if (!prodSimple) {
        setDebugMsg("Le produit n'existe pas en base. Exécute UPDATE products SET is_active=true WHERE slug ILIKE '%32x72%'");
        setLoading(false);
        return;
      }

      let fabFull = "Fabriqué en France et en Union Européenne";
      let fabFlag = "🇫🇷 🇪🇺";
      let fabShort = "UE";
      if (prodSimple.manufacturer_id) {
        const { data: manuf } = await supabase.from("manufacturers").select("label_fr, flag_emoji, code").eq("id", prodSimple.manufacturer_id).maybeSingle();
        if (manuf) {
          fabFull = manuf.label_fr || fabFull;
          fabFlag = manuf.flag_emoji || fabFlag;
          fabShort = manuf.code || fabShort;
        }
      }

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
        const parts = prodSimple.image_url.includes("|")? prodSimple.image_url.split("|") : [prodSimple.image_url];
        formattedImages = parts.map((p:string)=>cleanImageUrl(p));
      }
      if (formattedImages.length===0) formattedImages=[PLACEHOLDER];
      if (formattedImages.length===1) formattedImages = [formattedImages[0], formattedImages[0], formattedImages[0]];

      setProduct({
        ...prodSimple,
        images: formattedImages,
        categoryName: catName,
        fabrication: fabFull,
        fabricationFlag: fabFlag,
        fabricationShort: fabShort,
        priceFormatted: `${Number(prodSimple.price||0).toFixed(2).replace(".",",")} €`,
        oldPriceFormatted: `${(Number(prodSimple.price||0)*1.25).toFixed(2).replace(".",",")} €`,
        reviewsCount: Math.floor(Math.random()*80)+20
      });
      setMainImage(formattedImages[0]);

      const { data: sugData } = await supabase.from("products").select("id, name, slug, price, image_url, brand").eq("is_active", true).neq("id", prodSimple.id).limit(20);
      if (sugData) {
        const map = new Map();
        sugData.forEach((s:any)=>{
          const key = s.name?.trim() || s.id;
          if(!map.has(key)){
            map.set(key,{ id: s.id, name: s.name, price: `${Number(s.price||0).toFixed(2).replace(".",",")} €`, slug: `/shop/bebe/${s.slug}`, image: cleanImageUrl(s.image_url), fabrication: s.brand || "UE" });
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
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><p className="font-bold animate-pulse text-[#333333]">Chargement...</p></div>;
  if (!product) return <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20"><h1 className="text-2xl font-extrabold text-[#333333]">Produit introuvable</h1><p className="text-xs text-gray-500">Slug: {slug}</p>{debugMsg && <p className="text-xs text-red-500">{debugMsg}</p>}<Link href="/shop/bebe" className="px-6 py-2.5 bg-[#333333] text-white rounded-full font-bold text-sm">Retour boutique bébé</Link></div>;

  const rawDescription = product.description || "Un produit d'excellence ECLOSIA, conçu avec soin pour le confort et la sécurité de votre bébé.";
  const descLines = rawDescription.split(/\r?\n/);
  const bulletLines = descLines.filter((l:string) => l.trim().startsWith("-") || l.trim().startsWith("•"));
  const resumeLine = descLines.find((l:string) => l.toLowerCase().includes("très pratique") || l.toLowerCase().includes("résumé"));
  const descText = descLines.filter((l:string) => l!== resumeLine &&!bulletLines.includes(l) && l.trim().length > 0).join("\n\n");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20 pb-16 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/shop/bebe" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333]"><ArrowLeft className="w-4 h-4"/><span>Retour à l'univers Bébé</span></Link>
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
                  <button key={idx} onClick={()=>setMainImage(imgUrl)} className={`relative aspect-square w-16 shrink-0 snap-start rounded-lg overflow-hidden border bg-white p-1 cursor-pointer ${mainImage===imgUrl?"border-[#333333] ring-2 ring-[#333333]/20":"border-[#333333]/10 hover:border-[#333333]/30"}`}>
                    <img src={imgUrl} alt={`Vue ${idx+1}`} className="w-full h-full object-contain mix-blend-multiply" />
                    <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1 rounded-tl">{idx+1}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full md:w-[55%] flex flex-col p-4 sm:p-6">
              <div className="flex flex-wrap gap-2 mb-2"><span className="bg-[#6E857B] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase">{product.categoryName}</span></div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#333333] leading-snug mb-3 mt-2">{product.name}</h1>
              <hr className="border-[#333333]/10 mb-4"/>
              <div className="flex items-center gap-3 mb-1"><p className="text-3xl font-extrabold text-[#333333]">{product.priceFormatted}</p><p className="text-base text-gray-400 line-through">{product.oldPriceFormatted}</p><span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md">-20%</span></div>
              <div className="flex items-center gap-2 mb-4 mt-2"><span className="text-lg leading-none">{product.fabricationFlag}</span><span className="text-xs italic font-bold text-[#6E857B]">{product.fabrication}</span></div>
              <div className="bg-[#F9F6F4] rounded-xl p-4 mb-4 border border-[#333333]/5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-2 text-[#333333]"><ShieldCheck className="w-4 h-4 text-[#6E857B]"/> Description du produit</h3>
                {resumeLine && <p className="text-xs font-bold text-[#333333] mb-3">{resumeLine}</p>}
                <div className="text-xs text-[#333333]/80 leading-relaxed"><p className="whitespace-pre-wrap">{descText}</p>{bulletLines.length > 0 && (<ul className="mt-3 list-disc list-inside space-y-1">{bulletLines.map((b:string, i:number)=><li key={i}>{b.replace(/^[-•]\s*/,"")}</li>)}</ul>)}</div>
              </div>
              <p className="text-xs text-[#31A039] font-medium mb-1">En stock - Expédition rapide</p>
              <p className="text-xs text-[#333333]/80 mb-3">+ livraison à partir de <span className="font-bold">{activeDeliveryPriceStr}</span> vers <strong>{selectedCity||"votre adresse"}</strong></p>
              <div className="flex items-center gap-1.5 mb-5 text-amber-500">{[...Array(4)].map((_,i)=><Star key={i} className="w-4 h-4 fill-current"/>)}<Star className="w-4 h-4 text-gray-300"/><span className="text-xs text-[#333333]/60 ml-1">({product.reviewsCount} avis)</span></div>
              <hr className="border-[#333333]/10 mb-5"/>
              <div className="mt-auto"><button onClick={handleBuy} className="w-full bg-[#333333] hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"><ShoppingCart className="w-5 h-5"/> J'achète</button></div>
            </div>
          </div>
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#333333]/10 shadow-sm flex flex-col">
            <div className="p-4 border-b border-[#333333]/10 bg-[#6E857B]/5 rounded-t-2xl flex justify-between items-center"><h3 className="font-extrabold text-xs uppercase text-[#333333]">LIVRAISON & RETOURS</h3><span className="text-xs font-bold text-white bg-[#6E857B] px-2 py-0.5 rounded-md flex items-center gap-1">ECLOSIA <Truck className="w-3 h-3"/></span></div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button onClick={()=>setDeliveryMethod("relais")} className={`flex flex-col items-center p-2.5 border rounded-xl text-xs font-bold cursor-pointer transition-colors ${deliveryMethod==="relais"?"border-[#333333] bg-[#333333] text-white":"border-[#333333]/15 text-[#333333] bg-white hover:border-[#333333]/30"}`}><MapPin className="w-4 h-4 mb-1"/><span>Point Relais</span></button>
                <button onClick={()=>setDeliveryMethod("domicile")} className={`flex flex-col items-center p-2.5 border rounded-xl text-xs font-bold cursor-pointer transition-colors ${deliveryMethod==="domicile"?"border-[#333333] bg-[#333333] text-white":"border-[#333333]/15 text-[#333333] bg-white hover:border-[#333333]/30"}`}><Home className="w-4 h-4 mb-1"/><span>À domicile</span></button>
              </div>
              <select className="w-full text-sm border border-[#333333]/20 rounded-xl p-2.5 mb-3 bg-white text-[#333333] font-medium outline-none focus:border-[#333333] cursor-pointer" value={selectedRegion} onChange={(e)=>{const nr=e.target.value; setSelectedRegion(nr); setSelectedCity(locations[nr]?.[0]?.name||"");}}>{Object.keys(locations).map(r=><option key={r} value={r}>{r}</option>)}</select>
              <select className="w-full text-sm border border-[#333333]/20 rounded-xl p-2.5 mb-5 bg-white text-[#333333] font-medium outline-none focus:border-[#333333] cursor-pointer" value={selectedCity} onChange={e=>setSelectedCity(e.target.value)}>{(locations[selectedRegion]||[]).map((c:any)=><option key={c.name} value={c.name}>{c.name}</option>)}</select>
              <div className="border border-[#333333]/10 rounded-xl divide-y divide-[#333333]/10 bg-[#F9F6F4] text-[#333333]">
                <div className="p-3.5 flex gap-3"><Package className="w-4 h-4 shrink-0 text-[#333333]"/><div><p className="text-xs font-extrabold mb-1">Livraison</p><p className="text-xs">Frais: <span className="font-bold text-[#6E857B]">{activeDeliveryPriceStr}</span></p><p className="text-[10px] text-[#333333]/70">vers {selectedCity}</p></div></div>
                <div className="p-3.5 flex gap-3"><RotateCcw className="w-4 h-4 shrink-0 text-[#333333]"/><div><p className="text-xs font-extrabold mb-1">Retour</p><p className="text-xs text-[#333333]/70">10 jours gratuits</p></div></div>
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