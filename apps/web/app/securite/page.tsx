import Link from "next/link";
import { ShieldCheck, Lock, Award, CheckCircle2, ArrowLeft } from "lucide-react";

export default function SecuritePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAFAFA] to-[#F5EBE6]/30 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#333333]/70 hover:text-[#333333]">
          <ArrowLeft className="w-4 h-4" /><span>Retour à l'accueil</span>
        </Link>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE6E1] shadow-sm space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-[#6E857B]/10 text-[#6E857B]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#333333]">Sécurité & Authenticité</h1>
            <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
              Chez ECLOSIA, la sécurité des transactions et la qualité irréprochable des articles de puériculture pour bébé sont nos engagements absolus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            
            <div className="p-6 rounded-2xl bg-[#F9F6F0] border border-[#333333]/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#6E857B]/10 text-[#6E857B] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#333333]">Paiement 100% Sécurisé</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Toutes vos transactions bancaires sont cryptées via le protocole SSL et traitées par notre partenaire sécurisé de référence, <strong>Stripe</strong>. Vos coordonnées bancaires ne transitent jamais par nos serveurs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F9F6F0] border border-[#333333]/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#6E857B]/10 text-[#6E857B] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#333333]">Certification OEKO-TEX</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Nos textiles, cotons bios, bambous et matelas berceau disposent des labels de certification les plus stricts, garantissant l'absence totale de substances nocives pour la peau sensible de bébé.
              </p>
            </div>

          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-bold text-lg text-[#333333]">Nos engagements qualité</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#6E857B] shrink-0 mt-0.5" />
                <span><strong>Traçabilité rigoureuse :</strong> Sélection minutieuse de fabricants respectant les normes européennes et françaises en vigueur.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#6E857B] shrink-0 mt-0.5" />
                <span><strong>Conformité réglementaire :</strong> Micro-entreprise enregistrée en France sous le SIREN 104 232 756, en totale transparence avec le Code de la consommation.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#6E857B] shrink-0 mt-0.5" />
                <span><strong>Protection des données (RGPD) :</strong> Vos informations personnelles sont strictement protégées et ne sont jamais cédées à des tiers non autorisés.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}