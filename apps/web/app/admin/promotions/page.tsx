"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createClient } from "@supabase/supabase-js";
import { Tag, Trash2, Loader2, Plus, Save, X, CalendarDays, CheckCircle2, XCircle } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour le formulaire d'ajout
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newPromo, setNewPromo] = useState({ 
    code: "", 
    discount_type: "percentage", // ou "fixed"
    discount_value: 0, 
    end_date: "" 
  });

  // 1. Charger les promotions
  const fetchPromotions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur chargement des promotions:", error);
    } else {
      setPromotions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  // Formatage automatique du code promo (MAJUSCULES sans espaces)
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase().replace(/\s+/g, "");
    setNewPromo({ ...newPromo, code });
  };

  // 2. Ajouter une promotion
  const handleAddPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code || newPromo.discount_value <= 0 || !newPromo.end_date) {
      return alert("Veuillez remplir tous les champs correctement.");
    }

    setIsAdding(true);
    const { data, error } = await supabase
      .from("promotions")
      .insert([{
        code: newPromo.code,
        discount_type: newPromo.discount_type,
        discount_value: newPromo.discount_value,
        end_date: newPromo.end_date,
        is_active: true
      }])
      .select();

    if (error) {
      alert("Erreur lors de la création : Ce code existe peut-être déjà !");
    } else if (data) {
      setPromotions([data[0], ...promotions]);
      setNewPromo({ code: "", discount_type: "percentage", discount_value: 0, end_date: "" });
      setShowAddForm(false);
      alert("Code promo créé avec succès !");
    }
    setIsAdding(false);
  };

  // 3. Supprimer une promotion
  const handleDeletePromotion = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce code promo ?")) return;

    const { error } = await supabase.from("promotions").delete().eq("id", id);
    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
    } else {
      setPromotions(promotions.filter((p) => p.id !== id));
    }
  };

  // 4. Activer / Désactiver un code
  const togglePromoStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("promotions")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (!error) {
      setPromotions(promotions.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
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
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Tag className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-[#333333]">
                Promotions & Coupons
              </h1>
            </div>
            <p className="text-xs text-[#333333]/60">
              Créez des codes de réduction pour vos clientes (soldes, influenceurs, fidélité).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-[#F5EBE6] text-[#333333] text-xs font-bold rounded-xl border border-[#333333]/5">
              {promotions.length} code(s) actif(s)
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-[#333333] text-white hover:bg-black rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showAddForm ? "Fermer" : "Nouveau Code Promo"}</span>
            </button>
          </div>
        </div>

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="bg-white rounded-2xl border border-[#333333]/20 p-6 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-sm font-bold text-[#333333] mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              Créer un nouveau coupon
            </h2>
            <form onSubmit={handleAddPromotion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Code Promo *</label>
                  <input
                    type="text" required
                    value={newPromo.code}
                    onChange={handleCodeChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-[#333333] focus:outline-none focus:border-indigo-500"
                    placeholder="Ex: BIENVENUE10"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Type de réduction *</label>
                  <select
                    value={newPromo.discount_type}
                    onChange={(e) => setNewPromo({...newPromo, discount_type: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-[#333333] focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Valeur *</label>
                  <input
                    type="number" step="0.01" required
                    value={newPromo.discount_value}
                    onChange={(e) => setNewPromo({...newPromo, discount_value: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-[#333333] focus:outline-none focus:border-indigo-500"
                    placeholder={newPromo.discount_type === 'percentage' ? "Ex: 15 (%)" : "Ex: 10 (€)"}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Date d'expiration *</label>
                  <input
                    type="date" required
                    value={newPromo.end_date}
                    onChange={(e) => setNewPromo({...newPromo, end_date: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-[#333333] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 font-bold text-xs disabled:opacity-50"
                >
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isAdding ? "Création en cours..." : "Enregistrer le code promo"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des codes promo */}
        <div className="bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <Tag className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-sm font-medium text-gray-500">Aucun code promo n'est actif actuellement.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[#333333]/60 uppercase tracking-wider bg-gray-50/50">
                    <th className="p-3 font-bold">Code Promo</th>
                    <th className="p-3 font-bold">Réduction</th>
                    <th className="p-3 font-bold">Date d'expiration</th>
                    <th className="p-3 font-bold">Statut</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {promotions.map((promo) => {
                    const isExpired = new Date(promo.end_date).getTime() < new Date().getTime();

                    return (
                      <tr key={promo.id} className={`transition-colors ${isExpired ? "bg-gray-50 opacity-60" : "hover:bg-gray-50"}`}>
                        <td className="p-3 font-black text-[#333333] tracking-wider">
                          <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200">
                            {promo.code}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-indigo-600">
                          {promo.discount_type === "percentage" 
                            ? `- ${promo.discount_value} %` 
                            : `- ${promo.discount_value} €`}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className={`w-3.5 h-3.5 ${isExpired ? 'text-gray-400' : 'text-[#333333]'}`} />
                            <span className={isExpired ? 'text-gray-400' : 'text-[#333333]'}>
                              {new Date(promo.end_date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => togglePromoStatus(promo.id, promo.is_active)}
                            disabled={isExpired}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 transition-colors ${
                              isExpired 
                                ? "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed" 
                                : promo.is_active 
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" 
                                  : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                            }`}
                          >
                            {isExpired ? <XCircle className="w-3 h-3" /> : promo.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {isExpired ? "Expiré" : promo.is_active ? "Actif" : "Désactivé"}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeletePromotion(promo.id)}
                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors inline-flex items-center justify-center"
                            title="Supprimer ce code"
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