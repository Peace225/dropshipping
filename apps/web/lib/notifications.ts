import { Resend } from 'resend';
import twilio from 'twilio';

const resend = new Resend(process.env.RESEND_API_KEY);

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient =
  twilioAccountSid && twilioAuthToken
    ? twilio(twilioAccountSid, twilioAuthToken)
    : null;

interface OrderNotificationData {
  orderNumber: string;
  totalAmount: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

// Convertit un numéro français standard (ex: 0612345678) en format E.164 (+33612345678)
function formatToE164(phone: string): string {
  const cleaned = phone.replace(/[\s.-]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `+33${cleaned.slice(1)}`;
  }
  return cleaned;
}

export async function sendOrderNotifications(order: OrderNotificationData) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPhone = process.env.ADMIN_PHONE_NUMBER;
  const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const promises: Promise<unknown>[] = [];

  // ------------------------------------------------------------
  // 1. NOTIFICATIONS CLIENT
  // ------------------------------------------------------------

  // Email Client
  promises.push(
    resend.emails.send({
      from: `AURAE <${senderEmail}>`,
      to: [order.customerEmail],
      subject: `Confirmation de votre commande #${order.orderNumber}`,
      html: `
        <div style="font-family: sans-serif; color: #333333; line-height: 1.6;">
          <h2 style="color: #6E857B;">Merci pour votre commande, ${order.customerName} !</h2>
          <p>Votre commande <strong>#${order.orderNumber}</strong> d'un montant de <strong>${order.totalAmount}</strong> a bien été validée.</p>
          <p>Nous préparons actuellement vos articles avec le plus grand soin. Vous recevrez un nouvel email dès que votre colis sera expédié.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888888;">L'équipe AURAE</p>
        </div>
      `,
    })
  );

  // SMS Client
  if (order.customerPhone && twilioClient && twilioPhoneNumber) {
    const formattedClientPhone = formatToE164(order.customerPhone);
    promises.push(
      twilioClient.messages.create({
        body: `AURAE : Merci pour votre commande #${order.orderNumber} (${order.totalAmount}). Nous préparons votre colis !`,
        from: twilioPhoneNumber,
        to: formattedClientPhone,
      })
    );
  }

  // ------------------------------------------------------------
  // 2. NOTIFICATIONS ADMIN
  // ------------------------------------------------------------

  // Email Admin
  if (adminEmail) {
    promises.push(
      resend.emails.send({
        from: `AURAE Alertes <${senderEmail}>`,
        to: [adminEmail],
        subject: `🚨 Nouvelle commande #${order.orderNumber}`,
        html: `
          <div style="font-family: sans-serif; color: #333333; line-height: 1.6;">
            <h2>Nouvelle commande reçue</h2>
            <ul>
              <li><strong>N° Commande :</strong> #${order.orderNumber}</li>
              <li><strong>Client :</strong> ${order.customerName} (${order.customerEmail})</li>
              <li><strong>Téléphone :</strong> ${order.customerPhone || 'Non renseigné'}</li>
              <li><strong>Montant :</strong> ${order.totalAmount}</li>
            </ul>
            <p>
              <a href="${siteUrl}/admin/commandes" style="background-color: #6E857B; color: #ffffff; padding: 10px 16px; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: bold;">
                Accéder au tableau de bord
              </a>
            </p>
          </div>
        `,
      })
    );
  }

  // SMS Admin
  if (adminPhone && twilioClient && twilioPhoneNumber) {
    const formattedAdminPhone = formatToE164(adminPhone);
    promises.push(
      twilioClient.messages.create({
        body: `🚨 AURAE : Nouvelle commande #${order.orderNumber} de ${order.customerName} (${order.totalAmount}).`,
        from: twilioPhoneNumber,
        to: formattedAdminPhone,
      })
    );
  }

  // Exécution parallèle avec traçabilité des erreurs
  const results = await Promise.allSettled(promises);

  results.forEach((result, idx) => {
    if (result.status === 'rejected') {
      console.error(`[Notification Error - Index ${idx}]:`, result.reason);
    }
  });
}