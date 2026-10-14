import OpenAI from 'openai';

// 1. Initialisation sécurisée pour éviter le crash lors du build Vercel
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-build-placeholder',
});

// 2. Catalogue de référence avec "image_url" pour correspondre à Supabase et au Frontend
export const ECLOSIA_PRODUCTS = [
  { sku: 'SKU-KITBIO40X80M2', name: 'Matelas 40x80 + 3 draps housse coton bio + 2 alèses bio', price: 74.90, slug: 'matelas-40x80-3-draps-housse-coton-bio-2-al-ses-bio', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/6/7/9/7/16797.jpg', is_active: true },
  { sku: 'SKU-BUM1', name: 'Culotte de protection évolutive à velcro So Protect - Rainbow', price: 25.90, slug: 'culotte-de-protection-evolutive-velcro-so-protect-rainbow-sku-bum1', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/2/5/4/14254.jpg', is_active: true },
  { sku: 'SKU-BUM10', name: 'Culotte de protection évolutive à velcro So Protect - Apricot', price: 25.90, slug: 'culotte-de-protection-evolutive-velcro-so-protect-apricot-sku-bum10', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/3/3/0/14330.jpg', is_active: true },
  { sku: 'SKU-BUM12', name: 'Culotte de protection évolutive à velcro So Protect - Chestnut', price: 25.90, slug: 'culotte-de-protection-evolutive-velcro-so-protect-chestnut-sku-bum12', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/3/5/0/14350.jpg', is_active: true },
  { sku: 'SKU-BUM13', name: 'Culotte de protection évolutive à velcro So Protect - Chestnut', price: 25.90, slug: 'culotte-de-protection-evolutive-velcro-so-protect-chestnut-sku-bum13', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/3/8/3/14383.jpg', is_active: true },
  { sku: 'SKU-BUM14', name: 'Culotte de protection évolutive à velcro So Protect - Blue sky', price: 25.90, slug: 'culotte-de-protection-evolutive-velcro-so-protect-blue-sky-sku-bum14', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/3/1/9/14319.jpg', is_active: true },
  { sku: 'SKU-BUM16', name: 'Culotte de protection évolutive à velcro So Protect - Pine', price: 25.90, slug: 'culotte-de-protection-evolutive-velcro-so-protect-pine-sku-bum16', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/3/4/1/14341.jpg', is_active: true },
  { sku: 'SKU-BUM18', name: 'Culotte de protection évolutive à velcro So Protect - Pine', price: 25.90, slug: 'culotte-de-protection-evolutive-velcro-so-protect-pine-sku-bum18', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/3/5/8/14358.jpg', is_active: true },
  { sku: 'SKU-BUM41', name: 'Culotte de protection évolutive à velcro So Protect - Almond', price: 25.90, slug: 'culotte-de-protection-evolutive-velcro-so-protect-almond-sku-bum41', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/3/9/1/14391.jpg', is_active: true },
  { sku: 'SKU-BUM43', name: 'Culotte de protection évolutive à velcro So Protect - Rainbow', price: 25.90, slug: 'culotte-de-protection-evolutive-velcro-so-protect-rainbow-sku-bum43', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/4/3/6/14436.jpg', is_active: true },
  { sku: 'SKU-BUM5', name: 'Culotte de protection évolutive à velcro So Protect - Almond', price: 25.90, slug: 'culotte-de-protection-evolutive-velcro-so-protect-almond-sku-bum5', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/2/8/4/14284.jpg', is_active: true },
  { sku: 'SKU-BUM7', name: 'Culotte de protection évolutive à velcro So Protect - Blue sky', price: 25.90, slug: 'culotte-de-protection-evolutive-velcro-so-protect-blue-sky-sku-bum7', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/3/2/9/14329.jpg', is_active: true },
  { sku: 'SKU-BUM3', name: 'Serviette hygiénique lavable Nuit lot de 3 Chestnut', price: 25.90, slug: 'serviette-hygi-nique-lavable-nuit-lot-de-3-chestnut', image_url: 'https://www.lamaisonenchiffon.com/img/p/8/7/5/4/8754.jpg', is_active: true },
  { sku: 'SKU-COUSAL1', name: 'Coussinet d allaitement lavable lot de 6 Noir', price: 13.90, slug: 'coussinet-d-allaitement-lavable-lot-de-6-noir', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/5/5/9/1/15591.jpg', is_active: true },
  { sku: 'SKU-BBKJNG', name: 'Lot de 10 carrés démaquillants lavables bambou', price: 17.90, slug: 'lot-de-10-carr-s-d-maquillants-lavables-bambou', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/5/9/1/1/15911.jpg', is_active: true },
  { sku: 'SKU-CARREFUSCHIA', name: 'Lot de 10 carrés démaquillants lavables bambou Rose', price: 12.90, slug: 'lot-de-10-carr-s-d-maquillants-lavables-bambou-rose', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/5/5/5/7/15557.jpg', is_active: true },
  { sku: 'SKU-BUM26', name: 'Maillot de bain bébé Bumbuns S/M/L Crabds', price: 17.90, slug: 'maillot-de-bain-b-b-bumbuns-s-m-l-crabds', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/5/5/1/14551.jpg', is_active: true },
  { sku: 'SKU-BUM27', name: 'Maillot de bain bébé Bumbuns S/M/L Crabds', price: 17.90, slug: 'maillot-de-bain-b-b-bumbuns-s-m-l-crabds', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/5/7/4/14574.jpg', is_active: true },
  { sku: 'SKU-BUM28', name: 'Maillot de bain bébé Bumbuns S/M/L Fishes green', price: 17.90, slug: 'maillot-de-bain-b-b-bumbuns-s-m-l-fishes-green', image_url: 'https://www.lamaisonenchiffon.com/img/p/1/4/5/2/8/14528.jpg', is_active: true },
];

export const ECLOSIA_SYSTEM_PROMPT = `
Tu es Clara, conseillère virtuelle experte d'ECLOSIA (maternité, post-partum, puériculture en France).

CATALOGUE ACTIF (prix TTC définitifs) :
${ECLOSIA_PRODUCTS.filter((p) => p.is_active)
  .map((p) => `- ${p.name} : ${p.price.toFixed(2)}€ \vert{} SKU:${p.sku}`)
  .join('\n')}

INACTIFS À NE JAMAIS PROPOSER : SKU-COUP19/20/41/42/43, SKU-FELY, SKU-ABG60X120, SKU-ABG40X80
LIVRAISON EN FRANCE : 10,00€ fixe - Gratuite dès 60€ d'achat (expédition 24/48h). Ne jamais mentionner d'autres pays ou villes hors France.
QUALITÉ & NORMES : Certifié Oeko-Tex, bambou et coton bio, lavable et éco-responsable. (INTERDIT de mentionner "UE", "Union Européenne" ou "Europe").
RÈGLES : Réponds avec douceur et bienveillance sans utiliser d'étoiles (**). Propose 1 à 3 produits maximum avec leur nom et prix exact.
`.trim();