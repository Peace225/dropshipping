"use client";
export const dynamic = 'force-dynamic';

import { useState, FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";
import { Shield, Loader2, Check, Lock, Eye, EyeOff, KeyRound, AlertCircle } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SecuritePage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // États pour la visibilité des mots de passe (icônes d'œil)
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Les nouveaux mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#333333]/10 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-[#6E857B]/20 text-[#6E857B] flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#333333]">Sécurité du compte</h1>
          <p className="text-xs text-[#333333]/60">Modifiez votre mot de passe et renforcez la protection de vos données.</p>
        </div>
      </div>

      <hr className="my-6 border-[#333333]/10" />

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-xs font-bold flex items-center gap-2.5">
          <Check className="w-4 h-4 shrink-0" /> 
          <span>Votre mot de passe a été mis à jour et sécurisé avec succès !</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-xl">
        
        <div>
          <label className="block text-xs font-bold text-[#333333] mb-1.5">Nouveau mot de passe</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showNewPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-[#333333]/15 text-xs font-medium bg-[#F5EBE6]/10 text-[#333333] focus:outline-none focus:border-[#333333]"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#333333]/50 hover:text-[#333333] transition-colors cursor-pointer"
              aria-label="Afficher ou masquer le mot de passe"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-[#333333]/50 mt-1">Le mot de passe doit contenir au moins 6 caractères.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#333333] mb-1.5">Confirmer le nouveau mot de passe</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#333333]/40">
              <KeyRound className="w-4 h-4" />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-[#333333]/15 text-xs font-medium bg-[#F5EBE6]/10 text-[#333333] focus:outline-none focus:border-[#333333]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#333333]/50 hover:text-[#333333] transition-colors cursor-pointer"
              aria-label="Afficher ou masquer le mot de passe"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#333333] hover:bg-black text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? "Mise à jour en cours..." : "Mettre à jour le mot de passe"}</span>
          </button>
        </div>

      </form>

      <div className="mt-8 p-4 rounded-2xl bg-[#F5EBE6]/20 border border-[#333333]/10 flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#6E857B] shrink-0 mt-0.5" />
        <div>
          <h2 className="text-xs font-bold text-[#333333]">Sécurité et chiffrement Supabase Auth</h2>
          <p className="text-[11px] text-[#333333]/70 mt-0.5 leading-relaxed">
            Toutes vos données d'authentification sont cryptées et gérées de manière sécurisée par les protocoles de chiffrement de pointe Supabase.
          </p>
        </div>
      </div>

    </div>
  );
}