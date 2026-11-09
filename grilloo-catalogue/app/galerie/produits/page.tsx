import type { Metadata } from 'next';
import { stats } from '@/lib/catalog';
import { CatalogueBrowser } from '@/components/galerie/CatalogueBrowser';
import { Lines, Reveal, Curve } from '@/components/galerie/motion';
import { Caption, Container, TextLink } from '@/components/galerie/ui';
import { quoteHref } from '@/components/galerie/links';

export const metadata: Metadata = {
  title: 'Nos produits — catalogue des machines',
  description: `Les ${stats.products} machines de nettoyage professionnelles GRILLOO en ${stats.families} familles : recherche, filtres par famille et énergie, fiches détaillées et demande de devis.`,
};

export default function ProduitsPage() {
  return (
    <>
      <Container className="pb-8 pt-12 lg:pt-20">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal variant="fade"><Caption rule>Catalogue 2024 — {stats.products} machines</Caption></Reveal>
            <Lines as="h1" className="ga-display mt-6 text-[clamp(52px,8vw,128px)] leading-[.92] tracking-[-0.03em]" lines={['La', <em key="e">collection</em>]} />
          </div>
          <Reveal delay={250} className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-[15px] leading-[1.75] ga-text-stone">
              {stats.families} familles, de l’autolaveuse accompagnée à la balayeuse autoportée. Chaque fiche reprend les caractéristiques du catalogue ; une question, un doute sur un modèle ?
            </p>
            <TextLink href={quoteHref()} className="mt-5">Demander conseil</TextLink>
          </Reveal>
        </div>
      </Container>
      <Curve shape="swell" tone="line" className="-mb-4" />
      <Container className="pb-28 pt-6 lg:pb-40">
        <CatalogueBrowser />
      </Container>
    </>
  );
}
