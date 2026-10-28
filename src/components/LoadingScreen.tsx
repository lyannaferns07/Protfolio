import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import s from './LoadingScreen.module.css';

interface Props {
  /** Ref to the page wrapper that lives behind the overlay. */
  pageRef: React.RefObject<HTMLDivElement | null>;
  /** Called once the exit transition has finished. */
  onComplete: () => void;
}

/**
 * Premium cinematic ivory + lavender loading screen.
 * Matches the editorial design specification:
 * 1. Monospaced [ LOADING ] label
 * 2. Newsreader serif "Lyann Fernandes" + 4-point lavender sparkle
 * 3. Monospaced "IDEAS → CODE → EXPERIENCES"
 * 4. Delicate glowing circular loader with rotating orbit
 * 5. Understated "JUST A MOMENT..." with horizontal divider lines
 *
 * Reveal Transition:
 * The loading curtain moves vertically UPWARD from 0 to -100vh,
 * while the landing page emerges synchronized FROM BELOW (80vh to 0).
 */
export function LoadingScreen({ pageRef, onComplete }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const page = pageRef.current;
    if (!overlay || !page) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;
    let exitStarted = false;

    // Lock scroll while the loader is displayed
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Synchronously offset the landing page so it never flashes in normal position
    gsap.set(page, { y: reduced ? 0 : '80vh', force3D: true });

    const ctx = gsap.context(() => {
      if (reduced) {
        // Fast, subtle fade for prefers-reduced-motion
        gsap.set(
          '.ls-grid, .ls-glow, .ls-label, .ls-name, .ls-sparkle, .ls-tagline, .ls-loaderWrap, .ls-bottom',
          { opacity: 1, y: 0 },
        );

        const timer = window.setTimeout(() => {
          if (cancelled) return;
          const exitTl = gsap.timeline({
            onComplete: () => {
              if (cancelled) return;
              gsap.set(overlay, { display: 'none', pointerEvents: 'none' });
              gsap.set(page, { clearProps: 'transform' });
              document.body.style.overflow = prevOverflow;
              ScrollTrigger.refresh();
              onComplete();
            },
          });
          exitTl.to(overlay, { opacity: 0, duration: 0.35 });
        }, 500);

        return () => window.clearTimeout(timer);
      }

      // Initial visual states
      gsap.set('.ls-grid', { opacity: 0 });
      gsap.set('.ls-glow', { opacity: 0, scale: 0.85 });
      gsap.set('.ls-label', { opacity: 0, y: 12 });
      gsap.set('.ls-name', { opacity: 0, y: 18 });
      gsap.set('.ls-sparkle', { opacity: 0, scale: 0.3, rotation: -30 });
      gsap.set('.ls-tagline', { opacity: 0, y: 12 });
      gsap.set('.ls-loaderWrap', { opacity: 0, y: 14 });
      gsap.set('.ls-bottom', { opacity: 0, y: 10 });

      // Continuous rotation for circular loader
      const rotateTween = gsap.to('.ls-loader', {
        rotation: 360,
        duration: 2.2,
        ease: 'none',
        repeat: -1,
      });

      // ── Refined Entrance Sequence ──
      const entrance = gsap.timeline({ defaults: { ease: 'power2.out' } });

      entrance
        .to('.ls-grid', { opacity: 1, duration: 0.75 }, 0)
        .to('.ls-glow', { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' }, 0.1)
        .to('.ls-label', { opacity: 1, y: 0, duration: 0.55 }, 0.2)
        .to('.ls-name', { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' }, 0.35)
        .to('.ls-sparkle', { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)' }, 0.65)
        .to('.ls-tagline', { opacity: 1, y: 0, duration: 0.55 }, 0.75)
        .to('.ls-loaderWrap', { opacity: 1, y: 0, duration: 0.55 }, 0.9)
        .to('.ls-bottom', { opacity: 1, y: 0, duration: 0.55 }, 1.05);

      const minDisplayTime = 1600; // ms
      const startTime = performance.now();

      const beginReveal = () => {
        if (cancelled || exitStarted) return;
        exitStarted = true;

        const revealDuration = 1.15; // smooth, cinematic pace

        const exitTl = gsap.timeline({
          defaults: { ease: 'power3.inOut' },
          onComplete: () => {
            if (cancelled) return;
            rotateTween.kill();
            gsap.set(overlay, { display: 'none', pointerEvents: 'none' });
            gsap.set(page, { clearProps: 'transform' });
            document.body.style.overflow = prevOverflow;
            ScrollTrigger.refresh();
            onComplete();
          },
        });

        // 1. Loading screen curtain moves UPWARD
        exitTl.to(
          overlay,
          {
            y: '-100vh',
            duration: revealDuration,
            ease: 'power3.inOut',
            force3D: true,
          },
          0,
        );

        // 2. Landing page rises FROM BELOW: translateY(80vh) -> translateY(0)
        exitTl.to(
          page,
          {
            y: 0,
            duration: revealDuration,
            ease: 'power3.inOut',
            force3D: true,
          },
          0,
        );

        // 3. Central composition gently softens as curtain lifts
        exitTl.to(
          '.ls-composition',
          {
            opacity: 0,
            y: -28,
            duration: revealDuration * 0.45,
            ease: 'power2.in',
          },
          0,
        );
      };

      // App readiness detection
      const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
      const domReady = new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', () => resolve(), { once: true });
      });

      Promise.all([fontsReady, domReady]).then(() => {
        if (cancelled) return;
        const elapsed = performance.now() - startTime;
        const remaining = Math.max(0, minDisplayTime - elapsed);
        window.setTimeout(() => {
          if (!cancelled) beginReveal();
        }, remaining);
      });

      // Safety timeout: starts reveal after 2.6s even if external resources stall
      window.setTimeout(() => {
        if (!cancelled && !exitStarted) beginReveal();
      }, 2600);
    }, overlay);

    return () => {
      cancelled = true;
      ctx.revert();
      gsap.set(page, { clearProps: 'transform' });
      document.body.style.overflow = prevOverflow;
    };
  }, [pageRef, onComplete]);

  return (
    <div
      ref={overlayRef}
      className={s.overlay}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className={`${s.grid} ls-grid`} aria-hidden="true" />
      <div className={`${s.glow} ls-glow`} aria-hidden="true" />

      <div className={`${s.composition} ls-composition`}>
        <span className={`${s.label} ls-label`}>[ LOADING ]</span>

        <div className={s.nameRow}>
          <span className={`${s.name} ls-name`}>Lyann</span>
          <span className={s.nameSpace}> </span>
          <span className={`${s.name} ls-name`}>Fernandes</span>
          <svg
            className={`${s.sparkle} ls-sparkle`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <span className={`${s.tagline} ls-tagline`}>
          IDEAS → CODE → EXPERIENCES
        </span>

        <div className={`${s.loaderWrap} ls-loaderWrap`}>
          <svg
            ref={loaderRef}
            className={`${s.loader} ls-loader`}
            viewBox="0 0 60 60"
            aria-hidden="true"
          >
            <circle
              className={s.loaderTrack}
              cx="30"
              cy="30"
              r="24"
            />
            <circle
              className={s.loaderArc}
              cx="30"
              cy="30"
              r="24"
            />
            <circle
              className={s.loaderOrbHalo}
              cx="47"
              cy="13"
              r="7"
            />
            <circle
              className={s.loaderOrb}
              cx="47"
              cy="13"
              r="3.5"
            />
          </svg>
        </div>

        <div className={`${s.bottom} ls-bottom`}>
          <span className={s.divider} aria-hidden="true" />
          <span className={s.bottomText}>JUST A MOMENT...</span>
          <span className={s.divider} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}