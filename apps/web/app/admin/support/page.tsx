"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createClient } from "@supabase/supabase-js";
import { Sparkles, Search, Loader2, MessageSquare, Calendar, UserCircle, Eye } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminSupportPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Charger les conversations (Support ou IA)
  const fetchConversations = async () => {
    setLoading(true);
    // On essaie de récupérer depuis la table ai_conversations (vue sur votre BDD)
    const { data, error } = await supabase
      .from("ai_conversations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur chargement des conversations:", error);
    } else {
      setConversations(data || []);
      setFilteredConversations(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // 2. Recherche par ID ou contenu
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = conversations.filter(
        (c) =>
          (c.id && String(c.id).toLowerCase().includes(query)) ||
          (c.user_id && String(c.user_id).toLowerCase().includes(query))
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#333333]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Sparkles className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-[#333333]">
                Conseillère IA & Support
              </h1>
            </div>
            <p className="text-xs text-[#333333]/60">
              Consultez l'historique des requêtes et conversations de vos clientes avec l'assistante IA.
            </p>
          </div>
          <span className="px-4 py-2 bg-[#F5EBE6] text-[#333333] text-xs font-bold rounded-xl border border-[#333333]/5 w-fit">
            {conversations.length} conversation(s)
          </span>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-2xl border border-[#333333]/10 p-4 shadow-sm flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Rechercher une conversation par ID utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium text-[#333333] bg-transparent focus:outline-none"
          />
        </div>

        {/* Tableau des conversations */}
        <div className="bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-7 h-7 animate-spin text-purple-600" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <MessageSquare className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-sm font-medium text-gray-500">
                {searchQuery ? "Aucune conversation ne correspond à votre recherche." : "Aucune conversation enregistrée pour le moment."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[#333333]/60 uppercase tracking-wider bg-gray-50/50">
                    <th className="p-3 font-bold">Identifiant / Client</th>
                    <th className="p-3 font-bold">Dernière interaction</th>
                    <th className="p-3 font-bold">Statut</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredConversations.map((conv) => (
                    <tr key={conv.id} className="hover:bg-gray-50 transition-colors">
                      {/* ID / User */}
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <UserCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-[#333333]">
                              Client {String(conv.user_id || conv.id).slice(0, 6)}...
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono">
                              ID Conv: {String(conv.id).slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {new Date(conv.updated_at || conv.created_at).toLocaleString('fr-FR', {
                              day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Statut */}
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                          Traitée par l'IA
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <button
                          onClick={() => alert("Fonctionnalité d'affichage des messages en cours de développement")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-[#333333] hover:bg-gray-200 transition-colors text-[11px] font-bold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lire</span>
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