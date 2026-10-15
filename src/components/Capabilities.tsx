import { capabilities } from '../data/capabilities';
import { useInView } from '../hooks/useInView';
import s from './Capabilities.module.css';

export function Capabilities() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      id="capabilities"
      ref={ref}
      className={`${s.root} ${inView ? s.visible : ''}`}
      aria-labelledby="capabilities-heading"
    >
      <div className={s.inner}>
        <div className={s.header}>
          <p className={`${s.eyebrow} eyebrow`}>What I do</p>
          <h2 id="capabilities-heading" className={s.heading}>
            Capabilities &amp; Services
          </h2>
          <p className={s.subheading}>
            I work with small businesses, startups, and technology teams
            on web projects that need both design sensibility and technical execution.
          </p>
        </div>

        <div className={s.grid}>
          {capabilities.map((cap, i) => (
            <div
              key={cap.id}
              className={s.card}
              style={{ '--i': i } as React.CSSProperties}
            >
              <h3 className={s.cardTitle}>{cap.title}</h3>
              <p className={s.cardDesc}>{cap.description}</p>
              <ul className={s.deliverList} aria-label="What I can deliver">
                {cap.deliverNow.map((item) => (
                  <li key={item} className={s.deliverItem}>
                    <span className={s.deliverCheck} aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              {cap.learning && cap.learning.length > 0 && (
                <div className={s.learning}>
                  <p className={s.learningLabel}>Currently learning</p>
                  <ul aria-label="Areas I'm developing">
                    {cap.learning.map((item) => (
                      <li key={item} className={s.learningItem}>
                        <span aria-hidden="true">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Honest footer note */}
        <p className={s.note}>
          No invented metrics, no fake client logos. These are the services I can
          genuinely deliver based on real project experience.
        </p>
      </div>
    </section>
  );
}
