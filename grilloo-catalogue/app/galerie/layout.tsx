import type { Metadata } from 'next';
import './galerie.css';
import { Header } from '@/components/galerie/Header';
import { Footer } from '@/components/galerie/Footer';

export const metadata: Metadata = {
  title: { default: 'GRILLOO — Machines de nettoyage professionnelles', template: '%s — GRILLOO' },
  description:
    'GRILLOO, leader des solutions de nettoyage : 75 machines professionnelles en 10 familles — autolaveuses, autoportées, robot RoboClean G+, aspirateurs, monobrosses, balayeuses.',
};

export default function GalerieLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ga-root flex min-h-screen flex-col bg-ga-paper font-ga-sans text-ga-ink">
      <noscript>
        <style>{`.ga-r{opacity:1!important;transform:none!important}.ga-lines .ga-l>span{transform:none!important}.ga-curve path.ga-draw{stroke-dashoffset:0!important}`}</style>
      </noscript>
      <Header />
      <main id="contenu" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
