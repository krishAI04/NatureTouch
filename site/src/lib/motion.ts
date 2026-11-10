// One motion entry point for the whole site.
// Under prefers-reduced-motion: no Lenis, no pins, no scrubs — sections fall back to static layouts.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
export const motionOK = () => !reduceQuery.matches;

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  document.documentElement.classList.toggle('reduce', !motionOK());
  if (!motionOK() || lenis) return lenis;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

/** Header hides on scroll down, returns on scroll up; solid once past the first screen. */
export function initHeader(bar: HTMLElement) {
  let last = window.scrollY;
  const solidAt = document.querySelector('[data-dark-hero]') ? window.innerHeight * 0.5 : 24;
  const onScroll = () => {
    const y = window.scrollY;
    bar.classList.toggle('is-solid', y > solidAt);
    if (Math.abs(y - last) > 6) {
      bar.classList.toggle('is-hidden', y > last && y > window.innerHeight * 0.3);
      last = y;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  bar.addEventListener('focusin', () => bar.classList.remove('is-hidden'));
  onScroll();
}

// If the user flips reduced motion while the page is open, reload into the right mode.
reduceQuery.addEventListener('change', () => window.location.reload());

export { gsap, ScrollTrigger };
