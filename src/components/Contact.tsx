import { useState } from 'react';
import { profile, socials } from '../data/config';
import { Icon } from './Icon';
import s from './Contact.module.css';

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className={s.root} aria-labelledby="contact-heading">
      <div className={s.inner}>
        {/* ── Centred introduction ──────────────────────────── */}
        <div className={s.intro}>
          <span className={s.eyebrow}>[ Initiate Communication ]</span>
          <h2 id="contact-heading" className={s.heading}>
            Have a project in mind or an opportunity to discuss?
          </h2>
          <p className={s.subheading}>
            I am currently open to freelance client inquiries for website design &amp; development,
            as well as select developer internships.
          </p>
        </div>

        {/* ── Direct inquiry card ───────────────────────────── */}
        <div className={s.card}>
          <p className={s.cardLabel}>Direct Inquiries</p>

          <div className={s.emailRow}>
            <a href={`mailto:${profile.email}`} className={s.email}>
              <Icon name="mail" size={28} className={s.emailIcon} />
              <span className={s.emailText}>{profile.email}</span>
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className={s.copyBtn}
              aria-label={copied ? 'Email copied to clipboard' : 'Copy email address'}
            >
              <Icon name={copied ? 'check' : 'content_copy'} size={14} />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <span className="visually-hidden" role="status" aria-live="polite">
            {copied ? 'Email address copied to clipboard' : ''}
          </span>

          {/* Cadence + base */}
          <div className={s.metaRow}>
            <div className={s.metaItem}>
              <Icon name="schedule" size={20} className={s.metaIcon} />
              <div>
                <p className={s.metaLabel}>Response Cadence</p>
                <p className={s.metaValue}>Typical turnaround within 24 hours</p>
              </div>
            </div>
            <div className={s.metaItem}>
              <Icon name="public" size={20} className={s.metaIcon} />
              <div>
                <p className={s.metaLabel}>Current Base</p>
                <p className={s.metaValue}>{profile.location}</p>
              </div>
            </div>
          </div>

          {/* Social channels */}
          <div className={s.channels}>
            <p className={s.channelsLabel}>Verified Channels</p>
            <div className={s.channelList}>
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.channel}
                >
                  <Icon name={social.icon} size={16} />
                  {social.label}
                  <Icon name="arrow_outward" size={12} className={s.channelArrow} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}