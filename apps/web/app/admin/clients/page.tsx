"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { createClient } from "@supabase/supabase-js";
import { Users, Search, Loader2, Mail, Phone, Calendar, UserCircle } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Charger la liste des clients depuis la table 'customers'
  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des clients:", error);
    } else {
      setClients(data || []);
      setFilteredClients(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // 2. Filtrer les clients par nom ou email avec la barre de recherche
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(
        (c) =>
          (c.first_name && c.first_name.toLowerCase().includes(query)) ||
          (c.last_name && c.last_name.toLowerCase().includes(query)) ||
          (c.email && c.email.toLowerCase().includes(query)) ||
          (c.phone && c.phone.includes(query))
      );
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#333333]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-[#333333]">
                Base Clients
              </h1>
            </div>
            <p className="text-xs text-[#333333]/60">
              Gérez votre base d'utilisateurs et consultez leurs informations de contact.
            </p>
          </div>
          <span className="px-4 py-2 bg-[#F5EBE6] text-[#333333] text-xs font-bold rounded-xl border border-[#333333]/5 w-fit">
            {clients.length} client(s) inscrit(s)
          </span>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-2xl border border-[#333333]/10 p-4 shadow-sm flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, email ou numéro de téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium text-[#333333] bg-transparent focus:outline-none"
          />
        </div>

        {/* Tableau des clients */}
        <div className="bg-white rounded-2xl border border-[#333333]/10 p-6 shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <UserCircle className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-sm font-medium text-gray-500">
                {searchQuery ? "Aucun client ne correspond à votre recherche." : "Votre base de données clients est actuellement vide."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-[#333333]/60 uppercase tracking-wider bg-gray-50/50">
                    <th className="p-3 font-bold">Client</th>
                    <th className="p-3 font-bold">Contact</th>
                    <th className="p-3 font-bold">Date d'inscription</th>
                    <th className="p-3 font-bold">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      {/* Nom et Avatar */}
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
                            {(client.first_name?.[0] || "") + (client.last_name?.[0] || "") || "?"}
                          </div>
                          <div>
                            <p className="font-bold text-[#333333]">
                              {client.first_name || client.last_name ? `${client.first_name || ""} ${client.last_name || ""}` : "Client Anonyme"}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono">ID: {String(client.id).slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-medium">{client.email || "Non renseigné"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{client.phone || "Non renseigné"}</span>
                        </div>
                      </td>

                      {/* Date d'inscription */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {new Date(client.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Statut (Ex: Actif) */}
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          Compte Actif
                        </span>
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