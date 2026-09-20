"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  isFreeShipping?: boolean; // <-- Décidé par l'admin pour ce produit précis
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  
  shippingFee: number;             // Tarif de base défini par l'admin
  calculatedShippingFee: number;   // Montant final calculé selon les produits
  globalFreeShipping: boolean;     // Option globale si l'admin veut tout offrir
  freeShippingThreshold: number; // Seuil pour livraison gratuite
  setShippingConfig: (config: { shippingFee?: number; globalFreeShipping?: boolean; freeShippingThreshold?: number }) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Configuration admin globale
  const [shippingFee, setShippingFee] = useState<number>(5.00);
  const [globalFreeShipping, setGlobalFreeShipping] = useState<boolean>(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(150);

  useEffect(() => {
    const savedCart = localStorage.getItem("aurae_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erreur lecture localStorage:", e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("aurae_cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const setShippingConfig = (config: { shippingFee?: number; globalFreeShipping?: boolean; freeShippingThreshold?: number }) => {
    if (config.shippingFee !== undefined) setShippingFee(config.shippingFee);
    if (config.globalFreeShipping !== undefined) setGlobalFreeShipping(config.globalFreeShipping);
    if (config.freeShippingThreshold !== undefined) setFreeShippingThreshold(config.freeShippingThreshold);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // LOGIQUE PAR PRODUIT / ADMIN :
  // Si le panier est vide -> 0
  // Si l'admin a activé la gratuité globale sur le site -> 0
  // Sinon, est-ce que TOUS les articles du panier ont la livraison gratuite décidée par l'admin ?
  // -> Si un seul article est payant selon l'admin, les frais de port s'appliquent.
  const hasOnlyFreeShippingItems = cart.length > 0 && cart.every((item) => item.isFreeShipping === true);

  const calculatedShippingFee = 
    cart.length === 0 || globalFreeShipping || hasOnlyFreeShippingItems || totalPrice >= freeShippingThreshold
      ? 0 
      : shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        shippingFee,
        calculatedShippingFee,
        globalFreeShipping,
        freeShippingThreshold,
        setShippingConfig,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  }
  return context;
}