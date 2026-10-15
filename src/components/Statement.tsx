import { statement } from '../content';
import { useReveal } from '../hooks/useReveal';
import s from './Statement.module.css';

/** The large statement between the intro card and the works gallery. */
export function Statement() {
  const ref = useReveal<HTMLDivElement>({ fade: true, inView: true, duration: 0.7 });

  return (
    <section className={s.section} aria-label="Statement">
      <div ref={ref} className={s.mask}>
        <p className={s.text}>
          {statement.before}
          <span className="accent-green">{statement.accentA}</span>
          {statement.middle}
          <span className="accent-green">{statement.accentB}</span>
          {statement.end}
        </p>
      </div>
    </section>
  );
}