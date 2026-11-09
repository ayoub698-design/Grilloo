# GRILLOO — site vitrine (Next.js)

Hero Scene immersive, direction graphique **B « Noir Hydro »** : fond vidéo de 5 s en boucle, voile de lisibilité, carte produit RoboClean G+ en verre dépoli, défilant des familles de produits.

## Lancer le projet

Node.js 18.18 ou plus récent est requis (non installé sur ce poste au moment de l'écriture).

```powershell
winget install OpenJS.NodeJS.LTS   # puis rouvrir le terminal
cd "$env:USERPROFILE\OneDrive\Desktop\griloo\grilloo-site"
npm install
npm run dev                         # http://localhost:3000
```

Production : `npm run build` puis `npm start`.

## Arborescence

```
app/
  layout.jsx              Polices (next/font), métadonnées, lien d'évitement
  page.jsx                Page d'accueil : en-tête + Hero
  globals.css             Jetons de design (couleurs, rayons, gouttières)
components/
  header/SiteHeader.jsx   Navigation + menu mobile accessible (Échap, aria-expanded)
  hero/HeroScene.jsx      Composition du Hero
  hero/useLoopingVideo.js Lecture, pause, détection d'échec, boucle stricte de 5 s
  hero/WaterLoopCanvas.jsx Scène canvas de secours, boucle parfaite de 5 s
  hero/LoopControl.jsx    Bouton lecture/pause avec anneau de progression
  hero/heroContent.js     Tous les textes et la configuration vidéo
public/videos/            Emplacement de hero-loop.webm / hero-loop.mp4
```

## Fonctionnement de la boucle de 5 s

1. Au montage, la scène canvas s'affiche immédiatement (pas d'écran noir pendant le chargement).
2. La vidéo se charge par-dessus ; elle apparaît en fondu dès qu'elle **joue réellement** (événement `playing`).
3. Un fichier de 5 s exactes boucle via l'attribut natif `loop`. Un fichier plus long est rebouclé à 5 s par `requestVideoFrameCallback`, synchronisé image par image.
4. Si aucune source n'est lisible, ou si le navigateur refuse la lecture automatique, la scène canvas reste en place.
5. La lecture se met en pause hors écran, quand l'onglet est masqué, et au clic sur le bouton Pause (qui fige aussi les autres animations, critère WCAG 2.2.2).
6. `prefers-reduced-motion` : tout démarre à l'arrêt. Mode « économie de données » ou 2G : la vidéo n'est pas téléchargée.

## Préparer la vidéo

Installer ffmpeg : `winget install Gyan.FFmpeg`.

**Boucle sans raccord visible (recommandé).** On prend 6 s de la source et on fond la dernière seconde dans la première : la dernière image rejoint exactement la première.

```powershell
ffmpeg -ss 2 -i source.mp4 -t 6 -an -filter_complex "[0:v]scale=1920:-2:flags=lanczos,fps=30,split[a][b];[a]trim=1:6,setpts=PTS-STARTPTS[main];[b]trim=0:1,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=1:offset=4,format=yuv420p[v]" -map "[v]" -c:v libx264 -preset slow -crf 24 -movflags +faststart public/videos/hero-loop.mp4

ffmpeg -i public/videos/hero-loop.mp4 -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -an public/videos/hero-loop.webm

ffmpeg -i public/videos/hero-loop.mp4 -frames:v 1 -q:v 3 public/videos/hero-poster.jpg
```

Puis, dans `components/hero/heroContent.js`, renseignez `poster: '/videos/hero-poster.jpg'`.

**Quel plan filmer ou choisir ?** Un plan lent et sombre fonctionne le mieux sous le texte : autolaveuse en travelling latéral sur sol mouillé, reflets de baies vitrées, brosses en rotation en gros plan. Les vidéos du catalogue GRILLOO sont idéales ; à défaut, une banque libre de droits (Pexels, Mixkit : « floor scrubber », « wet floor reflection », « industrial cleaning ») — vérifiez la licence de chaque clip.

Budget conseillé : moins de 3 Mo pour le MP4, moins de 2 Mo pour le WebM.

## Personnaliser

- Textes, liens, chiffres : `components/hero/heroContent.js` (données reprises du catalogue 2024).
- Couleurs et rayons : `app/globals.css`.
- Logo : remplacer le mot-symbole texte dans `SiteHeader.jsx` par le SVG officiel placé dans `public/brand/`.
