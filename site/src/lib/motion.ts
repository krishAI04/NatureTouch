// One motion entry point for the whole site.
// Under prefers-reduced-motion: no Lenis, no pins, no scrubs — sections fall back to static layouts.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// phones: the address bar showing/hiding must not re-measure pinned scenes mid-scroll (that is what makes them jump)
ScrollTrigger.config({ ignoreMobileResize: true });

/** Touch screens scroll natively: pin with position fixed so the browser holds the scene steady.
 *  With Lenis (mouse and trackpad) scrolling is driven by JS, and transform pinning stays in step with it. */
export const pinTypeFor = (): 'fixed' | 'transform' => (window.matchMedia('(pointer: coarse)').matches ? 'fixed' : 'transform');

export const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
export const motionOK = () => !reduceQuery.matches;

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  document.documentElement.classList.toggle('reduce', !motionOK());
  if (!motionOK() || lenis) return lenis;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  if (document.documentElement.classList.contains('pl-wait')) lenis.stop(); // the homepage gateway starts it again
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

// the homepage gateway (PreloaderScript.astro) has opened: scrolling resumes and pinned scenes re-measure
window.addEventListener('nt:gate-open', () => { lenis?.start(); ScrollTrigger.refresh(); });

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
