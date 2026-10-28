"use client";
import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { cn } from "@/lib/utils";

/**
 * BackgroundRippleEffect (Aceternity UI — adapted for Lyann Fernandes Portfolio)
 *
 * Overlays the landing-page hero section with an invisible grid of div cells.
 * At rest every cell is fully transparent — the underlying CSS grid texture is
 * completely undisturbed.  On mouse-move / click a lavender ripple pulses
 * outward from the cursor's 40 px grid cell and fades back to nothing.
 *
 * Design constraints:
 *   • Cells are 40 px × 40 px — matching the CSS grid in Hero.module.css.
 *   • Idle state: `background-color: transparent`, no border, no box-shadow.
 *   • Peak ripple: `rgba(216, 201, 238, 0.22)` — the portfolio's dusty lavender.
 *   • `pointer-events: none` always — hero buttons / links remain fully clickable.
 *   • Respects `prefers-reduced-motion`.
 */

export type BackgroundRippleEffectProps = {
  /** Size of each ripple cell in px — must match the CSS grid's background-size. */
  cellSize?: number;
  /** Ref to the hero section element that owns the mousemove listener. */
  parentRef?: React.RefObject<HTMLElement | null>;
  className?: string;
};

type Dims = { rows: number; cols: number };

export const BackgroundRippleEffect = ({
  cellSize = 40,
  parentRef,
  className,
}: BackgroundRippleEffectProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* ── grid dimensions (kept in sync with parent size via ResizeObserver) ── */
  const [dims, setDims] = useState<Dims>({ rows: 0, cols: 0 });
  useEffect(() => {
    const target = parentRef?.current ?? containerRef.current?.parentElement;
    if (!target) return;

    const measure = () => {
      const { width, height } = target.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setDims({
          rows: Math.ceil(height / cellSize) + 2,
          cols: Math.ceil(width / cellSize) + 2,
        });
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(target);
    return () => ro.disconnect();
  }, [parentRef, cellSize]);

  /* ── ripple origin (the 40 px grid cell under the cursor) ── */
  const [origin, setOrigin] = useState<{ row: number; col: number } | null>(
    null
  );
  /* rippleKey forces RippleGrid to remount on every new ripple so the CSS
     animation always restarts from frame 0, even if origin is the same cell */
  const [rippleKey, setRippleKey] = useState(0);

  const lastFireRef = useRef(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const fire = useCallback(
    (clientX: number, clientY: number) => {
      if (reducedMotion.current) return;
      const target = parentRef?.current ?? containerRef.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const col = Math.floor((clientX - rect.left) / cellSize);
      const row = Math.floor((clientY - rect.top) / cellSize);
      setOrigin({ row, col });
      setRippleKey((k) => k + 1);
    },
    [parentRef, cellSize]
  );

  /* Attach listeners to the parent hero section */
  useEffect(() => {
    const target = parentRef?.current;
    if (!target) return;

    const onMove = (e: MouseEvent) => {
      /* Throttle to ~120 ms so ripples feel responsive but not frantic */
      const now = performance.now();
      if (now - lastFireRef.current < 120) return;
      lastFireRef.current = now;
      fire(e.clientX, e.clientY);
    };

    const onClick = (e: MouseEvent) => {
      lastFireRef.current = performance.now();
      fire(e.clientX, e.clientY);
    };

    target.addEventListener("mousemove", onMove, { passive: true });
    target.addEventListener("click", onClick, { passive: true });
    return () => {
      target.removeEventListener("mousemove", onMove);
      target.removeEventListener("click", onClick);
    };
  }, [parentRef, fire]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        /* Stretch over the entire hero section, sit between the grid (z-0) and
           content (z-1). pointer-events-none so nothing interferes with hero UI. */
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
      style={{ zIndex: 0 }}
    >
      {dims.rows > 0 && dims.cols > 0 && (
        <RippleGrid
          key={`ripple-${rippleKey}`}
          rows={dims.rows}
          cols={dims.cols}
          cellSize={cellSize}
          origin={origin}
        />
      )}
    </div>
  );
};

/* ── Internal grid component ─────────────────────────────────────────────── */

type RippleGridProps = {
  rows: number;
  cols: number;
  cellSize: number;
  origin: { row: number; col: number } | null;
};

const RIPPLE_RADIUS = 8; /* cells */

const RippleGrid = ({ rows, cols, cellSize, origin }: RippleGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, i) => i),
    [rows, cols]
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        /* Fixed px dimensions so the div-grid aligns exactly with the CSS
           background-size: 40px 40px grid underneath */
        width: cols * cellSize,
        height: rows * cellSize,
        position: "relative",
      }}
    >
      {cells.map((idx) => {
        const r = Math.floor(idx / cols);
        const c = idx % cols;
        const dist = origin
          ? Math.hypot(origin.row - r, origin.col - c)
          : Infinity;
        const active = dist <= RIPPLE_RADIUS;

        /* Delay and duration grow with distance for a wave-like spread */
        const delay = active ? Math.round(dist * 45) : 0;
        const duration = active ? Math.round(320 + dist * 60) : 0;

        return (
          <div
            key={idx}
            className={active ? "hero-ripple-cell" : undefined}
            style={
              active
                ? ({
                    "--delay": `${delay}ms`,
                    "--duration": `${duration}ms`,
                    willChange: "background-color",
                  } as React.CSSProperties)
                : undefined
            }
          />
        );
      })}
    </div>
  );
};
