# Brief technique — construction d'une orientation

Lire d'abord `DESIGN.md` (concept, règles de contenu, pages, 3 orientations).

## Environnement (Windows, PowerShell 5.1)

- Node portable : préfixer chaque commande par `$env:Path = "$env:LOCALAPPDATA\nodejs-portable;$env:Path";`
- Le projet est dans OneDrive : les commandes npm/next sont lentes (compilation 1–3 min), c'est normal.
- **Ne jamais lancer `npm run build`** (un seul build final, fait par le coordinateur ; plusieurs builds en parallèle se corrompent).
- Vérification de types : `npx tsc --noEmit` (tout le projet doit rester vert).
- Serveur de dev isolé par orientation (sinon conflit de dossier `.next`) :
  `$env:NEXT_DIST_DIR='.next-<orientation>'; npx next dev -p <port>` — à lancer en arrière-plan, attendre « Ready », puis l'arrêter à la fin.
- Captures : `powershell -ExecutionPolicy Bypass -File scripts\shot.ps1 -Base http://localhost:<port> -Out <dossier scratchpad> -Pages '/<orientation>/|1440x900', ... [-Reduce] [-Mobile]`
  `-Reduce` force prefers-reduced-motion (le contenu révélé au scroll apparaît d'emblée) ; `-Mobile` capture en 390 px. La première visite d'une page déclenche sa compilation : capturer deux fois si la première image est vide.

## Périmètre de fichiers

- Écrire **uniquement** dans `app/<orientation>/**` et `components/<orientation>/**` (et `public/img/<orientation>/**` si besoin de SVG statiques).
- **Ne pas modifier** `lib/*`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `next.config.ts`, `package.json`. Les jetons de couleur/police de l'orientation sont déjà dans `app/globals.css` (préfixes `ga-`, `si-`, `pl-`) ; CSS spécifique (keyframes, formes complexes) : un fichier `app/<orientation>/<orientation>.css` importé par son `layout.tsx`, en CSS classique (pas de `@apply`, pas de `@theme`).
- Pas de nouvelle dépendance npm. Animations en CSS + React (IntersectionObserver via `useReveal`), pas de librairie.

## Données et logique partagées (à utiliser, ne pas dupliquer)

- `lib/catalog.ts` : `brand`, `families`, `products`, `getProduct`, `getFamily`, `productsOf`, `familyHero`, `familyIntro`, `keyFigures`, `fmt`, `range`, `fmtRange`, `stats`, `featured`, `warranty`, `process`, `ENERGY_LABEL`, `energies`, `searchProducts`.
- `lib/sectors.ts` : `sectors` (9 secteurs), `sectorProducts`, `isCited`, `getSector`.
- `lib/assets.ts` : `img.product(slug)` (PNG détouré), `img.scene(id)`, `img.ambiance(name)`, `img.clay(name)`, `img.logo(variant, lockup)`, `img.catalogue` (PDF), `gallery` (mises en situation), `beforeAfter`.
- `lib/site.ts` : `site` (coordonnées — TODO = « À fournir par GRILLOO », à afficher tel quel), `nav` (chemins relatifs à préfixer par `/<orientation>`), `requestTypes`, `floorTypes`.
- `lib/hooks.ts` (client) : `useCatalogFilter()` (recherche, famille, énergie, tri, synchro URL `?q=&famille=&energie=`), `useReveal()`, `useQuoteForm()` (lit `?produit=` ; maquette, rien n'est envoyé).

Images disponibles (`public/img/`) :
- `cut/<slug>.png` : 81 photos produits détourées (transparent), une par slug de produit (+ variantes).
- `scenes/` : g9-entrepot, robo-hopital, gbe1200-parking, m43-marbre, gh46-moquette, gs30-atelier (vraies machines en situation, 1536×1024), hero-a (G54 + G9 + GBE1200 en studio blanc), hero-b (G9 de nuit, sol mouillé — sombre), hero-c (RoboClean G+ sur podium blanc), about-atelier, about-stock, illu-batiment / illu-ville / illu-coupe (illustrations PNG transparentes).
- `ambiance/` : sante, logistique, industrie, commerce, hotellerie, collectivites, brosse, hall-nuit, sol-sale, sol-propre (même cadrage : avant/après).
- `clay/` : illustrations 3D douces monochromes sarcelle (sec-sante, sec-logistique, sec-industrie, sec-commerce, sec-hotellerie, sec-collectivites, about, cta, val-<valeur>, step-*).
- `brand/` : logo-mark-{cyan,white,ink}.png, logo-lockup-{cyan,white,ink}.png.
Toutes les photos d'ambiance sont provisoires (le client fournira les siennes). Icônes : SVG inline dessinés à la main dans `components/<orientation>/icons.tsx`.

## Routes à livrer (toutes sous `app/<orientation>/`)

`layout.tsx` (header + footer communs à l'orientation, métadonnées), `page.tsx` (accueil, **exactement 5 sections**), `produits/page.tsx`, `produits/[slug]/page.tsx` (+ `generateStaticParams` sur les 75 produits, `dynamicParams = false`), `a-propos/page.tsx`, `secteurs/page.tsx`, `mises-en-situation/page.tsx`, `contact/page.tsx`.
- Export statique : pas d'API route, pas de `searchParams` côté serveur, pas de `headers()`. Le filtrage du catalogue est un composant client.
- Liens internes avec barre finale : `/<orientation>/produits/g9/`. Boutons « Demander un devis » → `/<orientation>/contact/?produit=<slug>`.
- `next/image` partout (images déjà non optimisées), `alt` pertinents, `priority` sur l'image du hero.
- SEO : `metadata` par page (title, description), un seul `h1` par page, JSON-LD `Product` sur les fiches.
- Responsive impeccable (390 px → 1440 px+), menu mobile accessible (bouton, `aria-expanded`, Échap), focus visibles, `prefers-reduced-motion` respecté.
- Header : liens vers les 5 pages de `nav` + bouton « Demander un devis » ; indiquer la page courante. Footer complet : logo, familles, pages, contact (valeurs TODO), réseaux, lien PDF catalogue, lien « ← Autres orientations » vers `/`.

## Qualité visuelle — ce qui est refusé

Le client a rejeté des maquettes « AI slop ». À éviter : dégradés violets/bleus génériques, blobs, glassmorphism partout, cartes identiques à coins arrondis empilées sans hiérarchie, icônes de pack génériques, emoji, compteurs animés, faux témoignages, faux logos clients, lorem ipsum, textes marketing creux. Chaque section doit avoir un rôle clair, une composition propre à l'orientation et un vrai contenu du catalogue.
