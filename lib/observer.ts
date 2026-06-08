/**
 * Singleton IntersectionObserver for ScrollReveal.
 *
 * All ScrollReveal instances share a single observer so that pages with
 * 5-7+ reveal wrappers do not create redundant observers. Each instance
 * registers its element + callback; the shared callback dispatches to the
 * correct per-element handler.
 */

type RevealCallback = () => void;

let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, RevealCallback>();

function getOrCreateObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = callbacks.get(entry.target);
            if (cb) {
              cb();
              // Auto-clean: one-shot reveal — unobserve after first intersection
              observer?.unobserve(entry.target);
              callbacks.delete(entry.target);
            }
          }
        }
      },
      { threshold: 0.15 },
    );
  }
  return observer;
}

/**
 * Register an element with the shared observer.
 * On intersection the callback fires once and the element is auto-unobserved.
 */
export function observeElement(el: Element, onReveal: RevealCallback): void {
  callbacks.set(el, onReveal);
  getOrCreateObserver().observe(el);
}

/**
 * Unregister an element from the shared observer (e.g. on unmount).
 * Safe to call even if the element was already auto-unobserved.
 */
export function unobserveElement(el: Element): void {
  callbacks.delete(el);
  if (observer) {
    observer.unobserve(el);
  }
}

/**
 * Reset internal singleton state. For testing only.
 * Call between tests that stub `IntersectionObserver` to ensure a clean slate.
 */
export function __resetObserverForTest(): void {
  observer = null;
}

