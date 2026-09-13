"use client";

import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Exemple de logique de soumission (Supabase / API)
    console.log("Connexion en cours avec :", { email, password });

    try {
      // Insérez votre logique d'authentification ici (ex: supabase.auth.signInWithPassword)
    } catch (error) {
      console.error("Erreur de connexion", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#333333]/15 text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10"
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
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#333333]/15 text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 cursor-pointer text-[#333333]/80 font-medium">
          <input type="checkbox" className="rounded border-[#333333]/20 text-[#333333] focus:ring-0" />
          <span>Se souvenir de moi</span>
        </label>
        <a href="/auth/mot-de-passe-oublie" className="font-bold text-[#6E857B] hover:underline">
          Mot de passe oublié ?
        </a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#333333] hover:bg-black text-white font-bold text-sm transition-all shadow-md active:scale-95 mt-2 disabled:opacity-50"
      >
        <span>{isLoading ? "Connexion..." : "Se connecter"}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}