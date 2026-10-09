"use client";

import { useEffect, useState, useRef } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Package, Sparkles, ArrowRight, Truck, Clock, CheckCircle, ShoppingBag, Eye, TrendingUp, BellRing, Bell, Smartphone } from "lucide-react";
import Link from "next/link";

export default function EspaceClientPage() {
  const router = useRouter();
  const [supabase] = useState(() => getSupabase());
  const [userProfile, setUserProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestNotification, setLatestNotification] = useState<string | null>(null);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | "default">("default");

  const userIdRef = useRef<string | null>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPermission(Notification.permission);
    }

    async function getData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = "/auth/connexion";
        return;
      }

      const userId = session.user.id;
      userIdRef.current = userId;

      // Utilisation de .maybeSingle() pour éviter de faire planter la promesse si l'utilisateur est récent
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      let { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .in("status", ["pending", "processing", "shipped", "delivered", "paid", "completed", "validated"])
        .order("created_at", { ascending: false })
        .limit(20);

      if (ordersData) {
        ordersData = ordersData.filter((o: any) => {
          if (o.is_test === true || o.is_fake === true) return false;
          if (o.status === "test" || o.status === "fake" || o.status === "cart") return false;
          if (o.id?.slice(0, 8).toUpperCase() === "03F4216E" && Number(o.total_amount || o.total) === 54.90) return false;
          return true;
        });
      }

      const { data: notifs } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (isMounted) {
        setUserProfile(userData || { full_name: session.user.user_metadata?.full_name || "Client ECLOSIA", email: session.user.email });
        setOrders(ordersData || []);
        setNotifications(notifs || []);
        setLoading(false);
      }
    }

    getData();
    return () => { isMounted = false; };
  }, [supabase]);

  useEffect(() => {
    if (loading || !userIdRef.current) return;
    const userId = userIdRef.current;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channelName = `eclosia-user-${userId}-${Date.now()}`;
    const channel = supabase.channel(channelName);

    channel
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `user_id=eq.${userId}` }, (payload: any) => {
          const updatedOrder = payload.new as any;
          const oldOrder = payload.old as any;
          setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
          if (oldOrder.status !== updatedOrder.status) {
            if (updatedOrder.status === 'shipped') {
              const msg = `Votre commande #${updatedOrder.id.slice(0, 8).toUpperCase()} est en route!`;
              setLatestNotification(msg);
            }
          }
        }
      )
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, (payload: any) => {
          const newNotif = payload.new;
          setNotifications((prev) => [newNotif, ...prev]);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [loading, supabase]);

  const enablePush = async () => {
    if (!("Notification" in window)) return alert("Notifications non supportées");
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if (perm === "granted") {
      if ('serviceWorker' in navigator) { 
        try { await navigator.serviceWorker.register('/sw.js'); } catch {} 
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('push_tokens').upsert({ user_id: session.user.id, token: `web-${Date.now()}`, platform: 'web' });
      }
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#6E857B] border-t-transparent animate-spin" />
      </div>
    );
  }

  const stats = {
    total: orders.length,
    enCours: orders.filter(o => ['processing', 'shipped', 'pending', 'validated', 'paid'].includes(o.status)).length,
    totalSpent: orders.reduce((acc, o) => acc + Number(o.total_amount || o.total || 0), 0)
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="bg-gradient-to-r from-[#6E857B] to-[#5b7067] rounded-3xl p-5 sm:p-8 text-white shadow-lg">
        <h1 className="text-xl sm:text-3xl font-black">
          Hello {userProfile?.full_name?.split(' ')[0] || "Maman"} 👋
        </h1>
      </div>
      {/* Le reste de votre JSX */}
    </div>
  );
}