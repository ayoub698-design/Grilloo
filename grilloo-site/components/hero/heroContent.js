/**
 * Contenu du Hero, tiré du catalogue GRILLOO 2024.
 * Modifiez ici les textes et la vidéo sans toucher aux composants.
 */

export const HERO_VIDEO = {
  /** Durée de la boucle en secondes. Une vidéo plus longue est rebouclée sur ces 5 s. */
  loopDuration: 5,
  /** Ordre = priorité : le navigateur prend la première source qu'il sait lire. */
  sources: [
    { src: '/videos/hero-loop.webm', type: 'video/webm' },
    { src: '/videos/hero-loop.mp4', type: 'video/mp4' },
  ],
  /** Image affichée avant la lecture, ex. '/videos/hero-poster.jpg'. */
  poster: null,
  caption: 'Boucle vidéo · 5 s',
};

export const NAV_LINKS = [
  { label: 'Machines', href: '#catalogue' },
  { label: 'RoboClean G+', href: '#roboclean' },
  { label: 'Secteurs', href: '#secteurs' },
  { label: 'Garantie', href: '#garantie' },
];

export const HERO_COPY = {
  eyebrow: 'Catalogue 2024 · 75 machines professionnelles',
  titleStart: 'La propreté,',
  titleAccent: "à l'échelle industrielle.",
  lede:
    'Autolaveuses, autoportées, balayeuses de voirie et aspirateurs ATEX. Des machines conçues pour les entrepôts, les hôpitaux, les centres commerciaux et les villes.',
  primaryCta: { label: 'Explorer le catalogue', href: '#catalogue' },
  secondaryCta: { label: 'Découvrir RoboClean G+', href: '#roboclean' },
};

export const FEATURED = {
  badge: 'Autonome',
  norm: 'EN IEC 63327',
  name: 'RoboClean G+',
  href: '#roboclean',
  stats: [
    { value: '2 365', unit: 'm²/h en autonome' },
    { value: '3,5 h', unit: 'Lithium-ion 24 V' },
    { value: '550 mm', unit: 'largeur de brosses' },
    { value: '55 / 55 L', unit: 'eau propre / sale' },
  ],
};

export const CATEGORIES = [
  'Autolaveuses',
  'Autoportées',
  'Aspirateurs',
  'Monobrosses',
  'Polisseuses',
  'Balayeuses',
  'Injecteurs-extracteurs',
  "Machines d'escalator",
  'Souffleurs',
  'Nettoyeurs haute pression',
];
