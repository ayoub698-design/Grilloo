# GRILLOO — Site catalogue · 3 orientations

Site catalogue de GRILLOO (« Leader des solutions de nettoyage »), fabricant de machines de nettoyage professionnelles : 75 machines, 10 familles (catalogue 2024).
Esthétique commune : **White / clean & premium** — fonds blancs ou très clairs, typographie raffinée, beaucoup d'air, le produit détouré comme héros.

## Règles de contenu (non négociables)

- **Rien d'inventé.** Seuls les textes, chiffres et caractéristiques du catalogue (`lib/catalog.ts`) sont affichés comme des faits.
- **Pas d'avis clients, pas de réalisations fictives.** La réassurance est factuelle (chiffres du catalogue, garantie, SAV, normes citées par les fiches). La page « Mises en situation » montre les machines par secteur, sans prétendre à des chantiers réels.
- **Coordonnées, horaires, adresse :** inconnus → emplacements visibles « À fournir par GRILLOO » (`lib/site.ts`).
- **Visuels :** les photos d'ambiance actuelles sont provisoires ; le client fournira de vraies photos. Tous les chemins d'images passent par `lib/assets.ts` pour être remplacés en un seul endroit.

## Pages (identiques pour les 3 orientations)

| Route | Contenu |
|---|---|
| `/` | Accueil — **exactement 5 sections** : 1 Hero · 2 Produits phares / aperçu du catalogue · 3 Concept & savoir-faire · 4 Réassurance factuelle · 5 Appel à l'action devis/contact |
| `/produits` | Catalogue : recherche, filtres par famille (et énergie), grille, boutons « Voir la fiche » / « Demander un devis » |
| `/produits/[slug]` | Fiche produit : visuel, chiffres clés, caractéristiques, points forts, accessoires, variantes, produits associés |
| `/a-propos` | Histoire (texte du catalogue), objectif, 7 engagements, expertise (10 familles), garantie |
| `/secteurs` | Domaines d'application (voir liste ci-dessous) avec les machines citées par le catalogue |
| `/mises-en-situation` | Galerie grand format des machines en situation, tags par secteur, comparaison sol avant / après |
| `/contact` | Formulaire devis/contact (type de demande, machine, surface, sol), coordonnées, horaires, plan d'accès |

Secteurs : Santé & établissements médicalisés · Logistique, entrepôts & parkings · Industrie & agroalimentaire · Commerce & surfaces de vente · Hôtellerie & restauration · Bureaux & tertiaire · Collectivités & espaces publics · Sociétés de propreté · Architectes, prescripteurs & facility managers.

## Les 3 orientations

### A — « Galerie » · minimaliste / luxe
Le catalogue comme un catalogue d'objets de design. Blanc chaud, silence, lenteur.
- **Typo :** Fraunces (display, optique haute, italiques) + Inter (texte). Chiffres en Fraunces.
- **Couleurs :** blanc cassé `#FAF9F6`, ivoire `#F1EEE8`, encre `#141414`, gris pierre `#8A867E`, accent cyan GRILLOO `#49B5BF` utilisé en filet fin uniquement.
- **Mise en page :** grille éditoriale asymétrique, très grandes marges, numérotation « N°01 », légendes en petites capitales, produits posés sur un socle ivoire avec ombre portée douce.
- **Motion :** fondus lents (900 ms), révélations par masque vertical, parallaxe très légère, curseur discret sur les cartes.
- **Séparateurs :** une seule courbe en filet (1 px) qui traverse la page, arches en creux.

### B — « Signal » · audacieux / bold
L'énergie de la marque. Blanc éclatant, typographie géante, cyan en aplats.
- **Typo :** Archivo (variable, largeur 62–125, graisses 400–900) : titres extra-larges en 900, texte en 400.
- **Couleurs :** blanc `#FFFFFF`, cyan GRILLOO `#1FB8CC` / `#49B5BF` en grands aplats, encre `#0A0A0A`, jaune signal `#FFD23F` en touche rare (badges).
- **Mise en page :** titres de 120–200 px qui chevauchent les produits détourés, chiffres énormes, étiquettes arrondies, bandeaux défilants (marquee) de noms de modèles.
- **Motion :** rapide et nerveuse (cubic-bezier élastique), textes qui glissent au scroll, cartes qui basculent légèrement au survol.
- **Séparateurs :** forme de raclette incurvée, bord dentelé façon poils de brosse, diagonales franches.

### C — « Plan » · élégance technique / architecturale
Le catalogue comme un dossier d'architecte. Papier blanc, trait fin, précision.
- **Typo :** Geist (texte et titres, graisses 300–600) + Geist Mono (cotes, références, légendes).
- **Couleurs :** blanc `#FFFFFF`, papier `#F6F8F8`, trait `#0D5560` (sarcelle foncé), cyan `#49B5BF` pour les cotes, gris `#9AA7AA`.
- **Mise en page :** grille visible à 8 colonnes, cartouches de plan (titre, échelle, référence), lignes de cote animées sur les produits, dessins axonométriques au trait en SVG pour les secteurs.
- **Motion :** tracés SVG qui se dessinent (stroke-dashoffset), compteurs de cote, apparitions en balayage horizontal.
- **Séparateurs :** découpes en gradins (escaliers architecturaux), angles à 15°, lignes de coupe pointillées.

## Technique

- Next.js (App Router) + Tailwind CSS v4, TypeScript, export statique (`output: 'export'`) → dossier `out/` déployable tel quel sur Netlify ou Vercel.
- Une seule base de code : `/` présente les 3 orientations ; chaque orientation vit sous `/galerie`, `/signal`, `/plan` avec son propre layout, ses polices et ses composants (`components/<orientation>/`).
- Données partagées : `lib/catalog.ts` (catalogue), `lib/sectors.ts`, `lib/site.ts` (coordonnées), `lib/assets.ts` (chemins d'images).
- Accessibilité : contrastes AA, navigation clavier, `prefers-reduced-motion` respecté, textes alternatifs.
