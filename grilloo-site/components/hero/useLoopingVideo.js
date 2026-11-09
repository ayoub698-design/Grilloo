'use client';

import { useEffect, useState } from 'react';

/**
 * Pilote la vidéo de fond du Hero :
 * - `ready`  : la vidéo joue réellement (événement `playing`), on peut l'afficher ;
 * - `failed` : aucune source lisible (fichier absent, format non supporté) ;
 * - boucle stricte sur `duration` secondes, même si le fichier est plus long ;
 * - lecture / pause selon `playing` (bouton utilisateur, visibilité, onglet).
 */
export function useLoopingVideo(videoRef, { duration = 5, playing = true, enabled = true } = {}) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // 1. Disponibilité et erreurs
  useEffect(() => {
    const video = videoRef.current;
    if (!enabled || !video) return undefined;

    const onPlaying = () => setReady(true);
    const onFail = () => setFailed(true);

    // L'erreur d'une <source> n'est pas propagée à <video> : on écoute la dernière,
    // qui ne se déclenche que lorsque toutes les sources ont échoué.
    const sources = video.querySelectorAll('source');
    const lastSource = sources[sources.length - 1];

    video.addEventListener('playing', onPlaying);
    video.addEventListener('error', onFail);
    lastSource?.addEventListener('error', onFail);

    if (video.error) setFailed(true);

    return () => {
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('error', onFail);
      lastSource?.removeEventListener('error', onFail);
    };
  }, [videoRef, enabled]);

  // 2. Lecture / pause
  useEffect(() => {
    const video = videoRef.current;
    if (!enabled || !video || failed) return;

    if (playing) {
      // play() peut être refusé (mode économie d'énergie iOS…) : le canvas reste affiché.
      video.play()?.catch(() => {});
    } else {
      video.pause();
    }
  }, [videoRef, enabled, failed, playing]);

  // 3. Boucle stricte de `duration` secondes, synchronisée sur les images de la vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!enabled || !video || failed || !playing) return undefined;

    const hasRVFC = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;
    let handle = 0;

    const tick = () => {
      // Fichier exactement de 5 s : l'attribut `loop` natif suffit.
      // Fichier plus long : on revient à 0 dès que la 5e seconde est atteinte.
      if (Number.isFinite(video.duration) && video.duration > duration + 0.05 && video.currentTime >= duration) {
        video.currentTime = 0;
      }
      schedule();
    };

    const schedule = () => {
      handle = hasRVFC ? video.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
    };

    schedule();

    return () => {
      if (hasRVFC) video.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
    };
  }, [videoRef, enabled, failed, playing, duration]);

  return { ready, failed };
}
