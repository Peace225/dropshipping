import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ONESIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID')!
const ONESIGNAL_REST_API_KEY = Deno.env.get('ONESIGNAL_REST_API_KEY')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const { record, old_record, title, message } = payload

    // ==========================================
    // 1. MODE BROADCAST (Si appel direct sans record)
    // ==========================================
    if (!record && title && message) {
      const broadcastPayload = {
        app_id: ONESIGNAL_APP_ID,
        included_segments: ["All"],
        contents: { fr: message },
        headings: { fr: title }
      }

      const res = await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`
        },
        body: JSON.stringify(broadcastPayload)
      })

      const data = await res.json()
      return new Response(JSON.stringify({ success: true, broadcast: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      })
    }

    if (!record) {
      return new Response("Aucune donnée (record) trouvée.", { headers: corsHeaders, status: 200 })
    }

    // ==========================================
    // 2. ANTI-SPAM (Si le statut n'a pas changé)
    // ==========================================
    if (old_record && old_record.status === record.status) {
      return new Response("Statut inchangé, notification ignorée.", { headers: corsHeaders, status: 200 })
    }

    // ==========================================
    // 3. INITIALISATION SUPABASE ADMIN
    // ==========================================
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const userId = record.user_id || record.customer_id

    if (!userId) {
      return new Response("Pas d'ID utilisateur associé à cet enregistrement.", { headers: corsHeaders, status: 200 })
    }

    // ==========================================
    // 4. RÉCUPÉRATION DU ONESIGNAL_ID (Avec Fallback corrigé)
    // ==========================================
    let onesignal_id = null
    let userEmail = record.email || null
    let userName = record.full_name || "Client(e)"

    // Recherche dans la table users
    const { data: userRecord } = await supabaseAdmin
      .from('users')
      .select('onesignal_id, email, full_name')
      .eq('id', userId)
      .single()

    if (userRecord) {
      onesignal_id = userRecord.onesignal_id
      if (userRecord.email) userEmail = userRecord.email
      if (userRecord.full_name) userName = userRecord.full_name
    }

    // Fallback : Recherche dans la table onesignal_players avec la colonne player_id
    if (!onesignal_id) {
      const { data: playerRecord } = await supabaseAdmin
        .from('onesignal_players')
        .select('player_id')
        .eq('user_id', userId)
        .single()

      if (playerRecord) {
        onesignal_id = playerRecord.player_id
      }
    }

    if (!onesignal_id) {
      return new Response("Utilisateur sans ID OneSignal actif.", { headers: corsHeaders, status: 200 })
    }

    // ==========================================
    // 5. MESSAGES INTELLIGENTS SELON LE STATUT
    // ==========================================
    const status = record.status || 'updated'
    let notifTitle = "ECLOSIA - Suivi de commande"
    let notifMessage = `Votre commande #${record.id} a été mise à jour. 🌿`

    switch (status) {
      case 'paid':
      case 'confirmed':
        notifTitle = "Commande confirmée ✨"
        notifMessage = `Merci ${userName} ! Votre commande ECLOSIA #${record.id} est bien validée.`
        break;
      case 'shipped':
      case 'expédiée':
        notifTitle = "Commande expédiée 📦"
        notifMessage = `Bonne nouvelle ! Votre commande ECLOSIA #${record.id} est en route.`
        break;
      case 'delivered':
      case 'livrée':
        notifTitle = "Commande livrée 🎉"
        notifMessage = `Votre colis ECLOSIA #${record.id} a été livré. Profitez-en bien !`
        break;
    }

    // ==========================================
    // 6. ENVOI DE LA PUSH NOTIFICATION (OneSignal)
    // ==========================================
    const pushPayload = {
      app_id: ONESIGNAL_APP_ID,
      include_player_ids: [onesignal_id],
      contents: { fr: notifMessage },
      headings: { fr: notifTitle }
    }

    const pushRes = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(pushPayload)
    })
    const pushData = await pushRes.json()

    // ==========================================
    // 7. EMAIL RESEND EN PARALLÈLE (Si configuré)
    // ==========================================
    let emailData = null
    if (RESEND_API_KEY && userEmail) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: "ECLOSIA <no-reply@eclosia.shop>",
            to: [userEmail],
            subject: notifTitle,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                <h2 style="color: #6E857B;">ECLOSIA</h2>
                <p>Bonjour <strong>${userName}</strong>,</p>
                <p>${notifMessage}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #888;">Ceci est un message automatique de votre boutique ECLOSIA.</p>
              </div>
            `
          })
        })
        emailData = await emailRes.json()
      } catch (err) {
        console.error("Erreur envoi email Resend:", err)
      }
    }

    return new Response(JSON.stringify({ success: true, push: pushData, email: emailData }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200 
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500 
    })
  }
})