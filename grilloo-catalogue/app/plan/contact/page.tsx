import type { Metadata } from 'next';
import { img } from '@/lib/assets';
import { site } from '@/lib/site';
import { ContactForm } from '@/components/plan/ContactForm';
import { SitePlan } from '@/components/plan/SitePlan';
import { IDownload } from '@/components/plan/icons';
import { Container, CutLine, Mono, PageHead, SheetHead, href } from '@/components/plan/ui';

export const metadata: Metadata = {
  title: 'Contact — Demande de devis',
  description: 'Demandez un devis, une démonstration ou un conseil sur une machine GRILLOO : formulaire technique, coordonnées, horaires et plan d’accès.',
};

export default function ContactPage() {
  return (
    <>
      <PageHead
        code="C-00"
        crumbs={[{ label: 'Accueil', href: href('') }, { label: 'Contact' }]}
        title={<>Contact<br /><span className="text-pl-ink/45">& demande de devis</span></>}
        lead="Devis, démonstration, conseil sur une machine ou service après-vente : un seul formulaire. Indiquez la machine, la surface et le type de sol pour une réponse précise."
      />

      <section aria-label="Formulaire et coordonnées" className="bg-white pb-20 pt-10">
        <Container>
          <div className="grid gap-10 lg:grid-cols-8 lg:gap-0">
            <div className="lg:col-span-5 lg:pr-10">
              <ContactForm />
            </div>
            <aside className="lg:col-span-3" aria-labelledby="pl-coord">
              <div className="lg:sticky lg:top-24">
                <SheetHead no="01" kicker="Coordonnées" />
                <h2 id="pl-coord" className="sr-only">Coordonnées</h2>
                <dl className="mt-4 grid border-l border-t border-pl-teal/70">
                  {[
                    ['Téléphone', site.phone],
                    ['E-mail', site.email],
                    ['Adresse', [site.address.line1, site.address.city, site.address.country].filter(Boolean).join(', ')],
                    ['Site', site.domain],
                  ].map(([k, v]) => (
                    <div key={k} className="border-b border-r border-pl-teal/70 px-4 py-3">
                      <dt className="font-pl-mono text-[9.5px] uppercase tracking-[0.1em] text-pl-ink/55">{k}</dt>
                      <dd className="mt-1 text-[15px] text-pl-ink">{v}</dd>
                    </div>
                  ))}
                </dl>

                <SheetHead no="02" kicker="Horaires" className="mt-10" />
                <table className="mt-4 w-full border-collapse text-[14.5px]">
                  <caption className="sr-only">Horaires d’ouverture</caption>
                  <tbody>
                    {site.hours.map((h) => (
                      <tr key={h.days} className="border-b border-pl-line">
                        <th scope="row" className="py-3 text-left font-normal text-pl-ink/75">{h.days}</th>
                        <td className="py-3 text-right font-pl-mono text-[12.5px] text-pl-ink">{h.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <SheetHead no="03" kicker="Documentation" className="mt-10" />
                <a href={img.catalogue} download className="mt-4 flex items-center justify-between gap-3 border border-pl-teal px-4 py-3 text-[14.5px] text-pl-teal hover:bg-pl-teal hover:text-white">
                  Catalogue 2024 (PDF) <IDownload />
                </a>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <CutLine letter="A" />

      <section aria-labelledby="pl-access" className="bg-white pb-24 pt-4">
        <Container>
          <SheetHead no="04" kicker="Accès" sheet="Plan schématique · sans échelle" />
          <div className="mt-10 grid gap-8 lg:grid-cols-8 lg:gap-0">
            <div className="lg:col-span-2 lg:pr-10">
              <h2 id="pl-access" className="text-[clamp(1.9rem,3.4vw,2.9rem)] font-light leading-[1.02] tracking-[-0.04em]">Plan d’accès</h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-pl-ink/75">Adresse à fournir. Ce plan est un schéma de principe : il sera remplacé par le plan réel du site GRILLOO.</p>
              <ul className="mt-6 grid gap-2 font-pl-mono text-[11px] text-pl-ink/75">
                <li className="flex items-center gap-3"><span className="h-[3px] w-6 bg-pl-cyan" aria-hidden="true" /> Itinéraire d’accès</li>
                <li className="flex items-center gap-3"><span className="h-3 w-6 border border-pl-teal bg-[#F2F6F7]" aria-hidden="true" /> Bâtiment</li>
                <li className="flex items-center gap-3"><span className="pl-hatch h-3 w-6 border border-pl-teal/50" aria-hidden="true" /> Îlots voisins</li>
              </ul>
            </div>
            <figure className="lg:col-span-6">
              <div className="border border-pl-teal">
                <div className="flex items-center justify-between border-b border-pl-teal px-3 py-2">
                  <Mono className="text-pl-teal">Plan d’accès — adresse à fournir</Mono>
                  <Mono className="hidden text-pl-ink/55 sm:inline">Sans échelle</Mono>
                </div>
                <SitePlan />
              </div>
              <figcaption className="mt-3 font-pl-mono text-[11px] text-pl-ink/60">Adresse : {site.address.line1}</figcaption>
            </figure>
          </div>
        </Container>
      </section>
    </>
  );
}
