"use client";

import { useState, useEffect } from "react";

export function CheckoutForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  });

  // Charger les données si elles existaient déjà
  useEffect(() => {
    const saved = localStorage.getItem("shipping_address");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    // Sauvegarde en temps réel pour que la commande y ait accès
    localStorage.setItem("shipping_address", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-serif text-[#333333] mb-1">
          Informations de livraison
        </h2>
        <p className="text-xs text-gray-500">
          Veuillez entrer vos coordonnées pour l'expédition de votre commande.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Prénom</label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm text-[#333333] bg-white"
            placeholder="Ex: Marie"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Nom</label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm text-[#333333] bg-white"
            placeholder="Ex: Dupont"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm text-[#333333] bg-white"
            placeholder="marie.dupont@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Téléphone</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm text-[#333333] bg-white"
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Adresse postale</label>
        <input
          type="text"
          name="address"
          required
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm text-[#333333] bg-white"
          placeholder="123 rue de la Paix"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Code postal</label>
          <input
            type="text"
            name="postalCode"
            required
            value={formData.postalCode}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm text-[#333333] bg-white"
            placeholder="75001"
          />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Ville</label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm text-[#333333] bg-white"
            placeholder="Paris"
          />
        </div>
      </div>
    </div>
  );
}