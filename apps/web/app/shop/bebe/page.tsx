"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Star, ShoppingBag, ArrowLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const BUCKET = "https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images";

const FILE_MAP: Record<string, string> = {
  "porte-bebe": "porte-bebe-ergonomique.jpg",
  "tapis-deveil": "tapis-d-eveil.jpg",
  "couches-pampers-tailles": "pack-couches-pampers.jpg",
  "coffret-maternite-essentielle": "coffret-maternite-essentielle.jpg",
  "lit-cododo": "lit-cododo-reglable.jpg",
  "kit-gigoteuse-lange-nid-ange-serviettes": "kit-naissance-gigoteuse-lange.jpg",
  "pack-soin-bebe-mustela": "pack-soins-mustela.jpg",
  "chaise-haute": "chaise-haute-evolutive.jpg",
  "baignoire-twistshake": "baignoire-twistshake.jpg",
  "coffret-naissance-biberons-mam": "coffret-biberons-mam.jpg",
  "lot-2-tetines-mam": "tetines-mam-lot-de-2.jpg",
  "kit-repas-bebe-silicone": "kit-repas-bebe-silicone.jpg",
  "trousse-premiers-soins-bebe": "trousse-premiers-soins-bebe.jpg",
  "transat-electrique-momi": "transat-electrique-momi.jpg",
  "lot-3-pyjamas": "lot-3-pyjamas-coton.jpg",
};

const CATEGORIES = ["Tous", "Transport & Sorties", "Sommeil & Chambre", "Éveil & Jouets", "Repas & Allaitement", "Soins, Bain & Hygiène", "Vêtements & Textile"];

function assignCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("porte-bebe") || n.includes("poussette")) return "Transport & Sorties";
  if (n.includes("lit") || n.includes("transat") || n.includes("baignoire") || n.includes("cododo")) return "Sommeil & Chambre";
  if (n.includes("tapis")) return "Éveil & Jouets";
  if (n.includes("chaise") || n.includes("biberon") || n.includes("repas") || n.includes("tétine")) return "Repas & Allaitement";
  if (n.includes("couche") || n.includes("soin") || n.includes("trousse") || n.includes("mustela")) return "Soins, Bain & Hygiène";
  return "Vêtements & Textile";
}

export default function BebeShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("products")
        .select(`id,name,slug,description,price,is_featured,categories!inner(slug)`)
        .eq("categories.slug", "bebe")
        .eq("is_active", true)
        .order("name");
      
      if(data) {
        setProducts(data.map((p:any) => ({
          id: p.id, 
          name: p.name,
          category: assignCategory(p.name),
          price: `${Number(p.price).toFixed(2)} €`,
          reviewsCount: Math.floor(Math.random()*80)+20,
          image: `${BUCKET}/${FILE_MAP[p.slug] || `${p.slug}.jpg`}`,
          slug: `/shop/bebe/${p.slug}`,
          badge: p.is_featured ? "Coup de cœur" : "Essentiel",
          description: p.description
        })));
      }
      setLoading(false);
    })();
  }, []);

  const filtered = selectedCategory === "Tous" ? products : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#F5EBE6]/20">
      
      {/* Container principal (idem Maternité) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 mt-16">
        
        {/* Bouton retour */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6">
          <ArrowLeft className="w-4 h-4" />Retour à l'accueil
        </Link>

        {/* Hero Banner Eclosia */}
        <div className="bg-gradient-to-r from-[#F5EBE6] via-[#DCE4E0]/60 to-[#F5EBE6] rounded-3xl p-6 sm:p-10 border border-[#333333]/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-8 sm:mb-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#6E857B] text-white mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Univers 2 : Le Cocon de Bébé
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] tracking-tight leading-tight mb-3">
              L'essentiel pour grandir en toute sécurité
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/80 font-medium">
              Des produits pensés pour le confort, l'éveil et la sécurité de votre bébé. Des matières certifiées douces, saines et respectueuses.
            </p>
          </div>
          <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#333333]/10 shadow-sm text-xs sm:text-sm text-[#333333] font-medium min-w-[260px]">
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#6E857B]" /><span>Certifié Oeko-Tex & Sans BPA</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#6E857B]" /><span>Normes européennes strictes</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#6E857B]" /><span>Matériaux 100% respectueux</span></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-[#333333]/10 shadow-sm p-4 sm:p-5">
              <h3 className="text-lg font-extrabold text-[#333333] mb-4 px-2">Catégories</h3>
              <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">
                {CATEGORIES.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setSelectedCategory(c)} 
                    className={`whitespace-nowrap lg:whitespace-normal flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      selectedCategory === c ? "bg-[#333333] text-white" : "text-[#333333]/70 bg-white lg:bg-transparent border border-[#333333]/5 lg:border-transparent hover:bg-[#333333]/5"
                    }`}
                  >
                    {c}
                    {selectedCategory === c && <ChevronRight className="hidden lg:block w-4 h-4"/>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grille Produits */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20 font-bold text-[#333333]/50">Chargement du catalogue...</div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center py-20 font-bold text-[#333333]/50 bg-white rounded-2xl border border-[#333333]/10">Aucun produit dans cette catégorie.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(product => (
                  <div key={product.id} className="group bg-white rounded-2xl border border-[#333333]/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                    
                    {/* Image Container avec couleur d'accentuation Bébé */}
                    <Link href={product.slug} className="relative block w-full h-48 sm:h-56 bg-[#6E857B]/10 overflow-hidden shrink-0 flex items-center justify-center">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/baignoire-twistshake.jpg" }}
                        className="w-full h-full object-contain p-6 sm:p-8 group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase text-[#333333] z-10">
                        {product.category}
                      </span>
                      <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-[#333333] text-white px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-semibold flex items-center gap-1.5 z-10">
                        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5"/>{product.badge}
                      </span>
                    </Link>
                    
                    {/* Infos produit */}
                    <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-1 mb-1.5 text-amber-500">
                          {[...Array(5)].map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-current" />))}
                          <span className="text-xs text-[#333333]/50 font-medium ml-1">({product.reviewsCount})</span>
                        </div>
                        <Link href={product.slug}>
                          <h3 className="font-extrabold text-[#333333] text-sm sm:text-base line-clamp-2 hover:underline">{product.name}</h3>
                        </Link>
                        <p className="text-xs sm:text-sm text-[#333333]/70 mt-1.5 line-clamp-2">{product.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-[#333333]/5 mt-auto">
                        <span className="font-extrabold text-lg sm:text-xl text-[#333333]">{product.price}</span>
                        <Link href={product.slug} className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-[#333333] text-white text-xs sm:text-sm font-bold transition-colors hover:bg-[#1a1a1a]">
                          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4"/>
                          <span className="hidden sm:inline">Découvrir</span>
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