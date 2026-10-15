/**
 * All editable content lives here.
 *
 * Every value below is a clearly-marked placeholder — replace them with your own
 * details and the whole site updates. Nothing here is Karolina Hess's identity,
 * biography, email or project work.
 */

export const profile = {
  /** TODO: your name. Rendered in the fixed header. */
  name: 'Your Name',
  /** TODO: two words that read as a job title, used as the hero H1. */
  roleLine1: 'Creative Web',
  roleLine2: 'Designer',
  /** TODO: one short positioning line under the H1. */
  tagline: 'specialized in branding and no-code development',
  /** TODO: your email. The footer copy button copies this. */
  email: 'you@example.com',
  /** TODO: location, shown nowhere yet but kept for future use. */
  location: 'Based in India. Working worldwide.',
} as const;

export const socials = [
  // TODO: replace with your own profile URLs.
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/' },
  { id: 'pinterest', label: 'Pinterest', href: 'https://pinterest.com/' },
  { id: 'x', label: 'X', href: 'https://x.com/' },
] as const;

/** Large statement between the intro card and the works gallery. */
export const statement = {
  before: 'Just ',
  accentA: 'custom-made',
  middle: ', thoughtful design — built and brought to life with ',
  accentB: 'no-code',
  end: '.',
} as const;

export const intro = {
  lead: 'Designer/developer ',
  leadAccent: 'hybrid',
  line1: ['I design with ', 'care.'],
  line2: 'No templates, no shortcuts.',
  reelLabel: 'PLAY REEL',
  /**
   * TODO: drop your own showreel clip here (a muted, looping, local file works
   * best). While empty, a neutral animated placeholder is shown in its place.
   */
  reelVideo: '',
} as const;

/**
 * Works gallery.
 *
 * `variant: 'fill'`   — media covers the card.
 * `variant: 'device'` — flat card background with smaller centred media.
 * `tone` sets the placeholder colour so the row reads as a designed set while
 * it is still empty; delete `tone` once you supply real imagery.
 */
export type Work = {
  id: string;
  /** TODO: your project title. */
  title: string;
  variant: 'fill' | 'device';
  /** Card background for `device` cards. */
  tone?: string;
  /** TODO: replace with a screenshot/preview. Path or URL, or '' for placeholder. */
  image?: string;
  /** TODO: optional looping clip, used instead of `image` when present. */
  video?: string;
};

export const works: Work[] = [
  { id: 'w1', title: 'Project One', variant: 'fill' },
  { id: 'w2', title: 'Project Two', variant: 'fill' },
  { id: 'w3', title: 'Project Three', variant: 'fill' },
  { id: 'w4', title: 'Project Four', variant: 'device', tone: '#FAFAFA' },
  { id: 'w5', title: 'Project Five', variant: 'fill' },
  { id: 'w6', title: 'Project Six', variant: 'fill' },
  { id: 'w7', title: 'Project Seven', variant: 'device', tone: '#C2C2C2' },
  { id: 'w8', title: 'Project Eight', variant: 'fill' },
  { id: 'w9', title: 'Project Nine', variant: 'fill' },
];

export const nav = [
  { id: 'home', label: 'HOME', href: '#home' },
  { id: 'works', label: 'WORKS', href: '#works' },
  { id: 'about', label: 'ABOUT', href: '#contact' },
] as const;