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
  
  // États du formulaire
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // États de l'UI et du chargement
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ÉTAPE 1 : Inscription et redirection
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          // ROUTE CALLBACK SÉCURISÉE : Évite les conflits d'URL si l'utilisateur clique sur le lien
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      // Sauvegarde des informations pour la page de vérification
      localStorage.setItem('eclosia_pending_email', cleanEmail);
      localStorage.setItem('eclosia_pending_name', fullName.trim());
      
      // Redirection fluide vers la page dédiée
      router.push(`/verify?email=${encodeURIComponent(cleanEmail)}`);
      
    } catch (error: any) {
      console.error("Erreur Inscription Supabase :", error);
      
      if (error.message.includes("User already registered")) {
        setErrorMessage("Un compte existe déjà avec cette adresse e-mail. Vous pouvez vous connecter.");
      } else if (error.message.includes("rate limit") || error.status === 429) {
        setErrorMessage("Limite de sécurité atteinte. Veuillez patienter quelques instants avant de réessayer.");
      } else {
        setErrorMessage(error.message || "Une erreur est survenue. Vérifiez vos informations ou votre dossier Spam.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/15 py-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>

        {/* Bandeau promotionnel */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-6 text-[10px] sm:text-xs font-bold text-[#6E857B]">
          <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white/50">Dès 10€</span>
          <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white/50">Coffrets 25,90€</span>
          <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white/50">Livraison offerte &gt; 74,90€</span>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#333333]/10 shadow-lg relative overflow-hidden">
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#6E857B]/20 flex items-center justify-center mx-auto mb-3 text-[#6E857B]">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
                Créer un compte
              </h1>
              <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">
                Rejoignez notre univers dédié à la maternité.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium text-center flex flex-col gap-2">
                <span>{errorMessage}</span>
                {errorMessage.includes("déjà") && (
                  <Link href="/auth/connexion" className="underline font-bold text-red-700">
                    Aller à la connexion
                  </Link>
                )}
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
                    placeholder="Sophie Martin"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10 text-[#333333]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1.5">Adresse e-mail</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sophie.martin@email.com"
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
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-12 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10 text-[#333333]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#333333]/50 hover:text-[#333333] transition-colors"
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
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{loading ? "Création en cours..." : "S'inscrire"}</span>
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-[#333333]/70 font-medium">
              Déjà un compte ECLOSIA ?{" "}
              <Link href="/auth/connexion" className="font-extrabold text-[#333333] hover:underline">
                Se connecter
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-[#333333]/60 font-medium pt-4 border-t border-[#333333]/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6E857B]" />
            <span>Sécurité et confidentialité garanties.</span>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-[#333333]/50 font-medium space-y-1">
          <p>© {new Date().getFullYear()} ECLOSIA Maternité & Puériculture</p>
          <p>75 rue de Rivoli, 75001 Paris</p>
        </div>

      </div>
    </div>
  );
}