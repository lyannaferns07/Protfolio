import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { credentials, capabilityIndex } from '../data/config';
import { Icon } from './Icon';
import s from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    // Respect prefers-reduced-motion
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(
        el.querySelectorAll(
          '[data-reveal-text], [data-reveal-photo], [data-reveal-card], [data-reveal-cap]'
        ),
        { opacity: 1, y: 0, scale: 1, clearProps: 'all' }
      );
    });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Row A text reveals (eyebrow, heading, pullquote)
      const textEls = el.querySelectorAll('[data-reveal-text]');
      if (textEls.length > 0) {
        gsap.fromTo(
          textEls,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el.querySelector(`.${s.rowA}`),
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 2. Photo reveal (gentle 1.04 -> 1 scale + soft fade)
      const photoEl = el.querySelector('[data-reveal-photo]');
      if (photoEl) {
        gsap.fromTo(
          photoEl,
          { opacity: 0, scale: 1.04 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.95,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: photoEl,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3. Right column cards & items stagger in (~80ms apart)
      const cardEls = el.querySelectorAll('[data-reveal-card]');
      if (cardEls.length > 0) {
        gsap.fromTo(
          cardEls,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardEls[0],
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 4. Row C technical capability cards stagger in (~80ms apart)
      const capCards = el.querySelectorAll('[data-reveal-cap]');
      if (capCards.length > 0) {
        gsap.fromTo(
          capCards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el.querySelector(`.${s.rowC}`),
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section id="about" className={s.root} aria-labelledby="about-heading" ref={rootRef}>
      <div className={s.inner}>
        {/* ── ROW A: Intro Header (full width) ────────────────── */}
        <header className={s.rowA}>
          <div className={s.headerText} data-reveal-text>
            <span className={s.eyebrow}>Philosophy &amp; Mindset</span>
            <h2 id="about-heading" className={s.heading}>
              Balancing algorithmic rigor with typographic grace.
            </h2>
          </div>

          <div className={s.headerQuoteWrap} data-reveal-text>
            <blockquote className={s.pullquote}>
              <p>&ldquo;Honesty in code, poise in typography.&rdquo;</p>
            </blockquote>
          </div>
        </header>

        {/* ── ROW B: Main Two-Column Split ────────────────────── */}
        <div className={s.rowB}>
          {/* LEFT COLUMN: Sticky Portrait & Lighthouse Badge (5 cols) */}
          <div className={s.leftCol}>
            <div className={s.stickyContainer}>
              <div className={s.portraitWrapper} data-reveal-photo>
                <div className={s.portraitBackdrop} aria-hidden="true" />
                <figure className={s.portraitFigure}>
                  <div className={s.portraitImgWrap}>
                    <img
                      src="/assets/lyann-portrait.png"
                      alt="Portrait of Lyann Fernandes"
                      width={843}
                      height={920}
                      loading="lazy"
                      decoding="async"
                      className={s.portraitImg}
                    />
                  </div>
                  <figcaption className={s.portraitCaption}>
                    FIG. 01 / LYANN FERNANDES — MUMBAI, IN
                  </figcaption>
                </figure>
              </div>

              <div className={s.badgeCard} data-reveal-card>
                <Icon name="verified" size={18} className={s.badgeCardIcon} />
                <div>
                  <p className={s.badgeCardTitle}>100% Lighthouse Performance</p>
                  <p className={s.badgeCardSub}>Standard bench on all custom builds</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Narrative Card, Body Paragraph, Credentials (7 cols) */}
          <div className={s.rightCol}>
            {/* 1. Narrative Card */}
            <div className={s.narrative} data-reveal-card>
              <h3 className={s.narrativeTitle}>Engineering from Mumbai for the Web</h3>
              <p className={s.body}>
                Currently completing my BSc in Computer Science at the University of Mumbai, I build
                interfaces that refuse to compromise. My academic grounding in algorithmic efficiency,
                computational logic, and memory constraints informs how I architect modern web
                layouts.
              </p>
              <p className={s.body}>
                I believe in zero-bloat web craft, accessible semantic primitives, and honoring the
                fluid nature of browsers across diverse networks and screen formats.
              </p>
            </div>

            {/* 2. Philosophy & Mindset Body Paragraph */}
            <div className={s.paragraphBlock} data-reveal-card>
              <p className={s.body}>
                Every interface is both a visual surface and a mechanical computational artifact. I
                approach software engineering with an architect&rsquo;s restraint: no superfluous
                dependencies, clean document object structures, and an obsessive focus on performance
                under constrained conditions.
              </p>
            </div>

            {/* 3. Credentials & Profile Status Table */}
            <div
              className={s.table}
              role="region"
              aria-label="Credentials & Profile Status"
              data-reveal-card
            >
              <div className={s.tableHead}>
                <span className={s.tableHeadLabel}>Credentials &amp; Profile Status</span>
                <span className={s.tableHeadMeta}>[ Verified ]</span>
              </div>
              <dl className={s.tableBody}>
                {credentials.map((row) => (
                  <div key={row.key} className={s.tableRow}>
                    <dt className={s.tableKey}>{row.key}</dt>
                    <dd className={`${s.tableValue} ${row.emphasis ? s.tableValueAccent : ''}`}>
                      {row.emphasis && <span className={s.availabilityDot} aria-hidden="true" />}
                      <span>{row.value}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* ── ROW C: Technical Capabilities (full width) ──────── */}
        <div className={s.rowC}>
          <p className={s.indexLabel} data-reveal-cap>
            Technical Capabilities &amp; Under the Hood
          </p>
          <div className={s.indexGrid}>
            {capabilityIndex.map((col) => (
              <div key={col.id} className={s.indexCard} data-reveal-cap>
                <p className={s.indexTitle}>
                  {col.id} / {col.title}
                </p>
                <ul className={s.indexList}>
                  {col.items.map((item) => (
                    <li key={item} className={s.indexItem}>
                      <span className={s.bullet} aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}