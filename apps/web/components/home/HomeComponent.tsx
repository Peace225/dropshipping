import Link from "next/link";
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Store, 
  Smartphone, 
  Heart, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2,
  PackageCheck,
  CreditCard,
  Headphones
} from "lucide-react";

const POPULAR_TAGS = [
  "Soins Grossesse", "Cosmétique Bio", "Vitamines Maternité", "Crèmes Anti-Vergetures", 
  "Poussettes Compactes", "Sièges Auto", "Bodies Bébé Coton Bio", "Lits Parapluie", "Chauffe-Biberons", 
  "Sacs à Langer", "Portage & Écharpes", "Jouets d'Éveil", "Baignoires Bébé", "Couches Écologiques", 
  "Soin Peau Sensible", "Coffrets Naissance", "Coussins d'Allaitement", "Tire-Laits Électriques"
];

const CAMPAIGNS = [
  { month: "FÉV", name: "Semaine Maternité", desc: "Soins & Bien-être" },
  { month: "MARS", name: "Printemps de l'Enfant", desc: "Puériculture" },
  { month: "JUIN", name: "Grand Anniversaire AURAE", desc: "Jusqu'à -50%" },
  { month: "SEPT", name: "Rentrée des Tout-Petits", desc: "Essentiels bébé" },
  { month: "NOV", name: "Aurae Wellness Days", desc: "Offres exclusives" },
];

const SERVICES = [
  {
    icon: Store,
    title: "Points Relais Partenaires",
    desc: "Retrait sécurisé partout en France.",
  },
  {
    icon: Truck,
    title: "Livraison Express",
    desc: "Expédition rapide à domicile en 24-48h.",
  },
  {
    icon: PackageCheck,
    title: "Marques Partenaires",
    desc: "Sélection rigoureuse d'experts.",
  },
  {
    icon: Heart,
    title: "Conseillère IA Dédiée",
    desc: "Accompagnement personnalisé 24/7.",
  },
  {
    icon: Sparkles,
    title: "Application Mobile",
    desc: "Avantages exclusifs sur l'app[cite: 1].",
  },
  {
    icon: ShieldCheck,
    title: "Garantie Authenticité",
    desc: "Produits testés et certifiés sûrs.",
  },
];

const FAQS = [
  {
    question: "Quels sont les délais de livraison pour les commandes en France ?",
    answer: "Les livraisons s'effectuent généralement en 24 à 48 heures ouvrables à domicile ou en point relais partout en France métropolitaine."
  },
  {
    question: "Quels modes de paiement sont acceptés sur ECLOSIA ?",
    answer: "Vous pouvez régler vos achats en toute sécurité par carte bancaire (Visa, Mastercard, CB), Apple Pay, PayPal ou en plusieurs fois sans frais."
  },
  {
    question: "Comment fonctionne la conseillère IA bien-être ?",
    answer: "Notre assistant virtuel s'appuie sur des données validées par des professionnels pour vous orienter vers les soins et articles de puériculture adaptés à chaque étape de votre grossesse et de la croissance de bébé."
  },
  {
    question: "Les produits cosmétiques et de puériculture sont-ils certifiés ?",
    answer: "Absolument. Chaque article proposé sur la plateforme est rigoureusement sélectionné pour respecter la sensibilité des mamans et la peau délicate des nourrissons, garantissant les normes de sécurité européennes en vigueur."
  },
  {
    question: "Quelle est la politique de retour en cas de non-conformité ?",
    answer: "Vous disposez d'un délai de rétractation de 30 jours pour retourner un article non ouvert ou défectueux, directement via votre espace client avec des retours prépayés."
  },
  {
    question: "Comment contacter le support client AURAE ?",
    answer: "Notre équipe est à votre écoute du lundi au vendredi de 8h à 19h et le samedi de 10h à 18h par chat ou par e-mail pour répondre à toutes vos interrogations."
  },
];

