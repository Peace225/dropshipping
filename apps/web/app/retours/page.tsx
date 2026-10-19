export default function RetoursPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE6E1] shadow-sm">
        <h1 className="text-3xl font-extrabold text-[#333333] mb-8">Politique de Retours et Remboursements</h1>
        
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">1. Délai de rétractation (30 jours)</h2>
            <p>
              Parce que nous savons à quel point le choix des articles pour votre bien-être et celui de bébé est délicat, <strong>ECLOSIA</strong> vous offre un délai de rétractation étendu à <strong>30 jours</strong> à compter de la date de réception de votre commande pour changer d&apos;avis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">2. Conditions de retour</h2>
            <p>
              Pour être éligible à un retour, l&apos;article doit répondre aux critères suivants :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Être dans son emballage d&apos;origine permettant sa recommercialisation.</li>
              <li>Être en parfait état (le client est autorisé à ouvrir et inspecter le produit, tout en veillant à ne pas l&apos;endommager).</li>
              <li>Être accompagné de tous ses accessoires ou notices éventuels.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">3. Comment effectuer un retour ?</h2>
            <p>
              Pour initier un retour, il vous suffit de contacter notre support client par e-mail à l&apos;adresse <strong>contact@eclosia.shop</strong> en indiquant votre numéro de commande et le motif de votre retour. Notre équipe vous transmettra la marche à suivre. 
            </p>
            <p className="mt-2">
              <em>Note :</em> Dans certains cas spécifiques et selon la nature de l&apos;article, notre service client pourra vous indiquer qu&apos;un renvoi physique n'est pas nécessaire pour procéder à votre solution personnalisée.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">4. Remboursement</h2>
            <p>
              Dès réception et inspection de l&apos;article retourné dans nos entrepôts (ou validation de votre dossier), nous procéderons au remboursement intégral du montant de la commande, <strong>frais de livraison standard initiaux inclus</strong>, via le moyen de paiement initialement utilisé, sous un délai maximum de 14 jours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}