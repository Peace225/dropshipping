import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialisation de Supabase avec la clé service role pour autoriser l'écriture sécurisée
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId, playerId } = await req.json();

    if (!userId || !playerId) {
      return NextResponse.json(
        { error: 'Paramètres manquants (userId ou playerId)' },
        { status: 400 }
      );
    }

    // Enregistrement ou mise à jour dans la table des joueurs OneSignal
    const { error } = await supabaseAdmin
      .from('onesignal_players')
      .upsert(
        { user_id: userId, onesignal_id: playerId, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Player ID sauvegardé avec succès' });
  } catch (err: any) {
    console.error('Erreur serveur:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}