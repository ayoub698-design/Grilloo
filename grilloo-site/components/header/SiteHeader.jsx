'use client';

import { useEffect, useId, useState } from 'react';
import styles from './SiteHeader.module.css';
import { NAV_LINKS } from '@/components/hero/heroContent';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Échap ferme le menu mobile ; le défilement de la page est bloqué tant qu'il est ouvert.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={styles.header} data-open={open ? 'true' : 'false'}>
      <div className={styles.bar}>
        <a className={styles.logo} href="/" aria-label="GRILLOO, accueil">
          {/* Remplacez par le logo SVG officiel : <Image src="/brand/grilloo.svg" … /> */}
          <span className={styles.logoWord}>grilloo</span>
          <span className={styles.logoTag}>Leader des solutions de nettoyage</span>
        </a>

        <nav className={styles.nav} aria-label="Navigation principale">
          {NAV_LINKS.map((l, i) => (
            <a key={l.href} className={styles.navLink} href={l.href} aria-current={i === 0 ? 'page' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>

        <a className={styles.cta} href="#devis">
          Demander un devis
        </a>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={styles.burger} aria-hidden="true" />
        </button>
      </div>

      <div id={panelId} className={styles.panel} hidden={!open}>
        <nav aria-label="Navigation mobile" className={styles.panelNav}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.panelLink} onClick={close}>
              {l.label}
            </a>
          ))}
          <a href="#devis" className={styles.panelCta} onClick={close}>
            Demander un devis
          </a>
        </nav>
      </div>
    </header>
  );
}
