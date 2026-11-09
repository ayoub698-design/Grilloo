/**
 * Catalogue GRILLOO 2024 — source unique de vérité.
 * Données transcrites du PDF (lib/catalog-data.json, régénérable avec scripts/convert-data.cjs).
 * Règle : n'afficher comme fait que ce qui figure ici.
 */
import raw from './catalog-data.json';

export type Spec = [label: string, value: string];
export type Energy = 'batterie' | 'secteur' | 'manuel' | 'pneumatique' | 'thermique';

export interface ProductKey {
  productivity: number | null; // m²/h
  width: number | null; // mm
  tank: number | null; // L
  autonomy: number | null; // h
  power: number | null; // W
  weight: number | null; // kg
  energy: Energy | null;
}

export interface Product {
  slug: string;
  name: string;
  family: string;
  kind: string;
  page: number;
  img: string;
  imgAlt: string[];
  lead: string;
  description: string[];
  features: string[];
  accessories: string[];
  options: string[];
  specs: Spec[];
  variants: { name: string; specs: Spec[] }[] | null;
  key: ProductKey;
  sectors: string[];
}

export interface Family {
  slug: string;
  name: string;
  plural: string;
  label: string;
  intro: string;
  count: number;
}

export interface BrandValue { key: string; title: string; text: string }

export interface Brand {
  name: string;
  tagline: string;
  site: string;
  headline: string;
  cover: { title: string; heading: string; text: string };
  backCover: string;
  intro: string;
  closing: string;
  mission: string;
  summary: string;
  values: BrandValue[];
}

const data = raw as unknown as { brand: Brand; families: Family[]; products: Product[] };

export const brand: Brand = data.brand;
export const families: Family[] = data.families;
export const products: Product[] = data.products.map((p) => ({
  ...p,
  imgAlt: p.imgAlt ?? [],
  description: p.description ?? [],
  features: p.features ?? [],
  accessories: p.accessories ?? [],
  options: p.options ?? [],
  specs: p.specs ?? [],
  sectors: p.sectors ?? [],
}));

const bySlug = new Map(products.map((p) => [p.slug, p]));
const famBySlug = new Map(families.map((f) => [f.slug, f]));

export const getProduct = (slug: string) => bySlug.get(slug);
export const getFamily = (slug: string) => famBySlug.get(slug);
export const productsOf = (family: string) => products.filter((p) => p.family === family);

/** Représentant visuel de chaque famille. */
const FAMILY_HERO: Record<string, string> = {
  autolaveuses: 'g54', autoportees: 'g9', aspirateurs: 'gs30', monobrosses: 'm43', polisseuses: 'gp1800',
  balayeuses: 'gbe1200', injecteurs: 'gh46', souffleurs: 'gk180', escalators: 'ge30', equipements: 'gnh150',
};
export const familyHero = (family: string) => FAMILY_HERO[family] ?? productsOf(family)[0]?.img;

/** Texte d'introduction de famille (le catalogue n'en a pas pour toutes : repli sur le texte du 1er modèle). */
export const familyIntro = (f: Family) => f.intro || productsOf(f.slug)[0]?.lead || '';

/** Mise en forme française. */
export const fmt = (n: number | null | undefined, digits = 1) =>
  n == null || Number.isNaN(n) ? '—' : Number(n).toLocaleString('fr-FR', { maximumFractionDigits: digits });

export function range(list: Product[], key: keyof Omit<ProductKey, 'energy'>): [number, number] | null {
  const v = list.map((p) => p.key[key]).filter((x): x is number => typeof x === 'number');
  return v.length ? [Math.min(...v), Math.max(...v)] : null;
}
export const fmtRange = (r: [number, number] | null) => (!r ? '—' : r[0] === r[1] ? fmt(r[0], 0) : `${fmt(r[0], 0)}–${fmt(r[1], 0)}`);

export interface KeyFigure { id: string; value: string; unit: string; label: string }

