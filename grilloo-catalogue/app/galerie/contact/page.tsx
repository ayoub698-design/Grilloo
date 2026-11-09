import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { img } from '@/lib/assets';
import { ContactForm } from '@/components/galerie/ContactForm';
import { AccessMap } from '@/components/galerie/AccessMap';
import { Reveal, Lines } from '@/components/galerie/motion';
import { Caption, Container } from '@/components/galerie/ui';
import { Download } from '@/components/galerie/icons';

export const metadata: Metadata = {
  title: 'Contact — demande de devis',
  description: 'Demande de devis, démonstration, conseil ou service après-vente : contactez GRILLOO en précisant la machine, la surface et le type de sol.',
};

export default function ContactPage() {
  return (
    <>
      <Container className="pb-10 pt-12 lg:pb-16 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal variant="fade"><Caption rule>Contact</Caption></Reveal>
            <Lines as="h1" className="ga-display mt-6 text-[clamp(50px,7.4vw,120px)] leading-[.93] tracking-[-0.03em]" lines={['Demander', <em key="e">un devis</em>]} />
          </div>
          <Reveal delay={250} className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-[15px] leading-[1.75] ga-text-stone">
              Précisez la machine, la surface à traiter et le type de sol. Le même formulaire sert pour une démonstration, un conseil ou le service après-vente.
            </p>
          </Reveal>
        </div>
      </Container>

      <Container className="grid gap-16 pb-24 lg:grid-cols-12 lg:gap-8 lg:pb-36">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <aside className="lg:col-span-4 lg:col-start-9" aria-label="Coordonnées">
          <div className="border-t border-ga-ink/80 pt-10">
            <p className="ga-caps ga-text-stone">Coordonnées</p>
            <dl className="mt-6 text-[14.5px]">
              {[
                ['Téléphone', site.phone],
                ['E-mail', site.email],
                ['Adresse', [site.address.line1, site.address.city, site.address.country].filter(Boolean).join(', ')],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-ga-line py-3.5">
                  <dt className="ga-caps ga-text-stone pt-0.5">{k}</dt>
                  <dd className="ga-display text-[17px] italic">{v}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-ga-line py-3.5">
                <dt className="ga-caps ga-text-stone pt-0.5">Site</dt>
                <dd><a href={site.url} className="ga-link">{site.domain}</a></dd>
              </div>
            </dl>

            <p className="ga-caps ga-text-stone mt-12">Horaires</p>
            <dl className="mt-5 text-[14.5px]">
              {site.hours.map((h) => (
                <div key={h.days} className="flex items-baseline justify-between gap-4 border-b border-ga-line py-3">
                  <dt>{h.days}</dt>
                  <dd className="text-right ga-text-stone">{h.time}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-12"><AccessMap address={site.address.line1} /></div>

            <a href={img.catalogue} target="_blank" rel="noopener" className="group mt-12 flex items-center justify-between gap-4 border-y border-ga-line py-5">
              <span>
                <span className="ga-caps ga-text-stone block">Catalogue 2024</span>
                <span className="ga-display mt-1 block text-[20px]"><span className="ga-link">Télécharger le PDF</span></span>
              </span>
              <Download className="h-5 w-5" />
            </a>
          </div>
        </aside>
      </Container>
    </>
  );
}
