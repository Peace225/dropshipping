"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Singleton pour éviter la création de multiples instances GoTrueClient
  const [supabase] = useState(() => getSupabase());

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cleanEmail = email.trim().toLowerCase();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        // Redirection vers la vérification si l'email n'est pas encore confirmé
        if (authError.message.toLowerCase().includes("email not confirmed")) {
          localStorage.setItem("eclosia_pending_email", cleanEmail);
          window.location.href = `/verify?email=${encodeURIComponent(cleanEmail)}`;
          return;
        }
        throw authError;
      }

      const user = data.user;
      if (!user) throw new Error("Utilisateur introuvable.");

      // Synchronisation de la session côté client
      await supabase.auth.getSession();

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      localStorage.removeItem("eclosia_pending_email");

      // Pause de 100 ms pour garantir la propagation complète du cookie avant la navigation
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (profile?.role === "admin" || profile?.role === "super_admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/compte";
      }

    } catch (err: any) {
      setError(err.message || "Email ou mot de passe incorrect.");
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
        <label className="block text-xs font-bold text-[#333333]/80 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl border border-[#333333]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E857B] bg-white text-[#333333]"
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-[#333333]/80 mb-1">
          Mot de passe
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
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