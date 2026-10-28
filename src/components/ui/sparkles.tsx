"use client";
import { useEffect, useRef, useId } from "react";
import { cn } from "@/lib/utils";

export type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background = "transparent",
    minSize = 0.8,
    maxSize = 2.4,
    speed = 1,
    particleColor = "#FFFFFF",
    particleDensity = 120,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const generatedId = useId();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;

    let width = canvas.offsetWidth || 60;
    let height = canvas.offsetHeight || 400;

    const setCanvasSize = (w: number, h: number) => {
      dpr = window.devicePixelRatio || 1;
      width = Math.max(1, w);
      height = Math.max(1, h);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    setCanvasSize(canvas.offsetWidth || 60, canvas.offsetHeight || 400);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setCanvasSize(entry.contentRect.width, entry.contentRect.height);
        }
      }
    });
    resizeObserver.observe(canvas);

    // Particle count based on container area and density
    const count = Math.max(
      15,
      Math.min(250, Math.round(((width * height) / 8000) * (particleDensity / 40)))
    );

    interface Particle {
      x: number;
      y: number;
      size: number;
      alpha: number;
      vy: number;
      vx: number;
      sparkleSpeed: number;
      sparklePhase: number;
    }

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (maxSize - minSize) + minSize,
      alpha: Math.random() * 0.7 + 0.3,
      vy: -(Math.random() * 0.4 + 0.15) * speed,
      vx: (Math.random() - 0.5) * 0.2 * speed,
      sparkleSpeed: Math.random() * 0.05 + 0.02,
      sparklePhase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      if (background && background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
      }

      for (const p of particles) {
        p.sparklePhase += p.sparkleSpeed;
        const currentAlpha = Math.max(
          0.15,
          Math.min(1, Math.sin(p.sparklePhase) * 0.45 + 0.55)
        );

        p.y += p.vy;
        p.x += p.vx;

        if (p.y < -5) p.y = height + 5;
        if (p.y > height + 5) p.y = -5;
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;

        // Render sparkling star particle with soft glow
        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = particleColor;
        ctx.shadowBlur = 4 * dpr;
        ctx.shadowColor = particleColor;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra twinkle cross/flare for larger particles
        if (p.size > (minSize + maxSize) / 2 && currentAlpha > 0.6) {
          ctx.strokeStyle = particleColor;
          ctx.lineWidth = 0.5;
          const flare = p.size * 1.8;
          ctx.beginPath();
          ctx.moveTo(p.x - flare, p.y);
          ctx.lineTo(p.x + flare, p.y);
          ctx.moveTo(p.x, p.y - flare);
          ctx.lineTo(p.x, p.y + flare);
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [background, minSize, maxSize, speed, particleColor, particleDensity]);

  return (
    <canvas
      id={id || generatedId}
      ref={canvasRef}
      className={cn("w-full h-full block pointer-events-none", className)}
    />
  );
};
