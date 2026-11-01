import { profile } from '../data/config';
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

        {/* Back to top */}
        <a href="#home" className={s.toTop}>
          Back to top
          <Icon name="arrow_upward" size={16} />
        </a>
      </div>
    </footer>
  );
}