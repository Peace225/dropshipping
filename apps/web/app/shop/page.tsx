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

// Structure des catégories par univers pour la Sidebar
const UNIVERSES = [
  {
    name: "Tous les produits",
    slug: "Tous",
  },
  {
    name: "Maternité",
    slug: "Maternité",
    categories: [
      "Grossesse & Post-Partum",
      "Soins & Tendresse",
      "Bien-être & Vergetures",
      "Allaitement & Confort",
    ],
  },
  {
    name: "Bébé",
    slug: "Bébé",
    categories: [
      "Transport & Sorties",
      "Sommeil & Chambre",
      "Éveil & Jouets",
      "Repas & Allaitement",
      "Soins, Bain & Hygiène",
      "Vêtements & Textile",
    ],
  },
];

export default function GlobalShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUniverse, setSelectedUniverse] = useState("Tous");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  useEffect(() => {
    async function fetchAllProducts() {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          description,
          price,
          is_featured,
          categories ( name, slug )
        `)
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (error) {
        console.error("Erreur de récupération de la boutique globale:", error);
      } else if (data) {
        const formatted = data.map((product: any) => {
          const catSlug = product.categories?.slug || "";
          
          // Détermination propre de l'univers (Bébé ou Maternité) pour diriger vers la bonne page de détail
          const isBebe = catSlug.toLowerCase().includes("bebe") || product.name.toLowerCase().includes("bébé") || product.name.toLowerCase().includes("biberon") || product.name.toLowerCase().includes("poussette");
          const targetFolder = isBebe ? "bebe" : "maternite";

          const directStorageImageUrl = `https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/${product.slug}.jpg`;

          return {
            id: product.id,
            name: product.name,
            universe: isBebe ? "Bébé" : "Maternité",
            categoryName: product.categories?.name || "Général",
            price: `${Number(product.price).toFixed(2).replace(".", ",")} €`,
            rating: 5,
            reviewsCount: Math.floor(Math.random() * 80) + 20,
            image: directStorageImageUrl,
            slug: `/shop/${targetFolder}/${product.slug}`, // URL garantie vers la bonne page détail
            badge: product.is_featured ? "Coup de cœur" : "Essentiel",
            description: product.description || "Un indispensable sélectionné par AURAE.",
          };
        });
        setProducts(formatted);
      }
      setLoading(false);
    }

    fetchAllProducts();
  }, []);

  // Filtrage par univers et par catégorie sélectionnée dans la sidebar
  const filteredProducts = products.filter((p) => {
    if (selectedUniverse !== "Tous" && p.universe !== selectedUniverse) {
      return false;
    }
    if (selectedCategory !== "Tous" && p.categoryName !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-16">
      
      {/* Bouton de retour à l'accueil */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#333333]/70 hover:text-[#333333] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ================= SIDEBAR PREMIUM ================= */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28 bg-white rounded-3xl border border-[#EAE6E1] p-6 shadow-sm">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#333333] mb-6">
                Univers & Catégories
              </h3>

              <div className="flex flex-col gap-4">
                {UNIVERSES.map((uni) => {
                  const isUniverseActive = selectedUniverse === uni.slug;
                  return (
                    <div key={uni.slug} className="flex flex-col gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedUniverse(uni.slug);
                          setSelectedCategory("Tous");
                        }}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                          isUniverseActive && selectedCategory === "Tous"
                            ? "bg-[#333333] text-white shadow-sm"
                            : "bg-[#FAFAFA] text-[#333333] hover:bg-gray-100"
                        }`}
                      >
                        <span>{uni.name}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isUniverseActive ? "rotate-90" : ""}`} />
                      </button>

                      {/* Sous-catégories si l'univers est actif */}
                      {uni.categories && isUniverseActive && (
                        <div className="flex flex-col pl-4 gap-1 mt-1 border-l-2 border-[#EAE6E1] ml-2">
                          <button
                            onClick={() => setSelectedCategory("Tous")}
                            className={`text-left py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                              selectedCategory === "Tous" ? "text-[#333333] font-bold bg-gray-50" : "text-gray-500 hover:text-[#333333]"
                            }`}
                          >
                            Toutes les catégories
                          </button>
                          {uni.categories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`text-left py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                                selectedCategory === cat ? "text-[#333333] font-bold bg-gray-50" : "text-gray-500 hover:text-[#333333]"
                              }`}
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

          {/* ================= CONTENU PRINCIPAL ================= */}
          <main className="flex-1">
            
            {/* En-tête épuré */}
            <div className="bg-[#FDFBF9] rounded-3xl p-8 border border-[#EAE6E1] mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6E857B] block mb-1">
                  Catalogue Officiel
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
                  {selectedUniverse === "Tous" ? "Tous les produits" : `Univers ${selectedUniverse}`}
                  {selectedCategory !== "Tous" && <span className="text-gray-400 font-normal text-lg"> / {selectedCategory}</span>}
                </h1>
              </div>
              <p className="text-xs font-semibold text-gray-500 bg-white px-4 py-2 rounded-full border border-[#EAE6E1]">
                {filteredProducts.length} article(s) disponible(s)
              </p>
            </div>

            {/* Grille des produits */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-400 font-medium animate-pulse text-sm">Chargement de la collection...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#EAE6E1]">
                <p className="text-gray-400 text-sm">Aucun produit ne correspond à cette sélection.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-[24px] border border-[#EAE6E1] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image cliquable redirigeant vers la page de détail */}
                    <Link 
                      href={product.slug} 
                      className="relative block w-full h-[280px] bg-[#FDFBF9] overflow-hidden p-6 cursor-pointer"
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
                        {product.universe}
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
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                          <span className="text-[11px] text-gray-400 font-medium ml-1">
                            ({product.reviewsCount})
                          </span>
                        </div>
                        {/* Titre cliquable redirigeant vers la page de détail */}
                        <Link href={product.slug}>
                          <h3 className="font-bold text-[#333333] text-base leading-tight group-hover:text-[#6E857B] transition-colors line-clamp-2 hover:underline">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#EAE6E1] mt-2">
                        <span className="font-extrabold text-lg text-[#333333]">
                          {product.price}
                        </span>
                        <Link
                          href={product.slug}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#333333] text-white hover:bg-[#6E857B] transition-colors active:scale-95 text-xs font-semibold"
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