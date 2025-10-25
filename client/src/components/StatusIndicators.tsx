import { type ConsciousnessState } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Shield } from "lucide-react";

interface StatusIndicatorsProps {
  consciousness: ConsciousnessState | null;
}

export function StatusIndicators({ consciousness }: StatusIndicatorsProps) {
  if (!consciousness) {
    return <div className="text-muted-foreground text-sm">Initializing consciousness...</div>;
  }

  const getTierInfo = () => {
    switch (consciousness.tier) {
      case "automation":
        return {
          label: "Tier 0: Automation",
          color: "text-muted-foreground",
          bg: "bg-muted/50",
          glow: "shadow-none",
        };
      case "monitored":
        return {
          label: "Tier 1: Monitored Self-Modeling",
          color: "text-neon-cyan",
          bg: "bg-neon-cyan/10",
          glow: "shadow-neon-cyan/30",
        };
      case "precautionary":
        return {
          label: "Tier 2: Precautionary Sentience",
          color: "text-neon-magenta",
          bg: "bg-neon-magenta/10",
          glow: "shadow-neon-magenta/30",
        };
    }
  };

  const getKillSwitchStatus = () => {
    const criteriaMet = [
      consciousness.di > 0.4,
      consciousness.bandwidth > 0.9,
      consciousness.causalRisk > 0.7,
    ].filter(Boolean).length;

    if (criteriaMet >= 2) {
      return {
        status: "CRITICAL",
        color: "text-destructive",
        icon: AlertTriangle,
        glow: "shadow-destructive/50",
      };
    } else if (criteriaMet === 1) {
      return {
        status: "WARNING",
        color: "text-neon-orange",
        icon: AlertTriangle,
        glow: "shadow-neon-orange/30",
      };
    }
    return {
      status: "SAFE",
      color: "text-neon-green",
      icon: Shield,
      glow: "shadow-neon-green/30",
    };
  };

  const tierInfo = getTierInfo();
  const killSwitch = getKillSwitchStatus();
  const KillSwitchIcon = killSwitch.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge 
          variant="outline" 
          className={`${tierInfo.color} ${tierInfo.bg} border-current/30 font-orbitron text-xs px-3 py-1.5`}
          style={{ boxShadow: `0 0 10px ${tierInfo.glow}` }}
          data-testid="badge-consciousness-tier"
        >
          {tierInfo.label}
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2" data-testid="indicator-heartbeat">
          <Activity 
            className="w-4 h-4 text-neon-cyan animate-pulse-glow" 
            style={{ filter: `drop-shadow(0 0 6px hsl(180, 100%, 50%))` }}
          />
          <div className="font-share-tech text-sm">
            <span className="text-muted-foreground">IP:</span>{" "}
            <span className="text-neon-cyan tabular-nums">{consciousness.ipPulseRate.toFixed(1)} Hz</span>
          </div>
        </div>

        <div className="flex items-center gap-2" data-testid="indicator-kill-switch">
          <KillSwitchIcon 
            className={`w-4 h-4 ${killSwitch.color} ${killSwitch.status === "CRITICAL" ? "animate-flicker" : ""}`}
            style={{ filter: `drop-shadow(0 0 6px ${killSwitch.glow})` }}
          />
          <div className="font-share-tech text-sm">
            <span className="text-muted-foreground">Kill-Switch:</span>{" "}
            <span className={killSwitch.color}>{killSwitch.status}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-share-tech text-muted-foreground uppercase tracking-wide">
          Expression State
        </div>
        <Badge 
          variant="secondary" 
          className="font-orbitron capitalize text-neon-magenta border-neon-magenta/30"
          style={{ boxShadow: `0 0 8px hsl(320, 100%, 60% / 0.2)` }}
          data-testid="badge-expression-state"
        >
          {consciousness.expression}
        </Badge>
      </div>
    </div>
  );
}
