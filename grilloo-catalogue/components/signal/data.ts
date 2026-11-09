/* Dérivations « Signal » à partir des données partagées (aucune donnée inventée : tout est extrait du catalogue). */
import { products, type Product } from '@/lib/catalog';

/** Modèle au rendement théorique le plus élevé. */
export const topProductivity: Product = products.reduce((a, b) => ((b.key.productivity ?? 0) > (a.key.productivity ?? 0) ? b : a));

/** Normes, indices et classes cités tels quels par les fiches produits. */
export interface Cited { label: string; detail: string; products: Product[] }
export const citedStandards: Cited[] = (() => {
  const out = new Map<string, Cited>();
  const add = (label: string, detail: string, p: Product) => {
    const c = out.get(label) ?? { label, detail, products: [] };
    if (!c.products.includes(p)) c.products.push(p);
    out.set(label, c);
  };
  for (const p of products) {
    for (const [k, v] of p.specs) {
      const ex = p.specs.find(([l]) => /marque ex/i.test(l))?.[1] ?? '';
      if (/degr[ée] de protection/i.test(k) && !ex.includes(v.replace(/^Indice de protection\s*/i, ''))) add(v.replace(/^Indice de protection\s*/i, ''), 'Indice de protection', p);
      if (/marque ex/i.test(k)) add(v, 'Marquage Ex (zones de poussières explosives)', p);
      if (/norme de s[ée]curit[ée]/i.test(k)) add(v, 'Norme de sécurité électrique', p);
    }
    const text = [p.lead, ...p.description, ...p.features].join(' ');
    if (/ATEX/.test(text)) add('ATEX', 'Directive européenne, protection contre les explosions', p);
    if (/HEPA H13/.test(text)) add('HEPA H13', 'Filtration très haute efficacité', p);
    else if (p.specs.some(([, v]) => /HEPA/.test(v))) add('HEPA', 'Degré de filtration', p);
    if (/inox SUS304/i.test(text)) add('Inox SUS304', 'Acier inoxydable', p);
  }
  return [...out.values()];
})();
