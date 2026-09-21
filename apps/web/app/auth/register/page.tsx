"use client";
export const dynamic = 'force-dynamic';

import { useState, FormEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Lock, Sparkles, ShieldCheck, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
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
  
  // États pour la vérification OTP
  const [showVerification, setShowVerification] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Gestion du compte à rebours pour le renvoi de code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showVerification && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showVerification, countdown]);

  // ÉTAPE 1 : Inscription et envoi de l'email
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Basculer sur l'écran de vérification
      setShowVerification(true);
      setCountdown(60);
    } catch (error: any) {
      console.error("Erreur Inscription Supabase :", error);
      // Afficher un message clair si le compte existe ou si limite atteinte
      if (error.message.includes("User already registered")) {
        setErrorMessage("Un compte existe déjà avec cette adresse email.");
      } else if (error.message.includes("rate limit")) {
        setErrorMessage("Trop de tentatives. Veuillez réessayer plus tard.");
      } else {
        setErrorMessage(error.message || "Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ÉTAPE 2 : Vérification du code OTP
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    const token = otp.join("");
    if (token.length !== 6) {
      setErrorMessage("Veuillez entrer le code à 6 chiffres.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
      });

      if (verifyError) throw verifyError;

      // Enregistrer l'utilisateur dans la table personnalisée
      if (data.user) {
        await supabase.from("users").upsert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          updated_at: new Date(),
        });
      }

      router.push("/compte");
      router.refresh();
    } catch (error: any) {
      console.error("Erreur Vérification OTP :", error);
      setErrorMessage("Code de vérification invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la saisie dans les cases OTP
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Passer automatiquement au champ suivant
    if (value && index < 5 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    setErrorMessage("");
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) throw error;
      setCountdown(60);
    } catch (error: any) {
      console.error("Erreur Renvoi Code :", error);
      setErrorMessage("Erreur lors du renvoi du code. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EBE6]/30 via-white to-[#6E857B]/15 py-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        
        {!showVerification && (
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]/70 hover:text-[#333333] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil ECLOSIA</span>
          </Link>
        )}

        <div className="bg-white p-8 rounded-3xl border border-[#333333]/10 shadow-lg relative overflow-hidden">
          
          {/* VUE 1 : FORMULAIRE D'INSCRIPTION */}
          {!showVerification ? (
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
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center text-center">
              {/* VUE 2 : VÉRIFICATION OTP */}
              <div className="w-16 h-16 rounded-full bg-[#F5EBE6] flex items-center justify-center mb-4 text-[#6E857B]">
                <Mail className="w-8 h-8" />
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black text-[#333333] mb-2">
                Vérifiez votre adresse e-mail
              </h2>
              <p className="text-sm text-[#333333]/70 mb-8 max-w-[280px]">
                Nous avons envoyé un code de vérification à :<br/>
                <strong className="text-[#333333]">{email}</strong>
              </p>

              {errorMessage && (
                <div className="mb-6 p-3 w-full bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium text-center">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="w-full space-y-8">
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-black text-[#333333] bg-white border-2 border-[#333333]/15 rounded-xl focus:border-[#6E857B] focus:outline-none focus:ring-4 focus:ring-[#6E857B]/10 transition-all"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#6E857B] hover:bg-[#5b7067] text-white font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  <span>{loading ? "Vérification..." : "Soumettre"}</span>
                </button>
              </form>

              <div className="mt-8 text-xs text-[#333333]/70 font-medium">
                Vous n'avez pas reçu le code ? <br/>
                {countdown > 0 ? (
                  <span className="text-[#6E857B] font-bold mt-1 inline-block">
                    Redemandez un nouveau code dans {countdown} secondes
                  </span>
                ) : (
                  <button 
                    onClick={handleResendCode}
                    className="text-[#333333] font-black underline mt-1 hover:text-[#6E857B] transition-colors"
                  >
                    Renvoyer le code
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-[#333333]/60 font-medium pt-4 border-t border-[#333333]/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6E857B]" />
            <span>Sécurité et confidentialité garanties.</span>
          </div>

        </div>
      </div>
    </div>
  );
}