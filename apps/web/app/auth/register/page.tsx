"use client";
export const dynamic = 'force-dynamic';

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Lock, Sparkles, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function InscriptionPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      // 1. Inscription avec Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // 2. Enregistrer ou mettre à jour le profil dans la table personnalisée "users"
      if (data.user) {
        await supabase.from("users").upsert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          updated_at: new Date(),
        });
      }

      // 3. Redirection directe vers l'Espace Client
      router.push("/compte");
      router.refresh();
    } catch (error: any) {
      setErrorMessage(error.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/15 py-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        
        {/* Fil d'Ariane / Retour */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil ECLOSIA</span>
        </Link>

        {/* Carte principale d'inscription */}
        <div className="bg-white p-8 rounded-3xl border border-[#333333]/10 shadow-lg">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#6E857B]/20 flex items-center justify-center mx-auto mb-3 text-[#6E857B]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
              Créer un compte ECLOSIA
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">
              Rejoignez notre univers dédié à la maternité et à la puériculture.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1.5">Nom complet</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Brad Sergueï Kokoliko"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10 text-[#333333]"
                />
              </div>
            </div>

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
                <span>{loading ? "Création en cours..." : "S'inscrire"}</span>
              </button>
            </div>

          </form>

          {/* Lien vers connexion */}
          <div className="mt-6 text-center text-xs text-[#333333]/70 font-medium">
            Déjà un compte ECLOSIA ?{" "}
            <Link href="/auth/connexion" className="font-extrabold text-[#333333] hover:underline">
              Se connecter
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-[#333333]/60 font-medium pt-4 border-t border-[#333333]/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6E857B]" />
            <span>Sécurité et confidentialité garanties.</span>
          </div>

        </div>

      </div>
    </div>
  );
}