/**
 * LYANN FERNANDES — SITE CONFIGURATION
 *
 * Single source of truth for all editable copy. Update the
 * values below and the entire site updates.
 */

export interface HeroStat {
  label: string;
  value: string;
}

export const profile = {
  /** Display name as it appears in the header and footer. */
  name: 'Lyann Fernandes',
  /** Monospace eyebrow pill above the hero headline. */
  role: 'Software Developer',
  /** Location + timezone string shown in the hero eyebrow. */
  locationLine: 'Mumbai, IN [IST / UTC+5:30]',
  /** Hero headline (rendered as one flowing serif block). */
  headline: 'I turn ideas into digital experiences.',
  /** Multi-line hero split copy. */
  heroLine1: 'I turn ideas into',
  heroLine2: 'digital experiences.',
  /** Supporting copy beneath the hero headline. */
  tagline:
    "I'm a Software Developer and BSc Computer Science student passionate about building meaningful digital experiences and solving real-world problems through technology.",
  /** Second tagline paragraph shown in About section. */
  taglinePart2:
    "Currently exploring Full-Stack Development, AI, and emerging technologies, I'm driven by curiosity, continuous learning, and turning ideas into functional digital products.",
  /** Build stamp beside the eyebrow pill. */
  buildStamp: 'Portfolio 2026',
  /** Availability pill. */
  availability: 'Open to internships & freelance projects',
  /** Primary + secondary hero CTA labels. */
  ctaPrimary: 'View Projects',
  ctaSecondary: 'Contact Me',
  email: 'lyannaferns@gmail.com',
  /** Location string used in About / Contact. */
  location: 'Mumbai, India (IST / UTC+5:30)',
  /** Academic focus. */
  education: 'BSc Computer Science, 2nd year',
} as const;

/** Four hairline-delimited stats beneath the hero CTAs. */
export const heroStats: readonly HeroStat[] = [
  { label: 'Location', value: 'Mumbai, India' },
  { label: 'Education', value: 'BSc Computer Science, 2nd year' },
  { label: 'Tech Stack', value: 'Used 20+ tech stack' },
  { label: 'Status', value: 'Open to opportunities' },
] as const;

export const socials = [
  { id: 'github',    label: 'GitHub',    icon: 'code',         href: 'https://github.com/' },
  { id: 'linkedin',  label: 'LinkedIn',  icon: 'hub',          href: 'https://linkedin.com/in/' },
  { id: 'instagram', label: 'Instagram', icon: 'photo_camera', href: 'https://www.instagram.com/lyanna_ferns__07/' },
] as const;

export const nav = [
  { id: 'home',     label: 'Home',     href: '#home' },
  { id: 'workshop', label: 'Workshop', href: '#workshop' },
  { id: 'about',    label: 'About',    href: '#about' },
  { id: 'contact',  label: 'Contact',  href: '#contact' },
] as const;

/** Credentials table rows in the About section. */
export const credentials = [
  { key: 'Education',         value: 'BSc Computer Science, 2nd year, Mumbai University', emphasis: false },
  { key: 'Focus Areas',       value: 'Frontend Development, UI Design, Web Development', emphasis: false },
  { key: 'Currently Learning',value: 'Full-Stack Development, AI & Machine Learning', emphasis: false },
  { key: 'Availability',      value: 'Open to internships & freelance projects (2026)', emphasis: true },
] as const;

/** Three-column "under the hood" capability index in the About section. */
export const capabilityIndex = [
  {
    id: '01',
    title: 'Core Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML5 & CSS3'],
  },
  {
    id: '02',
    title: 'Frameworks & Tools',
    items: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'Vite', 'GSAP', 'Framer Motion', 'Git & GitHub'],
  },
  {
    id: '03',
    title: 'Backend & AI',
    items: ['MongoDB', 'Firebase', 'MySQL', 'Supabase', 'REST APIs', 'AI Integrations', 'Full-Stack Development'],
  },
] as const;