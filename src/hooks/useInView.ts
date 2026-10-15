import { useEffect, useRef, useState } from 'react';

/**
 * useInView — returns true once an element has entered the viewport.
 * Uses IntersectionObserver. Triggers once by default.
 */
export function useInView<T extends HTMLElement>(
  options: IntersectionObserverInit & { once?: boolean } = {}
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const { once = true, threshold = 0.15, rootMargin = '0px 0px -80px 0px', ...rest } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin, ...rest }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return { ref, inView };
}
