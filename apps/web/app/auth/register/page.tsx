"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Lock, Sparkles, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";

export default function InscriptionPage() {
  const router = useRouter();
  
  // Singleton Supabase sécurisé dans le composant
  const [supabase] = useState(() => getSupabase());

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (cleanName.length < 2) {
      setErrorMessage("Veuillez entrer votre nom complet.");
      setLoading(false);
      return;
    }

    try {
      const origin = window.location.origin;
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { full_name: cleanName },
          // CORRECTION : Ajout de ?next=/compte pour la redirection automatique après vérification
          emailRedirectTo: `${origin}/auth/callback?next=/compte`,
        },
      });

      if (signUpError) throw signUpError;

      // Détection Supabase : Si l'email existe déjà, identities est un tableau vide []
      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        setErrorMessage("Un compte existe déjà avec cette adresse email. Connectez-vous.");
        setLoading(false);
        return;
      }

      // Sauvegarde locale pour la page de vérification
      if (typeof window !== "undefined") {
        localStorage.setItem('eclosia_pending_email', cleanEmail);
        localStorage.setItem('eclosia_pending_name', cleanName);
      }
      
      router.push(`/verify?email=${encodeURIComponent(cleanEmail)}`);
      
    } catch (error: any) {
      console.error("Erreur Inscription:", error);
      
      if (error.message?.includes("already registered") || error.message?.includes("User already registered")) {
        setErrorMessage("Un compte existe déjà avec cette adresse. Connectez-vous.");
      } else if (error.status === 429 || error.message?.includes("rate limit")) {
        setErrorMessage("Trop de tentatives. Attendez 1 minute puis réessayez.");
      } else {
        setErrorMessage(error.message || "Erreur lors de l'inscription.");
      }
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMessage("");
    setGoogleLoading(true);
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?next=/compte`,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setErrorMessage(error.message || "Erreur lors de la connexion avec Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/15 py-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        
        <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </Link>

        <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-6 text-[10px] sm:text-xs font-bold text-[#6E857B]">
          <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white/50">Dès 10€</span>
          <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white/50">Coffrets 25,90€</span>
          <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white/50">Livraison offerte &gt; 74,90€</span>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#333333]/10 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#6E857B]/20 flex items-center justify-center mx-auto mb-3 text-[#6E857B]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">Créer un compte</h1>
            <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">Rejoignez notre univers dédié à la maternité.</p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full mb-6 inline-flex items-center justify-center gap-3 py-3 rounded-2xl border border-[#333333]/15 bg-white hover:bg-gray-50 text-[#333333] font-bold text-xs sm:text-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            )}
            <span>{googleLoading ? "Redirection..." : "Continuer avec Google"}</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-[#333333]/10" />
            <span className="text-xs font-bold text-[#333333]/40 uppercase">ou par email</span>
            <div className="h-px flex-1 bg-[#333333]/10" />
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium text-center flex flex-col gap-2">
              <span>{errorMessage}</span>
              {(errorMessage.includes("existe déjà") || errorMessage.includes("déjà")) && (
                <Link href="/auth/connexion" className="underline font-bold text-red-700">Aller à la connexion</Link>
              )}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1.5">Nom complet</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40"><User className="w-4 h-4" /></span>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Sophie Martin" className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10 text-[#333333]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1.5">Adresse e-mail</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40"><Mail className="w-4 h-4" /></span>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sophie.martin@email.com" className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10 text-[#333333]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1.5">Mot de passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40"><Lock className="w-4 h-4" /></span>
                <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full pl-11 pr-12 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10 text-[#333333]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#333333]/50 hover:text-[#333333]">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
              <p className="text-[10px] text-[#333333]/50 mt-1 ml-1">Minimum 6 caractères</p>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading || googleLoading} className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#333333] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>{loading ? "Création en cours..." : "S'inscrire"}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-[#333333]/70 font-medium">
            Déjà un compte ECLOSIA ? <Link href="/auth/connexion" className="font-extrabold text-[#333333] hover:underline">Se connecter</Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-[#333333]/60 font-medium pt-4 border-t border-[#333333]/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6E857B]" /><span>Sécurité et confidentialité garanties.</span>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[#333333]/50 font-medium space-y-1">
          <p>© {new Date().getFullYear()} ECLOSIA Maternité & Puériculture</p>
          <p>75 rue de Rivoli, 75001 Paris</p>
        </div>
      </div>
    </div>
  );
}