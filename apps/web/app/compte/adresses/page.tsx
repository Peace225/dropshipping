import Link from "next/link";
import { ArrowLeft, MapPin, Plus, Trash2, Edit3, CheckCircle2 } from "lucide-react";

export default function AddressesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/10 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fil d'Ariane / Retour */}
        <Link
          href="/compte"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à mon compte</span>
        </Link>

        {/* En-tête */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#333333]/10 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#E8C5C8]/30 text-[#333333] mb-2">
              Carnet d'adresses
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
              Mes adresses de livraison
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">
              Gérez vos lieux de livraison pour vos commandes d'essentiels AURAE.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#333333] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une adresse</span>
          </button>
        </div>

        {/* Liste des adresses */}
        <div className="space-y-4">
          
          {/* Adresse 1 (Principale) */}
          <div className="bg-white p-6 rounded-3xl border-2 border-[#333333] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8C5C8]/30 flex items-center justify-center text-[#333333] flex-shrink-0 mt-1">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-extrabold text-sm sm:text-base text-[#333333]">
                    Domicile (Principal)
                  </h2>
                  <span className="inline-flex items-center gap-1 bg-[#6E857B]/15 text-[#333333] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-[#6E857B]" />
                    Par défaut
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed">
                  Brad Sergueï Kokoliko<br />
                  Cocody Riviera Palmeraie<br />
                  Abidjan, Côte d'Ivoire<br />
                  Tél : +225 07 00 00 00 00
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-[#333333]/10">
              <button
                type="button"
                className="p-2.5 rounded-xl border border-[#333333]/15 hover:bg-[#333333]/5 text-[#333333] transition-colors"
                title="Modifier"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Adresse 2 */}
          <div className="bg-white p-6 rounded-3xl border border-[#333333]/10 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5EBE6] flex items-center justify-center text-[#333333] flex-shrink-0 mt-1">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm sm:text-base text-[#333333] mb-1">
                  Bureau / Professionnel
                </h2>
                <p className="text-xs sm:text-sm text-[#333333]/80 font-medium leading-relaxed">
                  Brad Sergueï Kokoliko<br />
                  Plateau, Immeuble Alpha 2000<br />
                  Abidjan, Côte d'Ivoire<br />
                  Tél : +225 07 00 00 00 00
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-[#333333]/10">
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-[#333333]/15 text-xs font-bold text-[#333333] hover:bg-[#333333]/5 transition-colors"
              >
                Définir par défaut
              </button>
              <button
                type="button"
                className="p-2.5 rounded-xl border border-[#333333]/15 hover:bg-[#333333]/5 text-[#333333] transition-colors"
                title="Modifier"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}