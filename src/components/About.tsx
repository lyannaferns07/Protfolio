import { credentials, capabilityIndex } from '../data/config';
import { Icon } from './Icon';
import s from './About.module.css';

export function About() {
  return (
    <section id="about" className={s.root} aria-labelledby="about-heading">
      <div className={s.inner}>
        {/* ── Left: philosophy & mindset ─────────────────────── */}
        <div className={s.left}>
          <div>
            <span className={s.eyebrow}>Philosophy &amp; Mindset</span>
            <h2 id="about-heading" className={s.heading}>
              Balancing algorithmic rigor with typographic grace.
            </h2>
          </div>

          <blockquote className={s.pullquote}>
            <p>&ldquo;Honesty in code, poise in typography.&rdquo;</p>
          </blockquote>

          <p className={s.body}>
            Every interface is both a visual surface and a mechanical computational artifact. I
            approach software engineering with an architect&rsquo;s restraint: no superfluous
            dependencies, clean document object structures, and an obsessive focus on performance
            under constrained conditions.
          </p>

          <div className={s.badgeCard}>
            <Icon name="verified" size={18} className={s.badgeCardIcon} />
            <div>
              <p className={s.badgeCardTitle}>100% Lighthouse Performance</p>
              <p className={s.badgeCardSub}>Standard bench on all custom builds</p>
            </div>
          </div>
        </div>

        {/* ── Right: narrative, credentials, capability index ── */}
        <div className={s.right}>
          <div className={s.narrative}>
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

          {/* Credentials table */}
          <div className={s.table}>
            <div className={s.tableHead}>
              <span className={s.tableHeadLabel}>Credentials &amp; Profile Status</span>
              <span className={s.tableHeadMeta}>[ Verified ]</span>
            </div>
            <div className={s.tableBody}>
              {credentials.map((row) => (
                <div key={row.key} className={s.tableRow}>
                  <span className={s.tableKey}>{row.key}</span>
                  <span className={`${s.tableValue} ${row.emphasis ? s.tableValueAccent : ''}`}>
                    {row.emphasis && <span className={s.availabilityDot} aria-hidden="true" />}
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Capability index */}
          <div>
            <p className={s.indexLabel}>Technical Capabilities &amp; Under the Hood</p>
            <div className={s.indexGrid}>
              {capabilityIndex.map((col) => (
                <div key={col.id} className={s.indexCard}>
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
      </div>
    </section>
  );
}