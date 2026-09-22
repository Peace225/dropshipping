"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Star, ShoppingBag, ArrowLeft, ShieldCheck, ChevronRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FILE_MAP: Record<string, string> = {
  "douchette-intime-perinee": "douchette-intime-perinee.jpg",
  "soutien-gorge-grossesse-sans-coutures": "soutien-gorge-grossesse-sans-coutures.jpg",
  "ballon-de-grossesse": "ballon-grossesse.jpg",
  "ceinture-abdominale-apres-accouchement": "ceinture-abdominale-apres-accouchement.jpg",
  "coussinets-d-allaitement-jetables": "coussinets-allaitement-jetables.jpg",
  "serviettes-apaisantes-post-accouchement": "serviettes-apaisantes-post-accouchement.jpg",
  "serviettes-hygieniques-post-partum": "serviettes-hygieniques-maternite.jpg",
  
  "sac-de-maternite-organisateur-valise": "sac-maternite-organisateur.jpg",
  "sac-de-maternite-et-organisateur-valise": "sac-maternite-organisateur.jpg",
  "sac-de-maternite-organisateur": "sac-maternite-organisateur.jpg",
  "sac-maternite-organisateur": "sac-maternite-organisateur.jpg",
  
  "soutiens-gorge-d-allaitement-lot-de-3": "soutien-gorge-grossesse-sans-coutures.jpg",
  "soutien-allaitement-lot-de-3": "soutien-gorge-grossesse-sans-coutures.jpg",
  "huile-vergetures-bio-oil": "huile-vergetures-bio-oil.jpg",
  "huile-de-vergetures-bio-oil": "huile-vergetures-bio-oil.jpg",
};

function resolveProductImage(slug: string, rawImage?: string): string {
  const base = "https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images";

  // 1. PRIORITÉ ABSOLUE : on utilise le dictionnaire FILE_MAP en premier
  if (FILE_MAP[slug]) {
    return `${base}/${FILE_MAP[slug]}`;
  }

  // 2. Si l'URL en base est valide et pas tronquée
  if (rawImage && rawImage.startsWith("http") && rawImage.includes("aurae-images") && !rawImage.includes("cloudinary")) {
    if (!rawImage.endsWith("aurae-ima") && !rawImage.endsWith("aurae-images") && !rawImage.endsWith("aurae-images/")) {
      return rawImage;
    }
  }

  // 3. Fallback naturel
  return `${base}/${slug}.jpg`;
}

export default function MaternityShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [products, setProducts] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>(["Tous"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from("products")
        .select(`id, name, slug, price, description, categories!inner ( slug ), product_images ( image_url, is_primary, position )`)
        .eq("categories.slug", "maman")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur :", error);
      } else if (data) {
        const formattedData = data.map((product: any) => {
          const images = [...(product.product_images ?? [])].sort((a, b) => a.position - b.position);
          const rawImage = images.find((img: any) => img.is_primary)?.image_url ?? images[0]?.image_url ?? "";

          const finalImage = resolveProductImage(product.slug, rawImage);

          let dynamicCategory = "Accessoires";
          const lowerName = product.name?.toLowerCase() || "";
          if (lowerName.includes("vergeture") || lowerName.includes("huile") || lowerName.includes("crème") || lowerName.includes("baume") || lowerName.includes("soin") || lowerName.includes("weleda") || lowerName.includes("lanoline")) dynamicCategory = "Soins & Cosmétiques";
          else if (lowerName.includes("soutien") || lowerName.includes("allaitement") || lowerName.includes("tire-lait") || lowerName.includes("coussinet") || lowerName.includes("coussin d'allaitement")) dynamicCategory = "Allaitement";
          else if (lowerName.includes("ceinture") || lowerName.includes("coussin") || lowerName.includes("bola") || lowerName.includes("maintien") || lowerName.includes("ballon")) dynamicCategory = "Confort & Maintien";
          else if (lowerName.includes("post-partum") || lowerName.includes("douchette") || lowerName.includes("culotte") || lowerName.includes("serviette") || lowerName.includes("périnée") || lowerName.includes("apaisante")) dynamicCategory = "Post-Partum";
          else if (lowerName.includes("sac") || lowerName.includes("langer") || lowerName.includes("organisateur") || lowerName.includes("valise") || lowerName.includes("pyjama")) dynamicCategory = "Sacs & Bagagerie";

          return {
            id: product.id,
            name: product.name,
            category: dynamicCategory,
            price: `${Number(product.price).toFixed(2).replace(".", ",")} €`,
            rating: 5,
            reviewsCount: Math.floor(Math.random() * 100) + 10,
            image: finalImage,
            slug: `/shop/maternite/${product.slug}`,
            badge: "Coup de cœur",
            description: product.description || "Un soin expert pour vous accompagner.",
          };
        });

        const uniqueCategories = Array.from(new Set(formattedData.map((p) => p.category))).sort();
        setProducts(formattedData);
        setCategoriesList(["Tous", ...uniqueCategories]);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === "Tous" ? products : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 mt-16">
        <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6">
          <ArrowLeft className="w-4 h-4" />Retour à l'accueil
        </Link>
        <div className="bg-gradient-to-r from-[#F5EBE6] via-[#E8C5C8]/30 to-[#F5EBE6] rounded-3xl p-6 sm:p-10 border border-[#333333]/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E8C5C8] text-[#333333] mb-3"><Sparkles className="w-3.5 h-3.5" />Univers 1 : Soins & Cosmétique Maman</span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] tracking-tight leading-tight mb-3">Prendre soin de vous, de la grossesse au post-partum</h1>
            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium">Des formules clean, 100% sécurisées et adaptées aux bouleversements de votre corps.</p>
          </div>
          <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#333333]/10 shadow-sm text-xs sm:text-sm text-[#333333] font-medium min-w-">
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#6E857B]" /><span>100% Compatible Allaitement</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#6E857B]" /><span>Testé dermatologiquement</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#6E857B]" /><span>Sans perturbateurs endocriniens</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-[#333333]/10 shadow-sm p-5 sticky top-24">
              <h2 className="text-lg font-extrabold text-[#333333] mb-4 px-2">Catégories</h2>
              <div className="flex flex-col gap-1">
                {categoriesList.map((cat, idx) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button key={idx} onClick={() => setSelectedCategory(cat)} className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-bold ${isActive ? "bg-[#333333] text-white" : "text-[#333333]/70 hover:bg-[#333333]/5"}`}>
                      <span>{cat}</span>{isActive && <ChevronRight className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {loading ? <div className="flex items-center justify-center py-20 font-bold">Chargement...</div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between">
                    <Link href={product.slug} className="relative w-full h-64 bg-[#E8C5C8]/20 overflow-hidden flex items-center justify-center p-6 block">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/serviettes-hygieniques-maternite.jpg" }}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold uppercase">{product.category}</span>
                      <span className="absolute bottom-4 left-4 bg-[#333333] text-white px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1"><Sparkles className="w-3 h-3" />{product.badge}</span>
                    </Link>
                    <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                          {[...Array(product.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                          <span className="text-xs text-[#333333]/60 ml-1">({product.reviewsCount})</span>
                        </div>
                        <Link href={product.slug}><h2 className="font-extrabold text-base line-clamp-1">{product.name}</h2></Link>
                        <p className="text-xs sm:text-sm text-[#333333]/70 mt-1 line-clamp-2">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-[#333333]/5">
                        <span className="font-extrabold text-lg">{product.price}</span>
                        <Link href={product.slug} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#333333] text-white font-bold text-xs"><ShoppingBag className="w-4 h-4" />Découvrir</Link>
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