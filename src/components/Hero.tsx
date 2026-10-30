import { useEffect, useRef, useState } from 'react';
import { profile, heroStats, type HeroStat } from '../data/config';
import { projects } from '../data/projects';
import { Icon } from './Icon';
import { BackgroundRippleEffect } from './ui/background-ripple-effect';
import { Compare } from './ui/compare';
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
  const strategicNotes = projects.find((p) => p.id === 'strategic-creative-notes') ?? projects[1] ?? projects[0];

  // Static paths for the comparison images (wireframe left, live site right)
  const wireframeImage = '/images/projects/scn-wireframe.jpg';
  const websiteImage = '/images/projects/scn-website.jpg';

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

          {/* ── Right Column: Interactive Aceternity UI Compare Visual ── */}
          <div className={`${s.columnVisual} ${s.staggerItem} ${s.delay2}`}>
            <div ref={visualRef} className={s.visualContainer}>
              <div className={s.compareFrame}>
                {/* Minimalist Editorial Window Header */}
                <div className={s.compareHeader}>
                  <div className={s.windowDots}>
                    <span className={`${s.windowDot} ${s.windowDotClose}`} />
                    <span className={`${s.windowDot} ${s.windowDotMin}`} />
                    <span className={`${s.windowDot} ${s.windowDotMax}`} />
                  </div>
                  <div className={s.compareUrl}>
                    <Icon name="compare_arrows" size={13} />
                    <span>wireframe ⟷ live site</span>
                  </div>
                  <span className={s.compareBadge}>Interactive</span>
                </div>

                {/* Aceternity UI Compare Slider */}
                <Compare
                  firstImage={wireframeImage}
                  secondImage={websiteImage}
                  firstImageAlt={`${strategicNotes.title} — wireframe design`}
                  secondImageAlt={`${strategicNotes.title} — live website`}
                  firstImageClassName="object-cover object-top"
                  secondImageClassname="object-cover object-top"
                  className={s.compareComponent}
                  slideMode="hover"
                  initialSliderPercentage={50}
                  showHandlebar={true}
                  showSparkles={true}
                  sparklesSide="first"
                  sparklesColor="#8A63D2"
                  firstImageLabel={
                    <span className={s.floatingBadge}>
                      <span className={s.badgeDotLavender} aria-hidden="true" />
                      <span className={s.badgeFull}>Wireframe · Before</span>
                      <span className={s.badgeShort}>Wireframe</span>
                    </span>
                  }
                  secondImageLabel={
                    <span className={s.floatingBadge}>
                      <span className={s.badgeDotGreen} aria-hidden="true" />
                      <span className={s.badgeFull}>Live Site · After</span>
                      <span className={s.badgeShort}>Live Site</span>
                    </span>
                  }
                />

                {/* Subtle Editorial Meta Strip */}
                <div className={s.compareFooter}>
                  <div className={s.compareFooterItem}>
                    <span className={s.badgeDotLavender} aria-hidden="true" />
                    <span className={s.footerFull}>Wireframe · Before</span>
                    <span className={s.footerShort}>Wireframe</span>
                  </div>
                  <div className={s.compareFooterHint}>
                    <Icon name="drag_indicator" size={13} />
                    <span className={s.footerFull}>Hover or drag to compare</span>
                    <span className={s.footerShort}>Hover to compare</span>
                  </div>
                  <div className={s.compareFooterItem}>
                    <span className={s.badgeDotGreen} aria-hidden="true" />
                    <span className={s.footerFull}>Live Site · After</span>
                    <span className={s.footerShort}>Live Site</span>
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