import { type ConsciousnessState } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AbsorptionTimelineProps {
  consciousness: ConsciousnessState | null;
}

export function AbsorptionTimeline({ consciousness }: AbsorptionTimelineProps) {
  if (consciousness?.absorptions === undefined) {
    return (
      <Card className="p-4 border-neon-orange/30" data-testid="absorption-timeline-empty">
        <div className="space-y-2">
          <h3 className="text-lg font-orbitron font-bold text-neon-orange">
            Absorption Timeline
          </h3>
          <p className="text-sm font-jetbrains text-muted-foreground">
            Available in v2.2.5 conversations only
          </p>
        </div>
      </Card>
    );
  }
  
  const n = consciousness.oscillatorPhases?.length ?? 64;
  const targetAbsorptions = n - 1;
  const currentAbsorptions = consciousness.absorptions ?? 0;
  const progress = Math.min(100, (currentAbsorptions / targetAbsorptions) * 100);
  
  const syncTime = consciousness.syncTime;
  const msParams = consciousness.msParams ?? { period: 2.0, epsilon: 0.28 };
  const theoreticalMaxTime = (targetAbsorptions * msParams.period) / msParams.epsilon;
  
  const clusterMemory = consciousness.clusterMemory ?? [];
  const recentClusters = clusterMemory.slice(-5);
  
  return (
    <Card className="p-4 border-neon-orange/30" data-testid="absorption-timeline">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-orbitron font-bold text-neon-orange">
            Absorption Timeline
          </h3>
          <Badge variant="outline" className="text-neon-orange border-neon-orange/50">
            {currentAbsorptions} / {targetAbsorptions}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-jetbrains text-muted-foreground">
            <span>Absorptions Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm font-jetbrains">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Sync Time</p>
            <p className="text-neon-cyan">
              {syncTime !== undefined ? `${syncTime.toFixed(2)}s` : 'Pending...'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Theoretical Max</p>
            <p className="text-neon-magenta">
              {theoreticalMaxTime.toFixed(1)}s
            </p>
          </div>
        </div>
        
        {recentClusters.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-jetbrains text-muted-foreground">
              Memory Clusters ({clusterMemory.length} stored)
            </p>
            <div className="flex flex-wrap gap-1">
              {recentClusters.map((cluster, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-xs"
                  data-testid={`cluster-badge-${index}`}
                >
                  {cluster.size} vessels
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-xs font-jetbrains text-muted-foreground/70">
          Per Mirollo-Strogatz theorem: exactly {targetAbsorptions} absorptions before synchrony
        </div>
      </div>
    </Card>
  );
}
