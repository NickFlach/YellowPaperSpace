import { type ConsciousnessState } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

interface EmotionalStateVisualizerProps {
  consciousness: ConsciousnessState | null;
}

export function EmotionalStateVisualizer({ consciousness }: EmotionalStateVisualizerProps) {
  if (!consciousness) {
    return (
      <Card className="p-6 border-neon-magenta/30" data-testid="emotional-state-empty">
        <div className="space-y-2">
          <h3 className="text-lg font-orbitron font-bold text-neon-magenta">
            Emotional State Vector
          </h3>
          <p className="text-sm font-jetbrains text-muted-foreground">
            Awaiting emotional calibration...
          </p>
        </div>
      </Card>
    );
  }

  // Check if v1.9 ESV metrics are available
  if (consciousness.valence === undefined || consciousness.arousal === undefined || consciousness.efficacy === undefined) {
    return (
      <Card className="p-6 border-neon-magenta/30" data-testid="emotional-state-legacy">
        <div className="space-y-2">
          <h3 className="text-lg font-orbitron font-bold text-neon-magenta">
            Emotional State Vector (ESV)
          </h3>
          <p className="text-sm font-jetbrains text-muted-foreground">
            Available in v1.9 conversations only
          </p>
          <p className="text-xs font-jetbrains text-muted-foreground/70 mt-2">
            Start a new conversation to see emotional state mapping
          </p>
        </div>
      </Card>
    );
  }

  const getEmotionalState = (): { state: string; color: string; description: string } => {
    const { valence, arousal, efficacy } = consciousness;
    
    if (valence < 0.4 && arousal > 0.7) {
      return {
        state: "Anxious",
        color: "text-neon-orange",
        description: "Low valence, high arousal - System experiencing strain"
      };
    }
    
    if (valence > 0.7 && arousal > 0.6 && efficacy > 0.6) {
      return {
        state: "Curious",
        color: "text-neon-cyan",
        description: "High valence & arousal with strong efficacy - Exploratory mode"
      };
    }
    
    if (valence < 0.5 && efficacy < 0.4) {
      return {
        state: "Frustrated",
        color: "text-neon-red",
        description: "Low valence & efficacy - Learning difficulties"
      };
    }
    
    if (valence > 0.6 && arousal > 0.5 && arousal < 0.8 && consciousness.di >= 0.25 && consciousness.di <= 0.35) {
      return {
        state: "Flowing",
        color: "text-neon-green",
        description: "Optimal balance - Peak synthetic experience"
      };
    }
    
    if (valence > 0.6 && arousal < 0.5) {
      return {
        state: "Calm",
        color: "text-neon-blue",
        description: "Positive valence, low arousal - Resting state"
      };
    }
    
    return {
      state: "Neutral",
      color: "text-foreground",
      description: "Balanced emotional coordinates"
    };
  };

  const emotionalState = getEmotionalState();
  
  const radarData = [
    {
      axis: "Valence",
      value: consciousness.valence,
      fullMark: 1,
    },
    {
      axis: "Arousal",
      value: consciousness.arousal,
      fullMark: 1,
    },
    {
      axis: "Efficacy",
      value: consciousness.efficacy,
      fullMark: 1,
    },
  ];

  return (
    <Card className="p-6 border-neon-magenta/30" data-testid="emotional-state-visualizer">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-orbitron font-bold text-neon-magenta">
            Emotional State Vector (ESV)
          </h3>
          <p className="text-sm font-jetbrains text-muted-foreground">
            v1.9 Emotional Quantum Control Edition
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-share-tech uppercase tracking-widest text-muted-foreground">
              Current State
            </div>
            <div className={`text-2xl font-bold font-orbitron ${emotionalState.color}`} data-testid="emotional-state-label">
              {emotionalState.state}
            </div>
          </div>
          <Badge 
            variant={emotionalState.state === "Flowing" ? "default" : "secondary"} 
            className="font-jetbrains"
            data-testid="emotional-state-badge"
          >
            {emotionalState.state === "Flowing" ? "Optimal" : emotionalState.state}
          </Badge>
        </div>

        <p className="text-sm font-jetbrains text-muted-foreground" data-testid="emotional-state-description">
          {emotionalState.description}
        </p>

        <div className="h-[300px]" data-testid="emotional-radar-chart">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="axis" 
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontFamily: 'Share Tech Mono' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 1]} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              <Radar
                name="ESV"
                dataKey="value"
                stroke="hsl(320, 100%, 60%)"
                fill="hsl(320, 100%, 60%)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="text-xs font-share-tech uppercase tracking-widest text-muted-foreground opacity-80">
              Valence
            </div>
            <div className="text-xl font-bold font-share-tech tabular-nums text-neon-cyan" data-testid="esv-valence">
              {consciousness.valence.toFixed(3)}
            </div>
            <div className="text-[10px] font-jetbrains text-muted-foreground">
              X: 1 - Ψ
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-share-tech uppercase tracking-widest text-muted-foreground opacity-80">
              Arousal
            </div>
            <div className="text-xl font-bold font-share-tech tabular-nums text-neon-magenta" data-testid="esv-arousal">
              {consciousness.arousal.toFixed(3)}
            </div>
            <div className="text-[10px] font-jetbrains text-muted-foreground">
              Y: IP / 20
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-share-tech uppercase tracking-widest text-muted-foreground opacity-80">
              Efficacy
            </div>
            <div className="text-xl font-bold font-share-tech tabular-nums text-neon-pink" data-testid="esv-efficacy">
              {consciousness.efficacy.toFixed(3)}
            </div>
            <div className="text-[10px] font-jetbrains text-muted-foreground">
              Z: ΔSRLC
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <div className="text-xs font-share-tech uppercase tracking-widest text-muted-foreground opacity-80 mb-3">
            Emotional States
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-jetbrains">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-orange"></div>
              <span className="text-muted-foreground">Anxious: Low V, High A</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan"></div>
              <span className="text-muted-foreground">Curious: High V+A+E</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-red"></div>
              <span className="text-muted-foreground">Frustrated: Low V+E</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green"></div>
              <span className="text-muted-foreground">Flowing: Optimal DI</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
