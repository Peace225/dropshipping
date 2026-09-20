'use client'

import Link from "next/link";
import { Heart, MapPin } from "lucide-react";

export function Footer() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "ECLOSIA",
    "image": "https://eclosia.app/og-image.jpg",
    "@id": "https://eclosia.app",
    "url": "https://eclosia.app",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "France",
      "addressRegion": "Île-de-France",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.8566,
      "longitude": 2.3522
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "$$",
    "description": "Plateforme sécurisée de bien-être maternel et infantile propulsée par l'IA, soutenant les mamans en France et partout dans le monde."
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ajoute ici ton appel API newsletter
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <footer className="bg-[#333333] text-[#F5EBE6] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="space-y-4">
              <span className="text-2xl font-bold font-serif tracking-wider text-white">ECLOSIA</span>
              <p className="text-sm text-[#F5EBE6]/70 leading-relaxed">
                A secure, AI-powered maternal and baby wellness platform supporting mothers with expert care, community, and curated essentials.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#F5EBE6]/60">
                <MapPin className="w-4 h-4 text-[#6E857B]" />
                <span>Basé à Paris, France</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm text-[#F5EBE6]/70">
                <li><Link href="/shop" className="hover:text-[#6E857B] transition-colors">Shop Essentials</Link></li>
                <li><Link href="/ai-chat" className="hover:text-[#6E857B] transition-colors">AI Assistant</Link></li>
                <li><Link href="/community" className="hover:text-[#6E857B] transition-colors">Maternal Community</Link></li>
                <li><Link href="/about" className="hover:text-[#6E857B] transition-colors">Our Mission</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Support & Legal</h4>
              <ul className="space-y-2.5 text-sm text-[#F5EBE6]/70">
                <li><Link href="/help" className="hover:text-[#6E857B] transition-colors">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-[#6E857B] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#6E857B] transition-colors">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-[#6E857B] transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Stay Connected</h4>
              <p className="text-sm text-[#F5EBE6]/70 mb-4">Subscribe to our newsletter for expert tips and local updates across Paris & worldwide.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <input type="email" placeholder="Enter your email" className="px-4 py-3 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-[#F5EBE6]/40 text-sm focus:outline-none focus:border-[#6E857B]" />
                <button type="submit" className="px-4 py-3 rounded-full bg-[#6E857B] text-white text-sm font-medium hover:bg-[#6E857B]/90 transition-all shadow-md">Subscribe</button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F5EBE6]/50 gap-4">
            <p>© {new Date().getFullYear()} ECLOSIA. All rights reserved.</p>
            <p className="flex items-center gap-1">Crafted with <Heart className="w-3.5 h-3.5 text-[#6E857B] fill-[#6E857B]" /> for mothers in Paris & worldwide.</p>
          </div>
        </div>
      </footer>
    </>
  );
}