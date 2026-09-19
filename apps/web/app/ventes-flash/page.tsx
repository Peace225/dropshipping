"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock3,
  Star,
  ShoppingBag,
  SlidersHorizontal,
  ChevronDown,
  Search,
  Check,
  Zap,
  X,
  RotateCcw,
} from "lucide-react";

const FLASH_SLOTS = [
  { id: "current", label: "En ce moment", status: "Termine dans", time: "01:46:53", active: true },
  { id: "slot-1", label: "Aujourd'hui 18:00", status: "À venir", time: "18:00", active: false },
  { id: "slot-2", label: "Demain 09:00", status: "À venir", time: "09:00", active: false },
  { id: "slot-3", label: "Demain 14:00", status: "À venir", time: "14:00", active: false },
];

const FLASH_PRODUCTS = [
  {
    id: 1,
    universe: "Maman",
    universeColor: "bg-[#E8C5C8]",
    universeText: "text-[#333333]",
    name: "Coffret Maternité Essentiel",
    category: "Grossesse & Post-Partum",
    price: "49,00 €",
    oldPrice: "69,00 €",
    discount: "-29%",
    rating: 5,
    reviewsCount: 24,
    image: "/images/slide-1.jpg",
    slug: "/ventes-flash",
    stockLeft: 7,
    stockTotal: 30,
  },
  {
    id: 2,
    universe: "Bébé",
    universeColor: "bg-[#6E857B]",
    universeText: "text-white",
    name: "Porte-Bébé Ergonomique Physiolock",
    category: "Soins & Tendresse",
    price: "89,00 €",
    oldPrice: "119,00 €",
    discount: "-25%",
    rating: 5,
    reviewsCount: 42,
    image: "/images/slide-2.png",
    slug: "/ventes-flash",
    stockLeft: 3,
    stockTotal: 25,
  },
  {
    id: 3,
    universe: "Maman",
    universeColor: "bg-[#E8C5C8]",
    universeText: "text-[#333333]",
    name: "Huile Sèche Apaisante Post-Partum",
    category: "Bien-être & Vergetures",
    price: "29,00 €",
    oldPrice: "39,00 €",
    discount: "-26%",
    rating: 4,
    reviewsCount: 18,
    image: "/images/slide-3.png",
    slug: "/ventes-flash",
    stockLeft: 18,
    stockTotal: 50,
  },
  {
    id: 4,
    universe: "Bébé",
    universeColor: "bg-[#6E857B]",
    universeText: "text-white",
    name: "Coussin d'Allaitement Bio Coton",
    category: "Allaitement & Confort",
    price: "45,00 €",
    oldPrice: "59,00 €",
    discount: "-24%",
    rating: 5,
    reviewsCount: 15,
    image: "/images/slide-7.jpg",
    slug: "/ventes-flash",
    stockLeft: 12,
    stockTotal: 40,
  },
  {
    id: 5,
    universe: "Bébé",
    universeColor: "bg-[#6E857B]",
    universeText: "text-white",
    name: "Biberon Anti-Colique en Verre 240ml",
    category: "Repas & Repos",
    price: "19,00 €",
    oldPrice: "26,00 €",
    discount: "-27%",
    rating: 5,
    reviewsCount: 31,
    image: "/images/slide-1.jpg",
    slug: "/ventes-flash",
    stockLeft: 5,
    stockTotal: 20,
  },
  {
    id: 6,
    universe: "Maman",
    universeColor: "bg-[#E8C5C8]",
    universeText: "text-[#333333]",
    name: "Baume de Massage Relaxant Bio",
    category: "Soins & Tendresse",
    price: "22,00 €",
    oldPrice: "32,00 €",
    discount: "-31%",
    rating: 4,
    reviewsCount: 9,
    image: "/images/slide-2.png",
    slug: "/ventes-flash",
    stockLeft: 22,
    stockTotal: 60,
  },
];

const CATEGORIES = [
  "Tous les produits",
  "Grossesse & Post-Partum",
  "Soins & Tendresse",
  "Allaitement & Confort",
  "Bien-être & Vergetures",
  "Repas & Repos",
];

const DISCOUNT_OPTIONS = [
  { label: "Toutes les offres", value: 0 },
  { label: "10% et plus", value: 10 },
  { label: "20% et plus", value: 20 },
  { label: "30% et plus", value: 30 },
];

