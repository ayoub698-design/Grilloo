'use client';
import { usePathname } from 'next/navigation';

/**
 * Chemin « logique » de la page (ex. /galerie/produits/g9), identique côté serveur et navigateur,
 * y compris dans la version HTML locale ouverte en file:// (où l'adresse contient C:/…/site-html/…/index.html).
 */
export function toSitePath(p: string) {
  const m = p.replace(/\\/g, '/').match(/\/(galerie|signal|plan)(\/.*)?$/);
  let s = m ? `/${m[1]}${m[2] ?? ''}` : p;
  s = s.replace(/\/index\.html$/, '').replace(/\/+$/, '');
  return s || '/';
}

export function useSitePath() {
  return toSitePath(usePathname() ?? '');
}
