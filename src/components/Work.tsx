import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, type Project } from '../data/projects';
import { ProjectModal } from './ProjectModal';
import { Icon } from './Icon';
import s from './Work.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Timeline rhythm in abstract scroll units.
 *
 * The sticky stage is pinned for the height of the tall wrapper, and
 * the master timeline maps that range onto these units, so pacing
 * scales with viewport height.
 *
 * HOLD       — the settled card rests full-screen before the next moves
 * TRANS      — one card slides in from beyond the right edge, overlapping
 * FINAL_HOLD — the final card rests before the pin releases
 */
const HOLD = 0.5;
const TRANS = 1;
const FINAL_HOLD = 0.8;

export function Work() {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [currentIndex, setCurrentIndex] = useState(1);

  const wrapperRef = useRef<HTMLElement>(null);
  const stageAreaRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const activeRef = useRef(1);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stageArea = stageAreaRef.current;
    if (!wrapper || !stageArea) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ── Desktop: pinned overlapping deck ───────────────────────
         Requires >= 1024px: below that the split card has no room
         for two columns and the deck would show a mockup with no
         text, so those widths use the stacked layout instead.
      ──────────────────────────────────────────────────────── */
      mm.add(
        '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        () => {
          const cards = cardRefs.current.filter(Boolean) as HTMLLIElement[];
          const total = cards.length;
          const totalUnits = (total - 1) * (HOLD + TRANS) + FINAL_HOLD;

          // Park each card one full stage-width beyond the right edge.
          // A function value keeps this correct across resizes.
          const parkX = () => stageArea.offsetWidth;

          // Card 0 starts centred and visible; every later card is parked
          // one full stage-width beyond the right edge.
          gsap.set(cards, { x: 0, scale: 1, filter: 'brightness(1)', transformOrigin: 'center center' });
          gsap.set(cards.slice(1), { x: parkX });
          gsap.set('[data-reveal], [data-reveal-tech]', { opacity: 0, y: 16 });
          gsap.set('[data-reveal-media]', { opacity: 0, xPercent: 6, scale: 1.06 });
          gsap.set('[data-live]', { opacity: 0, y: 14 });

          /* Intro: header + first card + its live link, on entry */
          const intro = gsap.timeline({
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          });
          intro
            .fromTo(
              '[data-intro]',
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out' },
              0
            )
            .fromTo(
              '[data-first-card]',
              { opacity: 0, y: 34 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
              0.1
            )
            .fromTo(
              '[data-first-card] [data-reveal], [data-first-card] [data-reveal-tech]',
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
              0.25
            )
            .fromTo(
              '[data-first-card] [data-live]',
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
              0.7
            );

          /* Master scrubbed timeline — vertical scroll drives arrival */
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: wrapper,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const time = self.progress * totalUnits;

                if (progressFillRef.current) {
                  progressFillRef.current.style.width = `${(self.progress * 100).toFixed(2)}%`;
                }

                if (hintRef.current) {
                  hintRef.current.style.opacity = String(Math.max(0, 1 - self.progress / 0.05));
                }

                // The topmost card once it is fully arrived
                let active = 1;
                for (let i = 1; i < total; i++) {
                  if (time >= i * (HOLD + TRANS) - TRANS * 0.5) active = i + 1;
                }
                if (active !== activeRef.current) {
                  activeRef.current = active;
                  setCurrentIndex(active);
                }
              },
            },
          });

          let t = 0;
          for (let i = 1; i < total; i++) {
            const card = cards[i];
            // The current card rests for HOLD, then the next one travels
            // for TRANS. Advancing by both keeps the hand-off sequential.
            t += HOLD;

            // 1. Slide in from beyond the right edge → settle, overlapping
            tl.fromTo(card, { x: parkX }, { x: 0, duration: TRANS, ease: 'power2.inOut' }, t);

            // 2. Cards beneath recede (depth) as they are covered
            tl.to(
              cards.slice(0, i),
              { scale: 0.94, filter: 'brightness(0.72)', duration: TRANS * 0.9, ease: 'power2.out' },
              t
            );

            // 3. Content reveal: preview → text → tech → live link
            const revealAt = t + TRANS * 0.5;
            tl.to(
              card.querySelectorAll('[data-reveal-media]'),
              { opacity: 1, scale: 1, xPercent: 0, duration: 0.7, ease: 'power2.out' },
              revealAt
            );
            tl.to(
              card.querySelectorAll('[data-reveal]'),
              { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out' },
              revealAt + 0.05
            );
            tl.to(
              card.querySelectorAll('[data-reveal-tech]'),
              { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' },
              revealAt + 0.25
            );
            tl.to(
              card.querySelectorAll('[data-live]'),
              { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
              revealAt + 0.45
            );

            t += TRANS;
          }

          // Rest on the final card before the pin releases, so the
          // timeline length matches totalUnits used by the counter.
          tl.to({ _pad: 0 }, { _pad: 1, duration: FINAL_HOLD, ease: 'none' }, t);

          return () => {
            document.body.style.overflowX = '';
          };
        }
      );

      /* ── Tablet / mobile: vertical stack + gentle reveal ─────── */
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const cards = cardRefs.current.filter(Boolean) as HTMLLIElement[];
        gsap.set(cards, { clearProps: 'transform,opacity,filter' });

        const ctxInner = gsap.context(() => {
          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' },
              }
            );
          });
        }, stageArea);
        return () => ctxInner.revert();
      });

      /* ── Reduced motion: static stack, no animation at all ──── */
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          '[data-intro], [data-first-card], [data-live], [data-card], [data-reveal], [data-reveal-media], [data-reveal-tech]',
          { clearProps: 'all' }
        );
        if (hintRef.current) hintRef.current.style.opacity = '1';
        if (progressFillRef.current) progressFillRef.current.style.width = '0%';
      });
    }, wrapper);

    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  /* Lock page scroll while the case-study modal is open */
  useEffect(() => {
    document.body.style.overflow = openProject ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openProject]);

  useEffect(() => {
    if (!openProject) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenProject(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openProject]);

  return (
    <section
      id="workshop"
      ref={wrapperRef}
      className={s.section}
      aria-labelledby="workshop-heading"
    >
      <div className={s.stage}>
        {/* ── Section header ─────────────────────────────────── */}
        <header className={s.header}>
          <div className={s.headerLeft}>
            <span className={s.eyebrow} data-intro>
              [ Workshop Index 2024–2025 ]
            </span>
            <h2 id="workshop-heading" className={s.title} data-intro>
              WHAT I BUILT
            </h2>
          </div>
          <div className={s.headerRight} data-intro>
            <p className={s.subtitle}>
              Digital experiences, thoughtful solutions, and experiments at the intersection of
              design and technology.
            </p>
            <span className={s.counter} aria-live="polite">
              {String(currentIndex).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
            <span ref={hintRef} className={s.scrollHint} aria-hidden="true">
              Scroll to explore <span className={s.hintArrow}>↓</span>
            </span>
          </div>
        </header>

        {/* ── Overlapping card deck ────────────────────────────
            Cards are position:absolute, identically sized and
            centred. GSAP parks each beyond the right edge and
            slides it in on vertical scroll, layering above the
            previous card via z-index. The stage clips the parked
            cards, so the page never scrolls horizontally.
        ────────────────────────────────────────────────────── */}
        <div ref={stageAreaRef} className={s.cardStageArea}>
          <ul className={s.cardStack} role="list" aria-label="Workshop project presentations">
            {projects.map((project, index) => {
              const isFirst = index === 0;
              return (
                <li
                  key={project.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={s.card}
                  data-card
                  data-first-card={isFirst ? true : undefined}
                  style={{ zIndex: index + 1 }}
                >
                  <div className={s.cardGrid}>
                    {/* Left — narrative + technical detail */}
                    <div className={s.cardNarrative}>
                      <div>
                        <div className={s.badgeRow}>
                          <span className={s.badge}>{project.badge}</span>
                          <span className={s.discipline}>{project.discipline}</span>
                        </div>

                        <h3 className={s.cardTitle} data-reveal>
                          {project.title}
                        </h3>
                        <p className={s.cardScope} data-reveal>
                          Scope: {project.scope}
                        </p>
                        <p className={s.cardBlurb} data-reveal>
                          {project.tagline}
                        </p>
                      </div>

                      <div>
                        <ul className={s.techList}>
                          {project.technologies.map((tech) => (
                            <li key={tech} className={s.tech} data-reveal-tech>
                              {tech}
                            </li>
                          ))}
                        </ul>

                        {/* Primary action: live site when one exists,
                            otherwise open the case study modal. */}
                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={s.actionLink}
                            data-live
                          >
                            Live Website
                            <Icon name="arrow_outward" size={16} />
                          </a>
                        ) : (
                          <button
                            type="button"
                            className={s.actionLink}
                            data-live
                            onClick={() => setOpenProject(project)}
                            aria-label={`Open the ${project.title} case study`}
                          >
                            Read Case Study
                            <Icon name="arrow_forward" size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right — mockup canvas in a browser frame */}
                    <div className={s.cardCanvas}>
                      <div className={s.frame}>
                        <div className={s.frameBar}>
                          <span className={s.dots} aria-hidden="true">
                            <i />
                            <i />
                            <i />
                          </span>
                          <span className={s.frameUrl}>{project.frameUrl}</span>
                          <Icon name={project.frameIcon} size={14} className={s.frameIcon} />
                        </div>
                        <div className={s.frameBody}>
                          <img
                            src={project.mockup}
                            alt={project.mockupAlt}
                            className={s.mockup}
                            width={512}
                            height={279}
                            loading="eager"
                            decoding="async"
                            data-reveal-media={isFirst ? undefined : true}
                          />
                          <div className={s.frameTint} aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Footer rail ────────────────────────────────────── */}
        <footer className={s.footer}>
          <p className={s.note}>Open the full case study from any project link</p>
          <div className={s.progressTrack} aria-hidden="true">
            <div ref={progressFillRef} className={s.progressFill} />
          </div>
        </footer>
      </div>

      {/* Case-study modal */}
      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  );
}