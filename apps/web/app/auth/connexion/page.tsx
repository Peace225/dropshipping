"use client";
export const dynamic = 'force-dynamic';

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // État pour l'œil
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirection directe vers l'Espace Client après connexion
      router.push("/compte");
      router.refresh();
    } catch (error: any) {
      setErrorMessage(error.message || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/10 py-12 flex flex-col justify-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil ECLOSIA</span>
        </Link>

        <div className="bg-white p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8C5C8]/40 text-[#333333] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6E857B]" />
              Espace Client sécurisé
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
              Bon retour parmi nous
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">
              Connectez-vous pour suivre vos commandes et profiter de vos avantages.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1.5">Adresse email</label>
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
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10 text-[#333333]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1.5">Mot de passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10 text-[#333333]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#333333]/50 hover:text-[#333333] transition-colors"
                  aria-label="Afficher ou masquer le mot de passe"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#333333] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? "Connexion..." : "Se connecter"}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center border-t border-[#333333]/10 pt-6">
            <p className="text-xs text-[#333333]/70 font-medium">
              Pas encore de compte ?{" "}
              <Link href="/auth/register" className="font-bold text-[#333333] hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}