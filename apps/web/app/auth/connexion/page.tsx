"use client";
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function ConnexionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/10 py-12 flex flex-col justify-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour Ã  l'accueil AURAE</span>
        </Link>

        <div className="bg-white p-8 rounded-3xl border border-[#333333]/10 shadow-sm">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8C5C8]/40 text-[#333333] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6E857B]" />
              Espace Client sÃ©curisÃ©
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
              Bon retour parmi nous
            </h1>
            <p className="text-xs sm:text-sm text-[#333333]/70 font-medium mt-1">
              Connectez-vous pour suivre vos commandes et profiter de vos avantages.
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center border-t border-[#333333]/10 pt-6">
            <p className="text-xs text-[#333333]/70 font-medium">
              Pas encore de compte ?{" "}
              <Link href="/auth/register" className="font-bold text-[#333333] hover:underline">
                CrÃ©er un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

