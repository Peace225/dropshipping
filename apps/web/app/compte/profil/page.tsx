"use client";
export const dynamic = 'force-dynamic';

import { useState, FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";
import { Loader2, Check, Lock, Eye, EyeOff } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SecuritePage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      setErrorMsg("Les mots de passe ne correspondent pas.");
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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#333333]/10 shadow-sm space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#333333]">Sécurité du compte</h1>
        <p className="text-xs text-[#333333]/60 mt-1">Modifiez votre mot de passe pour sécuriser votre accès.</p>
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" /> Mot de passe mis à jour avec succès !
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-xs font-bold text-[#333333] mb-1.5">Nouveau mot de passe</label>
          <div className="relative">
            <input 
              type={showNewPassword ? "text" : "password"} 
              required 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border border-[#333333]/15 text-xs bg-[#F5EBE6]/10 focus:outline-none focus:ring-2 focus:ring-[#6E857B]" 
            />
            <button 
              type="button" 
              onClick={() => setShowNewPassword(!showNewPassword)} 
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#333333]"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#333333] mb-1.5">Confirmer le mot de passe</label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              required 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border border-[#333333]/15 text-xs bg-[#F5EBE6]/10 focus:outline-none focus:ring-2 focus:ring-[#6E857B]" 
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#333333]"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#333333] hover:bg-black text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <Lock className="w-4 h-4" />
          <span>Mettre à jour le mot de passe</span>
        </button>
      </form>
    </div>
  );
}