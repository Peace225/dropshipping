"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Package, Sparkles, ArrowRight, Truck, Clock, CheckCircle, ShoppingBag, Eye, TrendingUp, BellRing, Bell, Smartphone } from "lucide-react";
import Link from "next/link";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function EspaceClientPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestNotification, setLatestNotification] = useState<string | null>(null);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | "default">("default");
  
  const userIdRef = useRef<string | null>(null);
  const channelRef = useRef<any>(null);

  // 1️⃣ PREMIER USE-EFFECT : Chargement des données (Fetch)
  useEffect(() => {
    let isMounted = true;

    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPermission(Notification.permission);
    }

    async function getData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { 
        router.push("/auth/connexion"); 
        return; 
      }

      const userId = session.user.id;
      userIdRef.current = userId;

      const { data: userData } = await supabase.from("users").select("*").eq("id", userId).single();
      
      let { data: ordersData } = await supabase
       .from("orders")
       .select("*")
       .eq("user_id", userId)
       .in("status", ["pending","processing","shipped","delivered","paid","completed","validated"])
       .order("created_at", { ascending: false })
       .limit(20);

      if (ordersData) {
        ordersData = ordersData.filter((o: any) => {
          if (o.is_test === true || o.is_fake === true) return false;
          if (o.status === "test" || o.status === "fake" || o.status === "cart") return false;
          if (o.id?.slice(0,8).toUpperCase() === "03F4216E" && Number(o.total_amount || o.total) === 54.90) return false;
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

    return () => { 
      isMounted = false; 
    };
  }, [router]);


  // 2️⃣ DEUXIÈME USE-EFFECT : Supabase Realtime (Se lance UNIQUEMENT quand le loading est terminé)
  useEffect(() => {
    if (loading || !userIdRef.current) return;

    const userId = userIdRef.current;

    // Sécurité HMR : on nettoie le channel s'il existait déjà
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Création d'un nom de channel unique avec Date.now() pour éviter les collisions
    const channelName = `eclosia-user-${userId}-${Date.now()}`;
    const channel = supabase.channel(channelName);

    channel
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `user_id=eq.${userId}` },
        (payload: any) => {
          const updatedOrder = payload.new as any;
          const oldOrder = payload.old as any;
          
          setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));

          if (oldOrder.status !== updatedOrder.status) {
            if (updatedOrder.status === 'shipped') {
              const msg = `📦 Votre commande #${updatedOrder.id.slice(0, 8).toUpperCase()} de ${Number(updatedOrder.total_amount||0).toFixed(2)}€ est en route!`;
              setLatestNotification(msg);
              if (typeof window !== "undefined" && Notification.permission === "granted") {
                new Notification("🚚 ECLOSIA : Colis en route!", { body: msg, icon: "/icon.png", vibrate: [200,100,200] } as any);
                if (navigator.vibrate) navigator.vibrate([200,100,200]);
              }
              fetch('/api/orders/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: updatedOrder.id, status: 'shipped' })
              }).catch(()=>{});
            }
            if (updatedOrder.status === 'delivered') {
              setLatestNotification(`✨ Commande #${updatedOrder.id.slice(0, 8).toUpperCase()} livrée!`);
            }
            if (['paid','validated','processing'].includes(updatedOrder.status)) {
              setLatestNotification(`✅ Commande #${updatedOrder.id.slice(0, 8).toUpperCase()} validée!`);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload: any) => {
          const newNotif = payload.new;
          setNotifications((prev) => [newNotif, ...prev]);
          setLatestNotification(newNotif.title + " : " + newNotif.message.slice(0,60));
          if (typeof window !== "undefined" && Notification.permission === "granted") {
            new Notification(newNotif.title, { body: newNotif.message, icon: "/icon.png" });
          }
        }
      )
      .subscribe(); // Toujours à la fin

    // Sauvegarde la référence pour le nettoyage
    channelRef.current = channel;

    // Cleanup natif et propre
    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [loading]);


  const enablePush = async () => {
    if (!("Notification" in window)) return alert("Notifications non supportées");
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if (perm === "granted") {
      if ('serviceWorker' in navigator) { try { await navigator.serviceWorker.register('/sw.js'); } catch {} }
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('push_tokens').upsert({ user_id: session.user.id, token: `web-${Date.now()}`, platform: 'web' });
      }
      new Notification("🔔 ECLOSIA : Notifications activées!", { body: "Vous serez notifié sur votre téléphone - Livraison 10€ offerte dès 60€", icon: "/icon.png" });
    }
  };

  if (loading) {
    return <div className="py-20 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#6E857B] border-t-transparent animate-spin" /></div>;
  }

  const stats = {
    total: orders.length,
    enCours: orders.filter(o => ['processing','shipped','pending','validated','paid'].includes(o.status)).length,
    totalSpent: orders.reduce((acc, o) => acc + Number(o.total_amount || o.total || 0), 0)
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {notifPermission !== "granted" && (
        <div className="bg-[#333333] rounded-2xl p-4 flex items-center justify-between gap-4 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6E857B] flex items-center justify-center"><Bell className="w-5 h-5" /></div>
            <div>
              <p className="text-sm font-bold flex items-center gap-1.5"><Smartphone className="w-4 h-4" /> Activer notif téléphone</p>
              <p className="text-xs text-white/70">Alerte directe quand colis 25,90€/74,90€ en route</p>
            </div>
          </div>
          <button onClick={enablePush} className="px-5 py-2.5 rounded-full bg-white text-[#333333] text-xs font-black hover:bg-[#F5EBE6] shrink-0">Activer</button>
        </div>
      )}

      {latestNotification && (
        <div className="bg-[#6E857B] text-white p-4 rounded-2xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BellRing className="w-6 h-6 animate-pulse text-[#E8C5C8] shrink-0" />
            <p className="text-xs sm:text-sm font-bold">{latestNotification}</p>
          </div>
          <button onClick={() => setLatestNotification(null)} className="text-white/80 hover:text-white text-xs font-bold bg-white/10 px-3 py-1 rounded-full shrink-0">Fermer</button>
        </div>
      )}

      {notifications.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-black/5 flex items-center gap-2 font-bold text-sm text-[#333333]"><BellRing className="w-4 h-4 text-[#6E857B]" /> Notifications</div>
          <div className="divide-y divide-black/5">
            {notifications.slice(0,3).map((n:any) => (
              <div key={n.id} className="p-4 flex gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.type==='shipped'?'bg-blue-100 text-blue-600':'bg-green-100 text-green-600'}`}>
                  {n.type==='shipped'? <Truck className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#333333]">{n.title}</p>
                  <p className="text-xs text-black/60 mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-black/40 mt-1">{new Date(n.created_at).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-[#6E857B] to-[#5b7067] rounded-3xl p-5 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 mb-3 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#E8C5C8]" />Espace Premium
          </span>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight">Hello {userProfile?.full_name?.split(' ')[0] || "Maman"} 👋</h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">Suivi temps réel + notif téléphone - SKU-BUM1 25,90€, SKU-KITBIO40X80M2 74,90€</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm"><div className="flex items-center gap-2 text-[10px] sm:text-xs text-black/60 font-bold uppercase"><Package className="w-4 h-4 text-[#6E857B]" />Commandes</div><p className="text-xl sm:text-2xl font-black mt-1 text-[#333333]">{stats.total}</p></div>
        <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm"><div className="flex items-center gap-2 text-[10px] sm:text-xs text-black/60 font-bold uppercase"><Truck className="w-4 h-4 text-[#6E857B]" />En cours</div><p className="text-xl sm:text-2xl font-black mt-1 text-[#333333]">{stats.enCours}</p></div>
        <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm"><div className="flex items-center gap-2 text-[10px] sm:text-xs text-black/60 font-bold uppercase"><TrendingUp className="w-4 h-4 text-[#6E857B]" />Dépensé</div><p className="text-xl sm:text-2xl font-black mt-1 text-[#333333]">{stats.totalSpent.toFixed(2)}€</p></div>
      </div>

      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-black/5">
          <h2 className="font-bold text-sm sm:text-base flex items-center gap-2 text-[#333333]"><Clock className="w-5 h-5 text-[#6E857B]" />Commandes en ligne</h2>
          <Link href="/compte/commandes" className="text-xs font-bold text-[#6E857B] hover:underline">Voir l'historique →</Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-[#F5EBE6] rounded-3xl flex items-center justify-center mx-auto mb-4"><ShoppingBag className="w-8 h-8 text-[#6E857B]" /></div>
            <h3 className="font-bold text-sm text-[#333333]">Aucune commande pour le moment</h3>
            <p className="text-xs text-black/60 mt-1 max-w-xs mx-auto">Culotte 25,90€ SKU-BUM1, Matelas 40x80 74,90€ SKU-KITBIO40X80M2 - Livraison offerte dès 60€.</p>
            <Link href="/shop" className="inline-flex mt-5 px-6 py-3 rounded-full bg-[#333333] text-white text-xs font-bold hover:bg-black transition-all">Commencer mes achats <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {orders.map((order) => (
              <div key={order.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F5EBE6]/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${order.status === 'delivered'? 'bg-green-100 text-green-700' : order.status === 'shipped'? 'bg-blue-500 text-white animate-pulse' : 'bg-orange-100 text-orange-700'}`}>
                    {order.status === 'delivered'? <CheckCircle className="w-6 h-6" /> : order.status === 'shipped'? <Truck className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#333333]">Commande #{order.id.slice(0, 8).toUpperCase()} • {new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                    <p className="text-xs text-black/60 mt-0.5 font-medium">
                      {order.status === 'shipped'? `🚚 En route - Tracking ${order.tracking_number || 'en cours'}` : order.status === 'delivered'? '✨ Livrée' : order.status === 'validated' || order.status === 'paid'? '✅ Validée' : '⏳ En préparation'} • {Number(order.total_amount || order.total || 0).toFixed(2)}€
                    </p>
                    {order.status === 'shipped' && <p className="text-xs text-blue-600 font-bold mt-1">📱 Notif téléphone envoyée</p>}
                  </div>
                </div>
                <Link href={`/compte/commandes/${order.id}`} className="px-4 py-2 rounded-full bg-[#333333] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-black self-end sm:self-auto"><Eye className="w-3.5 h-3.5" />Suivre</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}