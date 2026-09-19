import React from "react";

// Etapes standards du tunnel logistique AURAE
const TRACKING_STEPS = [
  { key: 'order_received', label: 'Commande reçue' },
  { key: 'payment_confirmed', label: 'Paiement confirmé' },
  { key: 'processing', label: 'Préparation' },
  { key: 'shipped', label: 'Expédiée' },
  { key: 'in_transit', label: 'En transit' },
  { key: 'delivered', label: 'Livrée' },
];

interface HistoryEvent {
  status: string;
  created_at: string;
  description?: string;
}

interface OrderTimelineProps {
  currentStatusKey: string;
  historyEvents: HistoryEvent[];
}

export function OrderTimeline({ currentStatusKey, historyEvents }: OrderTimelineProps) {
  // Déterminer l'index actuel
  const currentIndex = TRACKING_STEPS.findIndex(step => step.key === currentStatusKey);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-[#333333]">Suivi de commande</h3>
      <div className="flex flex-col gap-3">
        {TRACKING_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const eventDetails = historyEvents.find(e => e.status === step.key);

          return (
            <div key={step.key} className="flex items-start gap-3">
              <span className={`text-xl ${isCompleted || isCurrent ? 'text-[#6E857B]' : 'text-gray-300'}`}>
                {isCompleted && '✓'}
                {isCurrent && '●'}
                {!isCompleted && !isCurrent && '○'}
              </span>
              <div>
                <p className={`font-medium ${isCurrent ? 'text-[#6E857B] font-bold' : 'text-[#333333]'}`}>
                  {step.label}
                </p>
                {eventDetails && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(eventDetails.created_at).toLocaleDateString('fr-FR')} 
                    {eventDetails.description ? ` - ${eventDetails.description}` : ''}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}