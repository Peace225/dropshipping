"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createClient } from "@supabase/supabase-js";
import { Package, Trash2, Loader2, CheckCircle2, XCircle, ExternalLink, Plus, Save, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminProductsMamanPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  // État du formulaire avec les 3 champs images
  const [newProduct, setNewProduct] = useState({ 
    name: "", sku: "", price: 0, stock: 0, 
    image1: "", image2: "", image3: "" 
  });

  // 1. Charger et filtrer les produits Maman en JavaScript
  const fetchMamanProducts = async () => {
    setLoading(true);
    
    // Récupération globale avec jointure des images
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_images (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des produits Maman:", error);
    } else if (data) {
      // Filtrage Javascript ciblé sur l'univers Maman
      const mamanProducts = data.filter(p => {
        const name = (p.name || "").toLowerCase();
        const cat = String(p.category || p.category_id || "").toLowerCase(); 
        
        return (
          cat.includes("maman") || cat.includes("grossesse") || cat.includes("maternité") || cat.includes("maternite") ||
          name.includes("maman") || name.includes("grossesse") || 
          name.includes("post-partum") || name.includes("serum") || name.includes("crème") || name.includes("creme") || name.includes("allaitement")
        );
      });
      
      setProducts(mamanProducts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMamanProducts();
  }, []);

  // 2. Sauvegarde en 2 étapes (Le produit d'abord, les images ensuite)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku) return alert("Veuillez remplir le nom et la référence (SKU).");

    setIsAdding(true);
    
    // ÉTAPE 1 : Créer le produit (Catégorie Maman)
    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert([{
        name: newProduct.name,
        sku: newProduct.sku,
        price: newProduct.price,
        stock: newProduct.stock,
        category: "Maman", 
        is_active: true,
      }])
      .select();

    if (productError) {
      alert("Erreur lors de l'ajout du produit : " + productError.message);
      setIsAdding(false);
      return;
    }

    const newProductId = productData[0].id;

    // ÉTAPE 2 : Ajouter les images dans product_images
    const imagesToInsert = [];
    if (newProduct.image1) imagesToInsert.push({ product_id: newProductId, image_url: newProduct.image1 });
    if (newProduct.image2) imagesToInsert.push({ product_id: newProductId, image_url: newProduct.image2 });
    if (newProduct.image3) imagesToInsert.push({ product_id: newProductId, image_url: newProduct.image3 });

    if (imagesToInsert.length > 0) {
      const { error: imageError } = await supabase
        .from("product_images")
        .insert(imagesToInsert);
        
      if (imageError) console.error("Erreur sauvegarde images:", imageError);
    }

    // ÉTAPE 3 : Récupérer le produit complet pour l'afficher instantanément
    const { data: finalProductData } = await supabase
      .from("products")
      .select('*, product_images(*)')
      .eq('id', newProductId)
      .single();

    if (finalProductData) {
      setProducts([finalProductData, ...products]);
      setNewProduct({ name: "", sku: "", price: 0, stock: 0, image1: "", image2: "", image3: "" }); 
      setShowAddForm(false);
      alert("Produit Maman et ses images ajoutés avec succès !");
    }
    
    setIsAdding(false);
  };

  // 3. Mettre à jour un produit
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
    }
    setUpdatingId(null);
  };

  // 4. Supprimer un produit
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet article ? Cette action est irréversible.")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
    } else {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* En-tête avec bouton d'ajout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#333333]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-[#D4A396]/20 text-[#333333]">
                <Package className="w-5 h-5 text-[#D4A396]" />
              </span>
              <h1 className="text-xl font-bold text-[#333333]">
                Gestion Univers Maman (Accueil & Catalogue)
              </h1>
            </div>
            <p className="text-xs text-[#333333]/60">
              Les modifications ou suppressions effectuées ici s'appliquent en temps réel sur la vitrine.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#333333] rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <span>Voir l'accueil</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-[#D4A396] text-white hover:bg-[#c39184] rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showAddForm ? "Fermer" : "Ajouter un produit Maman"}</span>
            </button>
          </div>
        </div>

        {/* Formulaire d'ajout rapide */}
        {showAddForm && (
          <div className="bg-white rounded-2xl border border-[#D4A396]/30 p-6 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-sm font-bold text-[#333333] mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#D4A396]" />
              Nouveau Produit Maman
            </h2>
            
            <form onSubmit={handleAddProduct}>
              {/* Ligne 1 : Infos principales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Nom du produit *</label>
                  <input
                    type="text" required
                    value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:border-[#D4A396]"
                    placeholder="Ex: Sérum anti-vergetures bio..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">SKU (Réf) *</label>
                  <input
                    type="text" required
                    value={newProduct.sku} onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:border-[#D4A396]"
                    placeholder="Ex: MAMAN-001"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Prix & Stock</label>
                  <div className="flex gap-2">
                    <input
                      type="number" step="0.01" placeholder="Prix €"
                      value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                      className="w-1/2 px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none focus:border-[#D4A396]"
                    />
                    <input
                      type="number" placeholder="Qté"
                      value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                      className="w-1/2 px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none focus:border-[#D4A396]"
                    />
                  </div>
                </div>
              </div>

              {/* Ligne 2 : Liens des 3 images */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-3 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Galerie d'images (Liens HTTPS)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="url"
                    value={newProduct.image1} onChange={(e) => setNewProduct({...newProduct, image1: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#D4A396]"
                    placeholder="Lien Image Principale (https://...)"
                  />
                  <input
                    type="url"
                    value={newProduct.image2} onChange={(e) => setNewProduct({...newProduct, image2: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#D4A396]"
                    placeholder="Lien Image 2 (Optionnel)"
                  />
                  <input
                    type="url"
                    value={newProduct.image3} onChange={(e) => setNewProduct({...newProduct, image3: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#D4A396]"
                    placeholder="Lien Image 3 (Optionnel)"
                  />
                </div>
              </div>

              {/* Bouton de sauvegarde */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-6 py-2.5 bg-[#333333] text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2 font-bold text-xs disabled:opacity-50"
                >
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isAdding ? "Création en cours..." : "Enregistrer le produit et les images"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tableau des produits avec Images */}
        <div className="bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-7 h-7 animate-spin text-[#D4A396]" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <Package className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-sm font-medium text-gray-500">Aucun produit trouvé pour l'univers Maman.</p>
              <button onClick={() => setShowAddForm(true)} className="text-xs font-bold text-[#D4A396] hover:underline block mx-auto">
                Ajouter le premier produit manuellement →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[#333333]/60 uppercase tracking-wider bg-gray-50/50">
                    <th className="p-3 font-bold">Visuel</th>
                    <th className="p-3 font-bold">Référence (SKU)</th>
                    <th className="p-3 font-bold">Nom du Produit</th>
                    <th className="p-3 font-bold">Prix (€)</th>
                    <th className="p-3 font-bold">Stock</th>
                    <th className="p-3 font-bold">Vitrine Accueil</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((product) => {
                    
                    const imageUrl = 
                      (product.product_images && product.product_images.length > 0 && (product.product_images[0].url || product.product_images[0].image_url)) || 
                      product.image_url;

                    return (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                            {imageUrl ? (
                              <img 
                                src={imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <Package className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </td>

                        <td className="p-3 font-mono text-gray-500 font-semibold">{product.sku || "N/A"}</td>
                        <td className="p-3 font-bold text-[#333333] max-w-xs">{product.name}</td>
                        
                        <td className="p-3">
                          <input
                            type="number"
                            step="0.01"
                            defaultValue={product.price}
                            onBlur={(e) => handleUpdateProduct(product.id, parseFloat(e.target.value) || 0, product.stock, product.is_active ?? true)}
                            className="px-2.5 py-1.5 rounded-lg border border-gray-300 w-20 text-xs font-extrabold bg-white text-[#333333] focus:border-[#D4A396] focus:outline-none"
                          />
                        </td>

                        <td className="p-3">
                          <input
                            type="number"
                            defaultValue={product.stock}
                            onBlur={(e) => handleUpdateProduct(product.id, product.price, parseInt(e.target.value) || 0, product.is_active ?? true)}
                            className="px-2.5 py-1 rounded-lg border border-gray-300 w-16 text-xs font-bold bg-white text-[#333333] focus:border-[#D4A396] focus:outline-none"
                          />
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() => handleUpdateProduct(product.id, product.price, product.stock, !(product.is_active ?? true))}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 transition-colors ${
                              product.is_active !== false 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" 
                                : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                            }`}
                          >
                            {product.is_active !== false ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {product.is_active !== false ? "Affiché" : "Masqué"}
                          </button>
                        </td>

                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors inline-flex items-center gap-1 text-xs font-bold"
                            title="Supprimer définitivement"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Supprimer</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}