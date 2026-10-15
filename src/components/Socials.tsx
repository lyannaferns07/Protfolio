import { socials } from '../content';
import { SocialIcon } from './icons';
import s from './Socials.module.css';

type Props = {
  /** `dark` = ink icons for the light hero, `light` = white for the green footer. */
  tone: 'dark' | 'light';
  className?: string;
};

export function Socials({ tone, className }: Props) {
  return (
    <ul className={`${s.list} ${className ?? ''}`} data-tone={tone}>
      {socials.map((item) => (
        <li key={item.id}>
          <a
            className={s.link}
            href={item.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={item.label}
          >
            <SocialIcon id={item.id} className={s.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}