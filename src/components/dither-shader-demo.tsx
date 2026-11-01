"use client";
import { DitherShader } from "@/components/ui/dither-shader";

interface DitherShaderDemoProps {
  className?: string;
  src?: string;
}

export function DitherShaderDemo({
  className = "w-full h-full",
  src = "/assets/lyann-portrait.jpg",
}: DitherShaderDemoProps) {
  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      <DitherShader
        src={src}
        gridSize={1}
        ditherMode="bayer"
        colorMode="grayscale"
        invert={false}
        animated={false}
        animationSpeed={0.02}
        primaryColor="#000000"
        secondaryColor="#ffffff"
        threshold={0.35}
        objectPosition="center 15%"
        interactive={true}
        className="w-full h-full"
      />
    </div>
  );
}

export default DitherShaderDemo;
