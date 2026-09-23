"use client";

import { useState, useEffect, useRef } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createClient } from "@supabase/supabase-js";
import { 
  Settings, Store, Mail, MapPin, Bell, Shield, 
  Loader2, CreditCard, Users, UserPlus, Trash2, X, CheckCircle2, Save 
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminSettingsPage() {
  // États pour le statut de la sauvegarde automatique
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const isFirstRender = useRef(true);
  
  // Paramètres globaux de la boutique
  const [settings, setSettings] = useState({
    storeName: "ECLOSIA",
    supportEmail: "contact@eclosia.com",
    phoneNumber: "+225 00 00 00 00",
    address: "Abidjan, Côte d'Ivoire",
    currency: "EUR",
    taxRate: 20,
    enableNotifications: true,
    maintenanceMode: false
  });

  // --- Sauvegarde Automatique (Debouncing) ---
  useEffect(() => {
    // Ne pas sauvegarder au premier chargement de la page
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Dès qu'un champ change, on affiche "Enregistrement..."
    setSaveStatus("saving");

    // On attend 1 seconde après la dernière frappe avant de sauvegarder
    const delayDebounceFn = setTimeout(async () => {
      
      // ICI : Logique pour enregistrer dans Supabase plus tard
      // await supabase.from('settings').upsert({ id: 1, ...settings });

      setSaveStatus("saved");
      
      // On remet le statut à normal après 2 secondes
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [settings]); // Se déclenche à chaque fois que `settings` change
  // ---------------------------------------------


  // --- Gestion des Administrateurs ---
  const [admins, setAdmins] = useState<any[]>([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "admin" });

  const fetchAdmins = async () => {
    setAdmins([
      { id: "1", name: "Super Admin Eclosia", email: "admin@eclosia.com", role: "super_admin", status: "Actif" },
    ]);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.email || !newAdmin.name) return alert("Veuillez remplir le nom et l'email.");
    
    setIsAddingAdmin(true);
    setTimeout(() => {
      const addedAdmin = {
        id: Math.random().toString(36).substr(2, 9),
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: "En attente (Invitation envoyée)"
      };
      setAdmins([...admins, addedAdmin]);
      setNewAdmin({ name: "", email: "", role: "admin" });
      setShowAddAdmin(false);
      setIsAddingAdmin(false);
    }, 800);
  };

  const handleRemoveAdmin = (id: string, role: string) => {
    if (role === "super_admin") return alert("Impossible de supprimer le Super Admin principal.");
    if (confirm("Voulez-vous vraiment révoquer l'accès de cet utilisateur ?")) {
      setAdmins(admins.filter(a => a.id !== id));
    }
  };
  // ---------------------------------------------

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* En-tête avec indicateur de sauvegarde automatique */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#333333]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-gray-100 text-gray-700">
                <Settings className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-[#333333]">
                Paramètres du Système
              </h1>
            </div>
            <p className="text-xs text-[#333333]/60">
              Les modifications sont sauvegardées automatiquement.
            </p>
          </div>
          
          {/* Indicateur de sauvegarde dynamique */}
          <div className="flex items-center h-10 px-4">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-2 text-xs font-bold text-indigo-600 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                Enregistré
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Colonne principale : Infos & Équipe */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bloc : Identité de la boutique */}
            <div className="bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm relative overflow-hidden">
              {saveStatus === "saving" && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/20 animate-pulse"></div>}
              <h2 className="text-sm font-bold text-[#333333] mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Store className="w-4 h-4 text-gray-500" />
                Identité de la boutique
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1.5">Nom de la boutique</label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-[#333333] focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1.5 flex items-center gap-1"><Mail className="w-3 h-3"/> Email Support</label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-[#333333] focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1.5 flex items-center gap-1"><MapPin className="w-3 h-3"/> Localisation / Siège</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-[#333333] focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Gestion de l'équipe */}
            <div className="bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h2 className="text-sm font-bold text-[#333333] flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  Gestion de l'équipe (Accès Admin)
                </h2>
                <button
                  onClick={() => setShowAddAdmin(!showAddAdmin)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {showAddAdmin ? <X className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  {showAddAdmin ? "Fermer" : "Ajouter un membre"}
                </button>
              </div>

              {showAddAdmin && (
                <form onSubmit={handleAddAdmin} className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Nom du membre</label>
                      <input
                        type="text" required
                        value={newAdmin.name} onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Adresse Email</label>
                      <input
                        type="email" required
                        value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1">Rôle</label>
                      <select
                        value={newAdmin.role} onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-indigo-500 bg-white"
                      >
                        <option value="admin">Administrateur</option>
                        <option value="editeur">Éditeur</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit" disabled={isAddingAdmin}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[11px] font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isAddingAdmin ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Envoyer l'invitation
                    </button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[#333333]/60 uppercase tracking-wider">
                    <tr>
                      <th className="py-2 font-bold">Membre</th>
                      <th className="py-2 font-bold">Rôle</th>
                      <th className="py-2 font-bold">Statut</th>
                      <th className="py-2 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {admins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50/50">
                        <td className="py-3">
                          <p className="font-bold text-[#333333]">{admin.name}</p>
                          <p className="text-[10px] text-gray-500">{admin.email}</p>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            admin.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                            admin.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {admin.role === 'super_admin' ? 'Super Admin' : admin.role === 'admin' ? 'Admin' : 'Éditeur'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-[10px] font-semibold text-emerald-600">{admin.status}</span>
                        </td>
                        <td className="py-3 text-right">
                          {admin.role !== "super_admin" && (
                            <button
                              onClick={() => handleRemoveAdmin(admin.id, admin.role)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Bloc : Ventes & Taxes */}
            <div className="bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm relative overflow-hidden">
              {saveStatus === "saving" && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/20 animate-pulse"></div>}
              <h2 className="text-sm font-bold text-[#333333] mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <CreditCard className="w-4 h-4 text-gray-500" />
                Ventes & Taxes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1.5">Devise principale</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-[#333333] focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="EUR">Euro (€)</option>
                    <option value="XOF">Franc CFA (FCFA)</option>
                    <option value="USD">Dollar ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#333333]/70 uppercase mb-1.5">Taux de TVA par défaut (%)</label>
                  <input
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium text-[#333333] focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Colonne latérale : Sécurité & Système */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm relative overflow-hidden">
              {saveStatus === "saving" && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/20 animate-pulse"></div>}
              <h2 className="text-sm font-bold text-[#333333] mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Bell className="w-4 h-4 text-gray-500" />
                Notifications
              </h2>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-medium text-[#333333]">Recevoir un email à chaque commande</span>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={settings.enableNotifications}
                    onChange={() => setSettings({...settings, enableNotifications: !settings.enableNotifications})}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${settings.enableNotifications ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.enableNotifications ? 'transform translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>

            <div className="bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm relative overflow-hidden">
              {saveStatus === "saving" && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/20 animate-pulse"></div>}
              <h2 className="text-sm font-bold text-[#333333] mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Shield className="w-4 h-4 text-rose-500" />
                Danger Zone
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-xs font-medium text-[#333333]">Mode Maintenance</span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={settings.maintenanceMode}
                      onChange={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-rose-500' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.maintenanceMode ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
                <p className="text-[10px] text-gray-400">
                  Si activé, vos clients verront une page "En travaux" et ne pourront plus passer commande.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}