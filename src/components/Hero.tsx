import { useEffect, useRef, useState } from 'react';
import { profile, heroStats, type HeroStat } from '../data/config';
import { projects } from '../data/projects';
import { Icon } from './Icon';
import { BackgroundRippleEffect } from './ui/background-ripple-effect';
import s from './Hero.module.css';

/**
 * Editorial Landing Hero Section
 *
 * Asymmetric two-column composition combining quiet luxury,
 * editorial typography, and a layered digital project visual.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Retrieve project data from real projects config
  const elephantGrey = projects.find((p) => p.id === 'elephant-grey') ?? projects[0];
  const cerco = projects.find((p) => p.id === 'cerco') ?? projects[1] ?? projects[0];

  // ── Entrance animation trigger ─────────────────────────────
  useEffect(() => {
    // Trigger staggered reveal after a slight tick for clean mount
    const timer = setTimeout(() => {
      setMounted(true);
    }, 60);

    return () => clearTimeout(timer);
  }, []);

  // ── Pointer-Responsive Parallax + Grid Glow (shared RAF) ──────
  useEffect(() => {
    const root = rootRef.current;
    const visual = visualRef.current;
    const grid = gridRef.current;
    if (!root) return;

    // Glow is only driven by a fine pointer; skip on touch devices
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    // Glow state — raw cursor position in px relative to root
    let glowRawX = -9999;
    let glowRawY = -9999;
    let glowCurrentX = -9999;
    let glowCurrentY = -9999;
    let isInside = false;

    // Parallax state (unchanged)
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();

      // Glow: absolute px inside the section
      glowRawX = e.clientX - rect.left;
      glowRawY = e.clientY - rect.top;
      isInside = true;

      if (!visual) return;
      // Parallax: normalised -1..1
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      targetX = Math.max(-1, Math.min(1, (e.clientX - rect.left - centerX) / centerX));
      targetY = Math.max(-1, Math.min(1, (e.clientY - rect.top - centerY) / centerY));
    };

    const onMouseLeave = () => {
      isInside = false;
      targetX = 0;
      targetY = 0;
    };

    const tick = () => {
      // ── Parallax ────────────────────────────────────────────
      if (visual && !prefersReducedMotion && hasFinePointer) {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        visual.style.setProperty('--px', currentX.toFixed(4));
        visual.style.setProperty('--py', currentY.toFixed(4));
      }

      // ── Grid cursor glow ────────────────────────────────────
      if (grid && hasFinePointer && !prefersReducedMotion) {
        const rect = root.getBoundingClientRect();
        const targetGlowX = isInside ? glowRawX : -9999;
        const targetGlowY = isInside ? glowRawY : -9999;

        // Lerp the glow position so it trails slightly behind the cursor
        glowCurrentX += (targetGlowX - glowCurrentX) * 0.12;
        glowCurrentY += (targetGlowY - glowCurrentY) * 0.12;

        const pctX = ((glowCurrentX / rect.width) * 100).toFixed(2);
        const pctY = ((glowCurrentY / rect.height) * 100).toFixed(2);
        const opacity = isInside ? '1' : '0';

        grid.style.setProperty('--glow-x', `${pctX}%`);
        grid.style.setProperty('--glow-y', `${pctY}%`);
        grid.style.setProperty('--glow-opacity', opacity);
      }

      rafId = requestAnimationFrame(tick);
    };

    root.addEventListener('mousemove', onMouseMove, { passive: true });
    root.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      root.removeEventListener('mousemove', onMouseMove);
      root.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="home"
      ref={rootRef}
      className={`${s.root} ${mounted ? s.mounted : ''}`}
      aria-label="Introduction"
    >
      {/* 40px hairline grid texture + cursor glow */}
      <div ref={gridRef} className={s.grid} aria-hidden="true" />

      {/* Lavender ripple interaction — Aceternity UI BackgroundRippleEffect
          transparent overlay aligned to the 40px CSS grid; invisible at rest,
          animates quiet-luxury lavender ripples on cursor movement or click */}
      <BackgroundRippleEffect parentRef={rootRef} cellSize={40} />

      {/* Warm champagne ambient illumination */}
      <div className={s.ambientLight} aria-hidden="true" />

      <div className={s.inner}>
        <div className={s.mainLayout}>
          {/* ── Left Column: Editorial Headline & Copy ──────── */}
          <div className={s.columnContent}>
            {/* Eyebrow metadata row */}
            <div className={`${s.eyebrowRow} ${s.staggerItem} ${s.delay1}`}>
              <span className={s.rolePill}>{profile.role}</span>
              <span className={s.statusPill}>
                <span className={s.statusDot} aria-hidden="true" />
                {profile.availability}
              </span>
              <span className={s.locationPill}>
                <Icon name="location_on" size={13} />
                {profile.locationLine}
              </span>
            </div>

            {/* Editorial Serif Display Headline with Staggered Reveal */}
            <h1
              className={`${s.headline} ${mounted ? s.visible : s.hidden}`}
              aria-label="I turn ideas into digital experiences."
            >
              <span className={s.revealLine}>
                <span className={s.revealInner} style={{ transitionDelay: '0.12s' }}>
                  I turn ideas
                </span>
              </span>
              <span className={s.revealLine}>
                <span className={s.revealInner} style={{ transitionDelay: '0.24s' }}>
                  into digital
                </span>
              </span>
              <span className={s.revealLine}>
                <span className={s.revealInner} style={{ transitionDelay: '0.36s' }}>
                  <em className={s.italicAccent}>experiences.</em>
                </span>
              </span>
            </h1>

            {/* Concise Introduction */}
            <p className={`${s.tagline} ${s.staggerItem} ${s.delay3}`}>
              {profile.tagline}
            </p>

            {/* Refined CTAs */}
            <div className={`${s.ctas} ${s.staggerItem} ${s.delay4}`}>
              <a href="#workshop" className={s.ctaPrimary}>
                <span>{profile.ctaPrimary}</span>
                <Icon name="arrow_downward" size={16} className={s.ctaIconDown} />
              </a>
              <a href="#contact" className={s.ctaSecondary}>
                <span>{profile.ctaSecondary}</span>
                <Icon name="arrow_outward" size={16} className={s.ctaIconOut} />
              </a>
            </div>

            {/* Minimalist stack spec row */}
            <div className={`${s.techPills} ${s.staggerItem} ${s.delay5}`}>
              <span className={s.techPillLabel}>Core Focus:</span>
              <span className={s.techPill}>React 19</span>
              <span className={s.techPill}>TypeScript</span>
              <span className={s.techPill}>Tailwind CSS</span>
              <span className={s.techPill}>AI Integration</span>
            </div>
          </div>

          {/* ── Right Column: Layered Project Windows Visual ── */}
          <div className={`${s.columnVisual} ${s.staggerItem} ${s.delay2}`}>
            <div ref={visualRef} className={s.visualContainer}>
              {/* Restrained architectural geometry graphic */}
              <svg
                className={s.ambientGraphic}
                viewBox="0 0 540 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Concentric coordinate rings — the outer ring keeps the
                    champagne grounding, the inner pair carry the lavender */}
                <circle
                  cx="280"
                  cy="250"
                  r="210"
                  style={{ stroke: 'var(--secondary)' }}
                  strokeWidth="0.8"
                  strokeDasharray="4 8"
                  opacity="0.3"
                />
                <circle
                  cx="280"
                  cy="250"
                  r="150"
                  style={{ stroke: 'var(--lavender-accent)' }}
                  strokeWidth="0.8"
                  opacity="0.35"
                />
                <circle
                  cx="280"
                  cy="250"
                  r="85"
                  style={{ stroke: 'var(--lavender-accent)' }}
                  strokeWidth="0.6"
                  strokeDasharray="2 6"
                  opacity="0.5"
                />

                {/* Fine crosshairs & framing lines */}
                <line
                  x1="70"
                  y1="250"
                  x2="490"
                  y2="250"
                  style={{ stroke: 'var(--border-light)' }}
                  strokeWidth="1"
                  strokeDasharray="8 12"
                  opacity="0.6"
                />
                <line
                  x1="280"
                  y1="40"
                  x2="280"
                  y2="460"
                  style={{ stroke: 'var(--border-light)' }}
                  strokeWidth="1"
                  strokeDasharray="8 12"
                  opacity="0.6"
                />

                {/* Subtle corner ticks */}
                <path d="M 40 40 L 60 40 M 40 40 L 40 60" style={{ stroke: 'var(--lavender-accent)' }} strokeWidth="1" opacity="0.5" />
                <path d="M 500 40 L 480 40 M 500 40 L 500 60" style={{ stroke: 'var(--lavender-accent)' }} strokeWidth="1" opacity="0.5" />
                <path d="M 40 460 L 60 460 M 40 460 L 40 440" style={{ stroke: 'var(--lavender-accent)' }} strokeWidth="1" opacity="0.5" />
                <path d="M 500 460 L 480 460 M 500 460 L 500 440" style={{ stroke: 'var(--lavender-accent)' }} strokeWidth="1" opacity="0.5" />
              </svg>

              {/* ── Secondary Layered Window: Cerco Project ──── */}
              <div className={s.secondaryWindow}>
                <div className={s.windowBar}>
                  <div className={s.windowDots}>
                    <span className={`${s.windowDot} ${s.windowDotClose}`} />
                    <span className={`${s.windowDot} ${s.windowDotMin}`} />
                    <span className={`${s.windowDot} ${s.windowDotMax}`} />
                  </div>
                  <div className={s.windowUrl}>
                    <Icon name={cerco.frameIcon || 'tune'} size={11} />
                    <span>{cerco.frameUrl}</span>
                  </div>
                  <span className={s.windowBadge}>{cerco.discipline}</span>
                </div>
                <div className={s.windowBody}>
                  <img
                    src={cerco.mockup}
                    alt={cerco.mockupAlt}
                    className={s.windowImg}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>

              {/* ── Primary Prominent Window: Elephant Grey ──── */}
              <div className={s.primaryWindow}>
                <div className={s.windowBar}>
                  <div className={s.windowDots}>
                    <span className={`${s.windowDot} ${s.windowDotClose}`} />
                    <span className={`${s.windowDot} ${s.windowDotMin}`} />
                    <span className={`${s.windowDot} ${s.windowDotMax}`} />
                  </div>
                  <div className={s.windowUrl}>
                    <Icon name={elephantGrey.frameIcon || 'lock'} size={11} />
                    <span>{elephantGrey.frameUrl}</span>
                  </div>
                  <span className={s.windowBadge}>01 / Client Flagship</span>
                </div>
                <div className={s.windowBody}>
                  <img
                    src={elephantGrey.mockup}
                    alt={elephantGrey.mockupAlt}
                    className={s.windowImg}
                    loading="eager"
                    decoding="async"
                  />
                  <a
                    href="#workshop"
                    className={s.windowOverlay}
                    aria-label={`View ${elephantGrey.title} case study in Workshop`}
                  >
                    <span className={s.overlayText}>
                      Explore Case Study
                      <Icon name="arrow_forward" size={14} />
                    </span>
                  </a>
                </div>
              </div>

              {/* ── Floating Technical Telemetry Card ───────── */}
              <div className={s.floatingCard}>
                <div className={s.floatingCardHeader}>
                  <span className={s.floatingCardTitle}>
                    <Icon name="terminal" size={13} />
                    Frontend Rigor
                  </span>
                  <span className={s.metricBadge}>Verified</span>
                </div>
                <div className={s.floatingMetrics}>
                  <div className={s.metricItem}>
                    <span className={s.metricKey}>Lighthouse Perf</span>
                    <span className={s.metricVal}>100 / 100</span>
                  </div>
                  <div className={s.metricItem}>
                    <span className={s.metricKey}>Type Safety</span>
                    <span className={s.metricVal}>Strict TypeScript</span>
                  </div>
                  <div className={s.metricItem}>
                    <span className={s.metricKey}>Interaction</span>
                    <span className={s.metricVal}>Spring Dynamics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metadata Stats Rail (Refined Transition into Workshop) ── */}
      <div className={s.statsRail}>
        <div className={s.statsInner}>
          {heroStats.map((stat: HeroStat, index: number) => (
            <div key={stat.label} className={s.statCell}>
              <span className={s.statIndex}>{String(index + 1).padStart(2, '0')} //</span>
              <span className={s.statLabel}>{stat.label}</span>
              <span className={s.statValue}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}