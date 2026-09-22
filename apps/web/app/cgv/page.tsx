export default function CgvPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE6E1] shadow-sm">
        <h1 className="text-3xl font-extrabold text-[#333333] mb-8">Conditions Générales de Vente (CGV)</h1>
        
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">Article 1 : Champ d&apos;application</h2>
            <p>
              Les présentes Conditions Générales de Vente régissent les ventes de produits effectuées sur le site <strong>ECLOSIA</strong> auprès des clients consommateurs. Toute commande validée implique l&apos;adhésion sans réserve aux présentes CGV.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">Article 2 : Prix</h2>
            <p>
              Les prix de nos produits sont indiqués en Euros (€) toutes taxes françaises comprises (TTC), hors frais de livraison éventuels. ECLOSIA se réserve le droit de modifier ses prix à tout moment, mais les produits facturés le seront sur la base des tarifs en vigueur au moment de la validation de la commande.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">Article 3 : Commandes</h2>
            <p>
              Les informations contractuelles font l&apos;objet d&apos;une confirmation par voie d&apos;e-mail. ECLOSIA se réserve le droit de refuser toute commande d&apos;un client avec lequel il existerait un litige relatif au paiement d&apos;une commande antérieure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">Article 4 : Livraison</h2>
            <p>
              Les produits sont livrés à l&apos;adresse de livraison indiquée lors de la commande. Le délai moyen de livraison standard est généralement constaté entre <strong>7 et 10 jours ouvrables</strong> en France métropolitaine.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">Article 5 : Droit de rétractation et Retours</h2>
            <p>
              Conformément à l&apos;article L.221-18 du Code de la consommation, le client dispose d&apos;un délai de <strong>30 jours</strong> à compter de la réception de sa commande pour exercer son droit de rétractation sans avoir à justifier de motifs. Les articles doivent être retournés dans leur emballage d&apos;origine, non ouverts et en parfait état.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">Article 6 : Service client</h2>
            <p>
              Pour toute question, information ou réclamation, notre équipe est joignable par e-mail à l&apos;adresse : support@eclosia.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}