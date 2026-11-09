import { sectors } from '@/lib/sectors';
import { Container, Eyebrow } from '@/components/signal/ui';
import { Marquee } from '@/components/signal/motion';
import SectorSwitcher from '@/components/signal/SectorSwitcher';

export const metadata = {
  title: 'Nos secteurs',
  description: 'Santé, logistique, industrie, commerce, hôtellerie, bureaux, collectivités, sociétés de propreté, prescripteurs : les machines GRILLOO citées par le catalogue pour chaque secteur.',
};

export default function SignalSecteurs() {
  return (
    <>
      <section className="pt-8 md:pt-12">
        <Container>
          <Eyebrow>Domaines d’application</Eyebrow>
          <h1 className="mt-4 flex flex-wrap items-baseline gap-x-5">
            <span className="si-display si-enter-x text-[clamp(3rem,11vw,10.5rem)]">Nos</span>
            <span className="si-display-cond si-enter-x text-[clamp(3.6rem,13vw,12.5rem)] text-si-cyan" style={{ '--d': '80ms' } as React.CSSProperties}>secteurs</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-si-ink/75">
            {sectors.length} domaines d’application. Pour chacun : le besoin, les surfaces rencontrées et les machines que les fiches du catalogue citent pour ce type de lieu.
          </p>
        </Container>
        <div className="mt-10 border-y-[3px] border-si-ink bg-si-cyan">
          <Marquee
            label="Secteurs"
            base={50}
            items={sectors.map((s) => (
              <span key={s.slug} className="flex items-center gap-6 px-6 py-3">
                <span className="whitespace-nowrap text-[clamp(1.3rem,2.4vw,2.2rem)] font-black uppercase leading-none [font-stretch:120%]">{s.short}</span>
                <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 bg-si-ink" />
              </span>
            ))}
          />
        </div>
      </section>
      <section className="pb-24 pt-12 md:pt-16" aria-label="Secteurs et machines">
        <Container>
          <SectorSwitcher />
        </Container>
      </section>
    </>
  );
}
