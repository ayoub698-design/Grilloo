import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getFamily } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { isCited, sectorProducts, sectors } from '@/lib/sectors';
import { AxoDrawing, axoCaption } from '@/components/plan/Axo';
import { Reveal } from '@/components/plan/Reveal';
import { IArrow } from '@/components/plan/icons';
import { Btn, Container, Crops, Mono, PageHead, SheetHead, href, pad, productHref, quoteHref } from '@/components/plan/ui';

export const metadata: Metadata = {
  title: 'Nos secteurs — Domaines d’application',
  description: 'Santé, logistique, industrie, commerce, hôtellerie, bureaux, collectivités, sociétés de propreté, prescripteurs : les machines GRILLOO par domaine d’application.',
};

const MAX = 6;

export default function SecteursPage() {
  return (
    <>
      <PageHead
        code="S-00"
        crumbs={[{ label: 'Accueil', href: href('') }, { label: 'Nos secteurs' }]}
        title={<>Nos secteurs<br /><span className="text-pl-ink/45">{sectors.length} domaines d’application</span></>}
        lead="Pour chaque domaine : le besoin, les surfaces rencontrées et les machines associées. Les machines listées sont celles dont la fiche cite ce type de lieu ; à défaut, celles des familles adaptées."
      >
        <nav aria-label="Index des secteurs">
          <Mono className="text-pl-ink/55">Index des planches</Mono>
          <ol className="mt-3 grid grid-cols-1 border-t border-pl-teal sm:grid-cols-2 lg:grid-cols-1">
            {sectors.map((s, i) => (
              <li key={s.slug} className="border-b border-pl-line">
                <a href={`#${s.slug}`} className="group flex items-baseline gap-3 py-2 text-[14px] text-pl-ink/80 hover:text-pl-teal">
                  <span className="font-pl-mono text-[10.5px] text-pl-teal">S-{pad(i + 1)}</span>
                  <span className="flex-1">{s.short}</span>
                  <IArrow size={12} className="rotate-90 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHead>

      <div className="bg-white pb-12">
        {sectors.map((s, i) => {
          const list = sectorProducts(s);
          const cited = isCited(s);
          const flip = i % 2 === 1;
          return (
            <section key={s.slug} id={s.slug} aria-labelledby={`pl-sec-${s.slug}`} className={`scroll-mt-20 pb-16 pt-14 lg:pb-20 ${flip ? 'bg-pl-paper' : 'bg-white'}`}>
              <Container>
                <SheetHead no={pad(i + 1)} kicker={s.short} sheet={`Planche S-${pad(i + 1)} / ${pad(sectors.length)}`} />
                <div className="mt-10 grid gap-10 lg:grid-cols-8 lg:gap-0">
                  <Reveal as="figure" className={`lg:col-span-4 ${flip ? 'lg:order-2 lg:pl-10' : 'lg:pr-10'}`}>
                    <div className="border border-pl-teal bg-white">
                      <div className="flex items-center justify-between border-b border-pl-teal px-3 py-2">
                        <Mono className="text-pl-teal">S-{pad(i + 1)} — Axonométrie</Mono>
                        <Mono className="text-pl-ink/55">Sans échelle</Mono>
                      </div>
                      <div className="pl-graph pl-graph-white relative px-3 py-4 sm:px-6">
                        <Crops />
                        <AxoDrawing slug={s.slug} />
                      </div>
                      <figcaption className="grid grid-cols-[1fr_auto] items-center border-t border-pl-line px-3 py-2">
                        <span className="font-pl-mono text-[11px] text-pl-ink/75">{axoCaption(s.slug)}</span>
                        <span className="flex items-center gap-2 font-pl-mono text-[10px] uppercase tracking-[0.08em] text-pl-ink/55">
                          <span className="inline-block h-px w-5 border-t border-dashed border-pl-cyan" aria-hidden="true" /> Passage machine
                        </span>
                      </figcaption>
                    </div>
                  </Reveal>

                  <div className={`lg:col-span-4 ${flip ? 'lg:order-1 lg:pr-10' : 'lg:pl-10'}`}>
                    <h2 id={`pl-sec-${s.slug}`} className="text-[clamp(1.9rem,3.4vw,2.9rem)] font-light leading-[1.02] tracking-[-0.04em]">{s.name}</h2>
                    <p className="mt-5 max-w-xl text-[16px] leading-[1.65] text-pl-ink/80">{s.need}</p>

                    <dl className="mt-8 grid gap-0 border-t border-pl-teal sm:grid-cols-2">
                      <div className="border-b border-pl-line py-3 sm:pr-4">
                        <dt className="font-pl-mono text-[10px] uppercase tracking-[0.1em] text-pl-ink/55">Surfaces</dt>
                        <dd className="mt-2 flex flex-wrap gap-1.5">
                          {s.surfaces.map((x) => <span key={x} className="border border-pl-line bg-white px-2 py-0.5 font-pl-mono text-[11px] text-pl-ink/80">{x}</span>)}
                        </dd>
                      </div>
                      <div className="border-b border-pl-line py-3 sm:border-l sm:pl-4">
                        <dt className="font-pl-mono text-[10px] uppercase tracking-[0.1em] text-pl-ink/55">Familles adaptées</dt>
                        <dd className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                          {s.families.map((f) => (
                            <Link key={f} href={`${href('/produits')}?famille=${f}`} className="text-[13.5px] text-pl-teal underline decoration-pl-line underline-offset-4 hover:decoration-pl-cyan">{getFamily(f)?.plural}</Link>
                          ))}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-8">
                      <div className="flex items-baseline justify-between gap-4">
                        <Mono className="text-pl-ink/55">{cited ? 'Machines dont la fiche cite ce type de lieu' : 'Machines des familles adaptées'}</Mono>
                        <Mono className="text-pl-teal">{pad(list.length)}</Mono>
                      </div>
                      <ul className="mt-3 grid grid-cols-2 border-l border-t border-pl-line bg-white sm:grid-cols-3">
                        {list.slice(0, MAX).map((p) => (
                          <li key={p.slug} className="border-b border-r border-pl-line">
                            <Link href={productHref(p.slug)} className="group flex h-full flex-col p-2 hover:bg-pl-paper">
                              <span className="pl-graph relative block aspect-[4/3]">
                                <Image src={img.product(p.img)} alt="" fill sizes="160px" className="object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
                              </span>
                              <span className="mt-2 truncate text-[14px] text-pl-ink group-hover:text-pl-teal">{p.name}</span>
                              <span className="truncate font-pl-mono text-[10px] text-pl-ink/55">{p.kind}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                        {list.length > MAX && (
                          <span className="text-[14px] text-pl-ink/70">
                            + {list.length - MAX} autres : {list.slice(MAX, MAX + 4).map((p, k) => (
                              <span key={p.slug}>{k > 0 && ', '}<Link href={productHref(p.slug)} className="text-pl-teal hover:underline">{p.name}</Link></span>
                            ))}{list.length > MAX + 4 && '…'}
                          </span>
                        )}
                        <Btn href={quoteHref()} variant="ghost" className="min-h-0">Conseil pour ce secteur</Btn>
                      </div>
                    </div>
                  </div>
                </div>
              </Container>
            </section>
          );
        })}
      </div>
    </>
  );
}
