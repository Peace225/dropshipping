"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";

export default function MotDePasseOubliePage() {
  // Singleton Supabase propre via lazy initialization useState
  const [supabase] = useState(() => getSupabase());

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    const cleanEmail = email.trim().toLowerCase();

    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Impossible d'envoyer l'email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/15 py-12 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        <Link href="/auth/connexion" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la connexion</span>
        </Link>

        <div className="bg-white p-8 rounded-3xl border border-[#333333]/10 shadow-lg">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8C5C8]/40 text-[#333333] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6E857B]" />
              Récupération ECLOSIA
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">Mot de passe oublié ?</h1>
            <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">Entrez votre e-mail pour recevoir les instructions.</p>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
              <h3 className="font-bold text-sm sm:text-base">E-mail envoyé avec succès !</h3>
              <p className="text-xs sm:text-sm text-green-700">
                Si un compte existe pour <strong className="break-all">{email}</strong>, un lien de réinitialisation vous a été envoyé.
              </p>
              <div className="pt-2">
                <Link href="/auth/connexion" className="inline-block w-full py-3 rounded-xl bg-[#333333] text-white text-xs sm:text-sm font-bold hover:bg-black transition-all">
                  Retourner à la connexion
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium text-center">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#333333] mb-1.5">Adresse e-mail</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40"><Mail className="w-4 h-4" /></span>
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

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#333333] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{loading ? "Envoi en cours..." : "Envoyer le lien"}</span>
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="mt-6 text-center text-xs text-[#333333]/70 font-medium border-t border-[#333333]/10 pt-6">
            Déjà de retour ? <Link href="/auth/connexion" className="font-extrabold text-[#333333] hover:underline">Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}