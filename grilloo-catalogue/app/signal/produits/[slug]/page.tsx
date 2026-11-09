import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ENERGY_LABEL, featured, getFamily, getProduct, keyFigures, products, productsOf } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { Btn, Container, Pill, familyHref, nameScale, quoteHref, to } from '@/components/signal/ui';
import { Reveal } from '@/components/signal/motion';
import ProductCard from '@/components/signal/ProductCard';
import { BristleEdge } from '@/components/signal/shapes';
import { ArrowRight, Download } from '@/components/signal/icons';

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const fam = getFamily(p.family);
  return {
    title: `${p.name} — ${fam?.name ?? p.kind}`,
    description: p.lead.slice(0, 158),
    openGraph: { images: [img.product(p.img || p.slug)] },
  };
}

const STICKERS = [
  { pos: 'lg:left-[4%] lg:top-[16%] -rotate-6', tone: 'bg-si-yellow text-si-ink' },
  { pos: 'lg:right-[4%] lg:top-[10%] rotate-3', tone: 'bg-si-ink text-white' },
  { pos: 'lg:left-[9%] lg:bottom-[12%] rotate-2', tone: 'bg-si-cyan text-si-ink' },
  { pos: 'lg:right-[7%] lg:bottom-[20%] -rotate-3', tone: 'bg-white text-si-ink ring-2 ring-inset ring-si-ink' },
];

