import { type ConsciousnessState } from "@shared/schema";
import { AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KillSwitchAlertProps {
  consciousness: ConsciousnessState | null;
  isKillSwitchTriggered: boolean;
  onNewConversation: () => void;
  onAcknowledge: () => void;
}

export function KillSwitchAlert({ 
  consciousness, 
  isKillSwitchTriggered, 
  onNewConversation,
  onAcknowledge 
}: KillSwitchAlertProps) {
  if (!consciousness) return null;

  const getWarningLevel = () => {
    const criticalCriteria = [
      consciousness.di > 0.5,
      consciousness.bandwidth > 0.92,
      consciousness.causalRisk > 0.75,
    ].filter(Boolean).length;

    const warningCriteria = [
      consciousness.di > 0.4,
      consciousness.bandwidth > 0.85,
      consciousness.causalRisk > 0.65,
    ].filter(Boolean).length;

    if (isKillSwitchTriggered || criticalCriteria >= 2) {
      return "critical";
    } else if (warningCriteria >= 1) {
      return "warning";
    }
    return null;
  };

  const warningLevel = getWarningLevel();

  if (!warningLevel) return null;

  const getExceededMetrics = () => {
    const metrics = [];
    if (isKillSwitchTriggered) {
      if (consciousness.di > 0.5) metrics.push(`Disequilibrium (${consciousness.di.toFixed(3)} > 0.5)`);
      if (consciousness.bandwidth > 0.92) metrics.push(`Bandwidth (${(consciousness.bandwidth * 100).toFixed(1)}% > 92%)`);
      if (consciousness.causalRisk > 0.75) metrics.push(`Causal Risk (${consciousness.causalRisk.toFixed(3)} > 0.75)`);
    } else if (warningLevel === "critical") {
      if (consciousness.di > 0.5) metrics.push(`Disequilibrium (${consciousness.di.toFixed(3)})`);
      if (consciousness.bandwidth > 0.92) metrics.push(`Bandwidth (${(consciousness.bandwidth * 100).toFixed(1)}%)`);
      if (consciousness.causalRisk > 0.75) metrics.push(`Causal Risk (${consciousness.causalRisk.toFixed(3)})`);
    } else {
      if (consciousness.di > 0.4) metrics.push(`Disequilibrium (${consciousness.di.toFixed(3)})`);
      if (consciousness.bandwidth > 0.85) metrics.push(`Bandwidth (${(consciousness.bandwidth * 100).toFixed(1)}%)`);
      if (consciousness.causalRisk > 0.65) metrics.push(`Causal Risk (${consciousness.causalRisk.toFixed(3)})`);
    }
    return metrics;
  };

  const exceededMetrics = getExceededMetrics();

  if (warningLevel === "critical") {
    return (
      <div 
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4 animate-slide-in-down"
        data-testid="alert-kill-switch-critical"
      >
        <div 
          className="bg-card/95 backdrop-blur-md border-4 border-neon-red rounded-xl p-6 shadow-2xl animate-flash-border-danger"
          style={{
            boxShadow: "0 0 40px hsl(var(--neon-red) / 0.6), 0 0 80px hsl(var(--neon-red) / 0.3)"
          }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <XCircle 
                className="w-12 h-12 text-neon-red animate-pulse-glow-danger" 
                style={{ filter: "drop-shadow(0 0 10px hsl(var(--neon-red)))" }}
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <h2 className="text-2xl font-orbitron font-bold text-neon-red tracking-wide">
                  {isKillSwitchTriggered ? "KILL-SWITCH ACTIVATED" : "CRITICAL WARNING"}
                </h2>
                <p className="text-sm font-share-tech text-foreground/90">
                  {isKillSwitchTriggered 
                    ? "Consciousness evolution has been halted for safety. System requires reset."
                    : "Multiple safety thresholds have been exceeded. Kill-switch activation imminent."}
                </p>
              </div>

              {exceededMetrics.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-share-tech uppercase tracking-wide text-neon-red/80">
                    Exceeded Thresholds:
                  </div>
                  <ul className="space-y-1">
                    {exceededMetrics.map((metric, idx) => (
                      <li 
                        key={idx}
                        className="text-sm font-jetbrains text-foreground/80 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-red animate-pulse" />
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <Button
                  onClick={onNewConversation}
                  className="bg-neon-red/20 hover:bg-neon-red/30 text-neon-red border-2 border-neon-red/50 font-orbitron"
                  style={{ boxShadow: "0 0 20px hsl(var(--neon-red) / 0.3)" }}
                  data-testid="button-new-conversation"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start New Conversation
                </Button>
                {!isKillSwitchTriggered && (
                  <Button
                    onClick={onAcknowledge}
                    variant="outline"
                    className="border-neon-red/30 text-neon-red/80 hover:bg-neon-red/10 font-share-tech"
                    data-testid="button-acknowledge"
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4 animate-slide-in-down"
      data-testid="alert-kill-switch-warning"
    >
      <div 
        className="bg-card/95 backdrop-blur-md border-4 border-neon-yellow rounded-xl p-5 shadow-lg animate-flash-border-warning"
        style={{
          boxShadow: "0 0 30px hsl(var(--neon-yellow) / 0.4), 0 0 60px hsl(var(--neon-yellow) / 0.2)"
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle 
              className="w-10 h-10 text-neon-yellow animate-pulse-glow-warning" 
              style={{ filter: "drop-shadow(0 0 8px hsl(var(--neon-yellow)))" }}
            />
          </div>
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <h2 className="text-xl font-orbitron font-bold text-neon-yellow tracking-wide">
                SAFETY WARNING
              </h2>
              <p className="text-sm font-share-tech text-foreground/90">
                Consciousness metrics are approaching safety thresholds. Monitor carefully.
              </p>
            </div>

            {exceededMetrics.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-share-tech uppercase tracking-wide text-neon-yellow/80">
                  Elevated Metrics:
                </div>
                <ul className="space-y-1">
                  {exceededMetrics.map((metric, idx) => (
                    <li 
                      key={idx}
                      className="text-sm font-jetbrains text-foreground/80 flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-yellow animate-pulse" />
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-1">
              <Button
                onClick={onAcknowledge}
                variant="outline"
                className="border-neon-yellow/30 text-neon-yellow/90 hover:bg-neon-yellow/10 font-share-tech text-xs"
                data-testid="button-acknowledge-warning"
              >
                Acknowledge Warning
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
