# Lyann Fernandes — Personal Portfolio

A sleek, responsive personal portfolio website showcasing creative web development, modern frontend engineering, and thoughtful UI/UX design.

---

## ✨ Features

- **Fluid & Responsive Design**: Crafted for all screen sizes (mobile, tablet, desktop) with modern CSS and Tailwind CSS v4.
- **Micro-Interactions & Animations**: GSAP transitions, Lenis smooth scrolling, and dynamic UI elements like interactive spotlights and custom hatched scale borders.
- **Centralized Content**: Easily editable copy and site configuration managed via [`src/data/config.ts`](./src/data/config.ts).
- **Dark & Light Mode Support**: Built using OKLCH color palettes and CSS variables for high-contrast, accessible themes.
- **Performance First**: Zero unnecessary runtime bloat, Vite-powered instant HMR, and optimized production builds.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS Modules
- **UI Components**: Custom components inspired by [shadcn/ui](https://ui.shadcn.com/) & [Aceternity UI](https://ui.aceternity.com/)
- **Typography**: [Geist](https://fontsource.org/fonts/geist) via Fontsource
- **Animations**: [GSAP](https://gsap.com/) & [Lenis](https://lenis.darkroom.engineering/)

---

## 📁 Project Structure

```text
Portfolio/
├── public/               # Static assets & portraits
├── src/
│   ├── components/       # Core page sections (Hero, About, Work, Header, etc.)
│   │   └── ui/           # Reusable UI primitives (Scales, Spotlight, Button)
│   ├── data/
│   │   └── config.ts     # Site copy, social links, stats & bio
│   ├── hooks/            # Custom React hooks (useInView, etc.)
│   ├── lib/              # Utility helpers (cn, etc.)
│   ├── styles/           # Global styles and Tailwind v4 configuration
│   ├── App.tsx           # Main application root
│   └── main.tsx          # App entry point
├── tools/                # Automated screenshot and capture utilities
├── components.json       # shadcn/ui configuration
├── tsconfig.json         # TypeScript configuration with path aliases
└── vite.config.ts        # Vite configuration with Tailwind plugin
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or newer) installed.

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## ⚙️ Configuration

To update personal information, social links, projects, or bio copy, simply edit [`src/data/config.ts`](./src/data/config.ts). The entire portfolio updates dynamically from this single source of truth.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
