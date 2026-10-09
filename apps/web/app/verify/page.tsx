"use client"

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ShieldCheck, Mail, RefreshCw, Check, AlertCircle, Sparkles } from 'lucide-react'
import { getSupabase } from "@/lib/supabase/client"

function VerifyContent() {
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''

  const [supabase] = useState(() => getSupabase())
  const hasSubmittedRef = useRef(false)

  const [email, setEmail] = useState("")
  const [codes, setCodes] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem('eclosia_pending_email')
    const finalEmail = emailFromUrl || stored || ""
    if (finalEmail) {
      setEmail(finalEmail)
      localStorage.setItem('eclosia_pending_email', finalEmail)
    }
  }, [emailFromUrl])

  const validerCode = async (otpToVerify: string) => {
    if (otpToVerify.length !== 6 || !email) return
    if (loading || success || hasSubmittedRef.current) return
    
    hasSubmittedRef.current = true
    setLoading(true)
    setError('')

    try {
      // 1. Essai de validation avec le type 'signup'
      let authResponse = await supabase.auth.verifyOtp({
        email: email.toLowerCase().trim(),
        token: otpToVerify,
        type: 'signup',
      })
      
      // Fallback sur le type 'email' si nécessaire
      if (authResponse.error) {
        authResponse = await supabase.auth.verifyOtp({
          email: email.toLowerCase().trim(),
          token: otpToVerify,
          type: 'email',
        })
      }

      if (authResponse.error) throw authResponse.error

      // 2. 🔑 Forcer la récupération et l'écriture de la session dans les cookies
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !sessionData.session) {
        const { error: refreshError } = await supabase.auth.refreshSession()
        if (refreshError) throw refreshError
      }

      // Envoi de l'email de bienvenue
      if (authResponse.data?.user) {
        fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.toLowerCase().trim() }),
        }).catch(() => {})
      }

      setSuccess(true)
      localStorage.removeItem('eclosia_pending_email')

      // Pause de 100ms pour garantir l'enregistrement effectif du cookie de session
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Redirection directe vers le compte
      window.location.href = '/compte'

    } catch (err: any) {
      const status = err?.status
      const msg = (err?.message || "").toLowerCase()

      // Si le compte est déjà vérifié
      if (status === 403 || msg.includes("already confirmed") || msg.includes("already verified")) {
        const { data: { session } } = await supabase.auth.refreshSession()
        
        if (session) {
          window.location.href = '/compte'
          return
        }

        localStorage.removeItem('eclosia_pending_email')
        window.location.href = '/auth/connexion?verified=1&email=' + encodeURIComponent(email)
        return
      }

      hasSubmittedRef.current = false
      setError(
        msg.includes("expired") ? "Code expiré. Cliquez sur Renvoyer." :
        msg.includes("invalid") || msg.includes("token") ? "Code invalide. Vérifiez et réessayez." :
        `Erreur: ${err?.message}`
      )
      setLoading(false)
    }
  }

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return
    const newCodes = [...codes]
    newCodes[index] = value.slice(-1)
    setCodes(newCodes)
    setError('')

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
    const codeStr = newCodes.join('')
    if (codeStr.length === 6 && !hasSubmittedRef.current) {
      validerCode(codeStr)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('')
    if (pasted.length === 6) {
      setCodes(pasted)
      inputsRef.current[5]?.focus()
      if (!hasSubmittedRef.current) validerCode(pasted.join(''))
    }
  }

  const resendCode = async () => {
    if (!email || resending) return
    setResending(true)
    setError("")
    hasSubmittedRef.current = false
    setCodes(['', '', '', '', '', ''])
    setTimeout(() => inputsRef.current[0]?.focus(), 50)

    try {
      const origin = window.location.origin
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.toLowerCase().trim(),
        options: { emailRedirectTo: `${origin}/auth/callback?next=/compte` },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-3 sm:px-4 py-8">
      <div className="w-full max-w-md shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-[#6E857B] to-[#5b7067] p-6 sm:p-7 text-center">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-widest">ECLOSIA</h1>
          <p className="text-white/80 text-xs sm:text-sm mt-1">Maternité & Puériculture</p>
        </div>

        <div className="bg-white p-5 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto bg-[#FAF7F2] h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Mail className="h-6 w-6 sm:h-7 sm:w-7 text-[#6E857B]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Vérifiez votre email</h2>
            <p className="text-xs sm:text-sm text-gray-500 px-2">
              Un code de confirmation a été envoyé à<br />
              <strong className="text-[#333333] font-semibold break-all">{email || 'votre adresse e-mail'}</strong>
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); if (!hasSubmittedRef.current) validerCode(codes.join('')); }} className="space-y-6 sm:space-y-8">
            <div className="flex justify-between gap-1.5 sm:gap-3">
              {codes.map((val, i) => (
                <input
                  key={i}
                  ref={el => { inputsRef.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border rounded-lg focus:ring-2 focus:ring-[#6E857B] focus:border-[#6E857B] outline-none transition-all ${
                    error ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 bg-gray-50 text-gray-900'
                  }`}
                  disabled={loading || success}
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success || codes.join('').length !== 6}
              className={`w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-4 rounded-xl font-bold text-sm sm:text-base text-white transition-all ${
                success ? 'bg-green-500' : 'bg-[#333333] hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
              }`}
            >
              {success ? <><Check className="w-5 h-5" /> Vérifié avec succès</> : loading ? <><RefreshCw className="w-5 h-5 animate-spin" /> Vérification...</> : <><ShieldCheck className="w-5 h-5" /> Confirmer mon compte</>}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm">
            <p className="text-gray-500 mb-2 sm:mb-3">Vous n'avez pas reçu le code?</p>
            <button type="button" onClick={resendCode} disabled={resending || loading || success} className="text-[#6E857B] font-semibold hover:text-[#5b7067] hover:underline disabled:text-gray-400 flex items-center justify-center gap-1.5 mx-auto">
              {resending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {resending ? 'Envoi en cours...' : 'Renvoyer le code par e-mail'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center"><RefreshCw className="w-8 h-8 animate-spin text-[#6E857B]" /></div>}>
      <VerifyContent />
    </Suspense>
  )
}