export default function VentesFlashPage() {
  // États de filtrage et de recherche
  const [selectedSlot, setSelectedSlot] = useState("current");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tous les produits");
  const [searchQuery, setSearchQuery] = useState("");
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState("Les plus demandés");

  // Fonction de réinitialisation globale
  const handleResetFilters = () => {
    setSelectedCategory("Tous les produits");
    setSearchQuery("");
    setMinDiscount(0);
    setMinRating(0);
    setSortBy("Les plus demandés");
  };

  const handleAddToCart = (product: (typeof FLASH_PRODUCTS)[number]) => {
    alert(`« ${product.name} » a été ajouté à votre panier.`);
  };

  // Filtrage et Tri dynamique
  const filteredProducts = useMemo(() => {
    return FLASH_PRODUCTS.filter((product) => {
      // 1. Filtrage par Catégorie
      if (
        selectedCategory !== "Tous les produits" &&
        product.category !== selectedCategory
      ) {
        return false;
      }

      // 2. Filtrage par Recherche textuelle
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchCategory = product.category.toLowerCase().includes(query);
        if (!matchName && !matchCategory) return false;
      }

      // 3. Filtrage par Remise Minimale
      if (minDiscount > 0) {
        const discountVal =
          Math.abs(
            parseInt(product.discount.replace("%", "").replace("-", ""), 10)
          ) || 0;
        if (discountVal < minDiscount) return false;
      }

      // 4. Filtrage par Note Minimale
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Helper pour convertir le prix "49,00 €" en number 49.00
      const getNumericPrice = (p: string) =>
        parseFloat(p.replace(",", ".").replace(/[^\d.]/g, ""));

      // Helper pour convertir la remise "-29%" en number 29
      const getNumericDiscount = (d: string) =>
        Math.abs(parseInt(d.replace("%", "").replace("-", ""), 10)) || 0;

      if (sortBy === "Prix : Croissant") {
        return getNumericPrice(a.price) - getNumericPrice(b.price);
      }
      if (sortBy === "Prix : Décroissant") {
        return getNumericPrice(b.price) - getNumericPrice(a.price);
      }
      if (sortBy === "Meilleures remises") {
        return getNumericDiscount(b.discount) - getNumericDiscount(a.discount);
      }
      return 0; // "Les plus demandés" (ordre par défaut)
    });
  }, [selectedCategory, searchQuery, minDiscount, minRating, sortBy]);

  const hasActiveFilters =
    selectedCategory !== "Tous les produits" ||
    searchQuery !== "" ||
    minDiscount > 0 ||
    minRating > 0;

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#333333]">
      {/* HEADER DE PAGE */}
      <div className="border-b border-[#333333]/10 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4A396] text-white">
                  <Zap className="h-3.5 w-3.5 fill-current" />
                </span>
                <h1 className="text-xl font-bold tracking-tight text-[#333333] sm:text-2xl">
                  Ventes Flash AURAE
                </h1>
              </div>
              <p className="mt-1 text-xs text-[#333333]/60">
                Offres exclusives à durée et stock limités.
              </p>
            </div>

            {/* BREADCRUMB */}
            <nav className="text-xs text-[#333333]/50">
              <Link href="/" className="hover:text-[#333333]">
                Accueil
              </Link>
              <span className="mx-2">/</span>
              <span className="font-semibold text-[#333333]">Ventes Flash</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* =====================================================
              SIDEBAR : FILTRES (GAUCHE)
          ====================================================== */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-72 transform overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 lg:static lg:z-0 lg:w-64 lg:shrink-0 lg:translate-x-0 lg:overflow-visible lg:rounded-2xl lg:border lg:border-[#333333]/10 lg:p-5 lg:shadow-none ${
              showMobileFilters
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            {/* ENTÊTE SIDEBAR */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#333333]">
                Filtres
              </h2>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#D4A396] transition-colors hover:text-[#333333]"
                >
                  <RotateCcw className="h-3 w-3" />
                  Effacer
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="rounded-lg p-1 text-[#333333]/60 hover:bg-gray-100 lg:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* CATEGORIES */}
            <div className="mb-6">
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#333333]/60">
                Catégorie
              </h3>
              <ul className="space-y-1 text-xs">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowMobileFilters(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${
                        selectedCategory === cat
                          ? "bg-[#F5EBE6] font-semibold text-[#333333]"
                          : "text-[#333333]/70 hover:bg-gray-50 hover:text-[#333333]"
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && (
                        <Check className="h-3.5 w-3.5 text-[#D4A396]" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="my-5 border-[#333333]/10" />

            {/* MARQUE / RECHERCHE */}
            <div className="mb-6">
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#333333]/60">
                Rechercher
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Chercher un produit..."
                  className="w-full rounded-xl border border-[#333333]/15 bg-white py-2 pl-9 pr-8 text-xs text-[#333333] placeholder-[#333333]/40 focus:border-[#D4A396] focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#333333]/40" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-[#333333]/40 hover:text-[#333333]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <hr className="my-5 border-[#333333]/10" />

            {/* REMISES (%) */}
            <div className="mb-6">
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#333333]/60">
                Remise minimale
              </h3>
              <div className="space-y-2 text-xs">
                {DISCOUNT_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-2.5 text-[#333333]/80 transition-colors hover:text-[#333333]"
                  >
                    <input
                      type="radio"
                      name="discount"
                      checked={minDiscount === opt.value}
                      onChange={() => setMinDiscount(opt.value)}
                      className="h-3.5 w-3.5 accent-[#6E857B]"
                    />
                    <span
                      className={
                        minDiscount === opt.value ? "font-semibold text-[#333333]" : ""
                      }
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="my-5 border-[#333333]/10" />

            {/* ÉVALUATION */}
            <div>
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#333333]/60">
                Avis Clients
              </h3>
              <div className="space-y-1.5">
                {[5, 4].map((stars) => {
                  const isActive = minRating === stars;
                  return (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setMinRating(isActive ? 0 : stars)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors ${
                        isActive
                          ? "bg-[#F5EBE6] font-semibold text-[#333333]"
                          : "text-[#333333]/80 hover:bg-gray-50 hover:text-[#333333]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: stars }, (_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 fill-current text-[#D4A396]"
                            />
                          ))}
                        </div>
                        <span className="text-xs">et plus</span>
                      </div>
                      {isActive && (
                        <Check className="h-3.5 w-3.5 text-[#D4A396]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* OVERLAY MOBILE */}
          {showMobileFilters && (
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
          )}

          {/* =====================================================
              SECTION PRINCIPALE (DROITE)
          ====================================================== */}
          <div className="min-w-0 flex-1">
            {/* BANNIÈRE DE VENTE FLASH ET BANDEAU CRÉNEAUX */}
            <div className="overflow-hidden rounded-2xl border border-[#333333]/10 bg-white shadow-sm">
              {/* HEADER SOMBRE AURAE */}
              <div className="bg-[#333333] p-4 text-white sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4A396] text-white">
                      <Zap className="h-4 w-4 fill-current" />
                    </span>
                    <div>
                      <h2 className="text-base font-bold sm:text-lg">
                        Ventes Flash en cours
                      </h2>
                      <p className="text-[11px] text-white/70">
                        {filteredProducts.length} offre(s) disponible(s)
                      </p>
                    </div>
                  </div>

                  {/* COMPTE À REBOURS */}
                  <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-sm">
                    <Clock3 className="h-4 w-4 text-[#D4A396]" />
                    <span className="text-xs text-white/80">Termine dans :</span>
                    <span className="font-mono text-sm font-bold tracking-wider text-white">
                      01h : 46m : 53s
                    </span>
                  </div>
                </div>
              </div>

              {/* TABS DE CRÉNEAUX HORAIRES */}
              <div className="flex overflow-x-auto border-b border-[#333333]/10 bg-[#F5EBE6]/50 [scrollbar-width:none]">
                {FLASH_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`flex min-w-[140px] flex-1 flex-col items-center border-b-2 px-4 py-3 text-center transition-all ${
                      selectedSlot === slot.id
                        ? "border-[#D4A396] bg-white font-bold text-[#333333]"
                        : "border-transparent text-[#333333]/60 hover:text-[#333333]"
                    }`}
                  >
                    <span className="text-xs">{slot.label}</span>
                    <span className="mt-0.5 text-[10px] font-medium text-[#6E857B]">
                      {slot.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* BARRE DE FILTRES MOBILES ET TRI */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#333333]/15 bg-white px-3.5 py-2 text-xs font-semibold text-[#333333] lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filtres
                {hasActiveFilters && (
                  <span className="h-2 w-2 rounded-full bg-[#D4A396]" />
                )}
              </button>

              <p className="hidden text-xs text-[#333333]/60 sm:block">
                Affichage de{" "}
                <span className="font-bold text-[#333333]">
                  {filteredProducts.length}
                </span>{" "}
                résultat(s)
              </p>

              {/* TRI DYNAMIQUE */}
              <div className="ml-auto flex items-center gap-2">
                <span className="hidden text-xs text-[#333333]/60 sm:inline">
                  Trier par :
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-xl border border-[#333333]/15 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-[#333333] focus:outline-none"
                  >
                    <option value="Les plus demandés">Les plus demandés</option>
                    <option value="Prix : Croissant">Prix : Croissant</option>
                    <option value="Prix : Décroissant">Prix : Décroissant</option>
                    <option value="Meilleures remises">Meilleures remises</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-[#333333]/50" />
                </div>
              </div>
            </div>

            {/* =====================================================
                GRILLE DES PRODUITS FLASH
            ====================================================== */}
            {filteredProducts.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => {
                  const stockPercentage = Math.round(
                    ((product.stockTotal - product.stockLeft) /
                      product.stockTotal) *
                      100
                  );

                  return (
                    <article
                      key={product.id}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#333333]/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* LIEN DE REDIRECTION SUR TOUTE LA CARTE */}
                      <Link
                        href={product.slug}
                        className="absolute inset-0 z-10"
                        aria-label={`Voir les détails de ${product.name}`}
                      />

                      {/* BADGE REMISE */}
                      <span className="absolute left-3 top-3 z-20 rounded-full bg-[#333333] px-2.5 py-1 text-[9px] font-bold tracking-wide text-white">
                        {product.discount}
                      </span>

                      {/* BADGE UNIVERS */}
                      <span
                        className={`absolute right-3 top-3 z-20 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${product.universeColor} ${product.universeText}`}
                      >
                        {product.universe}
                      </span>

                      {/* IMAGE */}
                      <div className="relative block aspect-square w-full overflow-hidden bg-[#F5EBE6]/45">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                          className="object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>

                      {/* INFORMATIONS */}
                      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                        <p className="mb-1 line-clamp-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6E857B]">
                          {product.category}
                        </p>

                        <h3 className="line-clamp-2 min-h-[36px] text-xs font-semibold leading-4 text-[#333333] transition-colors group-hover:text-[#6E857B]">
                          {product.name}
                        </h3>

                        {/* ÉTOILES */}
                        <div className="mt-2 flex items-center gap-1">
                          <div className="flex items-center gap-0.5">
                            {Array.from(
                              { length: product.rating },
                              (_, index) => (
                                <Star
                                  key={index}
                                  className="h-3 w-3 fill-current text-[#D4A396]"
                                />
                              )
                            )}
                          </div>
                          <span className="text-[10px] text-[#333333]/40">
                            ({product.reviewsCount})
                          </span>
                        </div>

                        {/* PRIX */}
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="text-base font-bold text-[#333333]">
                            {product.price}
                          </span>
                          <span className="text-xs text-[#333333]/40 line-through">
                            {product.oldPrice}
                          </span>
                        </div>

                        {/* JAUGE DE STOCK */}
                        <div className="mt-3">
                          <div className="mb-1 flex items-center justify-between text-[10px] font-medium text-[#333333]/70">
                            <span>Stock restant</span>
                            <span className="font-bold text-[#D4A396]">
                              {product.stockLeft} articles
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#333333]/10">
                            <div
                              className="h-full rounded-full bg-[#D4A396] transition-all duration-500"
                              style={{ width: `${stockPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* BOUTON D'AJOUT PANIER */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          aria-label={`Ajouter ${product.name} au panier`}
                          className="relative z-20 mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#333333] py-2.5 text-xs font-semibold text-white transition-all hover:bg-[#D4A396] active:scale-95"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Ajouter au panier
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* ÉTAT AUCUN RÉSULTAT */
              <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#333333]/20 bg-white p-12 text-center">
                <p className="text-sm font-semibold text-[#333333]">
                  Aucun produit ne correspond à vos critères de recherche.
                </p>
                <p className="mt-1 text-xs text-[#333333]/60">
                  Essayez de modifier ou de réinitialiser vos filtres.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#333333] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#D4A396]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}