/** Chemins internes de l'orientation « Galerie » (barre finale, export statique). */
export const BASE = '/galerie';
export const to = (path = '') => `${BASE}${path}/`.replace(/\/{2,}/g, '/');
export const productHref = (slug: string) => to(`/produits/${slug}`);
export const quoteHref = (slug?: string) => (slug ? `${BASE}/contact/?produit=${slug}` : to('/contact'));
export const familyHref = (family: string) => `${BASE}/produits/?famille=${family}`;

/** Numérotation éditoriale : N°01, N°02… */
export const no = (n: number) => `N°${String(n).padStart(2, '0')}`;
export const pad = (n: number) => String(n).padStart(2, '0');