/** Jusqu'à `max` chiffres clés lisibles, dans l'ordre d'importance. */
export function keyFigures(p: Product, max = 4): KeyFigure[] {
  const k = p.key, out: KeyFigure[] = [];
  if (k.productivity) out.push({ id: 'prod', value: fmt(k.productivity, 0), unit: 'm²/h', label: 'Rendement' });
  if (k.width) out.push({ id: 'width', value: fmt(k.width / 10, 1), unit: 'cm', label: 'Largeur de travail' });
  if (k.tank) out.push({ id: 'tank', value: fmt(k.tank, 1), unit: 'L', label: 'Capacité' });
  if (k.autonomy) out.push({ id: 'auto', value: fmt(k.autonomy, 1), unit: 'h', label: 'Autonomie' });
  if (k.power) out.push({ id: 'power', value: fmt(k.power, 0), unit: 'W', label: 'Puissance' });
  if (k.weight) out.push({ id: 'weight', value: fmt(k.weight, 1), unit: 'kg', label: 'Poids' });
  const norm = (s: string) => s.replace(/\s/g, '').toLowerCase();
  for (const [label, value] of p.specs) {
    if (out.length >= max) break;
    if (/mod[eè]le/i.test(label)) continue;
    if (out.some((o) => norm(o.value + o.unit) === norm(value) || norm(o.label) === norm(label))) continue;
    out.push({ id: `s${out.length}`, value, unit: '', label });
  }
  return out.slice(0, max);
}

export const stats = (() => {
  const r = range(products, 'productivity');
  return { products: products.length, families: families.length, minProd: r?.[0] ?? 0, maxProd: r?.[1] ?? 0 };
})();

export const ENERGY_LABEL: Record<Energy, string> = {
  batterie: 'Batterie', secteur: 'Secteur', manuel: 'Manuel', pneumatique: 'Pneumatique', thermique: 'Thermique',
};
export const energies = (list: Product[]) =>
  Array.from(new Set(list.map((p) => p.key.energy).filter(Boolean))) as Energy[];

/** Recherche plein texte tolérante (accents, casse). */
export const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export function searchProducts(query: string, list: Product[] = products) {
  const q = normalize(query).trim();
  if (!q) return list;
  return list.filter((p) => {
    const f = getFamily(p.family);
    return normalize(`${p.name} ${p.kind} ${f?.name ?? ''} ${f?.plural ?? ''} ${p.lead}`).includes(q);
  });
}

/** Produits phares (sélection éditoriale, une par usage majeur). */
export const featured = ['roboclean-g-plus', 'g9', 'g54', 'gbe1200', 'gs30', 'm43', 'gh46', 'gp1800']
  .map(getProduct).filter((p): p is Product => !!p);

/** Garantie : principes génériques du catalogue (p. 6) — aucune durée n'y est donnée. */
export const warranty: [string, string][] = [
  ['Durée', 'Définie produit par produit'],
  ['Couverture', 'Défauts de fabrication et pièces'],
  ['Conditions', 'Utilisation et entretien conformes aux instructions'],
  ['Réclamation', 'Preuve d’achat et procédure dédiée'],
  ['Exclusions', 'Mauvaise utilisation, accident'],
  ['Service client', 'À votre écoute pour toute question'],
];

/** Principe d'une autolaveuse, tel que décrit dans les fiches (brosser, aspirer, sécher). */
export const process = [
  { step: 'Laver', text: 'La solution est déposée et dosée sur le sol depuis le réservoir d’eau propre.' },
  { step: 'Brosser', text: 'Le plateau de brosse décolle la salissure : de 8 kg de pression (G01M) à 120 kg (G100).' },
  { step: 'Aspirer', text: 'Le moteur d’aspiration récupère l’eau sale dans le réservoir de récupération.' },
  { step: 'Sécher', text: 'Le suceur incurvé ramène l’eau vers l’aspiration : le sol est sec derrière la machine.' },
];
