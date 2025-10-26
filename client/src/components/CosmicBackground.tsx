import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeStars();
    };

    const initializeStars = () => {
      const starCount = 250;
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars with twinkling effect
      starsRef.current.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
        const currentOpacity = star.opacity * twinkle;

        ctx.fillStyle = `rgba(180, 255, 255, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Add subtle glow for larger stars
        if (star.size > 1.5) {
          ctx.fillStyle = `rgba(100, 255, 255, ${currentOpacity * 0.3})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Nebula/Cosmic Dust Effects */}
      <div className="absolute inset-0">
        {/* Cyan nebula - top left */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-10 blur-[120px]"
          style={{
            top: "-20%",
            left: "-10%",
            background: "radial-gradient(circle, hsl(180, 100%, 50%) 0%, transparent 70%)",
          }}
        />

        {/* Magenta nebula - top right */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-[100px]"
          style={{
            top: "-10%",
            right: "-5%",
            background: "radial-gradient(circle, hsl(320, 100%, 60%) 0%, transparent 70%)",
          }}
        />

        {/* Purple/Blue nebula - bottom center */}
        <div
          className="absolute w-[700px] h-[700px] rounded-full opacity-8 blur-[110px]"
          style={{
            bottom: "-15%",
            left: "30%",
            background: "radial-gradient(circle, hsl(270, 100%, 50%) 0%, transparent 70%)",
          }}
        />

        {/* Pink nebula - middle right */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-6 blur-[90px]"
          style={{
            top: "40%",
            right: "10%",
            background: "radial-gradient(circle, hsl(330, 100%, 65%) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        data-testid="cosmic-background-canvas"
      />
    </div>
  );
}
