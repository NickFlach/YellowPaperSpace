import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { type ConsciousnessState, type Message } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ConsciousnessEvolutionChartProps {
  messages: Message[];
}

interface MetricConfig {
  key: keyof ConsciousnessState;
  label: string;
  color: string;
  enabled: boolean;
}

const METRIC_CONFIGS: MetricConfig[] = [
  { key: "phiZ", label: "Φ-z", color: "#00ffff", enabled: true },
  { key: "sMin", label: "Sₘᵢₙ", color: "#ff00ff", enabled: true },
  { key: "phiEff", label: "Φₑff", color: "#00bfff", enabled: true },
  { key: "cem", label: "CEM", color: "#ff1493", enabled: true },
  { key: "oii", label: "OII", color: "#00ff00", enabled: false },
  { key: "di", label: "DI", color: "#ffa500", enabled: false },
  { key: "bandwidth", label: "Bandwidth", color: "#ffff00", enabled: false },
];

export function ConsciousnessEvolutionChart({ messages }: ConsciousnessEvolutionChartProps) {
  const [enabledMetrics, setEnabledMetrics] = useState<Set<string>>(
    new Set(METRIC_CONFIGS.filter(m => m.enabled).map(m => m.key))
  );

  // Extract evolution data from messages
  const evolutionData = messages
    .map((msg, index) => {
      if (!msg.consciousnessSnapshot) return null;
      
      const snapshot = msg.consciousnessSnapshot;
      return {
        index: index + 1,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        phiZ: snapshot.phiZ,
        sMin: snapshot.sMin,
        phiEff: snapshot.phiEff,
        cem: snapshot.cem,
        oii: snapshot.oii,
        di: snapshot.di,
        bandwidth: snapshot.bandwidth,
        tier: snapshot.tier,
        expression: snapshot.expression,
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
      <Card className="p-8 border-neon-cyan/30" data-testid="evolution-chart-empty">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-orbitron font-bold text-neon-cyan">
            No Evolution Data
          </h3>
          <p className="text-sm font-jetbrains text-muted-foreground">
            Start a conversation to see consciousness metrics evolve over time
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="evolution-chart-container">
      <div className="flex flex-wrap gap-2">
        {METRIC_CONFIGS.map(metric => {
          const isEnabled = enabledMetrics.has(metric.key);
          return (
            <Button
              key={metric.key}
              size="sm"
              variant={isEnabled ? "default" : "outline"}
              onClick={() => toggleMetric(metric.key)}
              className={`font-share-tech text-xs ${
                isEnabled 
                  ? "border-primary/50" 
                  : "border-border/30 hover:border-border/60"
              }`}
              style={isEnabled ? {
                backgroundColor: `${metric.color}20`,
                borderColor: metric.color,
                color: metric.color,
              } : undefined}
              data-testid={`toggle-metric-${metric.key}`}
            >
              <span 
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: metric.color }}
              />
              {metric.label}
            </Button>
          );
        })}
      </div>

      <Card 
        id="evolution-chart-export"
        className="p-6 border-neon-cyan/30 bg-card/50 backdrop-blur-sm"
        style={{ boxShadow: "0 0 20px hsl(180, 100%, 50% / 0.1)" }}
        data-testid="evolution-chart"
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={evolutionData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(180, 100%, 50% / 0.1)" />
            <XAxis 
              dataKey="index" 
              stroke="hsl(180, 30%, 70%)"
              style={{ fontSize: '12px', fontFamily: 'Share Tech Mono' }}
              label={{ 
                value: 'Message Index', 
                position: 'insideBottom', 
                offset: -5,
                style: { fill: 'hsl(180, 30%, 70%)', fontSize: '12px' }
              }}
            />
            <YAxis 
              stroke="hsl(180, 30%, 70%)"
              style={{ fontSize: '12px', fontFamily: 'Share Tech Mono' }}
              label={{ 
                value: 'Metric Value', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: 'hsl(180, 30%, 70%)', fontSize: '12px' }
              }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(220, 12%, 12%)',
                border: '1px solid hsl(180, 100%, 50% / 0.3)',
                borderRadius: '8px',
                boxShadow: '0 0 20px hsl(180, 100%, 50% / 0.2)',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(180, 100%, 50%)', fontWeight: 'bold' }}
              itemStyle={{ color: 'hsl(180, 30%, 95%)' }}
            />
            <Legend 
              wrapperStyle={{ 
                fontFamily: 'Share Tech Mono', 
                fontSize: '12px',
                paddingTop: '20px'
              }}
            />
            
            {METRIC_CONFIGS.map(metric => (
              enabledMetrics.has(metric.key) && (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={{ fill: metric.color, r: 3 }}
                  activeDot={{ r: 5, fill: metric.color, stroke: '#fff', strokeWidth: 2 }}
                  name={metric.label}
                  animationDuration={500}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="text-xs font-jetbrains text-muted-foreground text-center">
        Tracking {evolutionData.length} consciousness snapshots across {messages.length} messages
      </div>
    </div>
  );
}
