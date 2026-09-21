"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { MapPin, Plus, X, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("France");
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getAddresses() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth/connexion"); return; }

      setUserId(session.user.id);

      const { data } = await supabase
        .from("customer_addresses")
        .select("*")
        .eq("customer_id", session.user.id);

      if (data) setAddresses(data);
      setLoading(false);
    }
    getAddresses();
  }, [router]);

  const handleAddAddress = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);

    const { data, error } = await supabase
      .from("customer_addresses")
      .insert([{
        customer_id: userId,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        address_line: addressLine,
        city: city,
        postal_code: postalCode,
        country: country,
        is_default: addresses.length === 0
      }])
      .select();

    if (error) {
      console.error("Erreur adresse:", error);
      alert(`Erreur d'enregistrement : ${error.message}`);
    } else if (data) {
      setAddresses([...addresses, data[0]]);
      setShowModal(false);
      setFirstName(""); setLastName(""); setPhone(""); setAddressLine(""); setCity(""); setPostalCode(""); setCountry("France");
    }
    setSaving(false);
  };

  const handleDeleteAddress = async (id: string) => {
    const { error } = await supabase.from("customer_addresses").delete().eq("id", id);
    if (!error) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#333333]/10 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#333333]/10">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#333333]">Mes Adresses</h1>
            <p className="text-xs text-[#333333]/60 mt-1">Gérez vos lieux de livraison en France et à l'international.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#6E857B] text-white text-xs font-bold hover:bg-[#5b7067] transition-all cursor-pointer shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Ajouter une adresse</span>
          </button>
        </div>

        {loading ? (
          <p className="text-xs text-[#333333]/60">Chargement...</p>
        ) : addresses.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#333333]/15 rounded-3xl p-6 bg-[#F5EBE6]/10">
            <MapPin className="w-10 h-10 text-[#333333]/30 mx-auto mb-3" />
            <p className="text-sm font-bold text-[#333333]">Aucune adresse enregistrée</p>
            <p className="text-xs text-[#333333]/60 mt-1">Ajoutez une adresse pour faciliter vos futurs achats.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-4 rounded-2xl border border-[#333333]/10 relative bg-[#F5EBE6]/20 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-[#333333]">{addr.first_name} {addr.last_name}</p>
                  <p className="text-xs text-[#333333]/80 mt-1">{addr.address_line}</p>
                  <p className="text-xs text-[#333333]/70">{addr.city}, {addr.postal_code}</p>
                  <p className="text-xs text-[#333333]/60">{addr.country} {addr.phone ? `- Tél: ${addr.phone}` : ""}</p>
                </div>
                <button onClick={() => handleDeleteAddress(addr.id)} className="mt-3 self-end p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#333333]/10 shadow-xl relative my-8">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-[#333333]/60">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black text-[#333333] mb-1">Nouvelle adresse</h2>
            <p className="text-xs text-[#333333]/60 mb-6">Renseignez vos coordonnées de livraison.</p>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1.5">Prénom</label>
                  <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Brad" className="w-full px-4 py-3 rounded-2xl border border-[#333333]/15 text-xs bg-[#F5EBE6]/10" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1.5">Nom</label>
                  <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Falcone" className="w-full px-4 py-3 rounded-2xl border border-[#333333]/15 text-xs bg-[#F5EBE6]/10" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1.5">Téléphone</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+33 6 00 00 00 00" className="w-full px-4 py-3 rounded-2xl border border-[#333333]/15 text-xs bg-[#F5EBE6]/10" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1.5">Rue et numéro (address_line)</label>
                <input type="text" required value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="123 rue de la République" className="w-full px-4 py-3 rounded-2xl border border-[#333333]/15 text-xs bg-[#F5EBE6]/10" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1.5">Ville</label>
                  <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Paris" className="w-full px-4 py-3 rounded-2xl border border-[#333333]/15 text-xs bg-[#F5EBE6]/10" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1.5">Code postal</label>
                  <input type="text" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="75001" className="w-full px-4 py-3 rounded-2xl border border-[#333333]/15 text-xs bg-[#F5EBE6]/10" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1.5">Pays</label>
                <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)} placeholder="France" className="w-full px-4 py-3 rounded-2xl border border-[#333333]/15 text-xs bg-[#F5EBE6]/10" />
              </div>
              <div className="pt-2 flex items-center gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="w-1/2 py-3 rounded-2xl border border-[#333333]/15 text-xs font-bold cursor-pointer">Annuler</button>
                <button type="submit" disabled={saving} className="w-1/2 inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#333333] text-white text-xs font-bold cursor-pointer">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Enregistrer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}