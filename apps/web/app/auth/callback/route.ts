import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // 1. Sécurité Open Redirect : validation stricte du paramètre next
  let next = searchParams.get('next') ?? '/compte';
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('http://') || next.includes('https://')) {
    next = '/compte';
  }

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          // ✅ Ajout du type explicite pour corriger l'erreur TS
          setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                // Utilisation de la syntaxe objet, plus stable en Next.js 15
                cookieStore.set({ name, value, ...options });
              });
            } catch {
              // Le catch capture l'erreur si appelé dans un Server Component (lecture seule)
              // mais fonctionnera parfaitement ici dans un Route Handler.
            }
          },
        },
      }
    );

    // Échange du code d'autorisation contre une session Supabase
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      try {
        const userData = {
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || '',
          email: data.user.email?.toLowerCase() || '',
          updated_at: new Date().toISOString(),
        };

        // Synchronisation des tables utilisateurs
        await Promise.all([
          supabase.from('profiles').upsert(userData, { onConflict: 'id' }),
          supabase.from('users').upsert(userData, { onConflict: 'id' })
        ]);
        
        // Envoi de l'e-mail de bienvenue
        await fetch(`${origin}/api/send-welcome-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.user.email?.toLowerCase() }),
        }).catch(() => {});

      } catch (err) {
        console.error("Erreur lors de la synchronisation des profils/utilisateurs :", err);
      }

      // Redirection APRES la création de session : les cookies seront automatiquement attachés.
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // En cas d'erreur ou de code absent/invalide
  return NextResponse.redirect(`${origin}/auth/connexion?error=lien_invalide`);
}