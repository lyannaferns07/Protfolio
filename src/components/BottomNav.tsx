import { useEffect, useRef, useState } from 'react';
import { nav } from '../content';
import s from './BottomNav.module.css';

/**
 * Fixed bottom-centre pill navigation.
 *
 * The active item is derived from scroll position and an indicator pill
 * slides between items, matching the reference's lime highlight.
 */
export function BottomNav() {
  const [active, setActive] = useState<string>(nav[0].id as string);
  const [ready, setReady] = useState(false);
  const list = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    const measure = () => {
      let current: string = nav[0].id;
      for (const item of nav) {
        const el = document.querySelector(item.href);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.5) current = item.id;
      }
      setActive(current);
      // Positions the indicator only once real measurements exist.
      if (list.current) setReady(true);
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const activeItem = itemRefs.current[active];

  return (
    <nav className={s.root} aria-label="Primary">
      <ul className={s.list} ref={list}>
        {nav.map((item) => (
          <li
            key={item.id}
            className={s.item}
            ref={(el) => {
              itemRefs.current[item.id] = el;
            }}
          >
            <a className={s.link} href={item.href} data-active={item.id === active}>
              {item.label}
            </a>
          </li>
        ))}

        {ready && activeItem && (
          <li
            className={s.indicator}
            aria-hidden="true"
            style={{
              width: activeItem.offsetWidth,
              transform: `translateX(${activeItem.offsetLeft}px)`,
            }}
          />
        )}
      </ul>
    </nav>
  );
}