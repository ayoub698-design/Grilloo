/** Faits agrégés depuis le catalogue (aucune valeur saisie à la main). */
import { ENERGY_LABEL, energies, fmt, fmtRange, products, range, stats } from '@/lib/catalog';

/** Normes, indices et classes cités dans les tableaux de caractéristiques des fiches. */
export function citedStandards() {
  const map = new Map<string, string[]>();
  const add = (k: string, name: string) => { const l = map.get(k) ?? []; if (!l.includes(name)) l.push(name); map.set(k, l); };
  for (const p of products) {
    for (const [label, value] of p.specs) {
      const ip = value.match(/IP\s?(\d{2})/);
      if (ip) add(`Indice de protection IP${ip[1]}`, p.name);
      else if (/isolation/i.test(label)) add(`Classe d’isolation ${value.replace(/^Classe d’isolation\s*/i, '').trim()}`, p.name);
      else if (/^norme de s[ée]curit[ée]/i.test(label)) add(`Sécurité électrique : ${value}`, p.name);
      else if (/norme europ[ée]enne/i.test(value)) add(`Prise : ${value}`, p.name);
    }
    for (const f of p.features) {
      if (/classe d.isolation/i.test(f)) add(f.replace(/^Classe d’isolation\s*/i, 'Classe d’isolation '), p.name);
    }
  }
  // Fusion « Classe d’isolation F » et « Classe d’isolation F (155 °C) »
  const out = Array.from(map.entries()).map(([k, v]) => ({ label: k, products: v }));
  const f = out.filter((x) => /^Classe d’isolation F/.test(x.label));
  if (f.length > 1) {
    const merged = { label: f.find((x) => /155/.test(x.label))?.label ?? f[0].label, products: Array.from(new Set(f.flatMap((x) => x.products))) };
    return [...out.filter((x) => !f.includes(x)), merged];
  }
  return out;
}

export function catalogueFacts() {
  const maxP = products.reduce((a, b) => ((b.key.productivity ?? 0) > (a.key.productivity ?? 0) ? b : a));
  const width = range(products, 'width');
  const tank = range(products, 'tank');
  return {
    machines: stats.products,
    families: stats.families,
    maxProd: { value: `${fmt(stats.maxProd, 0)} m²/h`, product: maxP },
    width: width ? `${fmtRange(width)} mm` : '—',
    tank: tank ? `${fmtRange(tank)} L` : '—',
    energies: energies(products).map((e) => ENERGY_LABEL[e]),
    withSheet: products.filter((p) => p.specs.length > 0).length,
  };
}
