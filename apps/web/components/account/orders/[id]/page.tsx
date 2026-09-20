import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { createClient } from "@/lib/supabase/server";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: order } = await supabase.from("orders").select("*, order_tracking(*)").eq("id", params.id).single();
  const fallback = { status: "pending", order_tracking: [] as any[] };
  const finalOrder = order || fallback;
  return (
    <main className="p-6">
      <OrderTimeline currentStatusKey={finalOrder.status} historyEvents={finalOrder.order_tracking || []} />
    </main>
  );
}
