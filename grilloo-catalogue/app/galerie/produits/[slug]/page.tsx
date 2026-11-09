import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products, getProduct, getFamily, keyFigures, productsOf, ENERGY_LABEL, brand, type Product } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { site } from '@/lib/site';
import { ProductViewer } from '@/components/galerie/ProductViewer';
import { ProductCard } from '@/components/galerie/ProductCard';
import { Reveal, Lines, Curve } from '@/components/galerie/motion';
import { Caption, Container, Button, TextLink } from '@/components/galerie/ui';
import { Download } from '@/components/galerie/icons';
import { to, quoteHref, familyHref, pad } from '@/components/galerie/links';

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const fam = getFamily(p.family);
  return {
    title: `${p.name} — ${p.kind}`,
    description: p.lead.length > 158 ? `${p.lead.slice(0, 155).trimEnd()}…` : p.lead || `${p.name}, ${fam?.name ?? p.kind} GRILLOO.`,
    openGraph: { images: [img.product(p.img)] },
  };
}

function related(p: Product) {
  const same = productsOf(p.family).filter((x) => x.slug !== p.slug);
  const i = productsOf(p.family).findIndex((x) => x.slug === p.slug);
  // voisins dans l'ordre du catalogue d'abord
  return [...same.slice(Math.max(0, i - 1)), ...same.slice(0, Math.max(0, i - 1))].slice(0, 3);
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const fam = getFamily(p.family);
  const figs = keyFigures(p, 4);
  const images = [p.img, ...p.imgAlt];
  const rel = related(p);
  const index = products.findIndex((x) => x.slug === p.slug) + 1;
  const variantLabels = p.variants ? Array.from(new Set(p.variants.flatMap((v) => v.specs.map((s) => s[0])))) : [];
  const partialVariants = !!p.variants?.some((v) => v.specs.length < variantLabels.length);
  const [first, ...rest] = p.description;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `GRILLOO ${p.name}`,
    description: p.lead,
    image: `${site.url}${img.product(p.img)}`,
    brand: { '@type': 'Brand', name: brand.name },
    category: fam?.name ?? p.kind,
    sku: p.slug,
    additionalProperty: p.specs.map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Container className="pt-8 lg:pt-12">
        <nav aria-label="Fil d’Ariane" className="ga-caps ga-text-stone">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <li><Link href={to('/produits')} className="ga-link">Collection</Link></li>
            <li aria-hidden>/</li>
            <li><Link href={familyHref(p.family)} className="ga-link">{fam?.plural ?? p.kind}</Link></li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ga-ink">{p.name}</li>
          </ol>
        </nav>
      </Container>

      <Container className="grid gap-12 pb-20 pt-10 lg:grid-cols-12 lg:gap-8 lg:pb-28 lg:pt-14">
        <div className="lg:col-span-7">
          <Reveal variant="img"><ProductViewer name={p.name} images={images} /></Reveal>
        </div>

        <div className="lg:col-span-5 lg:pl-8">
          <div className="lg:sticky lg:top-28">
            <Reveal variant="fade" className="flex items-center justify-between gap-4">
              <Caption rule>{fam?.name ?? p.kind}</Caption>
              <span className="ga-caps ga-text-stone">N°{pad(index)} / {products.length}</span>
            </Reveal>
            <Lines as="h1" className="ga-display mt-6 break-words text-[clamp(48px,6vw,96px)] leading-[.92] tracking-[-0.03em]" lines={[p.name]} />
            <Reveal delay={200}>
              <p className="ga-display mt-4 text-[22px] italic ga-text-stone">{p.kind}{p.key.energy ? ` · ${ENERGY_LABEL[p.key.energy].toLowerCase()}` : ''}</p>
              {p.lead && <p className="mt-6 text-[15.5px] leading-[1.75]">{p.lead}</p>}
            </Reveal>

            {figs.length > 0 && (
              <Reveal delay={300} as="dl" className="mt-10 grid grid-cols-2 border-t border-ga-ink/80">
                {figs.map((f, i) => (
                  <div key={f.id} className={`min-w-0 border-b border-ga-line py-5 ${i % 2 ? 'pl-5' : 'border-r pr-5'}`}>
                    <dt className="ga-caps ga-text-stone">{f.label}</dt>
                    <dd className={`ga-num mt-2 break-words ${f.value.length > 9 ? 'text-[20px] leading-[1.15] md:text-[24px]' : 'text-[clamp(28px,3vw,40px)] leading-none'}`}>
                      {f.value}{f.unit && <span className="ml-1.5 font-sans text-[12px] tracking-wide ga-text-stone">{f.unit}</span>}
                    </dd>
                  </div>
                ))}
              </Reveal>
            )}

            <Reveal delay={400} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Button href={quoteHref(p.slug)}>Demander un devis</Button>
              <a href={`${img.catalogue}#page=${p.page}`} target="_blank" rel="noopener" className="group inline-flex items-center gap-3 text-[13.5px]">
                <Download className="h-4 w-4" />
                <span className="ga-link">Catalogue 2024, p. {p.page}</span>
              </a>
            </Reveal>
          </div>
        </div>
      </Container>

      <Curve shape="descend" tone="line" />

      {/* Description + points forts */}
      {(p.description.length > 0 || p.features.length > 0) && (
        <Container className="grid gap-14 py-16 lg:grid-cols-12 lg:gap-8 lg:py-24">
          {p.description.length > 0 && (
            <div className="lg:col-span-6">
              <Caption>Description</Caption>
              {first && <Reveal as="p" className="ga-display mt-6 text-[clamp(22px,2.2vw,30px)] leading-[1.35]">{first}</Reveal>}
              {rest.map((t, i) => (
                <Reveal as="p" key={i} delay={i * 80} className="mt-5 max-w-2xl text-[15px] leading-[1.8] ga-text-stone">{t}</Reveal>
              ))}
            </div>
          )}
          {p.features.length > 0 && (
            <div className={p.description.length ? 'lg:col-span-5 lg:col-start-8' : 'lg:col-span-8'}>
              <Caption>Points forts</Caption>
              <ol className="mt-6 border-t border-ga-line">
                {p.features.map((t, i) => (
                  <Reveal as="li" key={i} variant="fade" delay={i * 60} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-ga-line py-4 text-[14.5px] leading-[1.65]">
                    <span className="ga-num pt-px italic ga-text-stone">{pad(i + 1)}</span>
                    <span>{t}</span>
                  </Reveal>
                ))}
              </ol>
            </div>
          )}
        </Container>
      )}

      {/* Cartel technique */}
      <section aria-labelledby="ga-specs" className="bg-ga-ivory py-20 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Caption rule>Cartel technique</Caption>
            <h2 id="ga-specs" className="ga-display mt-6 text-[clamp(36px,4vw,56px)] leading-[1]">Caractéristiques <em>{p.name}</em></h2>
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed ga-text-stone">Valeurs reprises du tableau de la fiche, catalogue 2024 page {p.page}.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            {p.specs.length > 0 ? (
              <Reveal className="border border-ga-line bg-ga-paper px-6 py-7 shadow-[0_30px_60px_-40px_rgba(40,34,26,.25)] sm:px-10 sm:py-10">
                <div className="flex items-baseline justify-between gap-4 border-b border-ga-ink/80 pb-4">
                  <p className="ga-display text-[22px] italic">GRILLOO {p.name}</p>
                  <p className="ga-caps ga-text-stone shrink-0">{p.kind}</p>
                </div>
                <dl className="text-[14px]">
                  {p.specs.map(([k, v], i) => (
                    <div key={`${k}-${i}`} className="grid grid-cols-1 gap-1 border-b border-ga-line py-3 last:border-b-0 sm:grid-cols-[1fr_1fr] sm:gap-6">
                      <dt className="ga-text-stone">{k}</dt>
                      <dd className="ga-num break-words text-[16px] sm:text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : (
              <p className="text-[15px] ga-text-stone">Le catalogue ne publie pas de tableau de caractéristiques pour ce modèle.</p>
            )}
          </div>
        </Container>
      </section>

      {/* Variantes */}
      {p.variants && p.variants.length > 0 && (
        <Container className="py-20 lg:py-28">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Caption>Variantes</Caption>
              <h2 className="ga-display mt-5 text-[clamp(32px,3.4vw,48px)] leading-[1.05]">{p.variants.length} versions</h2>
            </div>
            {partialVariants && <p className="self-end text-[13.5px] leading-relaxed ga-text-stone lg:col-span-6 lg:col-start-7">— : valeur non précisée au catalogue pour cette version (seules les différences y sont indiquées).</p>}
          </div>
          <div className="ga-scroll-x mt-10 border-t border-ga-ink/80" tabIndex={0} role="region" aria-label="Tableau comparatif des variantes">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-ga-line">
                  <th scope="col" className="ga-caps ga-text-stone sticky left-0 bg-ga-paper py-4 pr-6 font-medium">Caractéristique</th>
                  {p.variants.map((v) => <th key={v.name} scope="col" className="ga-display whitespace-nowrap py-4 pr-6 text-[19px] font-normal">{v.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {variantLabels.map((l) => (
                  <tr key={l} className="border-b border-ga-line">
                    <th scope="row" className="sticky left-0 bg-ga-paper py-3 pr-6 font-normal ga-text-stone">{l}</th>
                    {p.variants!.map((v) => <td key={v.name} className="ga-num whitespace-nowrap py-3 pr-6 text-[15px]">{v.specs.find((s) => s[0] === l)?.[1] ?? '—'}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {p.variants.length > 4 && <p className="ga-caps ga-text-stone mt-4 text-right">Faire défiler le tableau →</p>}
        </Container>
      )}

      {/* Accessoires, options, lieux */}
      {(p.accessories.length > 0 || p.options.length > 0 || p.sectors.length > 0) && (
        <Container className={`grid gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 ${p.variants ? 'pb-20 lg:pb-28' : 'py-20 lg:py-28'}`}>
          {p.accessories.length > 0 && (
            <div>
              <Caption>Accessoires fournis</Caption>
              <ul className="mt-5 border-t border-ga-line text-[14.5px]">
                {p.accessories.map((a, i) => <li key={i} className="border-b border-ga-line py-3">{a}</li>)}
              </ul>
            </div>
          )}
          {p.options.length > 0 && (
            <div>
              <Caption>Options</Caption>
              <ul className="mt-5 border-t border-ga-line text-[14.5px]">
                {p.options.map((a, i) => <li key={i} className="border-b border-ga-line py-3">{a}</li>)}
              </ul>
            </div>
          )}
          {p.sectors.length > 0 && (
            <div>
              <Caption>Lieux d’utilisation cités</Caption>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-ga-line pt-4 text-[14.5px]">
                {p.sectors.map((s, i) => <li key={i} className="ga-display italic">{s}{i < p.sectors.length - 1 ? ' ·' : ''}</li>)}
              </ul>
              <TextLink href={to('/secteurs')} className="mt-6">Voir les secteurs</TextLink>
            </div>
          )}
        </Container>
      )}

      {/* Associés */}
      {rel.length > 0 && (
        <section aria-labelledby="ga-rel" className="border-t border-ga-line py-20 lg:py-28">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Caption>Dans la même famille</Caption>
                <h2 id="ga-rel" className="ga-display mt-5 text-[clamp(32px,3.4vw,48px)] leading-[1.05]">{fam?.plural}</h2>
              </div>
              <TextLink href={familyHref(p.family)}>Toute la famille</TextLink>
            </div>
            <ul className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14">
              {rel.map((r, i) => (
                <Reveal as="li" key={r.slug} delay={i * 120}><ProductCard p={r} index={products.findIndex((x) => x.slug === r.slug) + 1} /></Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section aria-label="Demande de devis" className="bg-ga-ivory">
        <Container className="flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center lg:py-20">
          <p className="ga-display max-w-2xl text-[clamp(30px,3.6vw,52px)] leading-[1.05]">
            Intéressé par la <em>{p.name}</em> ?
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <Button href={quoteHref(p.slug)}>Demander un devis</Button>
            <TextLink href={to('/produits')}>Retour à la collection</TextLink>
          </div>
        </Container>
      </section>
    </>
  );
}