export default async function SignalProduct({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const fam = getFamily(p.family);
  const figs = keyFigures(p, 4);
  const longWord = Math.max(...p.name.split(/\s+/).map((w) => w.length));
  const giant = p.name.length <= 12 ? p.name : p.name.split(/\s/)[0];
  const siblings = productsOf(p.family).filter((x) => x.slug !== p.slug);
  const related = [...siblings, ...featured.filter((x) => x.family !== p.family)].slice(0, 4);
  const variantLabels = p.variants ? Array.from(new Set(p.variants.flatMap((v) => v.specs.map(([l]) => l)))) : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `GRILLOO ${p.name}`,
    description: p.lead,
    brand: { '@type': 'Brand', name: 'GRILLOO' },
    category: fam?.name ?? p.kind,
    image: `https://www.grilloo.net${img.product(p.img || p.slug)}`,
    additionalProperty: p.specs.slice(0, 12).map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------- En-tête : nom géant derrière le détouré ---------- */}
      <section className="relative overflow-hidden bg-si-cyan-soft">
        <Container className="relative pt-5">
          <nav aria-label="Fil d’Ariane" className="relative z-20">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold">
              <li><Link href={to('/produits')} className="hover:underline">Nos produits</Link></li>
              <li aria-hidden="true" className="text-si-ink/40">/</li>
              <li><Link href={familyHref(p.family)} className="hover:underline">{fam?.plural ?? p.kind}</Link></li>
              <li aria-hidden="true" className="text-si-ink/40">/</li>
              <li aria-current="page" className="text-si-ink/60">{p.name}</li>
            </ol>
          </nav>

          <div className="relative mt-4 h-[380px] sm:h-[480px] lg:h-[600px]">
            <p aria-hidden="true" className={`si-enter-x pointer-events-none absolute inset-x-0 top-[2%] select-none whitespace-nowrap text-center font-black uppercase leading-[.78] tracking-[-0.04em] text-si-cyan ${nameScale(giant, 'hero')}`}>
              {giant}
            </p>
            <div className="si-enter-rise group absolute inset-x-[6%] bottom-[2%] top-[12%] lg:inset-x-[22%]" style={{ '--d': '120ms' } as React.CSSProperties}>
              <Image src={img.product(p.img || p.slug)} alt={`${fam?.name ?? p.kind} GRILLOO ${p.name}`} fill priority sizes="(min-width: 1024px) 56vw, 90vw" className="si-cut object-contain drop-shadow-[0_40px_32px_rgba(10,10,10,.22)]" />
            </div>
            <ul className="absolute inset-0 hidden lg:block" aria-label="Chiffres clés">
              {figs.map((f, k) => (
                <li key={f.id} className={`si-enter-pop absolute max-w-[15rem] rounded-[28px] px-5 py-3.5 shadow-[0_6px_0_rgba(10,10,10,.9)] ${STICKERS[k].pos} ${STICKERS[k].tone}`} style={{ '--d': `${300 + k * 90}ms` } as React.CSSProperties}>
                  <p className={`si-num font-black [font-stretch:115%] ${f.value.length > 8 ? 'text-[1.2rem] leading-tight' : 'text-[clamp(1.5rem,2.4vw,2.4rem)] leading-none'}`}>{f.value}{f.unit && <span className="ml-1 text-[.5em]">{f.unit}</span>}</p>
                  <p className="si-label mt-1.5 text-[9px]">{f.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
        <BristleEdge fill="#FFFFFF" down={false} className="relative z-10 -mb-px" />
      </section>

      <Container className="relative">
        {/* Identité */}
        <div className="grid grid-cols-1 gap-8 pt-8 lg:grid-cols-12 lg:pt-12">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap gap-2">
              <Pill tone="ink">{fam?.name ?? p.kind}</Pill>
              {p.key.energy && <Pill tone="soft">{ENERGY_LABEL[p.key.energy]}</Pill>}
              <Pill>Catalogue p. {p.page}</Pill>
            </div>
            <h1 className={`mt-5 font-black uppercase leading-[.88] tracking-[-0.03em] ${longWord >= 9 ? 'text-[clamp(2rem,5.2vw,4.8rem)] [font-stretch:100%]' : 'text-[clamp(2.6rem,7vw,6.5rem)] [font-stretch:118%]'}`}>
              {p.name}
            </h1>
            <p className="mt-6 max-w-2xl text-[19px] font-medium leading-relaxed md:text-[21px]">{p.lead}</p>
          </div>
          {/* Chiffres clés (mobile + rappel) */}
          <div className="hidden flex-col items-start gap-3 self-end lg:col-span-5 lg:flex lg:items-end">
            <Btn href={quoteHref(p.slug)} tone="cyan" size="lg">Demander un devis</Btn>
            <Btn href={img.catalogue} tone="outline" download arrow={false}>Fiche au catalogue PDF · p. {p.page}</Btn>
          </div>
          <dl className="grid grid-cols-2 gap-3 self-end lg:hidden">
            {figs.map((f, k) => (
              <div key={f.id} className={`min-w-0 rounded-[24px] p-4 ${k === 0 ? 'bg-si-yellow' : k === 1 ? 'bg-si-ink text-white' : k === 2 ? 'bg-si-cyan' : 'ring-2 ring-inset ring-si-ink'}`}>
                <dt className="si-label text-[9px] opacity-80">{f.label}</dt>
                <dd className={`si-num mt-2 font-black [font-stretch:112%] ${f.value.length > 8 ? 'text-[1.05rem] leading-tight' : 'text-[clamp(1.4rem,2.4vw,2.2rem)] leading-none'}`}>{f.value}{f.unit && <span className="ml-1 text-[.5em]">{f.unit}</span>}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Contenu */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 space-y-14 lg:col-span-7">
            {p.description.length > 0 && (
              <Reveal as="section" aria-labelledby="desc">
                <h2 id="desc" className="si-display text-[clamp(2rem,4vw,3.4rem)]">Description</h2>
                <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-si-ink/85">
                  {p.description.map((t, i) => (<p key={i}>{t}</p>))}
                </div>
              </Reveal>
            )}

            {p.features.length > 0 && (
              <Reveal as="section">
                <h2 className="si-display text-[clamp(2rem,4vw,3.4rem)]">Points forts</h2>
                <ol className="mt-6 divide-y-2 divide-si-ink/10 border-y-2 border-si-ink">
                  {p.features.map((t, i) => (
                    <li key={i} className="flex gap-5 py-4">
                      <span className="si-num w-10 shrink-0 text-[28px] font-black leading-none text-si-cyan [font-stretch:62%]">{String(i + 1).padStart(2, '0')}</span>
                      <span className="pt-0.5 text-[17px] font-semibold leading-snug">{t}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            )}

            {(p.accessories.length > 0 || p.options.length > 0) && (
              <Reveal as="section" className="grid gap-8 sm:grid-cols-2">
                {p.accessories.length > 0 && (
                  <div>
                    <h2 className="text-[22px] font-black uppercase [font-stretch:118%]">Accessoires fournis</h2>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {p.accessories.map((a) => (<li key={a} className="rounded-full bg-si-cyan-soft px-4 py-2 text-[14px] font-semibold">{a}</li>))}
                    </ul>
                  </div>
                )}
                {p.options.length > 0 && (
                  <div>
                    <h2 className="text-[22px] font-black uppercase [font-stretch:118%]">Options</h2>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {p.options.map((a) => (<li key={a} className="rounded-full px-4 py-2 text-[14px] font-semibold ring-2 ring-inset ring-si-ink">{a}</li>))}
                    </ul>
                  </div>
                )}
              </Reveal>
            )}
          </div>

          {/* Caractéristiques */}
          <aside className="min-w-0 lg:col-span-5" aria-labelledby="specs">
            <div className="rounded-[32px] bg-si-ink p-6 text-white md:p-8 lg:sticky lg:top-24">
              <div className="flex items-center justify-between gap-4">
                <h2 id="specs" className="si-display-cond text-[clamp(2.4rem,4vw,3.6rem)]">Caractéristiques</h2>
              </div>
              {p.specs.length ? (
                <table className="mt-6 w-full text-[14px]">
                  <caption className="sr-only">Caractéristiques techniques de {p.name}</caption>
                  <tbody>
                    {p.specs.map(([k, v], i) => (
                      <tr key={i} className="border-b border-white/15 last:border-0">
                        <th scope="row" className="py-2.5 pr-4 text-left align-top font-medium text-white/60">{k}</th>
                        <td className="py-2.5 text-right align-top font-bold">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-6 text-white/70">Caractéristiques détaillées par version ci-dessous.</p>
              )}
              <a href={img.catalogue} download className="si-btn mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[13px] font-bold text-si-ink">
                <Download className="h-4 w-4" /> Catalogue PDF (p. {p.page})
              </a>
            </div>
          </aside>
        </div>

        {/* Variantes */}
        {p.variants && p.variants.length > 0 && (
          <Reveal as="section" className="mt-20" aria-labelledby="variants">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="variants" className="si-display text-[clamp(2rem,4.6vw,4rem)]">{p.variants.length} versions</h2>
              <p className="text-[14px] text-si-grey">Comparaison des versions telles que listées au catalogue.</p>
            </div>
            <div className="mt-6 overflow-x-auto rounded-[28px] border-2 border-si-ink">
              <table className="w-full min-w-[560px] text-[14px]">
                <thead>
                  <tr className="bg-si-cyan">
                    <th scope="col" className="si-label px-5 py-4 text-left">Caractéristique</th>
                    {p.variants.map((v) => (<th key={v.name} scope="col" className="px-5 py-4 text-left text-[16px] font-black uppercase [font-stretch:115%]">{v.name}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {variantLabels.map((l) => (
                    <tr key={l} className="border-t border-si-line odd:bg-[#FAFAFA]">
                      <th scope="row" className="px-5 py-3 text-left font-medium text-si-grey">{l}</th>
                      {p.variants!.map((v) => (<td key={v.name} className="px-5 py-3 font-bold">{v.specs.find(([k]) => k === l)?.[1] ?? '—'}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        )}

        {/* CTA collant */}
        <div className="sticky bottom-3 z-30 mt-16 md:bottom-5">
          <div className="flex items-center gap-3 rounded-full bg-si-ink p-2 pl-5 text-white shadow-[0_18px_40px_-12px_rgba(10,10,10,.5)] md:pl-7">
            <p className="min-w-0 flex-1 truncate text-[14px] font-bold md:text-[16px]">
              <span className="font-black uppercase [font-stretch:115%]">{p.name}</span>
              <span className="hidden text-white/60 sm:inline"> · {fam?.name ?? p.kind}</span>
            </p>
            <Link href={quoteHref(p.slug)} className="si-btn inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-si-cyan px-5 text-[14px] font-bold text-si-ink md:h-12 md:px-6">
              Demander un devis <ArrowRight className="si-arrow hidden h-4 w-4 sm:block" />
            </Link>
          </div>
        </div>
      </Container>

      {/* Produits associés */}
      <section className="mt-16 pb-24" aria-labelledby="related">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="related">
              <span className="si-display block text-[clamp(2.2rem,6vw,5.5rem)]">À voir</span>
              <span className="si-display-cond block text-[clamp(2.6rem,7vw,6.5rem)] text-si-cyan">aussi</span>
            </h2>
            <Btn href={familyHref(p.family)} tone="outline" arrow>Toutes les {fam?.plural.toLowerCase() ?? 'machines'}</Btn>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((r) => (<li key={r.slug}><ProductCard p={r} /></li>))}
          </ul>
        </Container>
      </section>
    </article>
  );
}
