"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Trash2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function FavorisPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFavorites() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth/connexion"); return; }
      const { data } = await supabase.from("favorites").select("*, products(*)").eq("user_id", session.user.id).order("created_at", { ascending: false });
      if (data) setFavorites(data);
      setLoading(false);
    }
    getFavorites();
  }, [router]);

  const handleRemoveFavorite = async (id: string) => {
    await supabase.from("favorites").delete().eq("id", id);
    setFavorites(favorites.filter(f => f.id !== id));
  };

  const handleAddToCart = (product: any) => {
    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      image: product.images?.[0] || "/images/placeholder.png"
    });
  };

  const handleAddAllToCart = () => {
    favorites.forEach(f => f.products && handleAddToCart(f.products));
  };

  const totalFavoris = favorites.reduce((acc, f) => acc + Number(f.products?.price || 0), 0);

  return (
    <div className="space-y-5">
      {/* Header Favoris */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-black/5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-[#333333]">
            Mes Favoris <span className="px-2.5 py-1 rounded-full bg-[#F5EBE6] text-[#6E857B] text-xs">{(favorites || []).length}</span>
          </h1>
          <p className="text-xs text-black/60 mt-1">Vos coups de cœur ECLOSIA • {totalFavoris.toFixed(2)}€ au total</p>
        </div>
        {favorites.length > 0 && (
          <button onClick={handleAddAllToCart} className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#333333] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors cursor-pointer shadow-sm">
            <ShoppingBag className="w-4 h-4" /> Tout ajouter au panier
          </button>
        )}
      </div>

      {/* Incitation Livraison */}
      {favorites.length > 0 && (
        <div className="bg-gradient-to-r from-[#6E857B] to-[#5b7067] rounded-3xl p-4 flex items-center justify-between text-white shadow-sm">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#E8C5C8] shrink-0" />
            <p className="text-xs font-bold">Livraison offerte dès 60€ — {totalFavoris >= 60 ? "Vous y êtes !" : `il vous manque ${(60 - totalFavoris).toFixed(2)}€`}</p>
          </div>
          <Link href="/shop" className="text-xs font-bold bg-white text-[#333333] px-3.5 py-2 rounded-xl hover:bg-[#F5EBE6] transition-colors shrink-0">Compléter</Link>
        </div>
      )}

      {/* Liste des Favoris */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-black/5 shadow-sm">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-black/5 rounded-2xl animate-pulse" />)}</div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-14 border border-dashed border-black/10 rounded-3xl bg-[#F5EBE6]/20 p-6">
            <Heart className="w-12 h-12 text-black/20 mx-auto mb-3" />
            <p className="text-sm font-bold text-[#333333]">Aucun favori pour le moment</p>
            <p className="text-xs text-black/60 mt-1">Ajoutez vos produits préférés avec le petit cœur</p>
            <Link href="/shop" className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#333333] text-white text-xs font-bold hover:bg-black transition-all">
              Découvrir la boutique <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {favorites.map((fav) => (
              <div key={fav.id} className="group p-3 rounded-2xl border border-black/5 flex gap-3 bg-white hover:border-[#6E857B]/30 hover:shadow-sm transition-all">
                <Link href={`/shop/product/${fav.products?.slug}`} className="w-20 h-20 rounded-xl overflow-hidden bg-[#F5EBE6]/50 shrink-0 relative">
                  {fav.products?.images?.[0] ? <Image src={fav.products.images[0]} alt={fav.products.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-black/40">No img</div>}
                </Link>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <Link href={`/shop/product/${fav.products?.slug}`} className="text-xs font-bold line-clamp-2 leading-tight hover:text-[#6E857B] text-[#333333]">{fav.products?.name}</Link>
                    <p className="text-xs font-black text-[#6E857B] mt-1">{Number(fav.products?.price || 0).toFixed(2)} €</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <button onClick={() => handleAddToCart(fav.products)} className="flex-1 px-3 py-2 rounded-xl bg-[#333333] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-black transition-colors cursor-pointer">
                      <ShoppingBag className="w-3.5 h-3.5" />Ajouter
                    </button>
                    <button onClick={() => handleRemoveFavorite(fav.id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}