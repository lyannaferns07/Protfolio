import { useState } from 'react';
import { projects, type Project } from '../data/projects';
import { Skiper16 } from './ui/skiper-ui/skiper16';
import { ProjectModal } from './ProjectModal';
import s from './Work.module.css';

export function Work() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  return (
    <section
      id="workshop"
      className={s.section}
      aria-labelledby="workshop-heading"
    >
      {/* ── Editorial introduction — normal flow, scrolls away ── */}
      <div className={s.intro}>
        <div className={s.introInner}>
          <div className={s.introLeft}>
            <span className={s.eyebrow}>
              [ WORKSHOP INDEX ]
            </span>
            <h2 id="workshop-heading" className={s.title}>
              WHAT I BUILT
            </h2>
          </div>

          <div className={s.introRight}>
            <p className={s.subtitle}>
              Digital experiences, thoughtful solutions, and experiments at the
              intersection of design and technology.
            </p>
          </div>
        </div>
      </div>

      {/* ── Skiper16 Scroll-Driven Card Stack ── */}
      <div className={s.stackWrapper}>
        <Skiper16
          projects={projects}
          onSelectProject={setOpenProject}
        />
      </div>

      {/* Case-study modal */}
      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  );
}

