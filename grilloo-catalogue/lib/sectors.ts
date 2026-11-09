/**
 * Secteurs / marchés cibles. Les machines associées viennent uniquement des lieux
 * que chaque fiche du catalogue cite (`product.sectors`). Les textes décrivent le besoin
 * du secteur, sans rien affirmer sur des clients GRILLOO.
 */
import { products, type Product } from './catalog';
import { img } from './assets';

export interface Sector {
  slug: string;
  name: string;
  short: string;
  need: string; // le besoin, en une phrase
  surfaces: string[]; // types de surfaces rencontrées
  families: string[]; // familles pertinentes
  match?: RegExp; // lieux cités par les fiches
  image: string;
  illustration?: string;
}

export const sectors: Sector[] = [
  { slug: 'sante', name: 'Santé & établissements médicalisés', short: 'Santé',
    need: 'Des sols lavés et séchés en un passage, dans des circulations où le personnel et les patients se croisent en permanence.',
    surfaces: ['PVC / vinyle', 'Carrelage', 'Résine'], families: ['autolaveuses', 'aspirateurs', 'monobrosses'],
    match: /m[ée]dical|pharma|h[ôo]pital|clinique|laboratoire/i, image: img.scene('robo-hopital'), illustration: img.clay('sec-sante') },
  { slug: 'logistique', name: 'Logistique, entrepôts & parkings', short: 'Logistique',
    need: 'De grandes surfaces béton à balayer et laver vite, entre les allées de racks et les zones de quai.',
    surfaces: ['Béton', 'Résine époxy', 'Enrobé'], families: ['autoportees', 'balayeuses'],
    match: /entrep[ôo]t|logisti|parking|station|chargement|quai/i, image: img.scene('g9-entrepot'), illustration: img.clay('sec-logistique') },
  { slug: 'industrie', name: 'Industrie & agroalimentaire', short: 'Industrie',
    need: 'Des ateliers où se mêlent poussières, liquides et huiles, qui demandent des machines robustes et des aspirateurs eau et poussière.',
    surfaces: ['Béton', 'Résine', 'Carrelage technique'], families: ['aspirateurs', 'autoportees', 'balayeuses'],
    match: /industri|fabrication|production|atelier|chimi|p[ée]tro|a[ée]rospatial|aliment|abattoir|textile|impression|m[ée]canique|arm[ée]e/i,
    image: img.scene('gs30-atelier'), illustration: img.clay('sec-industrie') },
  { slug: 'commerce', name: 'Commerce & surfaces de vente', short: 'Commerce',
    need: 'Des surfaces de vente à entretenir avant l’ouverture, avec des machines compactes et silencieuses.',
    surfaces: ['Carrelage', 'Pierre', 'PVC'], families: ['autolaveuses', 'monobrosses', 'polisseuses'],
    match: /commerc|magasin|showroom|exposition|concession|marchand|centre/i, image: img.ambiance('commerce'), illustration: img.clay('sec-commerce') },
  { slug: 'hotellerie', name: 'Hôtellerie & restauration', short: 'Hôtellerie',
    need: 'Moquettes de couloirs, halls en marbre et cuisines : chaque surface a sa machine, de l’injecteur-extracteur à la monobrosse.',
    surfaces: ['Moquette', 'Marbre', 'Carrelage de cuisine'], families: ['injecteurs', 'monobrosses', 'souffleurs'],
    match: /h[ôo]tel|h[ôo]tes|restaura|tapis|moquette/i, image: img.scene('gh46-moquette'), illustration: img.clay('sec-hotellerie') },
  { slug: 'bureaux', name: 'Bureaux & tertiaire', short: 'Bureaux',
    need: 'Des espaces de travail occupés en journée, à nettoyer sans bruit ni gêne : aspirateurs, petites autolaveuses, moquettes.',
    surfaces: ['Moquette', 'Parquet', 'PVC'], families: ['aspirateurs', 'autolaveuses', 'injecteurs'],
    match: /bureau/i, image: img.scene('m43-marbre') },
  { slug: 'collectivites', name: 'Collectivités & espaces publics', short: 'Collectivités',
    need: 'Écoles, gymnases, places et voiries : du balayage extérieur au lavage des salles, sur des surfaces très variées.',
    surfaces: ['Pavés', 'Enrobé', 'Sols sportifs'], families: ['balayeuses', 'autolaveuses', 'equipements'],
    match: /municipal|[ée]cole|parc|rue|public|place|campus|gymnase|collectivit|r[ée]sidenti|touristi|trottoir/i,
    image: img.ambiance('collectivites'), illustration: img.clay('sec-collectivites') },
  { slug: 'proprete', name: 'Sociétés de propreté', short: 'Propreté',
    need: 'Des prestataires qui équipent leurs équipes pour des sites très différents : un catalogue complet, de la monobrosse à l’autoportée.',
    surfaces: ['Tous types de sols'], families: ['autolaveuses', 'autoportees', 'monobrosses', 'aspirateurs', 'injecteurs'],
    image: img.scene('about-atelier') },
  { slug: 'prescripteurs', name: 'Architectes, prescripteurs & facility managers', short: 'Prescripteurs',
    need: 'Choisir le bon matériel dès la conception ou la gestion d’un bâtiment : rendements, encombrements et énergies, fiche par fiche.',
    surfaces: ['Selon le projet'], families: ['autoportees', 'autolaveuses', 'escalators'],
    image: img.scene('illu-batiment') },
];

/** Machines dont la fiche cite le secteur ; à défaut, les machines des familles pertinentes. */
export function sectorProducts(s: Sector): Product[] {
  const cited = s.match ? products.filter((p) => p.sectors.some((x) => s.match!.test(x))) : [];
  if (cited.length) return cited;
  return products.filter((p) => s.families.includes(p.family));
}
export const isCited = (s: Sector) => !!s.match && products.some((p) => p.sectors.some((x) => s.match!.test(x)));
export const getSector = (slug: string) => sectors.find((s) => s.slug === slug);
