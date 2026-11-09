/** Icônes dessinées à la main — trait 1 px, sobres. */
type P = { className?: string; title?: string };
const base = (title?: string) => (title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true as const });

export function ArrowRight({ className = 'h-[10px] w-[22px]', title }: P) {
  return (
    <svg viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1" className={className} {...base(title)}>
      <path d="M0 5h21M16.5 .5 21 5l-4.5 4.5" />
    </svg>
  );
}
export function ArrowLeft({ className = 'h-[10px] w-[22px]', title }: P) {
  return (
    <svg viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1" className={className} {...base(title)}>
      <path d="M22 5H1M5.5 .5 1 5l4.5 4.5" />
    </svg>
  );
}
export function ArrowDown({ className = 'h-[22px] w-[10px]', title }: P) {
  return (
    <svg viewBox="0 0 10 22" fill="none" stroke="currentColor" strokeWidth="1" className={className} {...base(title)}>
      <path d="M5 0v21M.5 16.5 5 21l4.5-4.5" />
    </svg>
  );
}
export function Search({ className = 'h-5 w-5', title }: P) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className={className} {...base(title)}>
      <circle cx="8.5" cy="8.5" r="6.5" />
      <path d="m13.3 13.3 5.7 5.7" />
    </svg>
  );
}
export function Close({ className = 'h-5 w-5', title }: P) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className={className} {...base(title)}>
      <path d="m3 3 14 14M17 3 3 17" />
    </svg>
  );
}
export function Plus({ className = 'h-3 w-3', title }: P) {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1" className={className} {...base(title)}>
      <path d="M6 0v12M0 6h12" />
    </svg>
  );
}
export function Download({ className = 'h-4 w-4', title }: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" className={className} {...base(title)}>
      <path d="M8 1v10M4 7l4 4 4-4M1.5 14.5h13" />
    </svg>
  );
}
export function Expand({ className = 'h-4 w-4', title }: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" className={className} {...base(title)}>
      <path d="M1 6V1h5M10 1h5v5M15 10v5h-5M6 15H1v-5" />
    </svg>
  );
}
