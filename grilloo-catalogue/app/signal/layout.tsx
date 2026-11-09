import type { Metadata } from 'next';
import './signal.css';
import Header from '@/components/signal/Header';
import Footer from '@/components/signal/Footer';

export const metadata: Metadata = {
  title: { default: 'GRILLOO — La puissance du nettoyage entre vos mains', template: '%s — GRILLOO' },
  description: 'Catalogue GRILLOO 2024 : 75 machines de nettoyage professionnelles en 10 familles — autolaveuses, autoportées, aspirateurs, monobrosses, balayeuses, injecteurs-extracteurs.',
};

export default function SignalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="si-root min-h-screen bg-white font-si text-si-ink">
      <Header />
      <main id="contenu">{children}</main>
      <Footer />
    </div>
  );
}
