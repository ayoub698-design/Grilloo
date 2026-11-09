import { Unbounded, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const display = Unbounded({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'GRILLOO — Matériel de nettoyage professionnel',
  description:
    'Autolaveuses, autoportées, aspirateurs industriels, monobrosses et balayeuses : le catalogue GRILLOO 2024, 75 machines professionnelles.',
};

export const viewport = {
  themeColor: '#060B0E',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
