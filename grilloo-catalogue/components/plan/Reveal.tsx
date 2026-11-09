'use client';
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useReveal } from '@/lib/hooks';

/** Enveloppe qui pose data-in="true" à l'entrée dans la vue : les classes pl-wipe / pl-rise / pl-draw / pl-dim réagissent. */
export function Reveal({
  as: Tag = 'div', className, style, children, threshold = 0.08, id, ...rest
}: {
  as?: ElementType; className?: string; style?: CSSProperties; children?: ReactNode; threshold?: number; id?: string;
  'aria-label'?: string; 'aria-labelledby'?: string; role?: string;
}) {
  const { ref, inView } = useReveal<HTMLElement>({ rootMargin: '0px 0px -8% 0px', threshold });
  return (
    <Tag ref={ref} id={id} data-in={inView ? 'true' : 'false'} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}
