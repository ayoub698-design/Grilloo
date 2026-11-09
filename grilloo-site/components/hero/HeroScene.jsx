'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './HeroScene.module.css';
import WaterLoopCanvas from './WaterLoopCanvas';
import LoopControl from './LoopControl';
import { useLoopingVideo } from './useLoopingVideo';
import { useMediaQuery } from './useMediaQuery';
import { CATEGORIES, FEATURED, HERO_COPY, HERO_VIDEO } from './heroContent';

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className={styles.arrow}>
      <path d="M3 9h11M10 4.5 14.5 9 10 13.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HeroScene() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const clockRef = useRef(0); // temps de boucle de la scène canvas (secondes)
  const duration = HERO_VIDEO.loopDuration;

  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [allowVideo, setAllowVideo] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  // Pas de vidéo en mode « économie de données » ou en 2G : la scène canvas suffit.
  useEffect(() => {
    const connection = navigator.connection;
    const constrained = Boolean(connection?.saveData) || /(^|-)2g$/.test(connection?.effectiveType ?? '');
    setAllowVideo(!constrained);
  }, []);

  // Mouvement réduit demandé par le système : la scène démarre à l'arrêt.
  useEffect(() => {
    if (reducedMotion) setUserPaused(true);
  }, [reducedMotion]);

  // Pause automatique hors écran et onglet masqué (batterie, GPU).
  useEffect(() => {
    const node = sectionRef.current;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(node);
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const playing = !userPaused && inView && pageVisible;
  const { ready, failed } = useLoopingVideo(videoRef, { duration, playing, enabled: allowVideo });
  const videoActive = allowVideo && ready && !failed;

  const getLoopTime = useCallback(() => {
    const video = videoRef.current;
    if (videoActive && video) return video.currentTime % duration;
    return clockRef.current;
  }, [videoActive, duration]);

  const toggle = useCallback(() => setUserPaused((p) => !p), []);

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      aria-labelledby="hero-title"
      data-paused={userPaused ? 'true' : 'false'}
    >
      {/* Couche média : canvas procédural (attente / secours) puis vidéo en fondu */}
      <div className={styles.media} aria-hidden="true">
        <WaterLoopCanvas
          className={styles.canvas}
          running={!videoActive && playing}
          clockRef={clockRef}
          period={duration}
        />
        {allowVideo && (
          <video
            ref={videoRef}
            className={styles.video}
            data-ready={videoActive ? 'true' : 'false'}
            muted
            playsInline
            loop
            autoPlay={!reducedMotion}
            preload="auto"
            poster={HERO_VIDEO.poster ?? undefined}
            disablePictureInPicture
            disableRemotePlayback
            tabIndex={-1}
          >
            {HERO_VIDEO.sources.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
        )}
        <div className={styles.scrim} />
        <div className={styles.grain} />
      </div>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={`${styles.eyebrow} ${styles.reveal}`} style={{ '--i': 0 }}>
            <span className={styles.pulseDot} aria-hidden="true" />
            {HERO_COPY.eyebrow}
          </p>

          <h1 id="hero-title" className={`${styles.title} ${styles.reveal}`} style={{ '--i': 1 }}>
            {HERO_COPY.titleStart} <span className={styles.titleAccent}>{HERO_COPY.titleAccent}</span>
          </h1>

          <p className={`${styles.lede} ${styles.reveal}`} style={{ '--i': 2 }}>
            {HERO_COPY.lede}
          </p>

          <div className={`${styles.ctas} ${styles.reveal}`} style={{ '--i': 3 }}>
            <a className={styles.btnPrimary} href={HERO_COPY.primaryCta.href}>
              {HERO_COPY.primaryCta.label}
              <ArrowIcon />
            </a>
            <a className={styles.btnGhost} href={HERO_COPY.secondaryCta.href}>
              {HERO_COPY.secondaryCta.label}
            </a>
          </div>
        </div>

        <aside className={`${styles.card} ${styles.reveal}`} style={{ '--i': 4 }} aria-label={`Produit vedette : ${FEATURED.name}`}>
          <div className={styles.cardHead}>
            <span className={styles.cardBadge}>{FEATURED.badge}</span>
            <span className={styles.cardNorm}>{FEATURED.norm}</span>
          </div>
          <a className={styles.cardName} href={FEATURED.href}>
            {FEATURED.name}
            <ArrowIcon />
          </a>
          <dl className={styles.stats}>
            {FEATURED.stats.map((s) => (
              <div key={s.unit} className={styles.stat}>
                <dt className={styles.statUnit}>{s.unit}</dt>
                <dd className={styles.statValue}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <div className={styles.bottom}>
        <span className={styles.caption}>{videoActive ? HERO_VIDEO.caption : 'Scène animée · 5 s'}</span>
        <LoopControl playing={!userPaused} onToggle={toggle} getLoopTime={getLoopTime} duration={duration} />
      </div>

      <div className={styles.marquee}>
        <ul className={styles.marqueeTrack} aria-label="Familles de produits">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <li key={`${c}-${i}`} aria-hidden={i >= CATEGORIES.length ? 'true' : undefined}>
              {c}
              <span className={styles.marqueeSep} aria-hidden="true">
                ✦
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
