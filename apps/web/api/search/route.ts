import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim() || '';

  if (!query) {
    return NextResponse.json({ products: [] });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Exécution de la recherche catalogue
  const { data: products, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .ilike('name', `%${query}%`)
    .eq('is_active', true);

  const resultsCount = count || products?.length || 0;

  // 2. Traçabilité asynchrone (Non-bloquante pour la réponse UI)
  supabase
    .from('searches')
    .insert({
      user_id: user?.id || null,
      query: query,
      results_count: resultsCount,
    })
    .then(({ error }) => {
      if (error) console.error('[SEARCH_LOG_ERROR]', error);
    });

  return NextResponse.json({ products, resultsCount });
}