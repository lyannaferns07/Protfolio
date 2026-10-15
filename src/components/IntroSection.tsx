import { intro } from '../content';
import { useReveal } from '../hooks/useReveal';
import s from './IntroSection.module.css';

/**
 * The dark-green intro card: sub-label, two-line statement and the reel button.
 * All copy fades up as the card scrolls into view (the reference uses a 0.4s
 * bounce spring here; a matched ease reads the same without the overshoot).
 */
export function IntroSection() {
  const label = useReveal<HTMLParagraphElement>({ fade: true, inView: true, duration: 0.6 });
  const head1 = useReveal<HTMLDivElement>({ fade: true, inView: true, delay: 0.08, duration: 0.6 });
  const head2 = useReveal<HTMLDivElement>({ fade: true, inView: true, delay: 0.16, duration: 0.6 });
  const reel = useReveal<HTMLDivElement>({ fade: true, inView: true, delay: 0.24, duration: 0.6 });

  return (
    <section className={s.section} id="intro" aria-label="Introduction">
      <div className={s.card}>
        <p ref={label} className={s.label}>
          {intro.lead}
          <span className="accent-lime">{intro.leadAccent}</span>
        </p>

        <div className={s.headlines}>
          <div ref={head1} className={s.mask}>
            <p className={s.headline}>
              {intro.line1[0]}
              <span className="accent-lime">{intro.line1[1]}</span>
            </p>
          </div>
          <div ref={head2} className={s.mask}>
            <p className={s.headline}>{intro.line2}</p>
          </div>
        </div>

        <div ref={reel} className={s.reelWrap}>
          {/*
            TODO: set `intro.reelVideo` in src/content.ts to a muted looping
            clip; until then a neutral placeholder stands in so the button keeps
            the reference's exact shape.
          */}
          <div className={s.reelButton} role="img" aria-label={`${intro.reelLabel} — video placeholder`}>
            {intro.reelVideo ? (
              <video className={s.reelMedia} src={intro.reelVideo} loop muted playsInline preload="none" />
            ) : (
              <span className={s.reelPlaceholder} aria-hidden="true" />
            )}
            <span className={s.reelLabel}>{intro.reelLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}