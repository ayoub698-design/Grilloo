/** Icônes au trait (1,25 px), dessinées à la main pour l'orientation « Plan ». */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 16) => ({
  width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.25, strokeLinecap: 'square' as const, 'aria-hidden': true,
});

export const IArrow = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M2 8h11M9.5 4.5 13 8l-3.5 3.5" /></svg>);
export const IArrowLeft = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M14 8H3M6.5 4.5 3 8l3.5 3.5" /></svg>);
export const IArrowUpRight = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M4.5 11.5l7-7M5.5 4.5h6v6" /></svg>);
export const IDownload = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M8 2v8.5M4.5 7 8 10.5 11.5 7M2.5 13.5h11" /></svg>);
export const IPlus = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M8 3v10M3 8h10" /></svg>);
export const IClose = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>);
export const ISearch = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><circle cx="7" cy="7" r="4.25" /><path d="M10.2 10.2 13.5 13.5" /></svg>);
export const IGrid = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M2.5 2.5h4.5v4.5H2.5zM9 2.5h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z" /></svg>);
export const ITable = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M2 3.5h12M2 6.5h12M2 9.5h12M2 12.5h12M5 2v12" /></svg>);
export const IMenu = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M2 5h12M2 11h12" /></svg>);
export const IExpand = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" /></svg>);
export const ICheck = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><path d="M3 8.5l3 3 7-7" /></svg>);
export const INorth = ({ size, ...p }: P) => (<svg {...base(size)} {...p}><circle cx="8" cy="8" r="6.5" /><path d="M8 3.5 10 11 8 9.5 6 11z" fill="currentColor" stroke="none" /></svg>);

/** Pointe de flèche de cote (pleine). */
export const Arrowhead = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 9 7" className={className} aria-hidden="true"><path d="M0 3.5 9 0v7z" fill="currentColor" /></svg>
);
