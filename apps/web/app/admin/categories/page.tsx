"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createClient } from "@supabase/supabase-js";
import { Layers, Trash2, Loader2, Plus, Save, X, Tag } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour l'ajout
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({ 
    name: "", 
    slug: "", 
    description: "", 
    universe: "Bébé" // Valeur par défaut
  });

  // 1. Charger les catégories
  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("universe", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Erreur chargement catégories:", error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Générateur automatique de "slug" (URL amicale) basé sur le nom
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Enlève les accents
      .replace(/[^a-z0-9 -]/g, "") // Enlève les caractères spéciaux
      .replace(/\s+/g, "-") // Remplace les espaces par des tirets
      .replace(/-+/g, "-");
      
    setNewCategory({ ...newCategory, name, slug });
  };

  // 2. Ajouter une catégorie
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) return alert("Le nom et le slug sont requis.");

    setIsAdding(true);
    const { data, error } = await supabase
      .from("categories")
      .insert([newCategory])
      .select();

    if (error) {
      alert("Erreur lors de l'ajout : " + error.message);
    } else if (data) {
      setCategories([...categories, data[0]]);
      setNewCategory({ name: "", slug: "", description: "", universe: "Bébé" });
      setShowAddForm(false);
      alert("Catégorie ajoutée avec succès !");
    }
    setIsAdding(false);
  };

  // 3. Supprimer une catégorie
  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette catégorie ? Attention, les produits liés pourraient perdre leur catégorie.")) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
    } else {
      setCategories(categories.filter((c) => c.id !== id));
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
                <Layers className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-[#333333]">
                Gestion des Catégories
              </h1>
            </div>
            <p className="text-xs text-[#333333]/60">
              Gérez les rayons de votre boutique pour organiser vos produits.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-[#F5EBE6] text-[#333333] text-xs font-bold rounded-xl border border-[#333333]/5">
              {categories.length} catégorie(s)
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-[#333333] text-white hover:bg-black rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showAddForm ? "Fermer" : "Nouvelle Catégorie"}</span>
            </button>
          </div>
        </div>

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="bg-white rounded-2xl border border-[#333333]/20 p-6 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-sm font-bold text-[#333333] mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              Créer une nouvelle catégorie
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Univers *</label>
                  <select
                    value={newCategory.universe}
                    onChange={(e) => setNewCategory({...newCategory, universe: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-[#333333] focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="Bébé">Bébé</option>
                    <option value="Maman">Maman</option>
                    <option value="Commun">Commun / Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Nom de la catégorie *</label>
                  <input
                    type="text" required
                    value={newCategory.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-[#333333] focus:outline-none focus:border-indigo-500"
                    placeholder="Ex: Soins Visage"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Slug (URL générée) *</label>
                  <input
                    type="text" required
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-gray-500 bg-gray-50 focus:outline-none"
                    placeholder="soins-visage"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Description</label>
                <input
                  type="text"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-[#333333] focus:outline-none focus:border-indigo-500"
                  placeholder="Petite phrase d'accroche pour cette catégorie..."
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 font-bold text-xs disabled:opacity-50"
                >
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isAdding ? "Création en cours..." : "Créer la catégorie"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des catégories */}
        <div className="bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <Layers className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-sm font-medium text-gray-500">Aucune catégorie n'est encore créée.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[#333333]/60 uppercase tracking-wider bg-gray-50/50">
                    <th className="p-3 font-bold">Nom</th>
                    <th className="p-3 font-bold">Univers</th>
                    <th className="p-3 font-bold">Slug (URL)</th>
                    <th className="p-3 font-bold hidden md:table-cell">Description</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-bold text-[#333333] flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                        {cat.name}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          cat.universe === "Maman" ? "bg-[#D4A396]/20 text-[#D4A396]" : 
                          cat.universe === "Bébé" ? "bg-[#6E857B]/20 text-[#6E857B]" : 
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {cat.universe}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-gray-500">{cat.slug}</td>
                      <td className="p-3 text-gray-500 hidden md:table-cell truncate max-w-[200px]">
                        {cat.description || "-"}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors inline-flex items-center justify-center"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
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