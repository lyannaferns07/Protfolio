import { useEffect, useRef } from 'react';
import { type Project } from '../data/projects';
import s from './ProjectModal.module.css';

interface Props {
  project: Project | null;
  onClose: () => void;
}

const STATUS_LABELS: Record<Project['status'], string> = {
  live: 'Live',
  'in-progress': 'In Progress',
  concept: 'Concept',
  academic: 'Academic',
};

export function ProjectModal({ project, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll & focus the panel while open
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [project, onClose]);

  // Nothing to render when no project is selected
  if (!project) return null;

  return (
    <div
      ref={overlayRef}
      className={s.overlay}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${project.id}`}
    >
      <div ref={panelRef} className={s.panel} tabIndex={-1}>
        {/* Close */}
        <button
          className={s.closeBtn}
          onClick={onClose}
          aria-label="Close case study"
          id={`close-modal-${project.id}`}
        >
          ✕
        </button>

        {/* Hero image */}
        <div className={s.imageWrap}>
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} preview`}
              className={s.image}
              loading="lazy"
            />
          ) : (
            <div className={s.imagePlaceholder}>
              <span>{project.title}</span>
            </div>
          )}
        </div>

        <div className={s.body}>
          {/* Header */}
          <div className={s.header}>
            <div className={s.headerMeta}>
              <span className={s.category}>
                {project.category === 'client' ? 'Client Work' :
                 project.category === 'personal' ? 'Personal Project' : 'Academic'}
              </span>
              <span className={`${s.status} ${s[`status_${project.status.replace('-','_')}`]}`}>
                {STATUS_LABELS[project.status]}
              </span>
            </div>
            <h2 id={`modal-title-${project.id}`} className={s.title}>
              {project.title}
            </h2>
            <p className={s.description}>{project.description}</p>

            {/* Links */}
            <div className={s.links}>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.linkPrimary}
                >
                  Visit live site ↗
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.linkSecondary}
                >
                  View code ↗
                </a>
              )}
            </div>
          </div>

          {/* Case study sections */}
          <div className={s.caseStudy}>
            {project.problem && (
              <div className={s.section}>
                <h3 className={s.sectionTitle}>The Problem</h3>
                <p className={s.sectionText}>{project.problem}</p>
              </div>
            )}
            {project.role && (
              <div className={s.section}>
                <h3 className={s.sectionTitle}>My Role</h3>
                <p className={s.sectionText}>{project.role}</p>
              </div>
            )}
            {project.approach && (
              <div className={s.section}>
                <h3 className={s.sectionTitle}>Approach</h3>
                <p className={s.sectionText}>{project.approach}</p>
              </div>
            )}
            {project.outcome && (
              <div className={s.section}>
                <h3 className={s.sectionTitle}>Outcome</h3>
                <p className={s.sectionText}>{project.outcome}</p>
              </div>
            )}
            {project.learned && (
              <div className={s.section}>
                <h3 className={s.sectionTitle}>What I Learned</h3>
                <p className={s.sectionText}>{project.learned}</p>
              </div>
            )}
          </div>

          {/* Technologies */}
          <div className={s.techSection}>
            <h3 className={s.sectionTitle}>Technologies</h3>
            <div className={s.techList}>
              {project.technologies.map((tech) => (
                <span key={tech} className={s.techItem}>{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
