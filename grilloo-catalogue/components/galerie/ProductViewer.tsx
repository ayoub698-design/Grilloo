'use client';
import Image from 'next/image';
import { useState } from 'react';
import { img } from '@/lib/assets';
import { Plinth } from './Plinth';

/** Visuel principal sur socle + vignettes des vues complémentaires (si le catalogue en fournit). */
export function ProductViewer({ name, images }: { name: string; images: string[] }) {
  const [i, setI] = useState(0);
  const alts = images.map((_, k) => (k === 0 ? `${name}, vue principale` : `${name}, vue complémentaire ${k}`));
  return (
    <div>
      <div className="ga-lift">
        <Plinth key={images[i]} slug={images[i]} alt={alts[i]} niche priority ratio="1 / 1" base={0.18} inset={16} top={10} sizes="(min-width: 1024px) 55vw, 92vw" />
      </div>
      {images.length > 1 && (
        <ul className="mt-6 flex flex-wrap gap-3" aria-label="Autres vues">
          {images.map((s, k) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => setI(k)}
                aria-pressed={i === k}
                aria-label={alts[k]}
                className={`relative block h-20 w-20 border bg-ga-ivory transition-colors duration-500 ${i === k ? 'border-ga-ink' : 'border-transparent hover:border-ga-line'}`}
              >
                <Image src={img.product(s)} alt="" fill sizes="80px" className="object-contain p-2 mix-blend-multiply" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
