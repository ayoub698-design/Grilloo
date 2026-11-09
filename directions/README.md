# GRILLOO — maquettes « 3 directions »

Site statique sans build : HTML, CSS et JavaScript natifs. Ouvrir `index.html` dans un navigateur suffit.

```
directions/
  index.html            Synthèse : 3 directions, arborescence, SEO, points à valider
  a/  b/  c/            index.html (accueil) · gamme.html?f=<famille> · produit.html?p=<modèle>
  shared/
    data.js             Catalogue 2024 structuré (familles, produits, specs, variantes)
    data-issues.md      Incohérences du catalogue à faire valider par GRILLOO
    core.js / core.css  Helpers communs, panneau devis, révélations au scroll
    img/cut/            Photos produits extraites du PDF, détourées (PNG transparents)
    img/ambiance/       Ambiances générées (gpt-image-2.5) : lieux, sols, brosse
    img/brand/          Logo GRILLOO (cyan, blanc, encre ; avec et sans signature)
    img/catalogue/      Visuels d'ambiance d'origine du PDF
```

## Mise en ligne de test

- **Netlify** : glisser le dossier `directions/` sur app.netlify.com/drop.
- **Vercel** : `vercel deploy directions` (projet « Other », sans commande de build).

Le PDF du catalogue est copié dans `directions/Catalogue-GRILLOO-2024.pdf` : le dossier est autonome. Poids total environ 41 Mo (PNG détourés 26 Mo, PDF 10 Mo) ; en production, servir les images en WebP.

## Passage en production (Next.js)

`data.js` devient la source des pages générées statiquement : `/[famille]` et `/[famille]/[modele]`, avec métadonnées, JSON-LD Product (déjà produit par `GC.productLd`) et `next/image` pour servir les PNG en WebP.

## Outils de régénération (`../tools/`)

- `PdfImages.cs`, `PdfToPng.cs` : déchiffrent le PDF (RC4, mot de passe vide) et convertissent les images CMJN en PNG RVB.
- `Cutout.cs` : détourage du fond blanc, recadrage, réduction.
- `gen-image.ps1` : génération / édition d'image via l'API OpenAI (clé lue dans la variable d'environnement utilisateur `OPENAI_API_KEY`).
