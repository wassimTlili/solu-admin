/* eslint-disable @next/next/no-img-element -- a tiny static SVG, no optimisation needed */

/**
 * The Solu orange-slice mark, generated from the app's own logo geometry
 * (solu-mobile src/components/brand/soluLogoGeometry.ts) into public/solu-mark.svg.
 */
export function SoluMark({ className }: { className?: string }) {
  return <img src="/solu-mark.svg" alt="" aria-hidden="true" className={className} />;
}
