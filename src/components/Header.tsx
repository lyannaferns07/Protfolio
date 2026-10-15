import { useEffect, useState } from 'react';
import { profile, nav } from '../data/config';
import { Icon } from './Icon';
import s from './Header.module.css';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('home');

  /* Shadow + solid backdrop once the page has scrolled */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /**
   * Active section tracking.
   *
   * The Workshop section is much taller than the viewport, so a
   * ratio-based threshold can never be satisfied for it. Instead we
   * pick the section whose top edge is closest to the header line —
   * this works uniformly for short and very tall sections.
   */
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = 120; // header height + a little breathing room
      let bestId: string = nav[0].id;
      let bestDist = Infinity;

      for (const item of nav) {
        const el = document.querySelector<HTMLElement>(item.href);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Ignore sections entirely above the fold (already passed).
        if (rect.bottom < 0) continue;
        const dist = Math.abs(rect.top - line);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = item.id;
        }
      }

      setActiveId((prev) => (prev === bestId ? prev : bestId));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /* Close the mobile sheet on Escape */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  /* Lock body scroll while the sheet is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={`${s.root} ${scrolled ? s.scrolled : ''}`} role="banner">
      <div className={s.inner}>
        {/* Brand + availability */}
        <div className={s.brand}>
          <a href="#home" className={s.logo} aria-label={`${profile.name} — home`}>
            {profile.name}
          </a>
          <span className={s.availability}>
            <span className={s.availabilityDot} aria-hidden="true" />
            {profile.availability}
          </span>
        </div>

        {/* Desktop nav */}
        <nav className={s.nav} aria-label="Main navigation">
          {nav.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`${s.navLink} ${isActive ? s.navLinkActive : ''}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Trailing action */}
        <div className={s.actions}>
          <a href="#contact" className={s.cta}>
            Get in touch
          </a>
          <button
            type="button"
            className={`${s.burger} ${menuOpen ? s.burgerOpen : ''}`}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        className={`${s.sheet} ${menuOpen ? s.sheetOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          {nav.map((item, i) => (
            <a
              key={item.id}
              href={item.href}
              className={`${s.sheetLink} ${activeId === item.id ? s.sheetLinkActive : ''}`}
              style={{ transitionDelay: `${0.04 * i + 0.05}s` }}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span className={s.sheetIndex}>{String(i + 1).padStart(2, '0')}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className={s.sheetCta}
          onClick={() => setMenuOpen(false)}
          tabIndex={menuOpen ? 0 : -1}
        >
          Get in touch
          <Icon name="arrow_outward" size={16} />
        </a>
      </div>
    </header>
  );
}