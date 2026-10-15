import { useEffect, useRef } from 'react';

type Options = {
  /** Element that defines the pinned range. */
  container: React.RefObject<HTMLElement | null>;
  /** Called with 0..1 progress as the container scrolls through the viewport. */
  onProgress: (p: number) => void;
  /** Re-run when any of these change. */
  deps?: unknown[];
};

/**
 * Reports 0..1 progress across a tall container's scroll span.
 *
 * Everything runs in one shared rAF loop reading `scrollY`, and the callback
 * writes straight to the DOM, so scrolling never triggers a React render.
 * Progress is computed from cached measurements refreshed on resize, which
 * avoids layout thrash during scroll.
 */
export function useScrollProgress({ container, onProgress, deps = [] }: Options) {
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    let metrics = { top: 0, span: 1 };
    let frame = 0;
    let last = -1;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      // Scrollable distance the container offers: from the point its top edge
      // reaches the viewport top, until its bottom edge reaches the viewport top.
      metrics = { top, span: Math.max(1, el.offsetHeight - window.innerHeight) };
    };

    const tick = () => {
      const y = window.scrollY;
      if (y !== last) {
        last = y;
        const p = Math.min(1, Math.max(0, (y - metrics.top) / metrics.span));
        cb.current(p);
      }
      frame = requestAnimationFrame(tick);
    };

    measure();
    frame = requestAnimationFrame(tick);

    // Re-measure on resize and after fonts/images settle, since the container
    // height depends on both.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, ...deps]);
}