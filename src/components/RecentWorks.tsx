import { useRef } from 'react';
import { works, type Work } from '../content';
import { useScrollProgress } from '../hooks/useScrollProgress';
import s from './RecentWorks.module.css';

/**
 * Horizontal distance the track travels while the section is pinned.
 *
 * The reference lays the track out with its right edge 4000px beyond the
 * viewport's right edge (verified: viewport 1440 + 4000 − track 2797 = 2643,
 * the measured start x). Translating by exactly −4000 lands the track's right
 * edge flush with the viewport's right edge (−1357 + 2797 = 1440).
 */
const TRAVEL = 4000;

const PORTRAIT = { w: 249, h: 332 };
const LANDSCAPE = { w: 332, h: 249 };

/** Alternating 249×332 / 332×249, matching the reference's 2797px track. */
const SIZES = [
  PORTRAIT, LANDSCAPE, PORTRAIT, LANDSCAPE, PORTRAIT,
  LANDSCAPE, PORTRAIT, LANDSCAPE, PORTRAIT,
];

function Card({ work, size }: { work: Work; size: { w: number; h: number } }) {
  const style = { width: size.w, height: size.h, ...(work.tone ? { background: work.tone } : {}) };
  const media = work.video ? (
    <video className={s.media} src={work.video} loop muted playsInline preload="none" />
  ) : work.image ? (
    <img className={s.media} src={work.image} alt={work.title} loading="lazy" decoding="async" />
  ) : (
    <span className={s.placeholder} aria-hidden="true" data-variant={work.variant} />
  );

  return (
    <li className={s.card} style={style} data-variant={work.variant}>
      {media}
      <span className={s.cardLabel}>{work.title}</span>
    </li>
  );
}

export function RecentWorks() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  // Writes the transform straight to the node — no React state, no re-render.
  useScrollProgress({
    container: section,
    onProgress: (p) => {
      if (track.current) track.current.style.transform = `translate3d(${-TRAVEL * p}px, -50%, 0)`;
    },
  });

  return (
    <section className={s.section} ref={section} id="works" aria-label="Recent works">
      <div className={s.wrap}>
        <h2 className={s.typo}>Recent works</h2>

        <ul className={s.track} ref={track}>
          {works.map((work, i) => (
            <Card key={work.id} work={work} size={SIZES[i] ?? PORTRAIT} />
          ))}
        </ul>
      </div>
    </section>
  );
}