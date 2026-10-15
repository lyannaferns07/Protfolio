import { useInView } from '../hooks/useInView';
import { type Project } from '../data/projects';
import s from './ProjectCard.module.css';

const STATUS_LABELS: Record<Project['status'], string> = {
  live: 'Live',
  'in-progress': 'In Progress',
  concept: 'Concept',
  academic: 'Academic',
};

const CATEGORY_LABELS: Record<Project['category'], string> = {
  client: 'Client Work',
  personal: 'Personal Project',
  academic: 'Academic',
};

interface Props {
  project: Project;
  index: number;
  onSelect: () => void;
}

export function ProjectCard({ project, index, onSelect }: Props) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.1 });
  const delay = (index % 2) * 0.1;

  return (
    <article
      ref={ref}
      className={`${s.root} ${inView ? s.visible : ''} ${project.category === 'academic' ? s.academic : ''}`}
      style={{ '--delay': `${delay}s` } as React.CSSProperties}
      aria-label={`${project.title} — ${CATEGORY_LABELS[project.category]}`}
    >
      {/* Image area */}
      <div className={s.imageWrap} onClick={onSelect} role="button" tabIndex={0}
           onKeyDown={(e) => e.key === 'Enter' && onSelect()}
           aria-label={`View ${project.title} case study`}>
        <div className={s.imageInner}>
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} project preview`}
              className={s.image}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className={s.placeholder}>
              <span className={s.placeholderText}>{project.title}</span>
            </div>
          )}
        </div>
        <div className={s.imageOverlay} aria-hidden="true">
          <span className={s.viewLabel}>View Project →</span>
        </div>
      </div>

      {/* Card meta */}
      <div className={s.meta}>
        <div className={s.metaLeft}>
          <div className={s.badges}>
            <span className={`${s.badge} ${s[`badge_${project.category}`]}`}>
              {CATEGORY_LABELS[project.category]}
            </span>
            <span className={`${s.badge} ${s[`badge_${project.status.replace('-','_')}`]}`}>
              <span className={s.statusDot} aria-hidden="true" />
              {STATUS_LABELS[project.status]}
            </span>
          </div>
          <h3 className={s.title}>{project.title}</h3>
          <p className={s.tagline}>{project.tagline}</p>
          <div className={s.tech}>
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className={s.techTag}>{tech}</span>
            ))}
            {project.technologies.length > 4 && (
              <span className={s.techTag}>+{project.technologies.length - 4}</span>
            )}
          </div>
        </div>

        <div className={s.metaRight}>
          <button
            className={s.expandBtn}
            onClick={onSelect}
            aria-label={`Read ${project.title} case study`}
            id={`project-expand-${project.id}`}
          >
            <span className={s.expandIcon} aria-hidden="true">↗</span>
          </button>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={s.liveLink}
              aria-label={`Visit ${project.title} live site`}
              onClick={(e) => e.stopPropagation()}
            >
              Visit site
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
