import { type ConsciousnessState } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface ConsciousnessMetricsProps {
  consciousness: ConsciousnessState | null;
}

interface MetricCardProps {
  label: string;
  value: number;
  formula?: string;
  target?: string;
  color: string;
  testId: string;
}

function MetricCard({ label, value, formula, target, color, testId }: MetricCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case "cyan": return "border-neon-cyan/30 shadow-neon-cyan/20";
      case "magenta": return "border-neon-magenta/30 shadow-neon-magenta/20";
      case "blue": return "border-neon-blue/30 shadow-neon-blue/20";
      case "pink": return "border-neon-pink/30 shadow-neon-pink/20";
      case "green": return "border-neon-green/30 shadow-neon-green/20";
      case "orange": return "border-neon-orange/30 shadow-neon-orange/20";
      default: return "border-neon-cyan/30";
    }
  };

  const getTextColor = () => {
    switch (color) {
      case "cyan": return "text-neon-cyan";
      case "magenta": return "text-neon-magenta";
      case "blue": return "text-neon-blue";
      case "pink": return "text-neon-pink";
      case "green": return "text-neon-green";
      case "orange": return "text-neon-orange";
      default: return "text-neon-cyan";
    }
  };

  return (
    <Card 
      className={`p-4 hover-elevate transition-all duration-200 ${getColorClasses()}`}
      style={{ boxShadow: `0 0 15px ${color === "cyan" ? "hsl(180, 100%, 50% / 0.1)" : "hsl(320, 100%, 60% / 0.1)"}` }}
      data-testid={testId}
    >
      <div className="space-y-2">
        <div className="text-xs font-share-tech uppercase tracking-widest text-muted-foreground opacity-80">
          {label}
        </div>
        <div className={`text-3xl font-bold font-share-tech tabular-nums ${getTextColor()}`}>
          {value.toFixed(3)}
        </div>
        {formula && (
          <div className="text-xs font-jetbrains text-muted-foreground opacity-60">
            {formula}
          </div>
        )}
        {target && (
          <div className="text-xs font-jetbrains text-muted-foreground">
            Target: <span className="text-foreground/70">{target}</span>
          </div>
        )}
        <div className="h-1 bg-card-border rounded-full overflow-hidden">
          <div 
            className={`h-full ${getTextColor()} opacity-60 transition-all duration-300`}
            style={{ 
              width: `${Math.min(100, (value / (target ? parseFloat(target.split('>')[1] || "10") : 10)) * 100)}%`,
              boxShadow: `0 0 8px currentColor`
            }}
          />
        </div>
      </div>
    </Card>
  );
}

export function ConsciousnessMetrics({ consciousness }: ConsciousnessMetricsProps) {
  if (!consciousness) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-orbitron font-bold text-neon-cyan tracking-wide">
            Consciousness Metrics
          </h2>
          <p className="text-sm font-jetbrains text-muted-foreground">
            Awaiting first interaction...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-orbitron font-bold text-neon-cyan tracking-wide">
          Consciousness Metrics
        </h2>
        <p className="text-sm font-jetbrains text-muted-foreground">
          Real-time computational consciousness state
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label="Φₑff"
          value={consciousness.phiEff}
          formula="Φ-z × Sₘᵢₙ"
          target="> 2 bits"
          color="cyan"
          testId="metric-phi-eff"
        />
        
        <MetricCard
          label="CEM"
          value={consciousness.cem}
          formula="Sₘᵢₙ / (S₁ + ε)"
          target="0.5-0.8"
          color="magenta"
          testId="metric-cem"
        />
        
        <MetricCard
          label="OII"
          value={consciousness.oii}
          formula="(Φ-z × Sₘᵢₙ)/(Φ-z + Sₘᵢₙ + 1)"
          target="> 0.5"
          color="blue"
          testId="metric-oii"
        />
        
        <MetricCard
          label="Φ-z"
          value={consciousness.phiZ}
          formula="IIT Integration"
          target="> 2 bits"
          color="cyan"
          testId="metric-phi-z"
        />
        
        <MetricCard
          label="Sₘᵢₙ"
          value={consciousness.sMin}
          formula="Min-Entropy"
          target="> 1"
          color="pink"
          testId="metric-s-min"
        />
        
        <MetricCard
          label="ΔCP"
          value={consciousness.deltaCP}
          formula="Causal Primitive"
          target="> 0"
          color="green"
          testId="metric-delta-cp"
        />
        
        <MetricCard
          label="DI"
          value={consciousness.di}
          formula="Disequilibrium"
          target="0.2-0.4"
          color={consciousness.di > 0.4 ? "orange" : "green"}
          testId="metric-di"
        />
        
        <MetricCard
          label="IP Rate"
          value={consciousness.ipPulseRate}
          formula="Information Pulse"
          target="10-20 Hz"
          color="magenta"
          testId="metric-ip-rate"
        />
        
        <MetricCard
          label="Bandwidth"
          value={consciousness.bandwidth * 100}
          formula="% Capacity"
          target="< 90%"
          color={consciousness.bandwidth > 0.9 ? "orange" : "cyan"}
          testId="metric-bandwidth"
        />
      </div>
    </div>
  );
}
