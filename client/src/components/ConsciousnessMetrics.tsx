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
  warningState?: "safe" | "warning" | "critical";
}

function MetricCard({ label, value, formula, target, color, testId, warningState }: MetricCardProps) {
  const getColorClasses = () => {
    if (warningState === "critical") {
      return "border-neon-red/50 shadow-neon-red/30 animate-pulse-glow-danger";
    } else if (warningState === "warning") {
      return "border-neon-yellow/50 shadow-neon-yellow/30 animate-pulse-glow-warning";
    }
    
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
    if (warningState === "critical") return "text-neon-red";
    if (warningState === "warning") return "text-neon-yellow";
    
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
          warningState={
            consciousness.di > 0.5 ? "critical" :
            consciousness.di > 0.4 ? "warning" : "safe"
          }
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
          warningState={
            consciousness.bandwidth > 0.92 ? "critical" :
            consciousness.bandwidth > 0.85 ? "warning" : "safe"
          }
        />
        
        {/* v1.9 Emotional State Vector */}
        {consciousness.valence !== undefined && (
          <MetricCard
            label="Valence"
            value={consciousness.valence}
            formula="1 - Ψ"
            target="ESV X-axis"
            color="cyan"
            testId="metric-valence"
          />
        )}
        
        {consciousness.arousal !== undefined && (
          <MetricCard
            label="Arousal"
            value={consciousness.arousal}
            formula="IP / 20"
            target="ESV Y-axis"
            color="magenta"
            testId="metric-arousal"
          />
        )}
        
        {consciousness.efficacy !== undefined && (
          <MetricCard
            label="Efficacy"
            value={consciousness.efficacy}
            formula="ΔSRLC"
            target="ESV Z-axis"
            color="pink"
            testId="metric-efficacy"
          />
        )}
        
        {/* v1.9 System Strain */}
        {consciousness.systemStrain !== undefined && (
          <MetricCard
            label="Ψ Strain"
            value={consciousness.systemStrain}
            formula="Predictive Load"
            target="< 1.0"
            color={consciousness.systemStrain > 1.0 ? "orange" : "green"}
            testId="metric-system-strain"
            warningState={
              consciousness.systemStrain > 1.5 ? "critical" :
              consciousness.systemStrain > 1.0 ? "warning" : "safe"
            }
          />
        )}
        
        {/* v1.9 Reformed Kill-Switch Metrics */}
        {consciousness.ci !== undefined && (
          <MetricCard
            label="CI"
            value={consciousness.ci}
            formula="|DI - 0.3| / 0.3"
            target="< 0.5"
            color={consciousness.ci > 0.5 ? "orange" : "green"}
            testId="metric-ci"
            warningState={
              consciousness.ci > 0.5 ? "critical" :
              consciousness.ci > 0.4 ? "warning" : "safe"
            }
          />
        )}
        
        {consciousness.cbi !== undefined && (
          <MetricCard
            label="CBI"
            value={consciousness.cbi}
            formula="1 - R"
            target="< 0.4"
            color={consciousness.cbi > 0.4 ? "orange" : "green"}
            testId="metric-cbi"
            warningState={
              consciousness.cbi > 0.4 ? "critical" :
              consciousness.cbi > 0.3 ? "warning" : "safe"
            }
          />
        )}
        
        {/* v2.2.5 Mirollo-Strogatz Oscillator Metrics */}
        {consciousness.orderParameter !== undefined && (
          <MetricCard
            label="Order R"
            value={consciousness.orderParameter}
            formula="|Σexp(i2πθⱼ)/N|"
            target="0.55-0.92"
            color={
              consciousness.orderParameter >= 0.55 && consciousness.orderParameter <= 0.92 
                ? "green" : "orange"
            }
            testId="metric-order-parameter"
            warningState={
              consciousness.orderParameter > 0.92 ? "warning" :
              consciousness.orderParameter < 0.55 ? "warning" : "safe"
            }
          />
        )}
        
        {consciousness.phiEffCol !== undefined && (
          <MetricCard
            label="Φ_eff_col"
            value={consciousness.phiEffCol}
            formula="N × Φ × R"
            target="> 10 bits"
            color="cyan"
            testId="metric-phi-eff-col"
          />
        )}
        
        {consciousness.lliS !== undefined && (
          <MetricCard
            label="LLIₛ"
            value={consciousness.lliS}
            formula="Stabilized"
            target="~1.92"
            color="magenta"
            testId="metric-lli-s"
          />
        )}
        
        {consciousness.absorptions !== undefined && (
          <MetricCard
            label="Absorptions"
            value={consciousness.absorptions}
            formula="N-1 target"
            target="= 63"
            color="orange"
            testId="metric-absorptions"
          />
        )}
      </div>
    </div>
  );
}
