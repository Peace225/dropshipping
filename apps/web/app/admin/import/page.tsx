"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function AdminImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [supplier, setSupplier] = useState<string>("kiddystores");
  const [coefficient, setCoefficient] = useState<number>(2.5);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: "error", text: "Veuillez sélectionner un fichier CSV." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("supplier", supplier);
      formData.append("coefficient", coefficient.toString());

      const response = await fetch("/api/admin/import-catalog", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'importation.");
      }

      setMessage({ type: "success", text: `Importation réussie ! ${data.count || 0} produits synchronisés.` });
      setFile(null);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#333333]">
            Importation du Catalogue Fournisseur
          </h1>
          <p className="text-xs text-[#333333]/60 mt-1">
            Mettez à jour vos stocks et produits ECLOSIA via les fichiers CSV de vos fournisseurs.
          </p>
        </div>

        <div className="max-w-2xl bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm">
          <form onSubmit={handleUpload} className="space-y-6">
            
            {/* Choix du fournisseur */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-2">
                Sélectionner le fournisseur
              </label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#333333]/20 bg-white text-sm focus:outline-none focus:border-[#6E857B]"
              >
                <option value="kiddystores">Kiddy Stores (Textile Bébé)</option>
                <option value="bbla">BBLA (Made in France / Puériculture)</option>
                <option value="matterhorn">Matterhorn (Maternité / Post-partum)</option>
              </select>
            </div>

            {/* Choix du coefficient de marge */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-2">
                Coefficient multiplicateur de marge
              </label>
              <select
                value={coefficient}
                onChange={(e) => setCoefficient(parseFloat(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#333333]/20 bg-white text-sm focus:outline-none focus:border-[#6E857B]"
              >
                <option value="2">x2.0 (Standard)</option>
                <option value="2.5">x2.5 (Recommandé - Haut de gamme)</option>
                <option value="3">x3.0 (Luxueux / Forte marge)</option>
                <option value="3.5">x3.5 (Petits articles à forte valeur perçue)</option>
              </select>
            </div>

            {/* Zone de glisser-déposer du fichier CSV */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#333333]/70 mb-2">
                Fichier CSV du catalogue
              </label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#333333]/20 rounded-2xl p-8 text-center hover:border-[#6E857B] transition-colors cursor-pointer bg-[#FBF8F5]/50">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-file-input"
                />
                <label htmlFor="csv-file-input" className="cursor-pointer space-y-2 flex flex-col items-center">
                  <div className="p-3 bg-[#6E857B]/10 text-[#6E857B] rounded-xl">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-[#333333]">
                    {file ? file.name : "Cliquez pour choisir un fichier CSV ou glissez-le ici"}
                  </span>
                  <span className="text-xs text-neutral-400">Format accepté : .csv</span>
                </label>
              </div>
            </div>

            {/* Messages de retour */}
            {message && (
              <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
                message.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
              }`}>
                {message.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <span>{message.text}</span>
              </div>
            )}

            {/* Bouton de validation */}
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-3 px-4 bg-[#6E857B] text-white text-sm font-semibold rounded-xl hover:bg-[#5a6e66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Traitement en cours..." : "Lancer l'importation dans Supabase"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}