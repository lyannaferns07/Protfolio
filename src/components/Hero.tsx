import { useEffect, useRef } from 'react';
import { profile, heroStats } from '../data/config';
import { Icon } from './Icon';
import s from './Hero.module.css';

/**
 * Hero section.
 *
 * Motion: each block fades and rises once on mount, staggered.
 * Reduced motion: everything is visible immediately, no transitions.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-hero]'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      items.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
    });

    const timers = items.map((el, i) =>
      window.setTimeout(() => {
        el.style.transition = 'opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 60 * i + 80)
    );

    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <section id="home" ref={rootRef} className={s.root} aria-label="Introduction">
      {/* Fine 40px grid, per the Stitch design */}
      <div className={s.grid} aria-hidden="true" />

      <div className={s.inner}>
        {/* Eyebrow pill + build stamp */}
        <div className={s.eyebrowRow} data-hero>
          <span className={s.eyebrowPill}>
            {profile.role} — {profile.locationLine}
          </span>
          <span className={s.buildStamp}>
            <Icon name="terminal" size={14} />
            {profile.buildStamp}
          </span>
        </div>

        {/* Editorial serif headline */}
        <h1 className={s.headline} data-hero>
          {profile.headline}
        </h1>

        <p className={s.tagline} data-hero>
          {profile.tagline}
        </p>

        {/* CTAs */}
        <div className={s.ctas} data-hero>
          <a href="#workshop" className={s.ctaPrimary}>
            {profile.ctaPrimary}
            <Icon name="arrow_downward" size={16} />
          </a>
          <a href="#contact" className={s.ctaSecondary}>
            {profile.ctaSecondary}
            <Icon name="arrow_outward" size={16} />
          </a>
        </div>

        {/* Hairline-delimited metadata stats */}
        <div className={s.stats} data-hero>
          {heroStats.map((stat) => (
            <div key={stat.label} className={s.stat}>
              <p className={s.statLabel}>{stat.label}</p>
              <p className={s.statValue}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}