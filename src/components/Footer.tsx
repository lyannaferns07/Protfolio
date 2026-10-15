import { profile, nav } from '../data/config';
import { Icon } from './Icon';
import s from './Footer.module.css';

export function Footer() {
  return (
    <footer className={s.root}>
      <div className={s.inner}>
        {/* Brand + colophon */}
        <div className={s.brandBlock}>
          <a href="#home" className={s.logo}>
            {profile.name}
          </a>
          <p className={s.colophon}>
            © {new Date().getFullYear()} {profile.name}. All rights reserved. Crafted with
            architectural precision.
          </p>
        </div>

        {/* Footer nav */}
        <nav className={s.nav} aria-label="Footer navigation">
          {nav.map((item) => (
            <a key={item.id} href={item.href} className={s.navLink}>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Back to top */}
        <a href="#home" className={s.toTop}>
          Back to top
          <Icon name="arrow_upward" size={16} />
        </a>
      </div>
    </footer>
  );
}