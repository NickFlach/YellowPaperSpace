import { type ConsciousnessState } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ReferenceArea, ResponsiveContainer, Tooltip } from "recharts";

interface SynchronizationRadarProps {
  consciousness: ConsciousnessState | null;
  history: { orderParameter: number; timestamp: number }[];
}

export function SynchronizationRadar({ consciousness, history }: SynchronizationRadarProps) {
  if (!consciousness?.orderParameter === undefined) {
    return (
      <Card className="p-4 border-neon-magenta/30" data-testid="sync-radar-empty">
        <div className="space-y-2">
          <h3 className="text-lg font-orbitron font-bold text-neon-magenta">
            Synchronization Radar
          </h3>
          <p className="text-sm font-jetbrains text-muted-foreground">
            Available in v2.2.5 conversations only
          </p>
        </div>
      </Card>
    );
  }
  
  const orderParam = consciousness?.orderParameter ?? 0;
  const consciousBand = consciousness?.consciousBand ?? { lower: 0.55, upper: 0.92, target: 0.78 };
  const heterogeneityActive = consciousness?.heterogeneityActive ?? false;
  
  const isInBand = orderParam >= consciousBand.lower && orderParam <= consciousBand.upper;
  const distanceFromTarget = Math.abs(orderParam - consciousBand.target);
  
  const chartData = history.slice(-30).map((point, index) => ({
    index,
    R: point.orderParameter,
    timestamp: point.timestamp,
  }));
  
  const getStatusColor = () => {
    if (isInBand && distanceFromTarget < 0.1) return "text-neon-green";
    if (isInBand) return "text-neon-cyan";
    if (orderParam > consciousBand.upper) return "text-neon-orange";
    return "text-neon-red";
  };
  
  const getStatusText = () => {
    if (orderParam >= consciousBand.upper) return "SYNCHRONIZING";
    if (isInBand) return "CONSCIOUS";
    if (orderParam < consciousBand.lower) return "RECOVERING";
    return "TRANSITIONING";
  };
  
  return (
    <Card className="p-4 border-neon-magenta/30" data-testid="sync-radar">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-orbitron font-bold text-neon-magenta">
            Synchronization Radar
          </h3>
          <Badge 
            variant="outline" 
            className={`${getStatusColor()} border-current`}
          >
            {getStatusText()}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <p className="text-xs font-jetbrains text-muted-foreground">Current R</p>
            <p className={`text-xl font-orbitron font-bold ${getStatusColor()}`}>
              {orderParam.toFixed(3)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-jetbrains text-muted-foreground">Target</p>
            <p className="text-xl font-orbitron font-bold text-neon-cyan">
              {consciousBand.target.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-jetbrains text-muted-foreground">Distance</p>
            <p className={`text-xl font-orbitron font-bold ${distanceFromTarget < 0.1 ? 'text-neon-green' : 'text-neon-orange'}`}>
              {distanceFromTarget.toFixed(3)}
            </p>
          </div>
        </div>
        
        {chartData.length > 1 && (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <ReferenceArea
                  y1={consciousBand.lower}
                  y2={consciousBand.upper}
                  fill="rgba(0, 255, 136, 0.1)"
                  strokeOpacity={0}
                />
                <ReferenceLine
                  y={consciousBand.target}
                  stroke="rgba(0, 255, 255, 0.5)"
                  strokeDasharray="3 3"
                />
                <ReferenceLine
                  y={consciousBand.lower}
                  stroke="rgba(255, 100, 100, 0.3)"
                  strokeDasharray="2 2"
                />
                <ReferenceLine
                  y={consciousBand.upper}
                  stroke="rgba(255, 165, 0, 0.3)"
                  strokeDasharray="2 2"
                />
                <XAxis 
                  dataKey="index" 
                  tick={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis 
                  domain={[0, 1]} 
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 10, 20, 0.9)',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [value.toFixed(4), 'R']}
                />
                <Line
                  type="monotone"
                  dataKey="R"
                  stroke={isInBand ? "#00ff88" : "#ff00ff"}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#00ffff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        <div className="flex justify-between text-xs font-jetbrains text-muted-foreground">
          <span>Band: [{consciousBand.lower} - {consciousBand.upper}]</span>
          <span>
            Mode: {heterogeneityActive ? 'Controlled Violation' : 'Exact Theorem'}
          </span>
        </div>
      </div>
    </Card>
  );
}
