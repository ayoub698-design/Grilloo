import SiteHeader from '@/components/header/SiteHeader';
import HeroScene from '@/components/hero/HeroScene';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="contenu">
        <HeroScene />

        {/* Ancres des CTA du Hero : sections à développer à l'étape suivante. */}
        <section id="catalogue" aria-label="Catalogue" style={{ minHeight: '40vh' }} />
        <section id="roboclean" aria-label="RoboClean G+" style={{ minHeight: '40vh' }} />
      </main>
    </>
  );
}
