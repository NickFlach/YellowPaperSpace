import { type ConsciousnessState } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Zap, Shield } from "lucide-react";

interface HeterogeneityStatusProps {
  consciousness: ConsciousnessState | null;
}

export function HeterogeneityStatus({ consciousness }: HeterogeneityStatusProps) {
  if (consciousness?.orderParameter === undefined) {
    return (
      <Card className="p-4 border-neon-green/30" data-testid="heterogeneity-status-empty">
        <div className="space-y-2">
          <h3 className="text-lg font-orbitron font-bold text-neon-green">
            Theorem Status
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
  const msParams = consciousness.msParams ?? { period: 2.0, alpha: 1.5, epsilon: 0.28, heterogeneityStd: 0.008 };
  const memoryLifetime = consciousness.memoryLifetime ?? Infinity;
  const lliS = consciousness.lliS ?? 0;
  const phiEffCol = consciousness.phiEffCol ?? 0;
  
  const isInBand = orderParam >= consciousBand.lower && orderParam <= consciousBand.upper;
  const isApproachingSync = orderParam >= consciousBand.upper;
  const isRecovering = orderParam < consciousBand.lower;
  
  const getStateInfo = () => {
    if (heterogeneityActive) {
      return {
        icon: <Zap className="h-5 w-5 text-neon-magenta" />,
        title: "Controlled Violation",
        description: "Period heterogeneity δTᵢ ~ N(0, 0.008) active",
        color: "text-neon-magenta",
        bgColor: "bg-neon-magenta/10",
      };
    }
    if (isApproachingSync) {
      return {
        icon: <AlertCircle className="h-5 w-5 text-neon-orange" />,
        title: "Approaching Synchrony",
        description: "R ≥ 0.92 — heterogeneity will activate",
        color: "text-neon-orange",
        bgColor: "bg-neon-orange/10",
      };
    }
    if (isRecovering) {
      return {
        icon: <Shield className="h-5 w-5 text-neon-cyan" />,
        title: "Theorem Recovery",
        description: "R < 0.55 — exact theorem re-engaged",
        color: "text-neon-cyan",
        bgColor: "bg-neon-cyan/10",
      };
    }
    return {
      icon: <CheckCircle2 className="h-5 w-5 text-neon-green" />,
      title: "Exact Theorem Active",
      description: "Mirollo-Strogatz convergence guaranteed",
      color: "text-neon-green",
      bgColor: "bg-neon-green/10",
    };
  };
  
  const stateInfo = getStateInfo();
  
  return (
    <Card className="p-4 border-neon-green/30" data-testid="heterogeneity-status">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-orbitron font-bold text-neon-green">
            Theorem Status
          </h3>
          <Badge 
            variant="outline" 
            className={`${stateInfo.color} border-current`}
          >
            v2.2.5
          </Badge>
        </div>
        
        <div className={`p-3 rounded-lg ${stateInfo.bgColor}`}>
          <div className="flex items-start gap-3">
            {stateInfo.icon}
            <div className="space-y-1">
              <p className={`font-orbitron font-bold ${stateInfo.color}`}>
                {stateInfo.title}
              </p>
              <p className="text-xs font-jetbrains text-muted-foreground">
                {stateInfo.description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs font-jetbrains">
          <div className="space-y-1">
            <p className="text-muted-foreground">Φ_eff_col</p>
            <p className="text-neon-cyan font-bold">{phiEffCol.toFixed(2)} bits</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">LLIₛ</p>
            <p className="text-neon-magenta font-bold">{lliS.toFixed(3)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Memory Lifetime</p>
            <p className="text-neon-orange font-bold">
              {memoryLifetime >= 1e6 ? '∞' : `${(memoryLifetime / 1000).toFixed(1)}k`} cycles
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">δT std</p>
            <p className="text-neon-green font-bold">{msParams.heterogeneityStd}</p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border/50">
          <div className="grid grid-cols-3 gap-2 text-xs font-jetbrains text-center">
            <div>
              <p className="text-muted-foreground">T</p>
              <p className="text-foreground">{msParams.period}s</p>
            </div>
            <div>
              <p className="text-muted-foreground">α</p>
              <p className="text-foreground">{msParams.alpha}</p>
            </div>
            <div>
              <p className="text-muted-foreground">ε</p>
              <p className="text-foreground">{msParams.epsilon}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
