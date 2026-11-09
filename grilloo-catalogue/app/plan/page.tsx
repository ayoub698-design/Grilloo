import type { Metadata } from 'next';
import Link from 'next/link';
import { featured, warranty } from '@/lib/catalog';
import { img } from '@/lib/assets';
import { floorTypes, requestTypes, site } from '@/lib/site';
import { FamilyIndex } from '@/components/plan/FamilyIndex';
import { HomeHero } from '@/components/plan/HomeHero';
import { ProcessCut } from '@/components/plan/ProcessCut';
import { ProductPlate } from '@/components/plan/ProductPlate';
import { Reveal } from '@/components/plan/Reveal';
import { catalogueFacts, citedStandards } from '@/components/plan/facts';
import { IDownload } from '@/components/plan/icons';
import { Angle15, Btn, Container, CutLine, Mono, SheetHead, Steps, href, pad, productHref, quoteHref } from '@/components/plan/ui';

export const metadata: Metadata = {
  title: 'Nettoyez avec excellence — Catalogue technique',
  description: 'GRILLOO, leader des solutions de nettoyage : 75 machines professionnelles en 10 familles, présentées comme un dossier technique — autolaveuses, autoportées, balayeuses, aspirateurs, monobrosses.',
};

export default function PlanHome() {
  const facts = catalogueFacts();
  const standards = citedStandards();

  return (
    <>
      {/* 1 — Hero */}
      <HomeHero />

      <CutLine letter="A" />

      {/* 2 — Aperçu du catalogue */}
      <section aria-labelledby="pl-s2" className="bg-white pb-20 pt-4 lg:pb-28">
        <Container>
          <SheetHead no="02" kicker="Index des planches" sheet="Feuille 02 / 05" />
          <Reveal className="mt-10 grid gap-6 lg:grid-cols-8">
            <h2 id="pl-s2" className="pl-wipe text-[clamp(2.1rem,4.4vw,3.9rem)] font-light leading-[1] tracking-[-0.045em] lg:col-span-5">
              {facts.families} familles, {facts.machines} fiches.<br /><span className="text-pl-ink/45">Un jeu de plans complet.</span>
            </h2>
            <p className="pl-rise max-w-md self-end text-[15.5px] leading-relaxed text-pl-ink/75 lg:col-span-3" style={{ ['--d' as string]: '200ms' }}>
              De l’autolaveuse accompagnée à l’équipement haute pression, chaque machine du catalogue 2024 a sa fiche : rendement, largeur de travail, réservoirs, énergie, accessoires.
            </p>
          </Reveal>
          <div className="mt-14">
            <FamilyIndex />
          </div>

          <div className="mt-20 flex flex-wrap items-end justify-between gap-4 border-b border-pl-line pb-4">
            <div>
              <Mono className="text-pl-teal">Machines de référence</Mono>
              <p className="mt-2 text-[24px] font-light tracking-[-0.025em]">Une machine par usage majeur</p>
            </div>
            <Link href={href('/produits')} className="pl-navlink text-[14px] text-pl-teal">Toutes les machines →</Link>
          </div>
          <ul className="mt-px grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p, i) => (
              <li key={p.slug}><ProductPlate p={p} n={i + 1} /></li>
            ))}
          </ul>
        </Container>
      </section>

      <Steps from="#FFFFFF" to="#F6F8F8" />

      {/* 3 — Savoir-faire */}
      <section aria-labelledby="pl-s3" className="bg-pl-paper pb-20 pt-10 lg:pb-24">
        <Container>
          <SheetHead no="03" kicker="Savoir-faire" sheet="Feuille 03 / 05" />
          <Reveal className="mt-10 grid gap-6 lg:grid-cols-8">
            <h2 id="pl-s3" className="pl-wipe text-[clamp(2.1rem,4.4vw,3.9rem)] font-light leading-[1] tracking-[-0.045em] lg:col-span-5">
              Laver, brosser, aspirer, sécher.<br /><span className="text-pl-ink/45">Le principe, en coupe.</span>
            </h2>
            <p className="pl-rise max-w-md self-end text-[15.5px] leading-relaxed text-pl-ink/75 lg:col-span-3" style={{ ['--d' as string]: '200ms' }}>
              Le principe d’une autolaveuse, tel que les fiches le décrivent : la solution est déposée, le plateau brosse, le suceur ramène l’eau vers l’aspiration.
            </p>
          </Reveal>
          <div className="mt-12 border border-pl-line bg-white px-4 pb-6 pt-6 sm:px-8 lg:px-10">
            <ProcessCut />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Mono className="text-pl-ink/60">Dessin de principe — non contractuel</Mono>
            <Link href={`${href('/produits')}?famille=autolaveuses`} className="pl-navlink text-[14px] text-pl-teal">Voir les autolaveuses →</Link>
          </div>
        </Container>
      </section>

      <Angle15 from="#F6F8F8" to="#FFFFFF" at="62.5%" />

      {/* 4 — Réassurance factuelle */}
      <section aria-labelledby="pl-s4" className="bg-white pb-16 pt-6 lg:pb-24">
        <Container>
          <SheetHead no="04" kicker="Spécifications de la gamme" sheet="Feuille 04 / 05" />
          <div className="mt-10 grid gap-12 lg:grid-cols-8 lg:gap-0">
            <Reveal className="self-start lg:sticky lg:top-24 lg:col-span-3 lg:pr-12">
              <h2 id="pl-s4" className="pl-wipe text-[clamp(2.1rem,4.4vw,3.9rem)] font-light leading-[1] tracking-[-0.045em]">
                Des faits,<br /><span className="text-pl-ink/45">relevés fiche par fiche.</span>
              </h2>
              <p className="pl-rise mt-6 max-w-sm text-[15.5px] leading-relaxed text-pl-ink/75" style={{ ['--d' as string]: '200ms' }}>
                Chaque valeur de ce tableau provient du catalogue GRILLOO 2024. Les caractéristiques complètes de chaque machine figurent sur sa fiche.
              </p>
              <div className="pl-rise mt-8" style={{ ['--d' as string]: '300ms' }}>
                <Btn href={img.catalogue} download variant="line" icon={<IDownload />}>Catalogue 2024 · PDF</Btn>
              </div>
            </Reveal>

            <div className="lg:col-span-5">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Spécifications de la gamme GRILLOO, d’après le catalogue 2024</caption>
                <thead>
                  <tr className="border-b border-pl-teal font-pl-mono text-[10px] uppercase tracking-[0.1em] text-pl-ink/55">
                    <th scope="col" className="w-10 py-2 font-normal">Réf.</th>
                    <th scope="col" className="py-2 font-normal">Désignation</th>
                    <th scope="col" className="py-2 font-normal">Valeur</th>
                    <th scope="col" className="hidden py-2 text-right font-normal sm:table-cell">Source</th>
                  </tr>
                </thead>
                <tbody className="align-top text-[14.5px]">
                  {([
                    ['Machines au catalogue', <span key="v" className="text-[26px] font-light tracking-[-0.03em]">{facts.machines}</span>, 'Catalogue 2024'],
                    ['Familles de machines', <span key="v" className="text-[26px] font-light tracking-[-0.03em]">{facts.families}</span>, 'Catalogue 2024'],
                    ['Rendement théorique maximal', <span key="v"><span className="text-[26px] font-light tracking-[-0.03em]">{facts.maxProd.value.replace(' m²/h', '')}</span> <span className="font-pl-mono text-[12px] text-pl-teal">m²/h</span></span>,
                      <Link key="s" href={productHref(facts.maxProd.product.slug)} className="underline decoration-pl-line underline-offset-4 hover:text-pl-teal">Fiche {facts.maxProd.product.name}</Link>],
                    ['Largeurs de travail', <span key="v" className="font-pl-mono text-[13px]">{facts.width}</span>, 'Fiches produits'],
                    ['Capacités (réservoirs, cuves, bacs)', <span key="v" className="font-pl-mono text-[13px]">{facts.tank}</span>, 'Fiches produits'],
                    ['Énergies', <span key="v" className="font-pl-mono text-[13px]">{facts.energies.join(' · ')}</span>, 'Fiches produits'],
                  ] as const).map(([k, v, s], i) => (
                    <tr key={k} className="border-b border-pl-line">
                      <td className="py-4 font-pl-mono text-[11px] text-pl-teal">{pad(i + 1)}</td>
                      <td className="py-4 pr-4 text-pl-ink/80">{k}</td>
                      <td className="py-3 pr-2 pl-tnum">{v}</td>
                      <td className="hidden py-4 text-right font-pl-mono text-[11px] text-pl-ink/55 sm:table-cell">{s}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-pl-line">
                    <td className="py-4 font-pl-mono text-[11px] text-pl-teal">07</td>
                    <td className="py-4 pr-4 text-pl-ink/80">Garantie</td>
                    <td className="py-3" colSpan={2}>
                      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                        {warranty.map(([k, v]) => (
                          <div key={k} className="border-l border-pl-cyan pl-3">
                            <dt className="font-pl-mono text-[10px] uppercase tracking-[0.08em] text-pl-ink/55">{k}</dt>
                            <dd className="text-[13.5px] text-pl-ink">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </td>
                  </tr>
                  <tr className="border-b border-pl-line">
                    <td className="py-4 font-pl-mono text-[11px] text-pl-teal">08</td>
                    <td className="py-4 pr-4 text-pl-ink/80">Normes et indices cités par les fiches</td>
                    <td className="py-3" colSpan={2}>
                      <ul className="grid gap-2">
                        {standards.map((s) => (
                          <li key={s.label} className="flex flex-wrap items-baseline justify-between gap-x-4">
                            <span className="text-[13.5px]">{s.label}</span>
                            <span className="font-pl-mono text-[10.5px] text-pl-ink/55">{s.products.join(', ')}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                  <tr className="border-b border-pl-teal">
                    <td className="py-4 font-pl-mono text-[11px] text-pl-teal">09</td>
                    <td className="py-4 pr-4 text-pl-ink/80">Documentation</td>
                    <td className="py-4" colSpan={2}>
                      <a href={img.catalogue} download className="inline-flex items-center gap-2 text-pl-teal underline decoration-pl-line underline-offset-4 hover:decoration-pl-cyan">
                        <IDownload /> Catalogue de matériels de nettoyage 2024 (PDF)
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      <CutLine letter="B" />

      {/* 5 — Demande de devis */}
      <section aria-labelledby="pl-s5" className="bg-white pb-20 pt-4 lg:pb-28">
        <Container>
          <SheetHead no="05" kicker="Demande de prix" sheet="Feuille 05 / 05" />
          <Reveal className="pl-graph mt-10 border border-pl-teal">
            <div className="grid lg:grid-cols-8">
              <div className="border-b border-pl-teal bg-white p-6 sm:p-10 lg:col-span-3 lg:border-b-0 lg:border-r">
                <Mono className="text-pl-teal">Formulaire DP-01</Mono>
                <h2 id="pl-s5" className="pl-wipe mt-6 text-[clamp(2.1rem,4vw,3.5rem)] font-light leading-[1] tracking-[-0.045em]">
                  Demandez<br />un devis.
                </h2>
                <p className="pl-rise mt-6 max-w-sm text-[15.5px] leading-relaxed text-pl-ink/75" style={{ ['--d' as string]: '200ms' }}>
                  Indiquez la machine, la surface à traiter et le type de sol. Une démonstration, un conseil ou une question de service après-vente passent par le même formulaire.
                </p>
                <div className="pl-rise mt-8 flex flex-col gap-3" style={{ ['--d' as string]: '300ms' }}>
                  <Btn href={quoteHref()}>Remplir la demande</Btn>
                  <Btn href={href('/produits')} variant="line">Choisir une machine</Btn>
                </div>
              </div>

              <div className="p-6 sm:p-10 lg:col-span-5">
                <ol className="grid gap-0 border-t border-pl-teal bg-white">
                  {[
                    { k: 'Type de demande', v: <span className="flex flex-wrap gap-1.5">{requestTypes.map((t) => <span key={t} className="border border-pl-line px-2 py-0.5 font-pl-mono text-[10.5px] text-pl-ink/75">{t}</span>)}</span> },
                    { k: 'Machine', v: <span className="text-pl-ink/70">Une des {facts.machines} machines du catalogue</span> },
                    { k: 'Surface à traiter', v: <span className="flex items-baseline gap-2"><span className="inline-block w-28 border-b border-dashed border-pl-teal/60" />&nbsp;<span className="font-pl-mono text-[12px] text-pl-teal">m²</span></span> },
                    { k: 'Type de sol', v: <span className="flex flex-wrap gap-1.5">{floorTypes.map((t) => <span key={t} className="border border-pl-line px-2 py-0.5 font-pl-mono text-[10.5px] text-pl-ink/75">{t}</span>)}</span> },
                    { k: 'Coordonnées', v: <span className="text-pl-ink/70">Société, nom, e-mail, téléphone</span> },
                  ].map((row, i) => (
                    <li key={row.k} className="grid gap-2 border-b border-x border-pl-line px-4 py-4 sm:grid-cols-[2.5rem_9rem_1fr] sm:items-baseline sm:gap-4">
                      <span className="font-pl-mono text-[11px] text-pl-teal">{pad(i + 1)}</span>
                      <span className="text-[14px] text-pl-ink">{row.k}</span>
                      <span className="text-[14px]">{row.v}</span>
                    </li>
                  ))}
                </ol>
                <dl className="mt-6 grid grid-cols-1 border-l border-t border-pl-teal/70 bg-white font-pl-mono text-[11.5px] sm:grid-cols-3">
                  {[['Téléphone', site.phone], ['E-mail', site.email], ['Horaires', site.hours[0].time]].map(([k, v]) => (
                    <div key={k} className="border-b border-r border-pl-teal/70 px-3 py-2">
                      <dt className="text-[9.5px] uppercase tracking-[0.1em] text-pl-ink/55">{k}</dt>
                      <dd className="mt-0.5 text-pl-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
