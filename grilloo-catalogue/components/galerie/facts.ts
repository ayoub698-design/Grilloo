/**
 * Faits dérivés du catalogue (aucune donnée ajoutée) : normes et garanties citées par les fiches,
 * machine au rendement maximal.
 */
import { products, type Product } from '@/lib/catalog';

export interface CitedRow { title: string; value: string; products: Product[] }

const texts = (p: Product) => [p.lead, ...p.description, ...p.features].join(' \n ');

export function citedStandards(): CitedRow[] {
  const rows: CitedRow[] = [];
  const add = (title: string, value: string, p: Product) => {
    let r = rows.find((x) => x.title === title && x.value === value);
    if (!r) { r = { title, value, products: [] }; rows.push(r); }
    if (!r.products.includes(p)) r.products.push(p);
  };
  for (const p of products) {
    const t = texts(p);
    const iec = t.match(/EN IEC \d+/);
    if (iec) add('Sécurité — détection d’obstacles', iec[0], p);
    for (const [label, value] of p.specs) {
      if (/degr[ée] de protection/i.test(label)) add('Indice de protection', value.replace(/^Indice de protection\s*/i, ''), p);
      if (/marque ex/i.test(label)) add('Marquage Ex', value, p);
      if (/norme de s[ée]curit/i.test(label)) add('Norme de sécurité', value, p);
      if (/isolation/i.test(label)) add('Classe d’isolation', value, p);
    }
    if (/classe d.isolation F/i.test(t)) add('Classe d’isolation', 'F', p);
    const hepa = t.match(/HEPA H\d+/) ?? (/(HEPA)/.test(t + p.specs.map((s) => s[1]).join(' ')) ? ['HEPA'] : null);
    if (hepa) add('Filtration', `Filtre ${hepa[0]}`, p);
    const li = t.match(/(\d+) ans de garantie sur la batterie Li-ion/i);
    if (li) add('Garantie batterie Li-ion (option)', `${li[1]} ans`, p);
  }
  const order = ['Sécurité — détection d’obstacles', 'Indice de protection', 'Marquage Ex', 'Filtration', 'Norme de sécurité', 'Classe d’isolation', 'Garantie batterie Li-ion (option)'];
  return rows.sort((a, b) => order.indexOf(a.title) - order.indexOf(b.title));
}

export const topProductivity = (() => {
  const p = [...products].filter((x) => x.key.productivity).sort((a, b) => (b.key.productivity ?? 0) - (a.key.productivity ?? 0))[0];
  return p;
})();
