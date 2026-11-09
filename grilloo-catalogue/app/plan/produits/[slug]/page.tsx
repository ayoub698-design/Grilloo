import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ENERGY_LABEL, featured, getFamily, getProduct, keyFigures, products, productsOf } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { site } from '@/lib/site';
import { ProductPlate } from '@/components/plan/ProductPlate';
import { Reveal } from '@/components/plan/Reveal';
import { IDownload } from '@/components/plan/icons';
import { Btn, Cartouche, Container, Crops, DimH, DimV, Figure, Mono, SheetHead, Steps, href, pad, productDims, productHref, quoteHref } from '@/components/plan/ui';

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
  const desc = p.lead || p.description[0] || `${p.name} — ${fam?.name ?? p.kind} GRILLOO : fiche technique complète, caractéristiques et accessoires.`;
  return {
    title: `${p.name} — ${fam?.name ?? p.kind}`,
    description: desc.length > 158 ? `${desc.slice(0, 155).replace(/\s+\S*$/, '')}…` : desc,
    openGraph: { images: [img.product(p.img)] },
  };
}

/** Paragraphe court sans point final = intertitre de la fiche. */
const isSubhead = (s: string) => s.length < 70 && !/[.:;]$/.test(s.trim());

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const fam = getFamily(p.family);
  const famIndex = fam ? productsOf(fam.slug).findIndex((x) => x.slug === p.slug) + 1 : 1;
  const figs = keyFigures(p, 4);
  const dims = productDims(p);
  const related = (productsOf(p.family).filter((x) => x.slug !== p.slug).length
    ? productsOf(p.family).filter((x) => x.slug !== p.slug)
    : featured.filter((x) => x.slug !== p.slug)).slice(0, 4);
  const variants = p.variants && p.variants.length > 1 ? p.variants : null;
  const variantLabels = variants ? Array.from(new Set(variants.flatMap((v) => v.specs.map(([k]) => k)))) : [];
  const extraImgs = p.imgAlt.filter((s) => s !== p.img);

  let sec = 0;
  const next = () => pad(++sec);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `GRILLOO ${p.name}`,
    sku: p.slug,
    category: fam?.name ?? p.kind,
    brand: { '@type': 'Brand', name: 'GRILLOO' },
    image: `${site.url}${img.product(p.img)}`,
    description: p.lead || p.description[0] || `${p.name}, ${p.kind.toLowerCase()} GRILLOO.`,
    url: `${site.url}${productHref(p.slug)}`,
    additionalProperty: p.specs.map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* En-tête de fiche */}
      <section className="relative border-b border-pl-line bg-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Container className="h-full"><div className="pl-grid8 h-full border-r border-pl-line opacity-60" /></Container>
        </div>
        <Container className="relative pb-12 pt-8 lg:pb-16 lg:pt-10">
          <nav aria-label="Fil d’Ariane" className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Mono className="mr-2 bg-pl-teal px-1.5 py-0.5 text-white">F-{pad(p.page, 3)}</Mono>
            <Link href={href('')} className="font-pl-mono text-[11px] uppercase tracking-[0.08em] text-pl-ink/60 hover:text-pl-teal">Accueil</Link>
            <span className="text-pl-ink/30" aria-hidden="true">/</span>
            <Link href={href('/produits')} className="font-pl-mono text-[11px] uppercase tracking-[0.08em] text-pl-ink/60 hover:text-pl-teal">Nos produits</Link>
            {fam && (<>
              <span className="text-pl-ink/30" aria-hidden="true">/</span>
              <Link href={`${href('/produits')}?famille=${fam.slug}`} className="font-pl-mono text-[11px] uppercase tracking-[0.08em] text-pl-ink/60 hover:text-pl-teal">{fam.plural}</Link>
            </>)}
            <span className="text-pl-ink/30" aria-hidden="true">/</span>
            <Mono className="text-pl-ink" >{p.name}</Mono>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-8 lg:gap-0">
            {/* Planche cotée */}
            <Reveal as="figure" className="lg:col-span-5 lg:pr-10" aria-label={`${p.name} — planche cotée`}>
              <div className="border border-pl-teal bg-white">
                <div className="flex items-center justify-between border-b border-pl-teal px-3 py-2">
                  <Mono className="text-pl-teal">Fig. {pad(famIndex)} — {p.name}</Mono>
                  <Mono className="text-pl-ink/55">Vue produit</Mono>
                </div>
                <div className="pl-graph relative px-10 pb-14 pt-10 sm:px-20 sm:pb-16">
                  <Crops />
                  <div className="relative mx-auto aspect-square w-full max-w-[440px]">
                    <Image src={img.product(p.img)} alt={`${p.name} — ${p.kind} GRILLOO`} fill priority sizes="(min-width: 1024px) 440px, 80vw" className="object-contain" />
                    {dims.h && <DimV label={dims.h} className="-left-8 top-0 bottom-0 sm:-left-12" labelBg="#F6F8F8" />}
                    {dims.w && <DimH label={dims.w} className="-bottom-9 left-0 right-0" labelBg="#F6F8F8" />}
                  </div>
                </div>
                {dims.full && (
                  <p className="border-t border-pl-line px-3 py-2 font-pl-mono text-[10.5px] text-pl-ink/60">
                    Cotes de la fiche — {dims.full[0]} : {dims.full[1]}. Photographie non à l’échelle.
                  </p>
                )}
              </div>
              <figcaption>
                <Cartouche className="border-t-0" cells={[
                  { k: 'Désignation', v: p.name },
                  { k: 'Famille', v: fam?.name ?? p.kind },
                  { k: 'Réf. catalogue', v: `p. ${p.page}` },
                  { k: 'Énergie', v: p.key.energy ? ENERGY_LABEL[p.key.energy] : '—' },
                ]} />
              </figcaption>
              {extraImgs.length > 0 && (
                <ul className="mt-4 grid grid-cols-3 gap-px bg-pl-line sm:grid-cols-4">
                  {extraImgs.map((s, i) => (
                    <li key={s} className="pl-graph relative aspect-square bg-white">
                      <Image src={img.product(s)} alt={`${p.name} — vue complémentaire ${i + 1}`} fill sizes="160px" className="object-contain p-3" />
                      <Mono className="absolute left-2 top-1.5 text-pl-ink/55">Vue {String.fromCharCode(66 + i)}</Mono>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>

            {/* Désignation */}
            <Reveal className="lg:col-span-3">
              <Mono className="pl-rise block text-pl-teal">{p.kind}</Mono>
              <h1 className="pl-wipe mt-4 text-[clamp(3rem,6vw,5.4rem)] font-light leading-[0.92] tracking-[-0.055em] text-pl-ink">{p.name}</h1>
              {p.lead && <p className="pl-rise mt-6 text-[16px] leading-[1.65] text-pl-ink/80" style={{ ['--d' as string]: '150ms' }}>{p.lead}</p>}
              {figs.length > 0 && (
                <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-pl-teal pt-5">
                  {figs.map((f) => (
                    <div key={f.id} className="min-w-0">
                      <dt className="sr-only">{f.label}</dt>
                      <dd><Figure value={f.value} unit={f.unit} label={f.label} big /></dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="mt-9 flex flex-col gap-3">
                <Btn href={quoteHref(p.slug)}>Demander un devis</Btn>
                <Btn href={img.catalogue} download variant="line" icon={<IDownload />}>Catalogue PDF · page {p.page}</Btn>
              </div>
              {p.sectors.length > 0 && (
                <div className="mt-8 border-t border-pl-line pt-4">
                  <Mono className="text-pl-ink/55">Lieux d’utilisation cités par la fiche</Mono>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {p.sectors.map((s) => <li key={s} className="border border-pl-line px-2 py-0.5 font-pl-mono text-[10.5px] text-pl-ink/75">{s}</li>)}
                  </ul>
                </div>
              )}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Présentation + points forts */}
      {(p.description.length > 0 || p.features.length > 0) && (
        <section aria-labelledby="pl-desc" className="bg-white py-16 lg:py-20">
          <Container>
            <SheetHead no={next()} kicker="Présentation" sheet={`${p.name} · p. ${p.page}`} />
            <div className="mt-10 grid gap-12 lg:grid-cols-8 lg:gap-0">
              <div className="lg:col-span-5 lg:pr-12">
                <h2 id="pl-desc" className="text-[clamp(1.8rem,3.2vw,2.6rem)] font-light leading-[1.05] tracking-[-0.04em]">
                  {p.description.length ? 'Description' : 'Points forts'}
                </h2>
                {p.description.length > 0 && (
                  <div className="mt-6 max-w-[42rem] space-y-4 text-[15.5px] leading-[1.7] text-pl-ink/80">
                    {p.description.map((d, i) => isSubhead(d)
                      ? <p key={i} className="pt-3 text-[17px] font-medium tracking-[-0.01em] text-pl-ink">{d}</p>
                      : <p key={i}>{d}</p>)}
                  </div>
                )}
              </div>
              {p.features.length > 0 && (
                <div className="lg:col-span-3">
                  {p.description.length > 0 && <h3 className="text-[19px] font-normal tracking-[-0.02em]">Points forts</h3>}
                  <ol className="mt-4 border-t border-pl-teal">
                    {p.features.map((f, i) => (
                      <li key={i} className="grid grid-cols-[3rem_1fr] gap-2 border-b border-pl-line py-3 text-[14.5px] leading-snug text-pl-ink/85">
                        <span className="font-pl-mono text-[11px] text-pl-teal">PF-{pad(i + 1)}</span>{f}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      <Steps from="#FFFFFF" to="#F6F8F8" />

      {/* Fiche technique */}
      <section aria-labelledby="pl-specs" className="bg-pl-paper py-16 lg:py-20">
        <Container>
          <SheetHead no={next()} kicker="Fiche technique" sheet={`${p.specs.length} caractéristiques`} />
          <div className="mt-10 grid gap-8 lg:grid-cols-8 lg:gap-0">
            <div className="lg:col-span-2 lg:pr-10">
              <h2 id="pl-specs" className="text-[clamp(1.8rem,3.2vw,2.6rem)] font-light leading-[1.05] tracking-[-0.04em]">Caractéristiques</h2>
              <p className="mt-4 text-[14px] leading-relaxed text-pl-ink/70">Valeurs reprises à l’identique du catalogue 2024, page {p.page}.</p>
            </div>
            <dl className="border-t border-pl-teal bg-white px-4 sm:px-6 lg:col-span-6 lg:columns-2 lg:gap-x-10">
              {p.specs.map(([k, v], i) => (
                <div key={i} className="grid break-inside-avoid grid-cols-[2.25rem_1fr] gap-x-2 border-b border-pl-line py-3 sm:grid-cols-[2.25rem_1fr_auto] sm:gap-x-4">
                  <span className="font-pl-mono text-[10.5px] text-pl-teal" aria-hidden="true">{pad(i + 1)}</span>
                  <dt className="text-[14px] text-pl-ink/75">{k}</dt>
                  <dd className="col-start-2 font-pl-mono text-[13px] text-pl-ink sm:col-start-3 sm:text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {variants && (
            <div className="mt-16 grid gap-8 lg:grid-cols-8 lg:gap-0">
              <div className="lg:col-span-2 lg:pr-10">
                <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-light leading-[1.05] tracking-[-0.04em]">Variantes</h2>
                <p className="mt-4 text-[14px] leading-relaxed text-pl-ink/70">« — » : valeur non précisée par le catalogue pour cette variante.</p>
              </div>
              <div className="overflow-x-auto border border-pl-line bg-white lg:col-span-6">
                <table className="w-full min-w-[560px] border-collapse text-left text-[13.5px]">
                  <caption className="sr-only">Comparatif des variantes de {p.name}</caption>
                  <thead>
                    <tr className="border-b border-pl-teal bg-pl-paper">
                      <th scope="col" className="px-4 py-2.5 font-pl-mono text-[10px] font-normal uppercase tracking-[0.1em] text-pl-ink/55">Caractéristique</th>
                      {variants.map((v) => <th key={v.name} scope="col" className="px-4 py-2.5 text-right text-[14px] font-medium text-pl-ink">{v.name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {variantLabels.map((label) => (
                      <tr key={label} className="border-b border-pl-line">
                        <th scope="row" className="px-4 py-2.5 font-normal text-pl-ink/75">{label}</th>
                        {variants.map((v) => {
                          const val = v.specs.find(([k]) => k === label)?.[1];
                          return <td key={v.name} className={`px-4 py-2.5 text-right font-pl-mono text-[12.5px] ${val ? 'text-pl-ink' : 'text-pl-ink/35'}`}>{val ?? '—'}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(p.accessories.length > 0 || p.options.length > 0) && (
            <div className="mt-16 grid gap-8 lg:grid-cols-8 lg:gap-0">
              <div className="lg:col-span-2 lg:pr-10">
                <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-light leading-[1.05] tracking-[-0.04em]">Équipement</h2>
                <p className="mt-4 text-[14px] leading-relaxed text-pl-ink/70">Accessoires et options listés par la fiche.</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:col-span-6">
                {[['Accessoires', 'A', p.accessories], ['Options', 'O', p.options]].filter(([, , l]) => (l as string[]).length > 0).map(([title, code, list]) => (
                  <div key={title as string}>
                    <h3 className="text-[17px] font-normal tracking-[-0.01em]">{title as string}</h3>
                    <ul className="mt-3 border-t border-pl-teal bg-white">
                      {(list as string[]).map((a, i) => (
                        <li key={i} className="grid grid-cols-[3rem_1fr] gap-2 border-b border-pl-line px-3 py-2.5 text-[14px] text-pl-ink/85">
                          <span className="font-pl-mono text-[11px] text-pl-teal">{code as string}-{pad(i + 1)}</span>{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Machines associées */}
      <section aria-labelledby="pl-related" className="bg-white py-16 lg:py-20">
        <Container>
          <SheetHead no={next()} kicker="Machines associées" sheet={fam ? fam.plural : undefined} />
          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <h2 id="pl-related" className="text-[clamp(1.8rem,3.2vw,2.6rem)] font-light leading-[1.05] tracking-[-0.04em]">
              {productsOf(p.family).length > 1 ? `Dans la même famille` : 'Autres machines de référence'}
            </h2>
            {fam && <Link href={`${href('/produits')}?famille=${fam.slug}`} className="pl-navlink text-[14px] text-pl-teal">Toute la famille ({fam.count}) →</Link>}
          </div>
          <ul className="mt-8 grid grid-cols-2 lg:grid-cols-4">
            {related.map((r, i) => <li key={r.slug}><ProductPlate p={r} n={i + 1} /></li>)}
          </ul>

          <div className="pl-graph mt-16 grid border border-pl-teal lg:grid-cols-8">
            <div className="bg-white p-6 sm:p-8 lg:col-span-5 lg:border-r lg:border-pl-teal">
              <Mono className="text-pl-teal">Demande de prix · {p.name}</Mono>
              <p className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-[1.05] tracking-[-0.04em]">Un devis pour ce modèle ?</p>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-pl-ink/75">La machine est déjà renseignée dans le formulaire : précisez la surface, le type de sol et vos coordonnées.</p>
            </div>
            <div className="flex flex-col justify-center gap-3 p-6 sm:p-8 lg:col-span-3">
              <Btn href={quoteHref(p.slug)}>Demander un devis</Btn>
              <Btn href={href('/produits')} variant="line">Retour au catalogue</Btn>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
