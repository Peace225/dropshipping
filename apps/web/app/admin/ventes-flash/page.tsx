"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createClient } from "@supabase/supabase-js";
import { Zap, Trash2, Loader2, Plus, Save, X, Clock, Package } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminVentesFlashPage() {
  const [flashSales, setFlashSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour l'ajout
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newSale, setNewSale] = useState({ 
    product_id: "", 
    discount_price: 0, 
    end_date: "" 
  });

  // 1. Charger les ventes flash ET les produits disponibles
  const fetchData = async () => {
    setLoading(true);
    
    // Récupération des produits pour le menu déroulant
    const { data: productsData } = await supabase
      .from("products")
      .select("id, name, price")
      .eq("is_active", true)
      .order("name", { ascending: true });
      
    if (productsData) setProducts(productsData);

    // Récupération des ventes flash (nécessite une table "flash_sales" dans Supabase)
    const { data: salesData, error } = await supabase
      .from("flash_sales")
      .select(`
        *,
        products (name, price, image_url, product_images(url))
      `)
      .order("end_date", { ascending: true });

    if (error) {
      console.error("Erreur chargement ventes flash (vérifiez que la table existe):", error);
    } else {
      setFlashSales(salesData || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Ajouter une vente flash
  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSale.product_id || !newSale.end_date || newSale.discount_price <= 0) {
      return alert("Veuillez remplir tous les champs correctement.");
    }

    setIsAdding(true);
    const { data, error } = await supabase
      .from("flash_sales")
      .insert([newSale])
      .select('*, products(name, price, image_url, product_images(url))');

    if (error) {
      alert("Erreur lors de l'ajout : " + error.message);
    } else if (data) {
      setFlashSales([...flashSales, data[0]]);
      setNewSale({ product_id: "", discount_price: 0, end_date: "" });
      setShowAddForm(false);
      alert("Vente flash activée !");
    }
    setIsAdding(false);
  };

  // 3. Supprimer une vente flash
  const handleDeleteSale = async (id: string) => {
    if (!confirm("Voulez-vous vraiment annuler cette vente flash ?")) return;

    const { error } = await supabase.from("flash_sales").delete().eq("id", id);
    if (error) {
      alert("Erreur lors de l'annulation : " + error.message);
    } else {
      setFlashSales(flashSales.filter((s) => s.id !== id));
    }
  };

  // Fonction pour calculer le temps restant
  const getRemainingTime = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const distance = end - now;
    
    if (distance < 0) return "Terminé";
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}j ${hours}h restants`;
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#333333]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-[#D4A396]/20 text-[#D4A396]">
                <Zap className="w-5 h-5 fill-current" />
              </span>
              <h1 className="text-xl font-bold text-[#333333]">
                Ventes Flash & Promotions
              </h1>
            </div>
            <p className="text-xs text-[#333333]/60">
              Programmez des réductions à durée limitée pour booster vos ventes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-[#F5EBE6] text-[#333333] text-xs font-bold rounded-xl border border-[#333333]/5">
              {flashSales.length} offre(s) active(s)
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-[#D4A396] text-[#333333] hover:bg-[#c39184] rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showAddForm ? "Fermer" : "Nouvelle Vente Flash"}</span>
            </button>
          </div>
        </div>

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="bg-white rounded-2xl border border-[#D4A396]/40 p-6 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-sm font-bold text-[#333333] mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#D4A396]" />
              Créer une nouvelle vente flash
            </h2>
            <form onSubmit={handleAddSale} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Produit concerné *</label>
                  <select
                    required
                    value={newSale.product_id}
                    onChange={(e) => setNewSale({...newSale, product_id: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-[#333333] focus:outline-none focus:border-[#D4A396] bg-white"
                  >
                    <option value="">-- Sélectionner un produit --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Prix normal: {p.price}€)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Prix Flash (€) *</label>
                  <input
                    type="number" step="0.01" required
                    value={newSale.discount_price}
                    onChange={(e) => setNewSale({...newSale, discount_price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-[#333333] focus:outline-none focus:border-[#D4A396]"
                    placeholder="Nouveau prix cassé"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Date et heure de fin *</label>
                  <input
                    type="datetime-local" required
                    value={newSale.end_date}
                    onChange={(e) => setNewSale({...newSale, end_date: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-[#333333] focus:outline-none focus:border-[#D4A396]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-6 py-2.5 bg-[#333333] text-white rounded-xl hover:bg-black transition-colors flex items-center gap-2 font-bold text-xs disabled:opacity-50"
                >
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isAdding ? "Activation..." : "Activer la vente flash"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des Ventes Flash */}
        <div className="bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-7 h-7 animate-spin text-[#D4A396]" />
            </div>
          ) : flashSales.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <Zap className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-sm font-medium text-gray-500">Aucune vente flash n'est active actuellement.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[#333333]/60 uppercase tracking-wider bg-gray-50/50">
                    <th className="p-3 font-bold">Produit</th>
                    <th className="p-3 font-bold">Ancien Prix</th>
                    <th className="p-3 font-bold">Prix Flash</th>
                    <th className="p-3 font-bold">Fin de l'offre</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {flashSales.map((sale) => {
                    const product = sale.products;
                    const isExpired = new Date(sale.end_date).getTime() < new Date().getTime();

                    return (
                      <tr key={sale.id} className={`transition-colors ${isExpired ? "bg-gray-50 opacity-60" : "hover:bg-gray-50"}`}>
                        <td className="p-3 font-bold text-[#333333] flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
                            {product?.image_url || (product?.product_images && product.product_images.length > 0) ? (
                              <img 
                                src={product?.product_images?.[0]?.url || product.image_url} 
                                alt={product?.name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <Package className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <span className="max-w-[200px] truncate">{product?.name || "Produit inconnu"}</span>
                        </td>
                        <td className="p-3 text-gray-400 line-through">
                          {product?.price} €
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-lg bg-[#D4A396]/20 text-[#c35b3f] font-extrabold text-[11px]">
                            {sale.discount_price} €
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <Clock className={`w-3.5 h-3.5 ${isExpired ? 'text-gray-400' : 'text-amber-500'}`} />
                            <span className={`font-semibold ${isExpired ? 'text-gray-400' : 'text-[#333333]'}`}>
                              {getRemainingTime(sale.end_date)}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteSale(sale.id)}
                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors inline-flex items-center justify-center"
                            title="Annuler cette offre"
                          >
                            <Trash2 className="w-4 h-4" />
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