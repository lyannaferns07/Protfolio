/**
 * LYANN FERNANDES — SITE CONFIGURATION
 *
 * Single source of truth for all editable copy. Update the
 * values below and the entire site updates.
 */

export const profile = {
  /** Display name as it appears in the header and footer. */
  name: 'Lyann Fernandes',
  /** Monospace eyebrow pill above the hero headline. */
  role: 'Independent Creative Developer',
  /** Location + timezone string shown in the hero eyebrow. */
  locationLine: 'Mumbai, IN [IST / UTC+5:30]',
  /** Hero headline (rendered as one flowing serif block). */
  headline: 'I build digital experiences that make an impression.',
  /** Supporting copy beneath the hero headline. */
  tagline:
    "I'm Lyann, a computer science student and creative developer exploring the intersection of thoughtful web design, modern frontend engineering, and AI.",
  /** Build stamp beside the eyebrow pill. */
  buildStamp: 'v2025.04.18',
  /** Availability pill (hidden below lg). */
  availability: 'Available for select work / Summer 2025',
  /** Primary + secondary hero CTA labels. */
  ctaPrimary: 'Explore Selected Work',
  ctaSecondary: 'Get in touch',
  /** TODO: replace with your real address. */
  email: 'lyannfernandes@example.com',
  /** Location string used in About / Contact. */
  location: 'Mumbai, India (IST / UTC+5:30)',
  /** Academic focus. */
  education: 'BSc Computer Science',
} as const;

/** Four hairline-delimited stats beneath the hero CTAs. */
export const heroStats = [
  { label: 'Location', value: 'Mumbai, India (19.0760° N)' },
  { label: 'Focus', value: 'BSc Computer Science' },
  { label: 'Core Stack', value: 'React, TypeScript, Next.js' },
  { label: 'Approach', value: 'Creative UI & A11y Rigor' },
] as const;

export const socials = [
  { id: 'github',   label: 'GitHub',   icon: 'code',          href: 'https://github.com/' },
  { id: 'readcv',   label: 'ReadCV',   icon: 'description',   href: 'https://readcv.com/' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'hub',           href: 'https://linkedin.com/in/' },
  { id: 'twitter',  label: 'Twitter / X', icon: 'alternate_email', href: 'https://x.com/' },
] as const;

export const nav = [
  { id: 'home',     label: 'Home',     href: '#home' },
  { id: 'workshop', label: 'Workshop', href: '#workshop' },
  { id: 'about',    label: 'About',    href: '#about' },
  { id: 'contact',  label: 'Contact',  href: '#contact' },
] as const;

/** Credentials table rows in the About section. */
export const credentials = [
  { key: 'Education',    value: 'BSc in Computer Science, Mumbai University (Final Year)', emphasis: false },
  { key: 'Focus Areas',  value: 'Creative Frontend, UI Systems, AI Integrations', emphasis: false },
  { key: 'Core Standard',value: 'Semantic HTML, 100% Lighthouse, Zero heavy runtimes', emphasis: false },
  { key: 'Availability', value: 'Summer Internships & Select Client Work (2025)', emphasis: true },
] as const;

/** Three-column "under the hood" capability index in the About section. */
export const capabilityIndex = [
  {
    id: '01',
    title: 'Core Languages',
    items: ['TypeScript', 'JavaScript (ESNext)', 'Python', 'HTML5 / Modern CSS'],
  },
  {
    id: '02',
    title: 'Frameworks & Tools',
    items: ['React 18 / 19', 'Next.js (App Router)', 'Tailwind CSS', 'Vite & Bun'],
  },
  {
    id: '03',
    title: 'Disciplines',
    items: ['Data Structures & Alg.', 'Responsive Layouts', 'WCAG 2.1 AA Standards', 'REST APIs & Telemetry'],
  },
] as const;