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
            <h2 className="text-lg font-bold text-[#333333] mb-2">3. Utilisation des données et délais</h2>
            <p>
              Vos données sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>L&apos;exécution et le suivi de vos commandes (livraison estimée en 2 à 4 jours ouvrables).</li>
              <li>La gestion de la relation client et l&apos;assistance personnalisée.</li>
              <li>L&apos;envoi d&apos;informations ou d&apos;offres promotionnelles (uniquement si vous y avez consenti).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">4. Destinataires des données</h2>
            <p>
              Pour assurer nos services, vos données personnelles sont transmises à des tiers de confiance sélectionnés :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Stripe :</strong> pour le traitement sécurisé des paiements en ligne.</li>
              <li><strong>BigBuy :</strong> pour la préparation logistique et l&apos;expédition de votre commande (transmission de votre nom et adresse de livraison).</li>
              <li><strong>Hostinger et Supabase :</strong> pour l&apos;hébergement sécurisé du site web et de la base de données.</li>
              <li><strong>Outils marketing (ex: Meta Pixel) :</strong> pour la mesure de l&apos;audience et l&apos;optimisation publicitaire (sous réserve de votre consentement aux cookies).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">5. Durée de conservation des données</h2>
            <p>
              Conformément aux obligations légales et réglementaires :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Les données relatives aux commandes et transactions sont conservées pendant <strong>5 ans</strong> à des fins comptables et fiscales.</li>
              <li>Les données prospects (newsletter) sont conservées pendant <strong>3 ans</strong> à compter du dernier contact.</li>
              <li>Les données de compte client sont conservées jusqu&apos;à la suppression du compte par l&apos;utilisateur.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">6. Protection et sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles rigoureuses (chiffrement SSL, accès restreints aux bases de données) pour empêcher tout accès non autorisé, modification, divulgation ou destruction de vos données.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">7. Vos droits (RGPD)</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification, de portabilité et de suppression de vos données personnelles. 
            </p>
            <p className="mt-2">
              Pour exercer ces droits ou pour toute question, vous pouvez nous contacter par e-mail à : <strong>contact@eclosia.shop</strong>.
            </p>
            <p className="mt-2">
              Vous disposez également du droit d&apos;introduire une réclamation auprès de l&apos;autorité de contrôle compétente, la <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés), en vous rendant sur leur site officiel : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#6E857B] underline font-bold">www.cnil.fr</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}