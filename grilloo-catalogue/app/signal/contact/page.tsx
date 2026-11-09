import { site } from '@/lib/site';
import { img } from '@/lib/assets';
import { Container, Eyebrow } from '@/components/signal/ui';
import ContactForm from '@/components/signal/ContactForm';
import AccessMap from '@/components/signal/AccessMap';
import { Clock, Download, Mail, Phone, Pin, Social } from '@/components/signal/icons';

export const metadata = {
  title: 'Contact et demande de devis',
  description: 'Demandez un devis, une démonstration ou un conseil sur une machine de nettoyage GRILLOO.',
};

export default function SignalContact() {
  const rows = [
    { icon: Phone, k: 'Téléphone', v: site.phone },
    { icon: Mail, k: 'E-mail', v: site.email },
    { icon: Pin, k: 'Adresse', v: [site.address.line1, site.address.city, site.address.country].filter(Boolean).join(', ') },
  ];
  return (
    <section className="pb-24 pt-8 md:pt-12">
      <Container>
        <Eyebrow>Contact · devis · démonstration</Eyebrow>
        <h1 className="mt-4">
          <span className="si-display si-enter-x block text-[clamp(2.6rem,10vw,10rem)]">Parlons</span>
          <span className="si-display-cond si-enter-x block text-[clamp(3rem,12vw,12rem)] text-si-cyan" style={{ '--d': '80ms' } as React.CSSProperties}>de vos sols</span>
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="min-w-0 space-y-6 lg:col-span-5" aria-label="Coordonnées">
            <div className="rounded-[36px] bg-si-ink p-6 text-white md:p-8">
              <h2 className="si-display text-[clamp(1.8rem,3vw,2.6rem)]">Coordonnées</h2>
              <dl className="mt-6 space-y-4">
                {rows.map(({ icon: I, k, v }) => (
                  <div key={k} className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-si-cyan text-si-ink"><I className="h-5 w-5" /></span>
                    <div>
                      <dt className="si-label text-white/55">{k}</dt>
                      <dd className="mt-1 text-[17px] font-bold">{v}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="mt-8 border-t border-white/15 pt-6">
                <h3 className="si-label flex items-center gap-2 text-white/55"><Clock className="h-4 w-4" /> Horaires</h3>
                <dl className="mt-3 divide-y divide-white/10">
                  {site.hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4 py-2.5 text-[15px]">
                      <dt className="text-white/75">{h.days}</dt>
                      <dd className="text-right font-bold">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {site.social.map((s) => (
                  <a key={s.name} href={s.href} aria-label={`${s.name} (lien à fournir)`} className="si-btn grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-si-cyan hover:text-si-ink">
                    <Social name={s.name} className="h-[18px] w-[18px]" />
                  </a>
                ))}
                <a href={img.catalogue} download className="si-btn ml-auto inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-bold text-si-ink">
                  <Download className="h-4 w-4" /> Catalogue PDF
                </a>
              </div>
            </div>
            <AccessMap />
          </aside>
        </div>
      </Container>
    </section>
  );
}
