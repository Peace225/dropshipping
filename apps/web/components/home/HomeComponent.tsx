import Link from "next/link";
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Store, 
  Heart, 
  ArrowRight, 
  PackageCheck,
  CreditCard
} from "lucide-react";

const POPULAR_TAGS = [
  "Soins Grossesse", "Cosmétique", "Soin Maternité", "Crèmes Anti-Vergetures", 
  "Porte-bébés", "Bodies Bébé Coton", "Chauffe-Biberons", 
  "Sacs à Langer", "Jouets d'Éveil", "Baignoires Bébé", "Couches", 
  "Soin Peau Sensible", "Coffrets Naissance", "Coussins d'Allaitement"
];

const CAMPAIGNS = [
  { month: "FÉV", name: "Semaine Maternité", desc: "Soins & Bien-être" },
  { month: "MARS", name: "Printemps de l'Enfant", desc: "Puériculture" },
  { month: "JUIN", name: "Grand Anniversaire ECLOSIA", desc: "Jusqu'à -50%" },
  { month: "SEPT", name: "Rentrée des Tout-Petits", desc: "Essentiels bébé" },
  { month: "NOV", name: "Eclosia Wellness Days", desc: "Offres exclusives" },
];

const SERVICES = [
  {
    icon: Store,
    title: "Points Relais Partenaires",
    desc: "Retrait sécurisé pour vos commandes.",
  },
  {
    icon: Truck,
    title: "Livraison Standard",
    desc: "Expédition à domicile en 7 à 10 jours.",
  },
  {
    icon: PackageCheck,
    title: "Sélection Soignée",
    desc: "Des articles choisis avec soin pour vous.",
  },
  {
    icon: Heart,
    title: "Conseillère IA Dédiée",
    desc: "Un accompagnement pour vous orienter.",
  },
  {
    icon: CreditCard,
    title: "Paiement Sécurisé",
    desc: "Transactions 100% cryptées et protégées.",
  },
  {
    icon: ShieldCheck,
    title: "Qualité & Sécurité",
    desc: "Des produits respectueux des tout-petits.",
  },
];

const FAQS = [
  {
    question: "Quels sont les délais de livraison pour les commandes en France ?",
    answer: "Les livraisons s'effectuent généralement en 7 à 10 jours ouvrables à domicile ou en point relais partout en France métropolitaine."
  },
  {
    question: "Quels modes de paiement sont acceptés sur ECLOSIA ?",
    answer: "Vous pouvez régler vos achats en toute sécurité par carte bancaire (Visa, Mastercard, CB), Apple Pay, PayPal ou en plusieurs fois sans frais."
  },
  {
    question: "Comment fonctionne la conseillère IA bien-être ?",
    answer: "Notre assistant virtuel vous oriente vers les soins et articles de puériculture adaptés à chaque étape de votre maternité. Note importante : cet assistant ne remplace en aucun cas l'avis ou le diagnostic d'un professionnel de santé."
  },
  {
    question: "Comment sélectionnez-vous vos produits ?",
    answer: "Chaque article proposé sur la plateforme est soigneusement sélectionné pour respecter la sensibilité des mamans et la peau délicate des nourrissons, en privilégiant des matériaux doux et sûrs."
  },
  {
    question: "Quelle est la politique de retour en cas de non-conformité ?",
    answer: "Vous disposez d'un délai de rétractation de 30 jours pour retourner un article non ouvert ou défectueux, directement via votre espace client."
  },
  {
    question: "Comment contacter le support client ECLOSIA ?",
    answer: "Notre équipe est à votre écoute du lundi au vendredi de 8h à 19h et le samedi de 10h à 18h par chat ou par e-mail pour répondre à toutes vos interrogations."
  },
];

