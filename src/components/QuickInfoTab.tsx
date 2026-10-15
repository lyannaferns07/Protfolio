import s from './QuickInfoTab.module.css';

/**
 * The reference pins a small tab to the right edge carrying rotated text.
 * Here it doubles as a jump link to the contact block, which keeps it
 * functional rather than decorative.
 */
export function QuickInfoTab() {
  return (
    <a className={s.root} href="#contact">
      <span className={s.label}>Quick info</span>
    </a>
  );
}