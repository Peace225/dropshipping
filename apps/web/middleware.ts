import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        // ✅ Ajout du type explicite pour les cookies
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Récupération de l'utilisateur via le cookie de session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isAdmin = url.pathname.startsWith('/admin')
  const isCompte = url.pathname.startsWith('/compte')

  // Helper pour rediriger en conservant les cookies de session Supabase
  const redirectWithCookies = (destination: string) => {
    url.pathname = destination
    const redirectResponse = NextResponse.redirect(url)
    
    // Transfère les cookies mis à jour vers la réponse de redirection
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    
    return redirectResponse
  }

  // 1. Redirection des utilisateurs non connectés vers la page de connexion
  if (!user && (isAdmin || isCompte)) {
    return redirectWithCookies('/auth/connexion')
  }

  // 2. Vérification des droits administrateur
  if (user && isAdmin) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role !== 'super_admin' && profile?.role !== 'admin') {
      return redirectWithCookies('/compte')
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/compte', '/compte/:path*'],
}