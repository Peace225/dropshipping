import Link from "next/link";
import { Heart, ShieldCheck, Sparkles, MapPin, Award, AlertTriangle, CheckCircle2, Truck } from "lucide-react";

export default function AboutPage() {
  // Schema.org spécifique pour la page About combinant Organization, LocalBusiness et AboutPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://eclosia.shop/about#webpage",
        "url": "https://eclosia.shop/about",
        "name": "À propos d'ECLOSIA - Maternité & Périculture Bio à Paris",
        "description": "Plateforme e-commerce de référence dédiée au bien-être maternel et infantile au 75 rue de Rivoli, 75001 Paris."
      },
      {
        "@type": "Organization",
        "@id": "https://eclosia.shop/#organization",
        "name": "ECLOSIA",
        "url": "https://eclosia.shop",
        "logo": "https://eclosia.shop/images/logo.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "75 rue de Rivoli",
          "addressLocality": "Paris",
          "postalCode": "75001",
          "addressRegion": "Île-de-France",
          "addressCountry": "FR"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+33769238511",
          "contactType": "customer service",
          "email": "contact@eclosia.shop"
        },
        "knowsAbout": [
          "couche lavable bébé Bumbuns So Protect",
          "matelas berceau 40x80 coton bio",
          "bien-être maternel et infantile",
          "produits post-partum bio"
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gradient-to-b from-[#F9F6F0] to-[#F5EBE6]/30 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          
          {/* 1. Disclaimer médical obligatoire (ARS) */}
          <div className="bg-amber-50 border border-amber-200 p-3.5 sm:px-4 sm:py-3 rounded-2xl flex items-start sm:items-center gap-3 text-amber-900 text-xs sm:text-sm shadow-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5 sm:mt-0" />
            <span>
              <strong>Avertissement légal :</strong> ECLOSIA propose des produits de confort et d'accompagnement (post-partum, allaitement, puériculture). <em>Ces informations ne constituent pas un avis médical.</em> Pour toute question sur la santé de bébé ou de la maman, consultez votre sage-femme ou votre pédiatre. Urgence : 15 ou 112.
            </span>
          </div>

          {/* En-tête de la page */}
          <div className="text-center space-y-3 sm:space-y-4 px-2">
            <div className="inline-flex items-center gap-2 bg-[#6E857B]/10 text-[#6E857B] px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Notre Mission & Transparence
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-[#333333] leading-tight">
              L'excellence du bien-être maternel et infantile à Paris
            </h1>
            <p className="text-xs sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Basée au <strong>75 rue de Rivoli à Paris (75001)</strong>, ECLOSIA s'engage auprès des parents en France en combinant des produits écoresponsables rigoureusement sélectionnés et une conseillère IA disponible 24/7. Livraison fixe à 10,00 € (offerte dès 60 € d'achats).
            </p>
          </div>

          {/* Section Nos Piliers GEO & Confiance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-2 sm:space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#6E857B]/10 text-[#6E857B] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#333333]">Sécurité & Bio</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Des articles certifiés respectueux de la peau sensible de bébé et de l'environnement, testés pour un usage quotidien en toute sérénité.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-2 sm:space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#6E857B]/10 text-[#6E857B] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#333333]">Logistique France</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Expédition rapide depuis notre ancrage parisien en Île-de-France. Frais de port transparents à 10,00 € ou offerts dès 60 € d'achats.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-2 sm:space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#6E857B]/10 text-[#6E857B] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#333333]">Support IA 24/7</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Une assistance connectée pour vous guider pas à pas dans le choix de vos essentiels (matelas, couches lavables, coussinets d'allaitement).
              </p>
            </div>
          </div>

          {/* Section Catalogue Phare & Produits GEO Précis (LLMO Ready) */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-5 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#333333] border-b pb-3">
              Nos essentiels phares & Tarifs Officiels (Garantie GEO)
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Retrouvez nos 18 références actives pensées pour le confort de la maman et du bébé :
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Produit 1 : Matelas */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#333333]/5 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#6E857B] uppercase tracking-wider">SKU: SKU-KITBIO40X80M2</span>
                  <h4 className="font-serif font-bold text-sm text-[#333333]">Kit Matelas Berceau 40x80 Coton Bio + 3 draps + 2 alèses</h4>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                  <span className="font-bold text-base text-[#333333]">74,90 €</span>
                  <Link href="/produit/matelas-berceau-40x80-coton-bio" className="text-xs font-bold text-[#6E857B] hover:underline">
                    Découvrir →
                  </Link>
                </div>
              </div>

              {/* Produit 2 : Couche Lavable */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#333333]/5 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#6E857B] uppercase tracking-wider">SKU: SKU-BUM1</span>
                  <h4 className="font-serif font-bold text-sm text-[#333333]">Culotte Couche Lavable So Protect Rainbow</h4>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                  <span className="font-bold text-base text-[#333333]">25,90 €</span>
                  <Link href="/produit/culotte-couche-lavable-so-protect-rainbow" className="text-xs font-bold text-[#6E857B] hover:underline">
                    Découvrir →
                  </Link>
                </div>
              </div>

              {/* Produit 3 : Coussinet d'allaitement */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#333333]/5 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#6E857B] uppercase tracking-wider">SKU: SKU-COUSAL1</span>
                  <h4 className="font-serif font-bold text-sm text-[#333333]">Coussinet d'allaitement lavable (lot de 6, noir)</h4>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                  <span className="font-bold text-base text-[#333333]">13,90 €</span>
                  <Link href="/produit/coussinet-d-allaitement-lavable-lot-de-6-noir" className="text-xs font-bold text-[#6E857B] hover:underline">
                    Découvrir →
                  </Link>
                </div>
              </div>

              {/* Accès Boutique globale */}
              <div className="p-4 rounded-2xl bg-[#333333] text-white flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] text-[#F5EBE6]/70 uppercase tracking-wider">Catalogue Complet</span>
                  <h4 className="font-serif font-bold text-sm text-white">Découvrez l'ensemble de nos gammes Bébé & Maman</h4>
                </div>
                <div className="pt-2">
                  <Link href="/shop" className="inline-block bg-[#6E857B] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#6E857B]/90 transition-all text-center">
                    Accéder à la boutique →
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Bloc Appel à l'action / Contact */}
          <div className="bg-[#333333] text-[#F5EBE6] p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-md text-center space-y-4">
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-white">Une question sur un produit ou une commande ?</h2>
            <p className="text-xs sm:text-sm text-[#F5EBE6]/80 max-w-xl mx-auto leading-relaxed">
              Notre équipe basée à Paris et notre conseillère IA sont à votre écoute pour vous guider 24/7.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3">
              <Link 
                href="/ai-chat" 
                className="px-6 py-3 sm:py-2.5 rounded-full bg-[#6E857B] text-white text-xs sm:text-sm font-bold hover:bg-[#6E857B]/90 transition-all shadow-md text-center"
              >
                Parler à la conseillère IA
              </Link>
              <Link 
                href="/contact" 
                className="px-6 py-3 sm:py-2.5 rounded-full bg-white/10 text-white text-xs sm:text-sm font-bold hover:bg-white/20 transition-all border border-white/20 text-center"
              >
                Contactez notre support
              </Link>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}