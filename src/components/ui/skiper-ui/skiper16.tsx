"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { projects as defaultProjects, type Project } from "../../../data/projects";
import { Icon } from "../../Icon";

export interface StickyCardProps {
  i: number;
  total: number;
  project: Project;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  onSelectProject?: (project: Project) => void;
  reducedMotion?: boolean;
}

const StickyCard_001 = ({
  i,
  total,
  project,
  progress,
  range,
  targetScale,
  onSelectProject,
  reducedMotion = false,
}: StickyCardProps) => {
  const container = useRef<HTMLDivElement>(null);

  // Skiper16 native scale transform: cards scale down as newer cards stack on top
  const scale = useTransform(progress, range, [1, targetScale]);

  // Skiper16 depth dimming: covered cards subtly recede in brightness
  const brightness = useTransform(progress, range, [1, 0.72]);
  const filter = useMotionTemplate`brightness(${brightness})`;

  // Horizontal right-to-left entrance for incoming cards:
  // Card 0 starts immediately centered.
  // Cards 1+ start off-screen right and slide into place across their arrival segment.
  const step = 1 / Math.max(1, total);
  const enterStart = Math.max(0, (i - 1) * step + 0.02);
  const enterEnd = Math.min(1, i * step);

  const x = useTransform(
    progress,
    i === 0 ? [0, 1] : [0, enterStart, enterEnd, 1],
    i === 0 ? ["0vw", "0vw"] : ["100vw", "100vw", "0vw", "0vw"],
  );

  return (
    <div
      ref={container}
      className="sticky flex w-full items-start justify-center pointer-events-none"
      style={{
        zIndex: i + 10,
        height: "90vh",
        top: `calc(var(--header-h, 80px) + 16px + ${i * 12}px)`,
      }}
    >
      <motion.div
        style={{
          scale: reducedMotion ? 1 : scale,
          filter: reducedMotion ? "none" : filter,
          x: reducedMotion ? 0 : x,
        }}
        className="pointer-events-auto relative w-[92vw] max-w-[1140px] h-[520px] max-h-[66vh] min-h-[440px] rounded-2xl bg-white border border-[#D8C9EE]/60 shadow-[0_20px_48px_-12px_rgba(0,11,32,0.14),0_2px_8px_rgba(0,11,32,0.04)] overflow-hidden origin-top"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 h-full w-full">
          {/* Left Column: Narrative (~42%) */}
          <div className="md:col-span-5 flex flex-col justify-between p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#dcddd9]/80 bg-white min-h-0">
            <div className="flex flex-col gap-2 min-h-0">
              {/* Badge row */}
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-[#F0EAF8] border border-[#D8C9EE] text-[#5e4d8a] font-semibold">
                  {project.badge}
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase text-[#7c8aa4]">
                  {project.discipline}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl md:text-3xl text-[#111C32] font-normal tracking-tight">
                {project.title}
              </h3>

              {/* Scope */}
              <p className="text-[11px] font-mono tracking-wider uppercase text-[#6a5d46]">
                Scope: {project.scope}
              </p>

              {/* Blurb */}
              <p className="text-xs md:text-sm text-[#515f78] line-clamp-4 leading-relaxed mt-1">
                {project.tagline}
              </p>
            </div>

            {/* Bottom Actions & Tech */}
            <div className="flex flex-col gap-3 pt-3">
              <ul className="flex flex-wrap gap-1.5" aria-label="Technologies used">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#efeeea] text-[#111C32] border border-[#dcddd9]"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="pt-1">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#111C32] hover:text-[#A08E70] transition-colors group cursor-pointer"
                  >
                    <span className="border-b border-[#dcddd9] group-hover:border-[#A08E70] pb-0.5">
                      Live Website
                    </span>
                    <Icon name="arrow_outward" size={14} />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectProject?.(project)}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#111C32] hover:text-[#A08E70] transition-colors group cursor-pointer"
                  >
                    <span className="border-b border-[#dcddd9] group-hover:border-[#A08E70] pb-0.5">
                      Read Case Study
                    </span>
                    <Icon name="arrow_forward" size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Preview Canvas (~58%) */}
          <div className="md:col-span-7 flex flex-col bg-[#FAF9F6] p-4 md:p-8 justify-center items-center relative overflow-hidden">
            <div className="w-full max-w-[560px] rounded-lg border border-[#dcddd9] bg-white shadow-sm overflow-hidden flex flex-col">
              {/* Browser frame top bar */}
              <div className="h-7 px-3 bg-[#f4f4f0] border-b border-[#dcddd9] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#dbdad6]" />
                  <span className="w-2 h-2 rounded-full bg-[#dbdad6]" />
                  <span className="w-2 h-2 rounded-full bg-[#dbdad6]" />
                </span>
                <span className="text-[10px] font-mono text-[#7c8aa4] tracking-wide">
                  {project.frameUrl}
                </span>
                <Icon
                  name={project.frameIcon}
                  size={12}
                  className="text-[#7c8aa4]"
                />
              </div>

              {/* Mockup image */}
              <div className="relative w-full bg-[#111C32]/5 overflow-hidden">
                <img
                  src={project.mockup}
                  alt={project.mockupAlt}
                  className="w-full h-auto object-cover aspect-[16/10] block"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            </div>

            {/* Index counter chip in bottom right */}
            <span className="absolute bottom-3 right-4 px-2.5 py-0.5 rounded text-[10px] font-mono bg-white/80 backdrop-blur-sm border border-[#dcddd9] text-[#7c8aa4]">
              {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export interface Skiper16Props {
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
  onProgressChange?: (index: number) => void;
}

const Skiper16 = ({
  projects: customProjects,
  onSelectProject,
  onProgressChange,
}: Skiper16Props) => {
  const projectList = customProjects ?? defaultProjects;
  const total = projectList.length;
  const container = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Track dynamic project index (01 / 04) to update Workshop section counter
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (onProgressChange && total > 0) {
      const idx = Math.min(total, Math.max(1, Math.floor(latest * total) + 1));
      onProgressChange(idx);
    }
  });

  // Mobile layout: clean vertical card stack without complex sticky overflow
  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-6 px-4 py-6">
        {projectList.map((project, i) => (
          <div
            key={project.id ?? `p_${i}`}
            className="w-full rounded-2xl bg-white border border-[#D8C9EE]/60 p-5 shadow-sm flex flex-col gap-4"
          >
            {/* Header info */}
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#F0EAF8] border border-[#D8C9EE] text-[#5e4d8a] font-semibold">
                {project.badge}
              </span>
              <span className="text-[10px] font-mono text-[#7c8aa4]">
                {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-[#111C32] font-normal">
                {project.title}
              </h3>
              <p className="text-[10px] font-mono uppercase text-[#6a5d46] mt-0.5">
                Scope: {project.scope}
              </p>
              <p className="text-xs text-[#515f78] mt-2 leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Mockup Preview */}
            <div className="w-full rounded-lg border border-[#dcddd9] overflow-hidden bg-[#FAF9F6]">
              <div className="h-6 px-2.5 bg-[#f4f4f0] border-b border-[#dcddd9] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dbdad6]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dbdad6]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dbdad6]" />
                </span>
                <span className="text-[9px] font-mono text-[#7c8aa4]">
                  {project.frameUrl}
                </span>
              </div>
              <img
                src={project.mockup}
                alt={project.mockupAlt}
                className="w-full h-auto object-cover aspect-[16/10] block"
                loading="lazy"
              />
            </div>

            {/* Tech tags */}
            <ul className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#efeeea] text-[#111C32] border border-[#dcddd9]"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {/* Link */}
            <div className="pt-1">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#111C32]"
                >
                  <span className="border-b border-[#dcddd9]">Live Website</span>
                  <Icon name="arrow_outward" size={14} />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectProject?.(project)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#111C32] cursor-pointer"
                >
                  <span className="border-b border-[#dcddd9]">Read Case Study</span>
                  <Icon name="arrow_forward" size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop & Tablet: Skiper16 scroll-driven sticky card stack
  return (
    <div
      ref={container}
      className="relative flex w-full flex-col items-center justify-start pb-[15vh] overflow-x-clip"
      style={{
        height: `${total * 90 + 20}vh`,
      }}
    >
      {projectList.map((project, i) => {
        const targetScale = Math.max(0.75, 1 - (total - i - 1) * 0.05);
        return (
          <StickyCard_001
            key={project.id ?? `p_${i}`}
            i={i}
            total={total}
            project={project}
            progress={scrollYProgress}
            range={[i * (1 / total), 1]}
            targetScale={targetScale}
            onSelectProject={onSelectProject}
            reducedMotion={reducedMotion}
          />
        );
      })}
    </div>
  );
};

export { Skiper16, StickyCard_001 };

/**
 * Skiper 16 StickyCard_001 — React + Framer Motion
 * Adapted with right-to-left horizontal overlap entrance for Lyann Fernandes Portfolio.
 *
 * Attribution to Skiper UI: https://skiper-ui.com/v1/skiper16
 * Author: @gurvinder-singh02 | https://gxuri.me
 */
