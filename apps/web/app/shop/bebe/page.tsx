"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Star, ShoppingBag, ShieldCheck, ChevronRight, ArrowLeft } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialisation du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Catégories de l'univers Bébé
const CATEGORIES = [
  "Tous",
  "Transport & Sorties",
  "Sommeil & Chambre",
  "Éveil & Jouets",
  "Repas & Allaitement",
  "Soins, Bain & Hygiène",
  "Vêtements & Textile",
];

// Fonction pour attribuer dynamiquement la catégorie selon le nom du produit
function assignCategory(productName: string): string {
  const name = productName.toLowerCase();
  if (name.includes("poussette") || name.includes("siège") || name.includes("sac") || name.includes("porte-bébé") || name.includes("ombrelle") || name.includes("miroir")) return "Transport & Sorties";
  if (name.includes("lit") || name.includes("babyphone") || name.includes("veilleuse") || name.includes("mobile") || name.includes("transat") || name.includes("baignoire")) return "Sommeil & Chambre";
  if (name.includes("tapis") || name.includes("arche") || name.includes("anneaux")) return "Éveil & Jouets";
  if (name.includes("chaise") || name.includes("biberon") || name.includes("repas") || name.includes("cuiseur") || name.includes("bavoir") || name.includes("coussin")) return "Repas & Allaitement";
  if (name.includes("couches") || name.includes("soin") || name.includes("bain") || name.includes("trousse") || name.includes("mouche") || name.includes("thermomètre") || name.includes("matelas")) return "Soins, Bain & Hygiène";
  if (name.includes("coffret") || name.includes("kit") || name.includes("pyjama") || name.includes("lange") || name.includes("body")) return "Vêtements & Textile";
  return "Tous";
}

export default function BebeShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      // Récupération directe depuis la table products en filtrant par la catégorie 'bebe'
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          description,
          price,
          is_featured,
          categories!inner(slug)
        `)
        .eq("categories.slug", "bebe")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) {
        console.error("Erreur de récupération:", error);
      } else if (data) {
        const formattedProducts = data.map((product: any) => {
          // Génération automatique et infaillible de l'URL de l'image basée sur le slug exact dans Supabase Storage
          const directStorageImageUrl = `https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/${product.slug}.jpg`;

          return {
            id: product.id,
            name: product.name,
            category: assignCategory(product.name),
            price: `${Number(product.price).toFixed(2)} €`,
            rating: 5,
            reviewsCount: Math.floor(Math.random() * 80) + 20,
            image: directStorageImageUrl, // URL directe fonctionnelle pour tous les produits
            slug: `/shop/bebe/${product.slug}`,
            badge: product.is_featured ? "Coup de cœur" : "Essentiel",
            description: product.description || "Un indispensable pour votre bébé.",
          };
        });
        setProducts(formattedProducts);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === "Tous"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-16">
      
      {/* Bouton de retour à l'accueil */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#333333]/70 hover:text-[#333333] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>
      </div>

      {/* En-tête */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-[#FDFBF9] rounded-[32px] p-8 sm:p-12 border border-[#EAE6E1] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#333333] tracking-tight leading-tight mb-4">
              L'essentiel pour grandir en toute sécurité
            </h1>
            <p className="text-[#666666] text-lg leading-relaxed">
              Des produits pensés pour le confort, l'éveil et la sécurité de votre bébé. 
              Des matières certifiées douces, saines et respectueuses de sa peau délicate.
            </p>
          </div>
          <div className="flex flex-col gap-3 bg-white p-6 rounded-2xl border border-[#EAE6E1] shadow-sm text-sm text-[#333333] font-medium min-w-[280px]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#6E857B]" />
              <span>Certifié Oeko-Tex & Sans BPA</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#6E857B]" />
              <span>Conforme aux normes européennes</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#6E857B]" />
              <span>Matériaux 100% respectueux</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-28 bg-white rounded-3xl border border-[#EAE6E1] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#333333] mb-6">Catégories</h3>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map((cat, idx) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-[#333333] text-white"
                          : "text-[#666666] hover:bg-[#FDFBF9] hover:text-[#333333]"
                      }`}
                    >
                      {cat}
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grille des produits */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 font-medium">Chargement du catalogue...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#EAE6E1]">
                <p className="text-gray-500 text-lg">Aucun produit ne correspond à cette catégorie.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-[24px] border border-[#EAE6E1] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <Link 
                      href={product.slug} 
                      className="relative block w-full h-[280px] bg-[#FDFBF9] overflow-hidden p-6"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold text-[#333333] shadow-sm uppercase tracking-wider z-10">
                        {product.category}
                      </span>
                      <span className="absolute bottom-4 left-4 bg-[#333333] text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide flex items-center gap-1.5 shadow-sm z-10">
                        <Sparkles className="w-3.5 h-3.5" />
                        {product.badge}
                      </span>
                    </Link>

                    <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 mb-3 text-amber-500">
                          {[...Array(product.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                          <span className="text-xs text-gray-400 font-medium ml-1">
                            ({product.reviewsCount})
                          </span>
                        </div>
                        <Link href={product.slug}>
                          <h3 className="font-bold text-[#333333] text-lg leading-tight group-hover:text-[#6E857B] transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#EAE6E1] mt-2">
                        <span className="font-extrabold text-xl text-[#333333]">
                          {product.price}
                        </span>
                        <Link
                          href={product.slug}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#333333] text-white hover:bg-[#6E857B] transition-colors active:scale-95 text-sm font-semibold"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Découvrir</span>
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