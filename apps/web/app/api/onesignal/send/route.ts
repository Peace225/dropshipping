import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { playerId, title, message } = await req.json();

    if (!playerId || !title || !message) {
      return NextResponse.json(
        { error: 'Paramètres requis manquants (playerId, title, message)' },
        { status: 400 }
      );
    }

    const appId = process.env.ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!appId || !apiKey) {
      return NextResponse.json(
        { error: 'Configuration OneSignal manquante sur le serveur' },
        { status: 500 }
      );
    }

    // Appel à l'API REST de OneSignal
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        include_player_ids: [playerId],
        headings: { en: title, fr: title },
        contents: { en: message, fr: message },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Erreur lors de l\'envoi OneSignal:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}