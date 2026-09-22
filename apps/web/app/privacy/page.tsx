export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE6E1] shadow-sm">
        <h1 className="text-3xl font-extrabold text-[#333333] mb-8">Politique de Confidentialité</h1>
        
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">1. Introduction</h2>
            <p>
              Chez <strong>ECLOSIA</strong>, la protection de vos données personnelles et de votre vie privée est une priorité absolue. La présente Politique de Confidentialité vous informe sur la manière dont nous collectons, utilisons et protégeons vos informations personnelles lorsque vous naviguez sur notre site et utilisez nos services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">2. Données collectées</h2>
            <p>
              Nous collectons uniquement les informations nécessaires au bon traitement de vos commandes et à l&apos;amélioration de votre expérience utilisateur :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Données d&apos;identification (nom, prénom, adresse e-mail, adresse de livraison et de facturation).</li>
              <li>Données de transaction et de paiement (traitées de manière sécurisée par nos prestataires partenaires cryptés).</li>
              <li>Données d&apos;échanges avec notre conseillère IA ou notre support client.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">3. Utilisation des données</h2>
            <p>
              Vos données sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>L&apos;exécution et le suivi de vos commandes (livraison en 7 à 10 jours).</li>
              <li>La gestion de la relation client et l&apos;assistance personnalisée.</li>
              <li>L&apos;envoi d&apos;informations ou d&apos;offres promotionnelles (uniquement si vous y avez consenti).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">4. Protection et sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles rigoureuses (chiffrement SSL, accès restreints aux bases de données Supabase) pour empêcher tout accès non autorisé, modification, divulgation ou destruction de vos données.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">5. Vos droits (RGPD)</h2>
            <p>
              Conformément à la réglementation européenne en vigueur, vous disposez d&apos;un droit d&apos;accès, de rectification, de portabilité et de suppression de vos données personnelles. Pour exercer ces droits, vous pouvez nous contacter à tout moment par e-mail à : <strong>support@eclosia.app</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}