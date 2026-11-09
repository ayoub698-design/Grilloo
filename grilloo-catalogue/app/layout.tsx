import type { Metadata } from 'next';
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource-variable/inter';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.grilloo.net'),
  title: { default: 'GRILLOO — Machines de nettoyage professionnelles', template: '%s — GRILLOO' },
  description:
    'Catalogue GRILLOO 2024 : 75 machines de nettoyage professionnelles. Autolaveuses, autoportées, robot RoboClean G+, aspirateurs, monobrosses, balayeuses, injecteurs-extracteurs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
