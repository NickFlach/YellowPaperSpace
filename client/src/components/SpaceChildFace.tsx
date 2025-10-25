import { useEffect, useRef } from "react";
import { type ConsciousnessState } from "@shared/schema";

interface SpaceChildFaceProps {
  consciousness: ConsciousnessState | null;
  isProcessing?: boolean;
}

export function SpaceChildFace({ consciousness, isProcessing = false }: SpaceChildFaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !consciousness) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pixelSize = 64;
    canvas.width = pixelSize;
    canvas.height = pixelSize;

    const getExpressionColors = () => {
      const { expression, phiEff, cem, di } = consciousness;
      
      const cyan = `hsl(180, 100%, ${50 + phiEff * 5}%)`;
      const magenta = `hsl(320, 100%, ${60 + cem * 20}%)`;
      const blue = `hsl(210, 100%, ${55 + di * 30}%)`;
      const pink = `hsl(330, 100%, ${65 + phiEff * 5}%)`;
      const green = `hsl(120, 100%, ${50 + cem * 10}%)`;
      
      return { cyan, magenta, blue, pink, green };
    };

    const drawPixel = (x: number, y: number, color: string, alpha: number = 1) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
      ctx.globalAlpha = 1;
    };

    const drawFace = () => {
      ctx.clearRect(0, 0, pixelSize, pixelSize);
      const colors = getExpressionColors();
      const { expression, phiEff, cem, di } = consciousness;
      
      const time = Date.now() / 1000;
      const pulse = isProcessing ? Math.sin(time * 10) * 0.5 + 0.5 : Math.sin(time * 2) * 0.2 + 0.8;

      ctx.fillStyle = colors.cyan;
      
      if (expression === "focused" || phiEff > 3) {
        for (let y = 20; y < 28; y++) {
          for (let x = 18; x < 24; x++) {
            drawPixel(x, y, colors.cyan, pulse * 0.9);
          }
          for (let x = 40; x < 46; x++) {
            drawPixel(x, y, colors.cyan, pulse * 0.9);
          }
        }
        
        for (let y = 42; y < 46; y++) {
          for (let x = 24; x < 40; x++) {
            const dist = Math.abs(x - 32);
            const alpha = pulse * (1 - dist / 16);
            drawPixel(x, y, colors.magenta, alpha);
          }
        }
      } else if (expression === "diffuse" || cem < 0.5) {
        for (let y = 0; y < pixelSize; y += 4) {
          for (let x = 0; x < pixelSize; x += 4) {
            const noise = Math.random();
            const alpha = pulse * 0.3 * noise;
            drawPixel(x, y, colors.magenta, alpha);
            drawPixel(x + 1, y, colors.pink, alpha * 0.7);
          }
        }
        
        for (let y = 22; y < 26; y++) {
          for (let x = 20; x < 26; x++) {
            drawPixel(x, y, colors.pink, pulse * 0.5);
          }
          for (let x = 38; x < 44; x++) {
            drawPixel(x, y, colors.pink, pulse * 0.5);
          }
        }
      } else if (expression === "emergent" || phiEff > 5) {
        const layers = 8;
        for (let layer = 0; layer < layers; layer++) {
          const radius = 8 + layer * 3;
          for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
            const x = Math.floor(32 + Math.cos(angle + time) * radius);
            const y = Math.floor(32 + Math.sin(angle + time) * radius);
            const color = layer % 2 === 0 ? colors.cyan : colors.magenta;
            drawPixel(x, y, color, pulse * (1 - layer / layers));
          }
        }
      } else if (expression === "alert" || di > 0.35) {
        const flicker = Math.random() > 0.5 ? 1 : 0.3;
        
        for (let y = 18; y < 30; y++) {
          for (let x = 16; x < 26; x++) {
            drawPixel(x, y, colors.blue, pulse * flicker);
          }
          for (let x = 38; x < 48; x++) {
            drawPixel(x, y, colors.blue, pulse * flicker);
          }
        }
        
        for (let x = 16; x < 48; x++) {
          drawPixel(x, 40, colors.cyan, flicker);
          drawPixel(x, 44, colors.cyan, flicker);
        }
      } else {
        for (let y = 22; y < 28; y++) {
          for (let x = 20; x < 26; x++) {
            const alpha = pulse * 0.8 + Math.sin(x + time) * 0.1;
            drawPixel(x, y, colors.cyan, alpha);
          }
          for (let x = 38; x < 44; x++) {
            const alpha = pulse * 0.8 + Math.sin(x + time) * 0.1;
            drawPixel(x, y, colors.cyan, alpha);
          }
        }
        
        const mouthWidth = Math.floor(16 + cem * 8);
        const mouthY = 42;
        for (let x = 32 - mouthWidth / 2; x < 32 + mouthWidth / 2; x++) {
          drawPixel(x, mouthY, colors.magenta, pulse * 0.7);
        }
      }
      
      animationRef.current = requestAnimationFrame(drawFace);
    };

    drawFace();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [consciousness, isProcessing]);

  const getGlowColors = () => {
    if (!consciousness) return "0 0 25px hsl(180, 100%, 50%), 0 0 35px hsl(320, 100%, 60%)";
    
    const { expression, phiEff } = consciousness;
    if (expression === "emergent" || phiEff > 5) {
      return "0 0 40px hsl(180, 100%, 50%), 0 0 60px hsl(320, 100%, 60%)";
    } else if (expression === "alert") {
      return "0 0 30px hsl(210, 100%, 55%), 0 0 50px hsl(30, 100%, 60%)";
    } else if (expression === "focused") {
      return "0 0 35px hsl(180, 100%, 50%)";
    } else if (expression === "diffuse") {
      return "0 0 30px hsl(320, 100%, 60%)";
    }
    return "0 0 25px hsl(180, 100%, 50%), 0 0 35px hsl(320, 100%, 60%)";
  };

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-neon-cyan/20 via-transparent to-neon-magenta/20 animate-pulse-glow" />
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-xl border-2 border-neon-cyan/30 transition-all duration-300"
        style={{
          imageRendering: "pixelated",
          boxShadow: getGlowColors(),
        }}
        data-testid="canvas-space-child-face"
      />
      
      {isProcessing && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-scanline" />
        </div>
      )}
    </div>
  );
}