export default function HomeComponent() {
  return (
    <div className="min-h-screen bg-white text-[#333333]">
      
      {/* En-tête / Bannière Principale */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E8C5C8]/30 text-[#6E857B] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Plateforme e-commerce spécialisée en France
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
            ECLOSIA — <span className="text-[#6E857B]">bien-être féminin</span> & puériculture
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            ECLOSIA est la référence de confiance dédiée aux mamans et aux tout-petits. Alliant la douceur des soins cosmétiques naturels et l'exigence de sécurité de la puériculture, nous proposons une sélection rigoureuse d'essentiels livrés directement chez vous en France. Profitez d'un paiement 100% sécurisé et d'un accompagnement sur-mesure.
          </p>
        </div>

        {/* Statistiques Clés */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#F5EBE6]/60 rounded-2xl p-6 border border-[#E8C5C8]/40 shadow-sm mb-12">
          <div className="text-center border-r border-gray-200 last:border-none">
            <span className="block text-2xl sm:text-3xl font-black text-[#6E857B]">100%</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sécurisé & Normes UE</span>
          </div>
          <div className="text-center border-r border-gray-200 last:border-none">
            <span className="block text-2xl sm:text-3xl font-black text-[#6E857B]">50+</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Marques Partenaires</span>
          </div>
          <div className="text-center border-r border-gray-200 last:border-none">
            <span className="block text-2xl sm:text-3xl font-black text-[#6E857B]">24-48h</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Livraison France</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl sm:text-3xl font-black text-[#6E857B]">24/7</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Assistance IA</span>
          </div>
        </div>

        <div className="text-sm text-gray-700 leading-relaxed max-w-4xl mx-auto bg-[#F5EBE6]/40 p-6 rounded-2xl border border-[#E8C5C8]/30">
          <p>
            Pensée pour répondre aux besoins spécifiques des femmes, des futures mamans et des jeunes parents, notre plateforme combine une esthétique apaisante à une expertise logistique de pointe. Chaque transaction est protégée, nos produits proviennent de réseaux certifiés[cite: 1], et notre service client reste entièrement mobilisé pour vous accompagner au quotidien.
          </p>
        </div>
      </section>

      {/* Univers et Catégories */}
      <section className="bg-gray-50 py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
            Soins de maternité, puériculture & cocon de bébé
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            Notre catalogue s'articule autour de deux grands univers complémentaires. L'univers <span className="font-semibold text-[#E8C5C8]">Soins & Cosmétique Féminine</span> valorise la beauté naturelle et le bien-être cutané à travers des formules douces, des crèmes anti-vergetures et des rituels adaptés à la maternité. L'univers <span className="font-semibold text-[#6E857B]">Puériculture & Bébé</span> rassemble tout le nécessaire pour l'éveil, le sommeil, les repas et les déplacements : poussettes ergonomiques, bodies en coton biologique, lits parapluie et accessoires de soin de haute qualité. Retrouvez en un clin d'œil les articles les plus recherchés par les parents.
          </p>

          {/* Tags Populaires */}
          <div className="mt-6">
            <span className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Recherches et catégories populaires</span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-xs hover:border-[#6E857B] hover:text-[#6E857B] transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campagnes & Événements de l'année */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
          Temps forts & rendez-vous bien-être de l'année
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-8">
          ECLOSIA rythme votre année avec des événements exclusifs conçus pour vous faire bénéficier d'avantages uniques sur vos marques préférées. De la Semaine de la Maternité au Grand Anniversaire ECLOSIA, chaque temps fort est l'occasion de découvrir des sélections thématiques à prix privilégiés, pensées pour accompagner chaque étape de votre parentalité en toute sérénité.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CAMPAIGNS.map((camp, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
              <span className="block text-xs font-black text-[#6E857B] tracking-wider mb-1">{camp.month}</span>
              <span className="block font-bold text-gray-900 text-sm mb-1">{camp.name}</span>
              <span className="text-xs text-gray-500">{camp.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services pensés pour vous */}
      <section className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
            Des services sur-mesure pour votre tranquillité
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            Parce que chaque parent mérite une expérience fluide, nous avons développé un ensemble de services adaptés. Nos <span className="font-semibold">points relais partenaires</span> facilitent vos retraits partout en France, tandis que notre service de livraison s'assure que vos colis arrivent en parfait état. Profitez également de notre conseillère virtuelle intelligente pour vous guider instantanément dans vos choix de puériculture.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((srv, idx) => {
              const IconComponent = srv.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-start gap-4">
                  <div className="p-3 bg-[#F5EBE6] text-[#6E857B] rounded-lg shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{srv.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{srv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Questions fréquentes (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-8 text-gray-900 text-center">
          Questions fréquentes
        </h2>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-5 bg-white shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 flex items-center justify-between">
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bannière de Call to Action finale */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Offrez le meilleur à votre enfant et à vous-même</h2>
            <p className="text-xs sm:text-sm text-gray-400">Sélection experte • Paiement sécurisé • Livraison rapide en France</p>
          </div>
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6E857B] hover:bg-[#5b6e65] text-white font-bold text-sm rounded-full transition-all shadow-md"
          >
            <span>Découvrir la boutique</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}