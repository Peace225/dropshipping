import { OrderTimeline } from '@/components/orders/order-timeline';

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  // Récupération de la commande et du suivi depuis Supabase
  return (
    <main className="p-6">
      <OrderTimeline 
        currentStatusKey={order.status} 
        historyEvents={order.order_tracking} 
      />
    </main>
  );
}