"use client"

import { useState, useEffect, useRef, Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShieldCheck, Mail, RefreshCw, Check, AlertCircle, Sparkles } from 'lucide-react'

// Initialisation du client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''

  const [email, setEmail] = useState(emailFromUrl)
  const [codes, setCodes] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('eclosia_pending_email')
    if (!email && stored) setEmail(stored)
    if (emailFromUrl) localStorage.setItem('eclosia_pending_email', emailFromUrl)
  }, [emailFromUrl, email])

  const code = codes.join('')

  // Gestion de la saisie (chiffres uniquement + auto-focus suivant)
  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return
    const newCodes = [...codes]
    newCodes[index] = value.slice(-1)
    setCodes(newCodes)
    setError('')
    
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  // Retour en arrière avec la touche effacer (Backspace)
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  // Permet de coller les 6 chiffres directement
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6).split('')
    if (pasted.length === 6) {
      setCodes(pasted)
      inputsRef.current[5]?.focus()
    }
  }

  const validerCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (code.length !== 6) { setError('Veuillez saisir les 6 chiffres'); return }
    if (!email) { setError('Email manquant. Retournez à l’inscription.'); return }

    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.verifyOtp({
      email, token: code, type: 'signup',
    })

    if (authError) {
      setError('Code incorrect ou expiré. Vérifiez votre email ECLOSIA.')
      setLoading(false)
      return
    }

    // Envoi de l'email de bienvenue non-bloquant
    try {
      await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {}

    setSuccess(true)
    localStorage.removeItem('eclosia_pending_email')
    
    // Redirection fluide
    setTimeout(() => router.push('/compte'), 1000)
  }

  // Renvoi du code via l'infrastructure SMTP configurée
  const resendCode = async () => {
    if (!email) return
    setResending(true)
    await supabase.auth.resend({
      type: 'signup', email,
      options: { emailRedirectTo: `${window.location.origin}/verify?email=${email}` },
    })
    setResending(false)
  }

  // Soumission automatique si les 6 cases sont remplies
  useEffect(() => { 
    if (code.length === 6 && !loading && !success) {
      validerCode()
    }
  }, [code, loading, success])

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md shadow-2xl rounded-2xl">
        
        {/* Header ECLOSIA (Dégradé corrigé) */}
        <div className="bg-gradient-to-br from-[#6E857B] to-[#5b7067] rounded-t-2xl p-7 text-center">
          <h1 className="text-2xl font-black text-white tracking-widest">ECLOSIA</h1>
          <p className="text-white/80 text-sm mt-1">Maternité & Puériculture</p>
        </div>
        
        <div className="bg-white rounded-b-2xl border border-gray-100 p-8 shadow-sm">
          
          <div className="text-center mb-8">
            <div className="mx-auto bg-[#FAF7F2] h-14 w-14 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-7 w-7 text-[#6E857B]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Vérifiez votre email</h2>
            <p className="text-sm text-gray-500">
              Un code de confirmation a été envoyé à<br />
              <strong className="text-[#333333] font-semibold">{email || 'votre adresse e-mail'}</strong>
            </p>
          </div>

          <form onSubmit={validerCode} className="space-y-8">
            {/* 6 Cases OTP */}
            <div className="flex justify-between gap-2 sm:gap-4">
              {codes.map((val, i) => (
                <input
                  key={i}
                  ref={el => { inputsRef.current[i] = el }}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className={`w-12 h-14 text-center text-2xl font-bold border rounded-lg focus:ring-2 focus:ring-[#6E857B] focus:border-[#6E857B] outline-none transition-all ${
                    error ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 bg-gray-50 text-gray-900'
                  }`}
                  disabled={loading || success}
                />
              ))}
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Bouton de confirmation */}
            <button
              type="submit"
              disabled={loading || success || code.length !== 6}
              className={`w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-bold text-white transition-all ${
                success 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-[#333333] hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
              }`}
            >
              {success ? (
                <><Check className="w-5 h-5" /> Vérifié avec succès</>
              ) : loading ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /> Vérification...</>
              ) : (
                <><ShieldCheck className="w-5 h-5" /> Confirmer mon compte</>
              )}
            </button>
          </form>

          {/* Bouton renvoi de code */}
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-500 mb-3">Vous n'avez pas reçu le code ?</p>
            <button
              onClick={resendCode}
              disabled={resending || loading || success}
              className="text-[#6E857B] font-semibold hover:text-[#5b7067] hover:underline disabled:text-gray-400 disabled:no-underline flex items-center justify-center gap-1.5 mx-auto transition-colors"
            >
              {resending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {resending ? 'Envoi en cours...' : 'Renvoyer le code par e-mail'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  )
}

// Composant principal qui gère le composant <Suspense> exigé par Next.js 13/14/15 pour useSearchParams()
export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center"><RefreshCw className="w-8 h-8 animate-spin text-[#6E857B]" /></div>}>
      <VerifyContent />
    </Suspense>
  )
}