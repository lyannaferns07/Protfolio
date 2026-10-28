"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SparklesCore } from "@/components/ui/sparkles";

export interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  firstImageAlt?: string;
  secondImageAlt?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
  showSparkles?: boolean;
  firstImageLabel?: React.ReactNode;
  secondImageLabel?: React.ReactNode;
}

export const Compare = ({
  firstImage = "",
  secondImage = "",
  firstImageAlt = "First comparison visual",
  secondImageAlt = "Second comparison visual",
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
  showSparkles = true,
  firstImageLabel,
  secondImageLabel,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = (elapsedTime % (autoplayDuration * 2)) / autoplayDuration;
      const percentage = progress <= 1 ? progress * 100 : (2 - progress) * 100;

      setSliderXPercent(percentage);
      autoplayRef.current = setTimeout(animate, 16);
    };

    animate();
  }, [autoplay, autoplayDuration]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  const updatePosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderXPercent(percent);
  }, []);

  // ── Mouse & Pointer Tracking (Hover + Drag) ────────────────
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(true);
      setIsMouseOver(true);
      stopAutoplay();
      updatePosition(e.clientX);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore if unsupported
      }
    },
    [stopAutoplay, updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // If slideMode is hover: follows cursor whenever hovering over the component
      // If dragging: follows cursor while pointer is pressed down
      if (slideMode === "hover" || isDragging) {
        setIsMouseOver(true);
        updatePosition(e.clientX);
      }
    },
    [slideMode, isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      if (autoplay) {
        startAutoplay();
      }
    },
    [autoplay, startAutoplay]
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsMouseOver(true);
      stopAutoplay();
      if (slideMode === "hover") {
        updatePosition(e.clientX);
      }
    },
    [slideMode, stopAutoplay, updatePosition]
  );

  const handlePointerLeave = useCallback(() => {
    setIsMouseOver(false);
    setIsDragging(false);
    if (slideMode === "hover") {
      setSliderXPercent(initialSliderPercentage);
    }
    if (autoplay) {
      startAutoplay();
    }
  }, [slideMode, initialSliderPercentage, autoplay, startAutoplay]);

  // ── Keyboard Accessibility ─────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSliderXPercent((prev) => Math.max(0, prev - 5));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSliderXPercent((prev) => Math.min(100, prev + 5));
      } else if (e.key === "Home") {
        e.preventDefault();
        setSliderXPercent(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setSliderXPercent(100);
      }
    },
    []
  );

  return (
    <div
      ref={sliderRef}
      role="slider"
      tabIndex={0}
      aria-label="Interactive before and after comparison slider"
      aria-valuenow={Math.round(sliderXPercent)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${Math.round(sliderXPercent)}% revealed`}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative overflow-hidden w-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BDA7DB] focus-visible:ring-offset-2",
        className
      )}
      style={{
        touchAction: "pan-y",
        cursor: slideMode === "hover" ? "col-resize" : isDragging ? "grabbing" : "grab",
      }}
    >
      {/* ── First Image Layer (clipped) ────────────────────── */}
      <div className="overflow-hidden w-full h-full relative z-20 pointer-events-none select-none">
        <AnimatePresence initial={false}>
          {firstImage ? (
            <motion.div
              className={cn(
                "absolute inset-0 z-20 shrink-0 w-full h-full select-none overflow-hidden",
                firstImageClassName
              )}
              animate={{
                clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
              }}
              transition={{
                type: isMouseOver ? "tween" : "spring",
                duration: isMouseOver ? 0 : 0.45,
                stiffness: 280,
                damping: 28,
              }}
            >
              <img
                alt={firstImageAlt}
                src={firstImage}
                className={cn(
                  "absolute inset-0 z-20 shrink-0 w-full h-full select-none object-cover",
                  firstImageClassName
                )}
                draggable={false}
                loading="eager"
                decoding="async"
              />
              {/* Optional first image floating badge */}
              {firstImageLabel && (
                <div className="absolute top-3 left-3 z-30 pointer-events-none">
                  {firstImageLabel}
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ── Second Image Layer (base) ──────────────────────── */}
      <AnimatePresence initial={false}>
        {secondImage ? (
          <div className="absolute inset-0 z-10 w-full h-full">
            <motion.img
              className={cn(
                "absolute top-0 left-0 z-10 w-full h-full select-none object-cover",
                secondImageClassname
              )}
              alt={secondImageAlt}
              src={secondImage}
              draggable={false}
              loading="eager"
              decoding="async"
            />
            {/* Optional second image floating badge */}
            {secondImageLabel && (
              <div className="absolute top-3 right-3 z-30 pointer-events-none">
                {secondImageLabel}
              </div>
            )}
          </div>
        ) : null}
      </AnimatePresence>

      {/* ── Vertical Divider, Sparkles & Handlebar ─────────── */}
      <AnimatePresence initial={false}>
        <motion.div
          className="h-full w-px absolute top-0 z-40 pointer-events-none"
          animate={{ left: `${sliderXPercent}%` }}
          transition={{
            type: isMouseOver ? "tween" : "spring",
            duration: isMouseOver ? 0 : 0.45,
            stiffness: 280,
            damping: 28,
          }}
        >
          {/* Subtle lavender hairline */}
          <div className="absolute inset-y-0 -left-[1px] w-[2px] bg-gradient-to-b from-transparent via-[#BDA7DB] to-transparent opacity-95" />
          <div className="absolute inset-y-0 -left-3 w-6 bg-[#D8C9EE]/30 blur-[4px] pointer-events-none" />

          {/* Glowing gradient wash along the divider */}
          <div className="w-24 h-full absolute top-0 -left-12 bg-gradient-to-r from-transparent via-[#D8C9EE]/25 to-transparent pointer-events-none z-20" />

          {/* Sparkles Particle Field (visible, floating, centered on divider line) */}
          {showSparkles && (
            <div className="w-16 h-full top-0 -left-8 absolute pointer-events-none z-30 overflow-visible">
              <MemoizedSparklesCore
                background="transparent"
                minSize={0.8}
                maxSize={2.4}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#FFFFFF"
              />
            </div>
          )}

          {/* Draggable/Interactive Handlebar */}
          {showHandlebar && (
            <div
              className={cn(
                "h-9 w-9 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 absolute z-50 flex items-center justify-center pointer-events-auto",
                "bg-white border-[1.5px] border-[#D8C9EE] text-[#111C32]",
                "shadow-[0_4px_16px_rgba(17,28,50,0.16),0_0_0_1px_rgba(216,201,238,0.4)]",
                "transition-transform duration-150 select-none",
                isDragging || isMouseOver
                  ? "scale-110 ring-4 ring-[#D8C9EE]/50 border-[#BDA7DB] bg-[#FAF9F6]"
                  : "hover:scale-105 hover:border-[#BDA7DB] hover:ring-2 hover:ring-[#D8C9EE]/30"
              )}
              style={{
                cursor: slideMode === "hover" ? "col-resize" : isDragging ? "grabbing" : "grab",
              }}
              aria-hidden="true"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#111C32]"
              >
                <path
                  d="M5.5 4L2.5 8L5.5 12M10.5 4L13.5 8L10.5 12"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const MemoizedSparklesCore = React.memo(SparklesCore);
