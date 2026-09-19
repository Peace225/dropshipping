export const TRACKING_STEPS = [
  { key: 'order_received', label: 'Commande reçue' },
  { key: 'payment_confirmed', label: 'Paiement confirmé' },
  { key: 'processing', label: 'Préparation' },
  { key: 'shipped', label: 'Expédiée' },
  { key: 'in_transit', label: 'En transit' },
  { key: 'delivered', label: 'Livrée' },
] as const;