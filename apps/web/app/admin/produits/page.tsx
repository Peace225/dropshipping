"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createClient } from "@supabase/supabase-js";
import { Package, Search, Trash2, CheckCircle2, XCircle, Loader2, Save } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminProductsManagementPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Charger automatiquement tous les produits et leurs images
  const fetchAllProducts = async () => {
    setLoading(true);
    // Ajout de la jointure avec product_images
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_images (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des produits:", error);
    } else {
      setProducts(data || []);
      setFilteredProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Gestion de la recherche instantanée
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(query)) ||
          (p.sku && p.sku.toLowerCase().includes(query)) ||
          (p.supplier && p.supplier.toLowerCase().includes(query))
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Mettre à jour un produit (prix, stock, activation)
  const handleUpdateProduct = async (id: string, newPrice: number, newStock: number, isActive: boolean) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from("products")
      .update({
        price: newPrice,
        stock: newStock,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert("Erreur de mise à jour : " + error.message);
    } else {
      setProducts(
        products.map((p) => (p.id === id ? { ...p, price: newPrice, stock: newStock, is_active: isActive } : p))
      );
      alert("Produit mis à jour avec succès !");
    }
    setUpdatingId(null);
  };

  // Supprimer un produit
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet article de la base de données ?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
    } else {
      setProducts(products.filter((p) => p.id !== id));
      setFilteredProducts(filteredProducts.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#333333]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-[#6E857B]/10 text-[#6E857B]">
                <Package className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-[#333333]">
                Catalogue Général des Produits ({products.length})
              </h1>
            </div>
            <p className="text-xs text-[#333333]/60">
              Liste de l'ensemble des articles synchronisés depuis vos catalogues fournisseurs.
            </p>
          </div>
          <Link
            href="/admin/import"
            className="px-4 py-2.5 bg-[#6E857B] text-white rounded-xl text-xs font-bold hover:bg-[#5a6e66] transition-colors shadow-sm text-center"
          >
            + Importer un catalogue CSV
          </Link>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-2xl border border-[#333333]/10 p-4 shadow-sm flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Rechercher par nom de produit, référence SKU ou fournisseur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs focus:outline-none text-[#333333] bg-transparent"
          />
        </div>

        {/* Tableau des produits */}
        <div className="bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-7 h-7 animate-spin text-[#6E857B]" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <Package className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-sm font-medium text-gray-500">Aucun produit trouvé dans la base de données.</p>
              <Link href="/admin/import" className="text-xs font-bold text-[#6E857B] hover:underline block">
                Aller importer un fichier CSV fournisseur →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[#333333]/60 uppercase tracking-wider bg-gray-50/50">
                    <th className="p-3 font-bold">Visuel</th>
                    <th className="p-3 font-bold">Référence (SKU)</th>
                    <th className="p-3 font-bold">Nom du Produit</th>
                    <th className="p-3 font-bold">Fournisseur</th>
                    <th className="p-3 font-bold">Prix Vente (€)</th>
                    <th className="p-3 font-bold">Stock</th>
                    <th className="p-3 font-bold">Statut</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onUpdate={handleUpdateProduct}
                      onDelete={handleDeleteProduct}
                      isUpdating={updatingId === product.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

// Ligne individuelle modifiable
function ProductRow({ product, onUpdate, onDelete, isUpdating }: { product: any; onUpdate: any; onDelete: any; isUpdating: boolean }) {
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [isActive, setIsActive] = useState(product.is_active ?? true);

  // Récupération de l'image (jointe ou par défaut)
  const imageUrl = 
    (product.product_images && product.product_images.length > 0 && (product.product_images[0].url || product.product_images[0].image_url)) || 
    product.image_url;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="w-full h-full object-contain p-1" 
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <Package className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </td>
      <td className="p-3 font-mono text-gray-500 font-semibold">{product.sku || "N/A"}</td>
      <td className="p-3 font-bold text-[#333333] max-w-xs">
        <span className="line-clamp-2">{product.name}</span>
      </td>
      <td className="p-3 uppercase text-[10px] font-bold text-[#6E857B]">
        {product.supplier || "interne"}
      </td>
      
      {/* Modification directe du prix */}
      <td className="p-3">
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          className="px-2 py-1 rounded-lg border border-gray-300 w-20 text-xs font-extrabold bg-white text-[#333333]"
        />
      </td>

      {/* Modification directe du stock */}
      <td className="p-3">
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value) || 0)}
          className="px-2 py-1 rounded-lg border border-gray-300 w-16 text-xs font-bold bg-white text-[#333333]"
        />
      </td>

      {/* Statut Actif / Masqué */}
      <td className="p-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
            isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {isActive ? "Actif" : "Masqué"}
        </button>
      </td>

      {/* Actions */}
      <td className="p-3 text-right space-x-2">
        <button
          onClick={() => onUpdate(product.id, price, stock, isActive)}
          disabled={isUpdating}
          className="px-3 py-1.5 bg-[#6E857B] text-white rounded-lg hover:bg-[#5a6e66] transition-colors font-bold inline-flex items-center gap-1 text-xs disabled:opacity-50 shadow-sm"
        >
          {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Enregistrer
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors inline-flex items-center justify-center"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}