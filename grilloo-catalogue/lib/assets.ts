/**
 * Tous les chemins d'images passent par ici.
 * Les photos d'ambiance (scenes/, ambiance/) sont PROVISOIRES : à remplacer par les vraies photos
 * fournies par GRILLOO en gardant le même nom de fichier, ou en changeant la table ci-dessous.
 */
const base = '/img';

export const img = {
  /** Photo produit détourée (PNG transparent, extraite du catalogue). */
  product: (slug: string) => `${base}/cut/${slug}.png`,
  /** Mise en situation (machine réelle intégrée à un décor). */
  scene: (name: string) => `${base}/scenes/${name}${name.startsWith('illu-') ? '.png' : '.jpg'}`,
  /** Photo d'ambiance sans machine. */
  ambiance: (name: string) => `${base}/ambiance/${name}.jpg`,
  /** Illustration 3D douce aux couleurs de la marque. */
  clay: (name: string) => `${base}/clay/${name}.png`,
  /** Logo : variantes cyan | white | ink, avec (lockup) ou sans (mark) signature. */
  logo: (variant: 'cyan' | 'white' | 'ink' = 'cyan', lockup = false) => `${base}/brand/logo-${lockup ? 'lockup' : 'mark'}-${variant}.png`,
  catalogue: '/catalogue-grilloo-2024.pdf',
};

/** Mises en situation disponibles (galerie). `before`/`after` = paire avant/après sur le même cadrage. */
export const gallery = [
  { id: 'g9-entrepot', product: 'g9', sector: 'logistique', place: 'Entrepôt logistique' },
  { id: 'robo-hopital', product: 'roboclean-g-plus', sector: 'sante', place: 'Couloir hospitalier' },
  { id: 'gbe1200-parking', product: 'gbe1200', sector: 'logistique', place: 'Parking souterrain' },
  { id: 'm43-marbre', product: 'm43', sector: 'hotellerie', place: 'Hall en marbre' },
  { id: 'gh46-moquette', product: 'gh46', sector: 'hotellerie', place: 'Couloir d’hôtel' },
  { id: 'gs30-atelier', product: 'gs30', sector: 'industrie', place: 'Atelier industriel' },
  { id: 'hero-b', product: 'g9', sector: 'industrie', place: 'Hall industriel, de nuit' },
  { id: 'hero-c', product: 'roboclean-g-plus', sector: 'prescripteurs', place: 'Studio' },
].map((g) => ({ ...g, src: img.scene(g.id) }));

export const beforeAfter = { before: img.ambiance('sol-sale'), after: img.ambiance('sol-propre'), caption: 'Sol béton industriel, avant et après un passage d’autolaveuse (visuel d’illustration).' };
