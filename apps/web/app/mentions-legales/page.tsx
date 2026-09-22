export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE6E1] shadow-sm">
        <h1 className="text-3xl font-extrabold text-[#333333] mb-8">Mentions Légales</h1>
        
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">1. Édition du site</h2>
            <p>
              Le site <strong>ECLOSIA</strong> (ci-après &quot;le site&quot;) est édité dans le cadre de l&apos;activité de commerce en ligne spécialisé dans le bien-être maternel et la puériculture.
            </p>
            <p className="mt-2">
              <strong>Contact :</strong> support@eclosia.app<br />
              <strong>Pays d&apos;exploitation :</strong> France
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">2. Hébergement</h2>
            <p>
              Le site est hébergé par <strong>Vercel Inc.</strong>, situé 340 S Lemon Ave #4133 Walnut, CA 91789, USA, et par la plateforme de base de données <strong>Neon Technologies Inc.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">3. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble de ce site relève de la législation française et internationale sur le droit d&apos;auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">4. Protection des données personnelles (RGPD)</h2>
            <p>
              Conformément à la loi « Informatique et Libertés » et au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression des données vous concernant. Pour l&apos;exercer, vous pouvez nous contacter directement par e-mail.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#333333] mb-2">5. Avertissement médical (Conseillère IA)</h2>
            <p>
              Les recommandations fournies par notre assistant virtuel (Conseillère IA) et les contenus textuels du site ont un objectif purement informatif et d&apos;accompagnement. Ils ne remplacent en aucun cas un diagnostic, une consultation ou un avis médical prodigué par un professionnel de santé qualifié.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}