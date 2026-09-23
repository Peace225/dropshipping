"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Authentification Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error("Utilisateur introuvable.");

      // 2. Vérification du rôle dans la table "profiles"
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      // 3. Redirection conditionnelle selon le rôle
      if (!profileError && profileData?.role === "admin") {
        router.push("/admin"); // Redirection vers le dashboard admin
      } else {
        router.push("/compte"); // Redirection vers l'espace client classique
      }

      router.refresh();
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue lors de la connexion.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-xl border border-red-200 text-center font-medium">
          {error}
        </div>
      )}
      <div>
        <label className="block text-xs font-bold text-[#333333]/80 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-[#333333]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E857B] bg-white text-[#333333]"
          placeholder="votre@email.com"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-[#333333]/80 mb-1">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-[#333333]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E857B] bg-white text-[#333333]"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-[#333333] hover:bg-[#222222] text-white text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        <span>{loading ? "Connexion en cours..." : "Se connecter"}</span>
      </button>
    </form>
  );
}