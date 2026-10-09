"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";

export function LoginForm() {
  // Singleton propre via useState
  const [supabase] = useState(() => getSupabase());

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes("email not confirmed")) {
          if (typeof window !== "undefined") {
            localStorage.setItem('eclosia_pending_email', cleanEmail);
          }
          // Redirection vers la vérification si email non confirmé
          window.location.href = `/verify?email=${encodeURIComponent(cleanEmail)}`;
          return;
        }
        throw authError;
      }

      const user = authData.user;
      if (!user) throw new Error("Utilisateur introuvable.");

      if (typeof window !== "undefined") {
        localStorage.setItem('eclosia_pending_email', cleanEmail);
      }

      // Synchronisation de la session
      await supabase.auth.getSession();

      let userRole = "client";
      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profileData?.role) {
          userRole = profileData.role;
        }
      } catch (err) {
        console.warn("Table profiles ignorée ou absente:", err);
      }

      // ⏱️ Attente de 100 ms pour s'assurer que le cookie est inscrit dans le navigateur
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Hard navigation pour envoyer les cookies au Middleware
      if (userRole === "super_admin" || userRole === "admin") {
        window.location.href = "/admin"; 
      } else {
        window.location.href = "/compte"; 
      }

    } catch (error: any) {
      console.error("Erreur de connexion", error);
      setErrorMessage(error.message || "Email ou mot de passe incorrect.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium text-center">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-[#333333] uppercase tracking-wider mb-2">
          Adresse email
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
            <Mail className="w-4 h-4" />
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#333333]/15 text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10 text-[#333333]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#333333] uppercase tracking-wider mb-2">
          Mot de passe
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
            <Lock className="w-4 h-4" />
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#333333]/15 text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10 text-[#333333]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 cursor-pointer text-[#333333]/80 font-medium">
          <input type="checkbox" className="rounded border-[#333333]/20 text-[#333333] focus:ring-0" />
          <span>Se souvenir de moi</span>
        </label>
        <Link href="/auth/mot-de-passe-oublie" className="font-bold text-[#6E857B] hover:underline">
          Mot de passe oublié ?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#333333] hover:bg-black text-white font-bold text-sm transition-all shadow-md active:scale-95 mt-2 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connexion...</span>
          </>
        ) : (
          <>
            <span>Se connecter</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}