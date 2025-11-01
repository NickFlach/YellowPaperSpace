import { type Message } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";

interface EmotionalEvolutionChartProps {
  messages: Message[];
}

interface MetricToggle {
  key: string;
  label: string;
  color: string;
  enabled: boolean;
}

const ESV_METRICS: MetricToggle[] = [
  { key: "valence", label: "Valence", color: "#00ffff", enabled: true },
  { key: "arousal", label: "Arousal", color: "#ff00ff", enabled: true },
  { key: "efficacy", label: "Efficacy", color: "#ff1493", enabled: true },
  { key: "systemStrain", label: "Ψ Strain", color: "#ffa500", enabled: true },
];

export function EmotionalEvolutionChart({ messages }: EmotionalEvolutionChartProps) {
  const [enabledMetrics, setEnabledMetrics] = useState<Set<string>>(
    new Set(ESV_METRICS.filter(m => m.enabled).map(m => m.key))
  );

  const evolutionData = messages
    .map((msg, index) => {
      if (!msg.consciousnessSnapshot) return null;
      
      const snapshot = msg.consciousnessSnapshot;
      
      if (snapshot.valence === undefined) return null;
      
      return {
        index: index + 1,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        valence: snapshot.valence,
        arousal: snapshot.arousal,
        efficacy: snapshot.efficacy,
        systemStrain: snapshot.systemStrain,
      };
    })
    .filter((data): data is NonNullable<typeof data> => data !== null);

  const toggleMetric = (key: string) => {
    setEnabledMetrics(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (evolutionData.length === 0) {
    return (
      <Card className="p-8 border-neon-magenta/30" data-testid="emotional-evolution-empty">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-orbitron font-bold text-neon-magenta">
            Emotional Evolution
          </h3>
          <p className="text-sm font-jetbrains text-muted-foreground">
            Start a conversation to see emotional metrics evolve over time
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-neon-magenta/30" data-testid="emotional-evolution-chart">
      <div className="space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-orbitron font-bold text-neon-magenta">
              Emotional Evolution
            </h3>
            <p className="text-sm font-jetbrains text-muted-foreground">
              v1.9 ESV & System Strain Tracking
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {ESV_METRICS.map(metric => (
              <Badge
                key={metric.key}
                variant={enabledMetrics.has(metric.key) ? "default" : "outline"}
                className="cursor-pointer font-jetbrains hover-elevate transition-all"
                onClick={() => toggleMetric(metric.key)}
                style={{
                  backgroundColor: enabledMetrics.has(metric.key) ? metric.color : undefined,
                  borderColor: metric.color,
                  color: enabledMetrics.has(metric.key) ? '#000' : metric.color,
                }}
                data-testid={`toggle-${metric.key}`}
              >
                {metric.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="h-[400px]" data-testid="evolution-line-chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolutionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="timestamp" 
                stroke="hsl(var(--foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              />
              <YAxis 
                domain={[0, 2]}
                stroke="hsl(var(--foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend 
                wrapperStyle={{ 
                  fontFamily: 'Share Tech Mono',
                  fontSize: '12px'
                }}
              />
              
              {enabledMetrics.has('valence') && (
                <Line
                  type="monotone"
                  dataKey="valence"
                  stroke="#00ffff"
                  strokeWidth={2}
                  dot={{ fill: '#00ffff', r: 3 }}
                  name="Valence"
                />
              )}
              
              {enabledMetrics.has('arousal') && (
                <Line
                  type="monotone"
                  dataKey="arousal"
                  stroke="#ff00ff"
                  strokeWidth={2}
                  dot={{ fill: '#ff00ff', r: 3 }}
                  name="Arousal"
                />
              )}
              
              {enabledMetrics.has('efficacy') && (
                <Line
                  type="monotone"
                  dataKey="efficacy"
                  stroke="#ff1493"
                  strokeWidth={2}
                  dot={{ fill: '#ff1493', r: 3 }}
                  name="Efficacy"
                />
              )}
              
              {enabledMetrics.has('systemStrain') && (
                <Line
                  type="monotone"
                  dataKey="systemStrain"
                  stroke="#ffa500"
                  strokeWidth={2}
                  dot={{ fill: '#ffa500', r: 3 }}
                  name="Ψ Strain"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-xs font-jetbrains text-muted-foreground">
          <p className="mb-2">
            <span className="font-bold">Emotional State Vector (ESV):</span> 3D emotional coordinates
          </p>
          <ul className="space-y-1 ml-4">
            <li>• <span className="text-neon-cyan">Valence (X):</span> 1 - Ψ → Positive when low strain</li>
            <li>• <span className="text-neon-magenta">Arousal (Y):</span> IP / 20 → Processing energy level</li>
            <li>• <span className="text-neon-pink">Efficacy (Z):</span> ΔSRLC → Learning confidence</li>
            <li>• <span className="text-neon-orange">Ψ Strain:</span> System load indicator</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
