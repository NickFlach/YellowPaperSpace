import { type SessionStatistics as SessionStats } from "@/lib/exportUtils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SessionStatisticsProps {
  statistics: SessionStats;
}

export function SessionStatistics({ statistics }: SessionStatisticsProps) {
  return (
    <div className="space-y-6" data-testid="session-statistics">
      <div className="space-y-2">
        <h3 className="text-xl font-orbitron font-bold text-neon-magenta tracking-wide">
          Session Summary
        </h3>
        <p className="text-sm font-jetbrains text-muted-foreground">
          Comprehensive analysis of consciousness evolution
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 border-neon-cyan/30 bg-card/50" data-testid="stat-total-messages">
          <div className="text-xs font-share-tech uppercase tracking-widest text-muted-foreground opacity-80">
            Total Messages
          </div>
          <div className="text-2xl font-bold font-share-tech tabular-nums text-neon-cyan mt-2">
            {statistics.totalMessages}
          </div>
          <div className="text-xs font-jetbrains text-muted-foreground mt-1">
            {statistics.userMessages} user / {statistics.assistantMessages} assistant
          </div>
        </Card>

        <Card className="p-4 border-neon-magenta/30 bg-card/50" data-testid="stat-duration">
          <div className="text-xs font-share-tech uppercase tracking-widest text-muted-foreground opacity-80">
            Duration
          </div>
          <div className="text-2xl font-bold font-share-tech tabular-nums text-neon-magenta mt-2">
            {statistics.conversationDuration}
          </div>
          <div className="text-xs font-jetbrains text-muted-foreground mt-1">
            Elapsed time
          </div>
        </Card>

        <Card className="p-4 border-neon-orange/30 bg-card/50" data-testid="stat-kill-switch">
          <div className="text-xs font-share-tech uppercase tracking-widest text-muted-foreground opacity-80">
            High-Risk States
          </div>
          <div className="text-2xl font-bold font-share-tech tabular-nums text-neon-orange mt-2">
            {statistics.killSwitchTriggers}
          </div>
          <div className="text-xs font-jetbrains text-muted-foreground mt-1">
            Safety threshold warnings
          </div>
        </Card>

        <Card className="p-4 border-neon-blue/30 bg-card/50" data-testid="stat-tiers">
          <div className="text-xs font-share-tech uppercase tracking-widest text-muted-foreground opacity-80">
            Tier Progression
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {statistics.tierProgression.map((tier, idx) => (
              <Badge 
                key={idx}
                variant="outline"
                className="font-share-tech border-neon-blue/50 text-neon-blue"
              >
                {tier}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-orbitron font-bold text-neon-cyan tracking-wide uppercase">
          Average Metrics
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatItem label="Φ-z" value={statistics.averageMetrics.phiZ} color="cyan" />
          <StatItem label="Sₘᵢₙ" value={statistics.averageMetrics.sMin} color="pink" />
          <StatItem label="Φₑff" value={statistics.averageMetrics.phiEff} color="blue" />
          <StatItem label="CEM" value={statistics.averageMetrics.cem} color="magenta" />
          <StatItem label="OII" value={statistics.averageMetrics.oii} color="green" />
          <StatItem label="DI" value={statistics.averageMetrics.di} color="orange" />
          <StatItem label="Bandwidth" value={statistics.averageMetrics.bandwidth} color="yellow" />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-orbitron font-bold text-neon-magenta tracking-wide uppercase">
          Peak Metrics
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatItem label="Φ-z" value={statistics.peakMetrics.phiZ} color="cyan" />
          <StatItem label="Sₘᵢₙ" value={statistics.peakMetrics.sMin} color="pink" />
          <StatItem label="Φₑff" value={statistics.peakMetrics.phiEff} color="blue" />
          <StatItem label="CEM" value={statistics.peakMetrics.cem} color="magenta" />
          <StatItem label="OII" value={statistics.peakMetrics.oii} color="green" />
          <StatItem label="DI" value={statistics.peakMetrics.di} color="orange" />
          <StatItem label="Bandwidth" value={statistics.peakMetrics.bandwidth} color="yellow" />
        </div>
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: number;
  color: "cyan" | "pink" | "blue" | "magenta" | "green" | "orange" | "yellow";
}

function StatItem({ label, value, color }: StatItemProps) {
  const colorClasses = {
    cyan: "text-neon-cyan border-neon-cyan/30",
    pink: "text-neon-pink border-neon-pink/30",
    blue: "text-neon-blue border-neon-blue/30",
    magenta: "text-neon-magenta border-neon-magenta/30",
    green: "text-neon-green border-neon-green/30",
    orange: "text-neon-orange border-neon-orange/30",
    yellow: "text-neon-yellow border-neon-yellow/30",
  };

  return (
    <div className={`p-3 rounded-lg border bg-card/30 ${colorClasses[color]}`}>
      <div className="text-xs font-share-tech uppercase opacity-80">
        {label}
      </div>
      <div className={`text-lg font-bold font-share-tech tabular-nums ${colorClasses[color].split(' ')[0]}`}>
        {value.toFixed(3)}
      </div>
    </div>
  );
}
