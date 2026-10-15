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
    discipline: 'Atelier Architecture',
    scope: 'Design & Full Frontend Development',
    tagline:
      'Bespoke digital flagship for an atelier architectural firm, engineered with typographic fluidity, accessible hierarchy, and sub-second paint times on 4G cellular networks.',
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
      'Refined architectural monograph website in deep charcoal and warm alabaster, showing Brutalist concrete structures in soft morning light with meticulous typographic composition.',
    frameUrl: 'elephant-grey.com',
    frameIcon: 'lock',
    image: '/images/projects/elephant-grey.jpg',
    liveUrl: 'https://elephant-grey.com/',
  },

  /* ── 2. Cerco — service discovery platform ─────────── */
  {
    id: 'cerco',
    title: 'Cerco',
    category: 'personal',
    status: 'in-progress',
    badge: '02 / Platform',
    discipline: 'Service Directory',
    scope: 'Interface Design & Frontend Architecture',
    tagline:
      'Contextual service discovery platform connecting local specialists with clients through contextual search, geospatial mapping, and frictionless facet filtering.',
    description:
      'Cerco is a platform concept designed to help people discover and connect with local service providers — from electricians and plumbers to tutors and event caterers. The goal is to make the process of finding verified, reviewed local services as simple and trustworthy as possible.',
    problem:
      'Finding reliable local services in India often relies on informal word-of-mouth or scattered listings across multiple platforms. Cerco explores what a purpose-built, design-first discovery experience could look like.',
    role: 'This is a collaborative project. My contribution covers the interface design, frontend architecture, search and filtering UI, and responsive development.',
    approach:
      'The interface prioritises clarity and trust: service cards show relevant metadata upfront, filtering is fast and contextual, and the design system uses clean, readable typography with deliberate whitespace to make browsing feel effortless.',
    outcome:
      'Currently in active development. The core browsing and filtering interface is functional.',
    technologies: ['React', 'TypeScript', 'Tailwind', 'UI Tooling'],
    mockup: '/images/workshop/cerco.jpg',
    mockupAlt:
      'Contextual discovery platform interface with structured data grids, geometric search filter facets, and interactive service card directories in navy on off-white.',
    frameUrl: 'cerco.network/discovery',
    frameIcon: 'tune',
    image: '/images/projects/cerco.png',
  },

  /* ── 3. Assist AI — AI interface concept ───────────── */
  {
    id: 'assist-ai',
    title: 'Assist AI',
    category: 'personal',
    status: 'concept',
    badge: '03 / R&D Lab',
    discipline: 'Generative Tokens',
    scope: 'Active Prototype / Research',
    tagline:
      'Exploration into prompt-to-layout generative workflows, bridging high-level semantic intent with deterministic, composable design tokens and real-time layout synthesis.',
    description:
      'Assist AI is a concept project exploring what it would look like if an AI could generate and refine interface components from natural language prompts. The project investigates the design and UX side of AI-powered tooling — how do you communicate what you want, how do you review and iterate on generated output, and what controls keep the human in the loop?',
    problem:
      'AI code generation tools exist but the interface for refining generated UI is often clunky or requires deep technical knowledge. This concept explores a design-first approach to that interaction.',
    role: 'Sole designer and developer of the concept prototype. Research, UX design, interface prototyping.',
    approach:
      'I focused on the interaction model: a split-view editor with real-time preview, a prompt history panel, and simple refinement controls. The concept is implemented as a static prototype with AI functionality documented rather than fully wired.',
    outcome:
      'Concept prototype complete. Serves as a demonstration of my interest in AI-powered product experiences and the UX challenges they present. Not yet a launched product.',
    learned:
      'Thinking critically about AI tools as a UX designer means questioning what "help" actually means, and when the AI is genuinely saving time vs. adding friction.',
    technologies: ['LLM Prompts', 'Design Tokens', 'Next.js', 'AST Parsing'],
    mockup: '/images/workshop/assist-ai.jpg',
    mockupAlt:
      'Developer tool canvas with generative design node trees, modular wireframe layouts, and token inspectors in off-white and deep midnight blue.',
    frameUrl: 'assist-lab.internal/canvas',
    frameIcon: 'psychology',
    image: '/images/projects/assist-ai.png',
  },

  /* ── 4. Smart Irrigation System — academic IoT ──────── */
  {
    id: 'smart-irrigation',
    title: 'Smart Irrigation System',
    category: 'academic',
    status: 'academic',
    badge: '04 / Applied CS',
    discipline: 'IoT Telemetry',
    scope: 'IoT Logic & Telemetry Dashboard',
    tagline:
      'Applied Computer Science academic project parsing soil telemetry to optimize moisture dispersion with low-latency microcontrollers and real-time data streaming.',
    description:
      'An academic project exploring embedded systems and IoT concepts. The system uses soil moisture sensors to automate irrigation decisions, reducing water usage by only activating irrigation when soil conditions require it. The project covered hardware integration, sensor data processing, basic decision logic, and documentation.',
    role: 'Academic project. Contributed to sensor integration, data flow design, and the written report.',
    approach:
      'The system uses a microcontroller to read moisture sensor data at regular intervals. When moisture falls below a threshold, the irrigation actuator is triggered. A simple dashboard shows current sensor readings.',
    outcome:
      'Submitted as an academic case study. Demonstrates foundational understanding of IoT system design, sensor integration, and hardware-software interaction.',
    technologies: ['C++', 'Microcontroller', 'Telemetry', 'REST APIs'],
    mockup: '/images/workshop/smart-irrigation.jpg',
    mockupAlt:
      'Real-time telemetry dashboard with environmental sensor data, moisture percentage trend charts, microcontroller packet logs, and hardware device states.',
    frameUrl: 'telemetry.local:8080/soil',
    frameIcon: 'sensors',
    image: '/images/projects/smart-irrigation.png',
  },
];

export const featuredProject = projects.find((p) => p.status === 'live') ?? projects[0];
export const clientProjects = projects.filter((p) => p.category === 'client');
export const personalProjects = projects.filter((p) => p.category === 'personal');
export const academicProjects = projects.filter((p) => p.category === 'academic');