import { useEffect, useRef, RefObject } from 'react';

/**
 * Lightweight hook to trigger reveal CSS transition when section enters viewport
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px'
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.classList.add('reveal-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    el.classList.add('reveal-init');
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return ref;
}