export default function HomeComponent() {
  return (
    <div className="min-h-screen bg-white text-[#333333] overflow-x-hidden pt-4 sm:pt-6">
      
      {/* En-tête / Bannière Principale */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#E8C5C8]/30 text-[#6E857B] mb-3 sm:mb-4">
            <Sparkles className="w-3 h-3" />
            Plateforme e-commerce spécialisée
          </span>
          <h1 className="text-[22px] sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-gray-900 leading-tight">
            ECLOSIA — <span className="text-[#6E857B]">bien-être féminin</span> & puériculture
          </h1>
          <p className="text-[11px] sm:text-sm text-gray-600 leading-relaxed px-1 sm:px-0 max-w-2xl mx-auto">
            ECLOSIA est la référence dédiée aux mamans et aux tout-petits. Alliant la douceur des soins cosmétiques et l'exigence de la puériculture, nous proposons une sélection rigoureuse d'essentiels livrés chez vous. Profitez d'un paiement 100% sécurisé et d'un accompagnement sur-mesure.
          </p>
        </div>

        {/* Statistiques Clés - Responsive : 2 colonnes sur mobile, 4 sur desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 bg-[#F5EBE6]/60 rounded-[16px] sm:rounded-2xl p-4 sm:p-5 border border-[#E8C5C8]/40 shadow-sm mb-6 sm:mb-10">
          <div className="text-center md:border-r border-gray-200/60 pb-3 md:pb-0 border-b md:border-b-0">
            <span className="block text-xl sm:text-2xl font-black text-[#6E857B]">100%</span>
            <span className="text-[9px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wide">Paiement Sécurisé</span>
          </div>
          <div className="text-center md:border-r border-gray-200/60 pb-3 md:pb-0 border-b md:border-b-0">
            <span className="block text-xl sm:text-2xl font-black text-[#6E857B]">Qualité</span>
            <span className="text-[9px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wide">Sélection Soignée</span>
          </div>
          <div className="text-center md:border-r border-gray-200/60 pt-3 md:pt-0">
            <span className="block text-xl sm:text-2xl font-black text-[#6E857B]">7-10j</span>
            <span className="text-[9px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wide">Livraison Standard</span>
          </div>
          <div className="text-center pt-3 md:pt-0">
            <span className="block text-xl sm:text-2xl font-black text-[#6E857B]">24/7</span>
            <span className="text-[9px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wide">Assistance IA</span>
          </div>
        </div>

        <div className="text-[11px] sm:text-sm text-gray-700 leading-relaxed max-w-4xl mx-auto bg-[#F5EBE6]/40 p-4 sm:p-6 rounded-[16px] sm:rounded-2xl border border-[#E8C5C8]/30">
          <p>
            Pensée pour répondre aux besoins spécifiques des femmes, des futures mamans et des jeunes parents, notre plateforme combine une esthétique apaisante à une expertise de pointe. Chaque transaction est protégée, nos produits sont choisis avec soin, et notre service client reste entièrement mobilisé pour vous accompagner au quotidien.
          </p>
        </div>
      </section>

      {/* Univers et Catégories */}
      <section className="bg-gray-50 py-8 sm:py-10 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[18px] sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 leading-tight">
            Soins de maternité, puériculture & cocon de bébé
          </h2>
          <p className="text-[11px] sm:text-sm text-gray-600 leading-relaxed mb-5 sm:mb-6">
            Notre catalogue s'articule autour de deux grands univers complémentaires. L'univers <span className="font-semibold text-[#E8C5C8]">Soins & Cosmétique Féminine</span> valorise la beauté naturelle et le bien-être à travers des formules douces, des crèmes anti-vergetures et des rituels adaptés à la maternité. L'univers <span className="font-semibold text-[#6E857B]">Puériculture & Bébé</span> rassemble tout le nécessaire pour l'éveil, le sommeil, les repas et les déplacements : porte-bébés ergonomiques, accessoires de bain, tapis d'éveil et articles de soin de haute qualité. Retrouvez en un clin d'œil les articles les plus recherchés par les parents.
          </p>

          {/* Tags Populaires */}
          <div className="mt-4">
            <span className="block text-[9px] sm:text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-2.5">Recherches et catégories populaires</span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {POPULAR_TAGS.map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white border border-gray-200 rounded-full text-[10px] sm:text-[11px] font-semibold text-gray-700 shadow-xs hover:border-[#6E857B] hover:text-[#6E857B] transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campagnes & Événements de l'année */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="text-[18px] sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 leading-tight">
          Temps forts & rendez-vous bien-être de l'année
        </h2>
        <p className="text-[11px] sm:text-sm text-gray-600 leading-relaxed mb-5 sm:mb-8">
          ECLOSIA rythme votre année avec des événements exclusifs conçus pour vous faire bénéficier d'avantages uniques sur vos articles préférés. De la Semaine de la Maternité au Grand Anniversaire ECLOSIA, chaque temps fort est l'occasion de découvrir des sélections thématiques à prix privilégiés, pensées pour accompagner chaque étape de votre parentalité en toute sérénité.
        </p>

        {/* Grille responsive : 2 colonnes sur mobile, 3 sur tablette, 5 sur desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CAMPAIGNS.map((camp, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 rounded-[12px] sm:rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition-shadow">
              <span className="block text-[11px] sm:text-xs font-black text-[#6E857B] tracking-wider mb-1 sm:mb-1.5">{camp.month}</span>
              <span className="block font-bold text-gray-900 text-[11px] sm:text-xs mb-0.5 sm:mb-1 leading-tight">{camp.name}</span>
              <span className="text-[10px] sm:text-[11px] text-gray-500 leading-snug">{camp.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services pensés pour vous */}
      <section className="bg-gray-50 py-8 sm:py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[18px] sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 leading-tight">
            Des services sur-mesure pour votre tranquillité
          </h2>
          <p className="text-[11px] sm:text-sm text-gray-600 leading-relaxed mb-6 sm:mb-8">
            Parce que chaque parent mérite une expérience fluide, nous avons développé un ensemble de services adaptés. Nos <span className="font-semibold text-gray-800">points relais partenaires</span> facilitent vos retraits partout en France, tandis que notre service de livraison s'assure que vos colis arrivent à bon port. Profitez également de notre conseillère virtuelle intelligente pour vous guider dans vos choix.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {SERVICES.map((srv, idx) => {
              const IconComponent = srv.icon;
              return (
                <div key={idx} className="bg-white p-4 sm:p-5 rounded-[14px] sm:rounded-xl border border-gray-200 shadow-xs flex items-start gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 bg-[#F5EBE6] text-[#6E857B] rounded-[10px] sm:rounded-xl shrink-0">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-[12px] sm:text-sm mb-0.5 sm:mb-1">{srv.title}</h3>
                    <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">{srv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Questions fréquentes (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <h2 className="text-[18px] sm:text-xl font-bold mb-5 sm:mb-8 text-gray-900 text-center">
          Questions fréquentes
        </h2>

        <div className="space-y-3 sm:space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-[14px] sm:rounded-xl p-4 sm:p-5 bg-white shadow-xs">
              <h3 className="font-bold text-gray-900 text-[12px] sm:text-sm mb-1.5 sm:mb-2 flex items-center justify-between">
                <span className="leading-tight">{faq.question}</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

     

    </div>
  );
}