"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const PLACEHOLDER = "https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/placeholder.jpg";

function cleanImageUrl(raw?: string): string {
  if (!raw) return PLACEHOLDER;
  const first = raw.includes("|") ? raw.split("|")[0].trim() : raw.trim();
  if (!first) return PLACEHOLDER;
  if (first.startsWith("http")) return first;
  const f = first.split("/").pop() || first;
  return `https://cbvpxrhiurdjhzdpyceb.supabase.co/storage/v1/object/public/aurae-images/${f}`;
}

export interface CartItem {
  id: string; name: string; slug: string; price: number; image: string; quantity: number;
  category?: string; isFreeShipping?: boolean; priceFormatted?: string;
  delivery?: { method: string; region: string; city: string; priceStr: string; };
}

interface CartContextType {
  cart: CartItem[]; items: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity"> | CartItem) => void;
  addItem: (product: Omit<CartItem, "quantity"> | CartItem) => void;
  add: (product: Omit<CartItem, "quantity"> | CartItem) => void;
  removeFromCart: (id: string) => void; removeItem: (id: string) => void; remove: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void; clear: () => void;
  totalItems: number; count: number; totalQty: number;
  totalPrice: number; total: number; subtotal: number;
  shippingFee: number; calculatedShippingFee: number; deliveryTotal: number;
  globalFreeShipping: boolean; freeShippingThreshold: number;
  setShippingConfig: (config: { shippingFee?: number; globalFreeShipping?: boolean; freeShippingThreshold?: number }) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEYS = ["aurae_cart", "cart", "panier", "shopping_cart", "checkout_items"];

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  for (const key of STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((it: any) => ({
          id: String(it.id), name: it.name || "Produit ECLOSIA", slug: it.slug || String(it.id),
          price: Number(it.price) || 0, image: cleanImageUrl(it.image || it.image_url),
          quantity: Number(it.quantity) || 1, category: it.category, isFreeShipping: it.isFreeShipping,
          priceFormatted: it.priceFormatted, delivery: it.delivery,
        }));
      }
    } catch {}
  }
  return [];
}

function saveToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  const str = JSON.stringify(items);
  for (const k of STORAGE_KEYS) localStorage.setItem(k, str);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [shippingFee, setShippingFee] = useState<number>(10.0);
  const [globalFreeShipping, setGlobalFreeShipping] = useState<boolean>(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(60);

  useEffect(() => { setCart(loadFromStorage()); setIsInitialized(true); }, []);
  useEffect(() => { if (isInitialized) saveToStorage(cart); }, [cart, isInitialized]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key && STORAGE_KEYS.includes(e.key)) setCart(loadFromStorage()); };
    const onFocus = () => setCart(loadFromStorage());
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener("focus", onFocus); };
  }, []);

  const addToCart = (product: Omit<CartItem, "quantity"> | CartItem) => {
    setCart((prev) => {
      const id = String((product as any).id);
      const existing = prev.find((it) => it.id === id);
      if (existing) return prev.map((it) => it.id === id ? { ...it, quantity: it.quantity + ((product as any).quantity || 1) } : it);
      return [...prev, { ...(product as any), id, quantity: (product as any).quantity || 1, image: cleanImageUrl((product as any).image), slug: (product as any).slug || id }];
    });
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((it) => it.id !== String(id)));
  const updateQuantity = (id: string, quantity: number) => { if (quantity <= 0) { removeFromCart(id); return; } setCart((prev) => prev.map((it) => it.id === String(id) ? { ...it, quantity } : it)); };
  const clearCart = () => { setCart([]); STORAGE_KEYS.forEach((k) => localStorage.removeItem(k)); };
  const setShippingConfig = (config: { shippingFee?: number; globalFreeShipping?: boolean; freeShippingThreshold?: number }) => {
    if (config.shippingFee !== undefined) setShippingFee(config.shippingFee);
    if (config.globalFreeShipping !== undefined) setGlobalFreeShipping(config.globalFreeShipping);
    if (config.freeShippingThreshold !== undefined) setFreeShippingThreshold(config.freeShippingThreshold);
  };

  const totalItems = cart.reduce((s, it) => s + it.quantity, 0);
  const totalPrice = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  const hasOnlyFreeShippingItems = cart.length > 0 && cart.every((it) => it.isFreeShipping === true);
  const calculatedShippingFee = (cart.length === 0 || globalFreeShipping || hasOnlyFreeShippingItems || totalPrice >= freeShippingThreshold) ? 0 : shippingFee;

  const value: CartContextType = {
    cart, items: cart, addToCart, addItem: addToCart, add: addToCart,
    removeFromCart, removeItem: removeFromCart, remove: removeFromCart,
    updateQuantity, clearCart, clear: clearCart,
    totalItems, count: totalItems, totalQty: totalItems,
    totalPrice, total: totalPrice + calculatedShippingFee, subtotal: totalPrice,
    shippingFee, calculatedShippingFee, deliveryTotal: calculatedShippingFee,
    globalFreeShipping, freeShippingThreshold, setShippingConfig,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  return ctx;
}