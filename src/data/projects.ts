/**
 * PROJECT DATA — Lyann Fernandes Portfolio
 *
 * Single source of truth for the Workshop section. Each card reads
 * from this file. Project mockups live in /public/images/workshop/,
 * case-study photography in /public/images/projects/.
 *
 * category values: 'client' | 'personal' | 'academic'
 * status values:   'live' | 'in-progress' | 'concept' | 'academic'
 */

export type Technology = string;

export type Project = {
  id: string;
  title: string;
  category: 'client' | 'personal' | 'academic';
  status: 'live' | 'in-progress' | 'concept' | 'academic';
  /** Monospace index tag rendered in the badge, e.g. "01 / CLIENT WORK — LIVE" */
  badge: string;
  /** Monospace discipline label on the right of the badge row */
  discipline: string;
  /** Uppercase scope line beneath the title */
  scope: string;
  /** Card blurb (60–120 chars) */
  tagline: string;
  /** Longer description for the expanded case study modal */
  description: string;
  /** Problem / goal that prompted the project */
  problem?: string;
  /** Your specific role / contribution */
  role?: string;
  /** Key decisions, approach, what was interesting */
  approach?: string;
  /** Measurable outcome or current status */
  outcome?: string;
  /** What you learned from this project */
  learned?: string;
  technologies: Technology[];
  /** Mockup preview shown in the card canvas — /public/images/workshop/ */
  mockup: string;
  /** Alt text describing the mockup */
  mockupAlt: string;
  /** Fake browser-frame URL strip above the mockup */
  frameUrl: string;
  /** Material Symbols icon name shown at the right of the frame strip */
  frameIcon: string;
  /** Real case-study photography — /public/images/projects/ */
  image: string;
  /** Optional: additional screenshots for a case study panel */
  screenshots?: string[];
  /** External URL if the project is live */
  liveUrl?: string;
  /** GitHub repository URL */
  repoUrl?: string;
};

export const projects: Project[] = [
  /* ── 1. Elephant Grey — primary client case study ───── */
  {
    id: 'elephant-grey',
    title: 'Elephant Grey',
    category: 'client',
    status: 'live',
    badge: '01 / Client Work — Live',
    discipline: 'Creative Studio',
    scope: 'Design & Full Frontend Development',
    tagline:
      'Digital flagship for an independent creative studio and media production house, built around story-first editorial design and precise typographic architecture.',
    description:
      'Elephant Grey Collaborative LLP is an independent creative studio and media production house based in India, specialising in grounded, realistic storytelling, episodic series design, narrative architecture, and end-to-end project execution. I designed and developed their website to communicate their identity clearly to collaborators and clients.',
    problem:
      "Elephant Grey needed a website that reflected their considered, story-first approach without feeling like a generic portfolio template. The studio's work spans across media formats, so the site had to accommodate different types of projects while keeping a cohesive voice.",
    role: 'Design and frontend development. Responsible for overall layout, typography system, responsive implementation, SEO setup, and deployment.',
    approach:
      "I chose a content-first approach: letting the studio's own language and work lead the page structure. The font stack pairs a grotesque sans with an editorial serif, giving the typography hierarchy and warmth without decoration. Layout is restrained and grid-based.",
    outcome:
      'The site is live at elephant-grey.com. The studio uses it as their primary web presence for client and collaborator outreach.',
    learned:
      'Client work taught me to balance creative preferences with practical communication goals — and the importance of a clear, well-structured typographic system over visual flourishes.',
    technologies: ['Vite', 'React', 'Tailwind CSS', 'Responsive Architecture'],
    mockup: '/images/workshop/elephant-grey.jpg',
    mockupAlt:
      'Refined editorial website for Elephant Grey Collaborative in deep charcoal and warm alabaster, with meticulous typographic composition and story-first layout.',
    frameUrl: 'elephant-grey.com',
    frameIcon: 'lock',
    image: '/images/projects/elephant-grey.jpg',
    liveUrl: 'https://elephant-grey.com/',
  },

  /* ── 2. Strategic Creative Notes — personal team project ── */
  {
    id: 'strategic-creative-notes',
    title: 'Strategic Creative Notes',
    category: 'personal',
    status: 'live',
    badge: '02 / Personal Team Project — Live',
    discipline: 'Knowledge Management',
    scope: 'Product Design & Frontend Development',
    tagline:
      'A collaborative notes platform built for creative teams — structured thinking, linked ideas, and a clean editorial interface for strategy work.',
    description:
      'Strategic Creative Notes is a personal team project — a web application designed for creative professionals and strategists who need a focused, distraction-free space to capture, organise, and develop ideas together. The platform emphasises clear information hierarchy and a considered writing environment over feature bloat.',
    problem:
      'Generic note-taking tools are either too simple for structured creative strategy work or too complex with unnecessary features. Strategic Creative Notes explores what a purpose-built, design-conscious tool for creative teams could look like.',
    role: 'Personal team project. Contributed to product design, frontend architecture, interface design, and the collaborative editing experience.',
    approach:
      'The interface is intentionally minimal: a clean sidebar for navigation, a focused editor for writing, and linked notes for connecting related ideas. Typography and whitespace carry the visual weight. The design system uses a dark base with restrained accent colours for long writing sessions.',
    outcome:
      'Live at strategic-creative-notes.vercel.app. Used by the team for ongoing creative strategy and project documentation.',
    learned:
      'Building a tool you actually use as a team forces real prioritisation — every unnecessary feature becomes an obvious distraction when you are the primary user.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    mockup: '/images/workshop/strategic-creative-notes.jpg',
    mockupAlt:
      'Strategic Creative Notes web application interface showcasing the student productivity workspace, beautiful typography, and unified note-taking suite.',
    frameUrl: 'strategic-creative-notes.vercel.app',
    frameIcon: 'article',
    image: '/images/projects/scn-website.jpg',
    liveUrl: 'https://strategic-creative-notes.vercel.app/',
  },
];

export const featuredProject = projects.find((p) => p.status === 'live') ?? projects[0];
export const clientProjects = projects.filter((p) => p.category === 'client');
export const personalProjects = projects.filter((p) => p.category === 'personal');
export const academicProjects = projects.filter((p) => p.category === 'academic');