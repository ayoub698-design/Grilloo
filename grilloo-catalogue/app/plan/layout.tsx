import type { Metadata } from 'next';
import { Footer } from '@/components/plan/Footer';
import { Header } from '@/components/plan/Header';
import './plan.css';

export const metadata: Metadata = {
  title: { default: 'GRILLOO — Machines de nettoyage professionnelles · Plan', template: '%s — GRILLOO' },
  description: 'Catalogue GRILLOO 2024 présenté comme un dossier technique : 75 machines de nettoyage professionnelles, fiches, cotes et caractéristiques.',
};

const noJs = `.pl-root .pl-wipe{clip-path:none}.pl-root .pl-rise,.pl-root .pl-settle{opacity:1;transform:none;filter:none}.pl-root .pl-rule,.pl-root .pl-dim-line{transform:none}.pl-root .pl-draw .d{stroke-dashoffset:0}.pl-root .pl-draw .f{fill-opacity:1}.pl-root .pl-draw .o,.pl-root .pl-dim-ext,.pl-root .pl-arrow,.pl-root .pl-dim-label{opacity:1}`;

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pl-root min-h-screen bg-white font-pl-sans text-pl-ink antialiased">
      <noscript><style>{noJs}</style></noscript>
      <Header />
      <main id="contenu">{children}</main>
      <Footer />
    </div>
  );
}
