'use client';

import { useEffect, useRef } from 'react';
import styles from './HeroScene.module.css';

const RADIUS = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatSeconds(s) {
  return `0:0${Math.min(9, Math.floor(s))}`;
}

/**
 * Bouton lecture/pause de la boucle, avec anneau de progression sur 5 s.
 * La progression est écrite directement dans le DOM (pas de re-rendu React à 60 i/s).
 */
export default function LoopControl({ playing, onToggle, getLoopTime, duration }) {
  const ringRef = useRef(null);
  const timeRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const t = getLoopTime() % duration;
      ringRef.current?.style.setProperty('--progress', (t / duration).toFixed(4));
      if (timeRef.current) timeRef.current.textContent = formatSeconds(t);
      if (playing) raf = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(raf);
  }, [playing, getLoopTime, duration]);

  return (
    <button
      type="button"
      className={styles.loopControl}
      onClick={onToggle}
      aria-pressed={!playing}
      aria-label={playing ? "Mettre l'animation de fond en pause" : "Relancer l'animation de fond"}
    >
      <span className={styles.ring} ref={ringRef} aria-hidden="true">
        <svg viewBox="0 0 36 36" width="36" height="36">
          <circle cx="18" cy="18" r={RADIUS} className={styles.ringTrack} />
          <circle
            cx="18"
            cy="18"
            r={RADIUS}
            className={styles.ringValue}
            strokeDasharray={CIRCUMFERENCE}
            style={{ '--circ': `${CIRCUMFERENCE}px` }}
          />
          {playing ? (
            <g fill="currentColor">
              <rect x="13.5" y="12" width="3" height="12" rx="1" />
              <rect x="19.5" y="12" width="3" height="12" rx="1" />
            </g>
          ) : (
            <path d="M15 12.5v11l9-5.5z" fill="currentColor" />
          )}
        </svg>
      </span>
      <span className={styles.loopLabel} aria-hidden="true">
        {playing ? 'Pause' : 'Lecture'}
        <span className={styles.loopTime}>
          <span ref={timeRef}>0:00</span> / 0:0{duration}
        </span>
      </span>
    </button>
  );
}
