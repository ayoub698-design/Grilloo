# GRILLOO — Site catalogue (3 orientations)

Next.js 15 (App Router) · Tailwind CSS v4 · TypeScript · export statique.

- `/` : choix de l'orientation
- `/galerie/` : A — minimaliste / luxe
- `/signal/` : B — audacieux / bold
- `/plan/` : C — technique / architectural

Chaque orientation a les mêmes pages : accueil (5 sections), Nos produits, fiche produit (×75), À propos de nous, Nos secteurs, Mises en situation, Contact.
Concept et règles : [DESIGN.md](DESIGN.md) · conventions de code : [BRIEF-TECHNIQUE.md](BRIEF-TECHNIQUE.md).

## Version HTML locale (double-clic, sans serveur)

`npm run html` produit le dossier **`site-html/`** : un site HTML complet qui s'ouvre en double-cliquant sur `site-html/index.html` (ou sur `OUVRIR-LE-SITE.cmd`), sans installation ni serveur. Ce dossier peut être copié sur une clé USB ou zippé et envoyé.

## Lancer en développement

Node.js est installé en version portable dans `%LOCALAPPDATA%\nodejs-portable` (ajouté au PATH utilisateur : ouvrir un nouveau terminal).

```powershell
cd "$env:USERPROFILE\OneDrive\Desktop\griloo\grilloo-catalogue"
npm install        # une seule fois
npm run dev        # http://localhost:3000
```

Version de production : `npm run build` génère le dossier `out/` (site statique complet).

> Le projet est dans OneDrive : la synchronisation ralentit fortement `npm` et la compilation. Pour travailler confortablement, déplacer le dossier hors d'OneDrive (par ex. `C:\dev\grilloo-catalogue`) ou exclure `node_modules` et `.next*` de la synchronisation.

## Déployer

- **Vercel** : importer le dépôt, framework « Next.js », aucune configuration (l'export statique est déclaré dans `next.config.ts`).
- **Netlify** : commande de build `npm run build`, dossier publié `out`. Ou glisser le dossier `out/` sur app.netlify.com/drop.

## Contenus à fournir par GRILLOO avant la mise en ligne

Tout est centralisé :
- `lib/site.ts` : e-mail, téléphone, adresse, horaires, coordonnées GPS (plan d'accès), liens réseaux sociaux. Les valeurs manquantes s'affichent « À fournir par GRILLOO ».
- `lib/assets.ts` : chemins des photos. Les photos d'ambiance actuelles sont provisoires (générées) ; remplacer les fichiers de `public/img/scenes/` et `public/img/ambiance/` par les vraies photos, même nom de fichier.
- Formulaire : `lib/hooks.ts` → `useQuoteForm().submit` (brancher Netlify Forms, Formspree ou un service e-mail).
- `lib/catalog-data.json` : données du catalogue 2024 ; plusieurs fiches se contredisent, voir `../directions/shared/data-issues.md`.

### Photos souhaitées (liste de prises de vue)

| Usage | Photo | Format conseillé |
|---|---|---|
| Hero | 1 machine phare (G9 ou RoboClean G+) en situation réelle, lumière naturelle | paysage 3:2, ≥ 2400 px |
| Mises en situation | 1 photo par secteur avec une machine GRILLOO en service : hôpital, entrepôt, usine, magasin, hôtel/restaurant, bureaux, espace public | paysage 3:2, ≥ 2000 px |
| Avant / après | même cadrage d'un sol avant et après passage (2 photos, trépied) | 3:2 |
| À propos | locaux, atelier SAV, stock, équipe (si souhaité) | 3:2 ou 4:5 |
| Produits | idéalement nouveaux packshots sur fond blanc uni (les actuels sont extraits du PDF) | carré, ≥ 1600 px |
