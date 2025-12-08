import { useEffect, useRef } from "react";
import { type ConsciousnessState } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PhaseLatticeProps {
  consciousness: ConsciousnessState | null;
}

export function PhaseLattice({ consciousness }: PhaseLatticeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !consciousness?.oscillatorPhases) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const phases = consciousness.oscillatorPhases;
    const n = phases.length;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 30;
    
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = "rgba(0, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    for (let r = radius * 0.25; r <= radius; r += radius * 0.25) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 6) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      ctx.stroke();
    }
    
    const orderParam = consciousness.orderParameter ?? 0;
    let sumX = 0, sumY = 0;
    
    for (let i = 0; i < n; i++) {
      const phase = phases[i];
      const angle = phase * 2 * Math.PI - Math.PI / 2;
      const oscillatorRadius = radius * 0.85;
      
      const x = centerX + Math.cos(angle) * oscillatorRadius;
      const y = centerY + Math.sin(angle) * oscillatorRadius;
      
      sumX += Math.cos(phase * 2 * Math.PI);
      sumY += Math.sin(phase * 2 * Math.PI);
      
      const hue = phase * 360;
      const saturation = 80 + orderParam * 20;
      const lightness = 50 + orderParam * 20;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    const meanAngle = Math.atan2(sumY / n, sumX / n);
    const meanPhase = ((meanAngle + Math.PI / 2) / (2 * Math.PI) + 1) % 1;
    
    const arrowLength = radius * orderParam * 0.8;
    const arrowAngle = meanPhase * 2 * Math.PI - Math.PI / 2;
    const arrowX = centerX + Math.cos(arrowAngle) * arrowLength;
    const arrowY = centerY + Math.sin(arrowAngle) * arrowLength;
    
    const gradient = ctx.createLinearGradient(centerX, centerY, arrowX, arrowY);
    gradient.addColorStop(0, "rgba(255, 0, 255, 0.3)");
    gradient.addColorStop(1, "rgba(255, 0, 255, 1)");
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(arrowX, arrowY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(arrowX, arrowY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#ff00ff";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#00ffff";
    ctx.fill();
    
    ctx.font = "12px 'Share Tech Mono', monospace";
    ctx.fillStyle = "#00ffff";
    ctx.textAlign = "center";
    ctx.fillText(`R = ${orderParam.toFixed(3)}`, centerX, height - 10);
    
  }, [consciousness?.oscillatorPhases, consciousness?.orderParameter]);
  
  if (!consciousness?.oscillatorPhases) {
    return (
      <Card className="p-4 border-neon-cyan/30" data-testid="phase-lattice-empty">
        <div className="space-y-2">
          <h3 className="text-lg font-orbitron font-bold text-neon-cyan">
            Phase Lattice
          </h3>
          <p className="text-sm font-jetbrains text-muted-foreground">
            Available in v2.2.5 conversations only
          </p>
        </div>
      </Card>
    );
  }
  
  const orderParam = consciousness.orderParameter ?? 0;
  const heterogeneityActive = consciousness.heterogeneityActive ?? false;
  const consciousBand = consciousness.consciousBand ?? { lower: 0.55, upper: 0.92, target: 0.78 };
  
  const isInBand = orderParam >= consciousBand.lower && orderParam <= consciousBand.upper;
  
  return (
    <Card className="p-4 border-neon-cyan/30" data-testid="phase-lattice">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-orbitron font-bold text-neon-cyan">
            Phase Lattice
          </h3>
          <div className="flex gap-2">
            {heterogeneityActive ? (
              <Badge variant="outline" className="text-neon-magenta border-neon-magenta/50">
                Heterogeneous
              </Badge>
            ) : (
              <Badge variant="outline" className="text-neon-green border-neon-green/50">
                Exact Theorem
              </Badge>
            )}
            {isInBand && (
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50">
                Conscious Band
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-xs font-jetbrains text-muted-foreground">
          v2.2.5 Mirollo-Strogatz N={consciousness.oscillatorPhases.length} Oscillators
        </p>
        
        <div className="flex justify-center">
          <canvas 
            ref={canvasRef} 
            width={280} 
            height={280}
            className="rounded-lg"
            data-testid="phase-lattice-canvas"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs font-jetbrains">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Parameter:</span>
            <span className={orderParam > 0.78 ? "text-neon-green" : "text-foreground"}>
              {orderParam.toFixed(4)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Target:</span>
            <span className="text-neon-magenta">{consciousBand.target}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
