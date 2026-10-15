import { useEffect, useRef } from 'react';

interface RevealOptions {
  /** Translate Y offset to start from (px). Default: 60 */
  from?: number;
  /** Opacity start (0 = fade in). Default: undefined (no fade) */
  fade?: boolean;
  /** Delay before animation starts (s). Default: 0 */
  delay?: number;
  /** Duration (s). Default: 0.85 */
  duration?: number;
  /** CSS easing string. Default: var(--ease-mask) */
  easing?: string;
  /** Trigger animation on inView. Optional */
  inView?: boolean;
}

/**
 * useReveal — CSS-only slide-up reveal on mount.
 *
 * Attaches initial hidden state via inline style and triggers
 * the animation using a CSS transition after a tick.
 * Respects prefers-reduced-motion: with reduced motion the
 * element is immediately visible.
 */
export function useReveal<T extends HTMLElement>({
  from = 60,
  fade = false,
  delay = 0,
  duration = 0.85,
  easing = 'cubic-bezier(0.53, 0, 0.44, 1)',
}: RevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect user's motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.transform = 'none';
      el.style.opacity = '1';
      return;
    }

    // Set initial hidden state
    el.style.transform = `translateY(${from}px)`;
    if (fade) el.style.opacity = '0';
    el.style.transition = 'none';

    // Force reflow then animate
    const id = window.setTimeout(() => {
      el.style.transition = [
        `transform ${duration}s ${easing} ${delay}s`,
        fade ? `opacity ${duration}s ${easing} ${delay}s` : '',
      ]
        .filter(Boolean)
        .join(', ');
      el.style.transform = 'translateY(0)';
      if (fade) el.style.opacity = '1';
    }, 20);

    return () => window.clearTimeout(id);
  }, [from, fade, delay, duration, easing]);

  return ref;
}