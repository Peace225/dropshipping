"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck, Mail, Lock, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { getSupabase } from '@/lib/supabase/client';

function ConnexionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  const emailFromUrl = searchParams.get('email') || '';

  const [supabase] = useState(() => getSupabase());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    } else {
      const stored = localStorage.getItem('eclosia_pending_email');
      if (stored) setEmail(stored);
    }
  }, [emailFromUrl]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes("email not confirmed")) {
          localStorage.setItem('eclosia_pending_email', cleanEmail);
          router.push(`/verify?email=${encodeURIComponent(cleanEmail)}`);
          return;
        }
        throw authError;
      }

      const user = authData.user;
      if (!user) throw new Error("Utilisateur introuvable");

      // Synchronisation de la session côté client
      await supabase.auth.getSession();

      let userRole = "client";
      try {
        const { data: profileData } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
        if (profileData?.role) userRole = profileData.role;
      } catch {}

      // Petite attente pour garantir l'écriture des cookies dans le navigateur avant redirection
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (userRole === "super_admin" || userRole === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/compte";
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Email ou mot de passe incorrect.");
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google') => {
    setErrorMessage("");
    setOauthLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/compte`,
          queryParams: { access_type: 'offline', prompt: 'consent' }
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setErrorMessage(error.message || `Erreur avec ${provider}.`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/10 py-12 flex flex-col justify-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l&apos;accueil ECLOSIA</span>
        </Link>

        <div className="bg-white p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8C5C8]/40 text-[#333333] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6E857B]" />
              Espace sécurisé ECLOSIA
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">Bon retour parmi nous</h1>
            <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">Connectez-vous pour accéder à votre espace.</p>
          </div>

          {verified === '1' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0"/>
              <span>Compte vérifié pour <strong>{emailFromUrl ? decodeURIComponent(emailFromUrl) : email}</strong>. Connectez-vous.</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium text-center">{errorMessage}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1.5">Adresse email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40"><Mail className="w-4 h-4" /></span>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10 text-[#333333]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1.5">Mot de passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40"><Lock className="w-4 h-4" /></span>
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full pl-11 pr-12 py-3 rounded-2xl border border-[#333333]/15 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#333333] bg-[#F5EBE6]/10 text-[#333333]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#333333]/50 hover:text-[#333333]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading || oauthLoading !== null} className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#333333] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-50">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? "Connexion..." : "Se connecter"}</span>
              </button>
            </div>
          </form>

          <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#333333]/10"></div></div><div className="relative flex justify-center text-xs font-medium"><span className="px-4 bg-white text-[#333333]/50">Ou continuer avec</span></div></div>

          <div className="space-y-3">
            <button type="button" onClick={() => handleOAuthLogin('google')} disabled={loading || oauthLoading !== null} className="w-full inline-flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-white border border-[#333333]/15 hover:bg-gray-50 text-[#333333] font-bold text-xs sm:text-sm transition-all active:scale-95 disabled:opacity-50">
              {oauthLoading === 'google' ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              <span>Google</span>
            </button>
          </div>

          <div className="mt-6 text-center border-t border-[#333333]/10 pt-6">
            <p className="text-xs text-[#333333]/70 font-medium">Pas encore de compte? <Link href="/inscription" className="font-bold text-[#333333] hover:underline">Créer un compte</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin"/></div>}>
      <ConnexionContent />
    </Suspense>
  )
}