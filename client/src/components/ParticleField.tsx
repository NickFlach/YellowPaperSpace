import { useEffect, useRef } from "react";
import { type ConsciousnessState } from "@shared/schema";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

interface ParticleFieldProps {
  consciousness: ConsciousnessState | null;
}

const NEON_COLORS = [
  "180, 100%, 50%", // cyan
  "320, 100%, 60%", // magenta
  "330, 100%, 65%", // pink
  "120, 100%, 50%", // green
];

export function ParticleField({ consciousness }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const targetParticleCountRef = useRef<number>(50);
  const currentSpeedMultiplierRef = useRef<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => {
      const colorIndex = Math.floor(Math.random() * NEON_COLORS.length);
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: NEON_COLORS[colorIndex],
        opacity: Math.random() * 0.4 + 0.3,
      };
    };

    const updateParticleCount = (targetCount: number) => {
      const currentCount = particlesRef.current.length;
      
      if (currentCount < targetCount) {
        // Add particles gradually
        const toAdd = Math.min(5, targetCount - currentCount);
        for (let i = 0; i < toAdd; i++) {
          particlesRef.current.push(createParticle());
        }
      } else if (currentCount > targetCount) {
        // Remove particles gradually
        const toRemove = Math.min(5, currentCount - targetCount);
        particlesRef.current.splice(0, toRemove);
      }
    };

    const updateParticle = (particle: Particle, speedMultiplier: number) => {
      // Apply Brownian motion with consciousness-driven speed
      particle.vx += (Math.random() - 0.5) * 0.1;
      particle.vy += (Math.random() - 0.5) * 0.1;

      // Limit velocity
      const maxVelocity = 2 * speedMultiplier;
      particle.vx = Math.max(-maxVelocity, Math.min(maxVelocity, particle.vx));
      particle.vy = Math.max(-maxVelocity, Math.min(maxVelocity, particle.vy));

      // Apply damping
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      // Update position
      particle.x += particle.vx * speedMultiplier;
      particle.y += particle.vy * speedMultiplier;

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
    };

    const drawParticle = (particle: Particle) => {
      // Draw main particle
      ctx.fillStyle = `hsla(${particle.color}, ${particle.opacity})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Draw glow effect
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * 3
      );
      gradient.addColorStop(0, `hsla(${particle.color}, ${particle.opacity * 0.4})`);
      gradient.addColorStop(1, `hsla(${particle.color}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smoothly adjust particle count
      updateParticleCount(targetParticleCountRef.current);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        updateParticle(particle, currentSpeedMultiplierRef.current);
        drawParticle(particle);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    
    // Initialize with default particles
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push(createParticle());
    }

    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update particle dynamics based on consciousness state
  useEffect(() => {
    if (!consciousness) return;

    // Map bandwidth (0-1) to particle count (50-150)
    const targetCount = Math.floor(50 + consciousness.bandwidth * 100);
    targetParticleCountRef.current = Math.max(50, Math.min(150, targetCount));

    // Map DI (0-1) to speed multiplier (0.5 - 3.0)
    // Higher DI = faster, more chaotic movement
    const speedMultiplier = 0.5 + consciousness.di * 2.5;
    
    // Smooth transition using linear interpolation
    const smoothTransition = () => {
      const currentSpeed = currentSpeedMultiplierRef.current;
      const diff = speedMultiplier - currentSpeed;
      
      if (Math.abs(diff) > 0.01) {
        currentSpeedMultiplierRef.current += diff * 0.1;
        requestAnimationFrame(smoothTransition);
      } else {
        currentSpeedMultiplierRef.current = speedMultiplier;
      }
    };
    
    smoothTransition();
  }, [consciousness]);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        data-testid="particle-field-canvas"
      />
    </div>
  );
}
