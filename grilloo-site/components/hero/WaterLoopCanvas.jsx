'use client';

import { useEffect, useRef } from 'react';

/**
 * Scène procédurale de secours (et d'attente) : reflets sur un sol mouillé,
 * lignes de perspective, balayage lumineux et gouttelettes.
 * Tous les mouvements ont une période de `period` secondes : la boucle est parfaite.
 */

const TAU = Math.PI * 2;

function seededRandom(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeParticles(count) {
  const rand = seededRandom(2024);
  return Array.from({ length: count }, () => ({
    x: rand(),
    y: rand(),
    r: 0.6 + rand() * 1.8,
    speed: 1 + Math.floor(rand() * 2), // nombre entier de traversées par boucle
    twinkle: 1 + Math.floor(rand() * 3), // nombre entier de scintillements par boucle
    phase: rand() * TAU,
    drift: (rand() - 0.5) * 0.03,
  }));
}

function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function draw(ctx, w, h, u, particles, dpr) {
  const horizon = h * 0.56;

  // Fond
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#05090c');
  bg.addColorStop(0.55, '#071c23');
  bg.addColorStop(1, '#04090c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Halo principal qui « respire »
  const bx = w * 0.72 + Math.cos(TAU * u) * w * 0.04;
  const by = horizon + Math.sin(TAU * u) * h * 0.03;
  const bloom = ctx.createRadialGradient(bx, by, 0, bx, by, w * 0.5);
  bloom.addColorStop(0, 'rgba(47, 211, 234, 0.20)');
  bloom.addColorStop(1, 'rgba(47, 211, 234, 0)');
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, w, h);

  // Baies lumineuses au fond et leurs reflets sur le sol
  const pillars = 7;
  for (let i = 0; i < pillars; i += 1) {
    const px = w * (0.36 + i * 0.09);
    const pw = w * 0.018;
    const a = 0.1 + 0.06 * Math.sin(TAU * (u + i / pillars));

    const top = horizon * 0.22;
    const wall = ctx.createLinearGradient(0, top, 0, horizon);
    wall.addColorStop(0, 'rgba(47, 211, 234, 0)');
    wall.addColorStop(1, `rgba(140, 235, 248, ${a})`);
    ctx.fillStyle = wall;
    ctx.fillRect(px, top, pw, horizon - top);

    const refl = ctx.createLinearGradient(0, horizon, 0, h);
    refl.addColorStop(0, `rgba(140, 235, 248, ${a * 0.8})`);
    refl.addColorStop(1, 'rgba(47, 211, 234, 0)');
    ctx.fillStyle = refl;
    ctx.fillRect(px - pw * 0.2, horizon, pw * 1.4, h - horizon);
  }

  // Lignes de fuite du sol
  const vx = w * 0.62;
  ctx.lineWidth = Math.max(1, dpr * 0.75);
  ctx.strokeStyle = 'rgba(47, 211, 234, 0.07)';
  for (let i = -10; i <= 10; i += 1) {
    ctx.beginPath();
    ctx.moveTo(vx, horizon);
    ctx.lineTo(vx + i * w * 0.16, h);
    ctx.stroke();
  }

  // Lignes transversales qui avancent vers le spectateur (une ligne par boucle)
  const rows = 12;
  for (let i = 0; i < rows; i += 1) {
    const z = (i + u) / rows;
    const y = horizon + (h - horizon) * z ** 2.4;
    const alpha = (0.02 + 0.14 * z) * (1 - smoothstep(0.85, 1, z));
    ctx.strokeStyle = `rgba(47, 211, 234, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Balayage lumineux : entre hors champ à gauche, sort hors champ à droite
  const sx = -0.35 * w + u * 1.7 * w;
  const sy = h * 0.82;
  const sweep = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.35);
  sweep.addColorStop(0, 'rgba(47, 211, 234, 0.22)');
  sweep.addColorStop(1, 'rgba(47, 211, 234, 0)');
  ctx.fillStyle = sweep;
  ctx.fillRect(0, horizon, w, h - horizon);

  // Gouttelettes en suspension
  for (const p of particles) {
    const y01 = (((p.y - p.speed * u) % 1) + 1) % 1;
    const x = (p.x + p.drift * Math.sin(TAU * u)) * w;
    const alpha =
      (0.15 + 0.35 * (0.5 + 0.5 * Math.sin(TAU * p.twinkle * u + p.phase))) * Math.sin(Math.PI * y01);
    ctx.fillStyle = `rgba(184, 244, 252, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y01 * h, p.r * dpr, 0, TAU);
    ctx.fill();
  }

  // Vignettage
  const vig = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.3, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
  vig.addColorStop(0, 'rgba(4, 9, 12, 0)');
  vig.addColorStop(1, 'rgba(4, 9, 12, 0.7)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}

export default function WaterLoopCanvas({ className, running, clockRef, period = 5 }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    const particles = makeParticles(70);
    let w = 1;
    let h = 1;
    let dpr = 1;
    let raf = 0;
    let last = 0;

    const render = () => draw(ctx, w, h, (clockRef.current % period) / period, particles, dpr);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5); // plafonné pour préserver le GPU mobile
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width * dpr));
      h = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = w;
      canvas.height = h;
      render();
    };

    const frame = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      clockRef.current = (clockRef.current + dt) % period;
      render();
      raf = requestAnimationFrame(frame);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    engineRef.current = {
      start() {
        if (raf) return;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      },
      stop() {
        cancelAnimationFrame(raf);
        raf = 0;
        render();
      },
    };

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      engineRef.current = null;
    };
  }, [clockRef, period]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (running) engine.start();
    else engine.stop();
  }, [running]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
