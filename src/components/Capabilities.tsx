import { capabilityIndex } from '../data/config';
import s from './Capabilities.module.css';

export function Capabilities() {
  return (
    <section id="capabilities" className={s.root} aria-label="Technical Capabilities">
      <div className={s.inner}>
        <p className={s.label}>Technical Capabilities &amp; Under the Hood</p>
        <div className={s.grid}>
          {capabilityIndex.map((col) => (
            <div key={col.id} className={s.card}>
              <p className={s.title}>
                {col.id} / {col.title}
              </p>
              <ul className={s.list}>
                {col.items.map((item) => (
                  <li key={item} className={s.item}>
                    <span className={s.bullet} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Capabilities;

