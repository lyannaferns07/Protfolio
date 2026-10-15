/**
 * CAPABILITIES DATA — Lyann Fernandes Portfolio
 * What I offer to clients and collaborators.
 */

export type Capability = {
  id: string;
  title: string;
  description: string;
  /** Items I can deliver now */
  deliverNow: string[];
  /** Items I am actively learning */
  learning?: string[];
};

export const capabilities: Capability[] = [
  {
    id: 'websites',
    title: 'Business Websites',
    description:
      'Clean, professional websites for small businesses and startups — built to communicate clearly and load fast.',
    deliverNow: [
      'Multi-page business sites',
      'Landing pages and single-page sites',
      'Portfolio and showcase sites',
      'Responsive across all devices',
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    description:
      'Precise, maintainable frontend code using modern React, TypeScript, and CSS — with attention to detail on interaction and accessibility.',
    deliverNow: [
      'React / TypeScript applications',
      'Responsive CSS implementation',
      'Animation and micro-interactions',
      'Semantic, accessible HTML',
    ],
    learning: ['Advanced GSAP animation patterns', 'Performance optimisation at scale'],
  },
  {
    id: 'ui',
    title: 'UI Implementation',
    description:
      'Taking a design from Figma or a brief and building it precisely in code, with all states, hover effects, and edge cases handled.',
    deliverNow: [
      'Figma-to-code implementation',
      'Design system setup',
      'Component library development',
      'Website redesign and modernisation',
    ],
  },
  {
    id: 'ai',
    title: 'AI-Assisted Web Experiences',
    description:
      'Exploring how AI tools can be integrated into web products to improve workflows, personalisation, and interface generation.',
    deliverNow: [
      'AI API integration (OpenAI, etc.)',
      'Prototype and concept development',
      'AI-assisted workflow design',
    ],
    learning: ['Production-scale AI feature deployment', 'AI UX patterns and evaluation'],
  },
];
