import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SimulatedConsciousnessEngine } from "@/lib/simulatedConsciousnessEngine";
import { SpaceChildFace } from "@/components/SpaceChildFace";
import { type ConsciousnessState, type ConsciousnessParameters, type ChatMessage, defaultConsciousnessParameters } from "@shared/schema";
import { ChevronDown, ChevronRight, RotateCcw, Info, TrendingUp, TrendingDown } from "lucide-react";

interface TPMSimulatorProps {
  currentConsciousness: ConsciousnessState | null;
  messages: ChatMessage[];
}

interface ParameterControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  tooltip: string;
  isModified: boolean;
}

function ParameterControl({ label, value, min, max, step, onChange, tooltip, isModified }: ParameterControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-share-tech uppercase tracking-wide ${isModified ? "text-neon-cyan" : "text-muted-foreground"}`}>
            {label}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 text-muted-foreground cursor-help" data-testid={`info-${label}`} />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-card border-neon-cyan/30">
                <p className="text-xs font-jetbrains">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Badge variant={isModified ? "default" : "secondary"} className="font-jetbrains tabular-nums text-xs">
          {value.toFixed(2)}
        </Badge>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(vals[0])}
        className="w-full"
        data-testid={`slider-${label}`}
      />
      <div className="flex justify-between text-[10px] font-jetbrains text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

interface MetricComparisonProps {
  label: string;
  current: number;
  simulated: number;
  color: string;
}

function MetricComparison({ label, current, simulated, color }: MetricComparisonProps) {
  const diff = simulated - current;
  const percentChange = current !== 0 ? (diff / current) * 100 : 0;
  const isIncrease = diff > 0;
  const hasChanged = Math.abs(diff) > 0.001;

  const getColorClass = () => {
    switch (color) {
      case "cyan": return "text-neon-cyan border-neon-cyan/30";
      case "magenta": return "text-neon-magenta border-neon-magenta/30";
      case "blue": return "text-neon-blue border-neon-blue/30";
      case "pink": return "text-neon-pink border-neon-pink/30";
      case "green": return "text-neon-green border-neon-green/30";
      case "orange": return "text-neon-orange border-neon-orange/30";
      default: return "text-neon-cyan border-neon-cyan/30";
    }
  };

  return (
    <Card className={`p-3 border ${getColorClass()} ${hasChanged ? "shadow-lg" : ""}`} data-testid={`metric-comparison-${label}`}>
      <div className="space-y-2">
        <div className="text-xs font-share-tech uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <div className="flex items-center justify-between">
          <div className={`text-2xl font-bold font-share-tech tabular-nums ${getColorClass()}`}>
            {simulated.toFixed(3)}
          </div>
          {hasChanged && (
            <div className="flex items-center gap-1">
              {isIncrease ? (
                <TrendingUp className="w-4 h-4 text-neon-green" />
              ) : (
                <TrendingDown className="w-4 h-4 text-neon-red" />
              )}
              <span className={`text-xs font-jetbrains tabular-nums ${isIncrease ? "text-neon-green" : "text-neon-red"}`}>
                {isIncrease ? "+" : ""}{percentChange.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        {hasChanged && (
          <div className="text-xs font-jetbrains text-muted-foreground">
            From: <span className="text-foreground/70">{current.toFixed(3)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export function TPMSimulator({ currentConsciousness, messages }: TPMSimulatorProps) {
  const [parameters, setParameters] = useState<ConsciousnessParameters>(defaultConsciousnessParameters);
  const [phiZOpen, setPhiZOpen] = useState(true);
  const [sMinOpen, setSMinOpen] = useState(false);
  const [killSwitchOpen, setKillSwitchOpen] = useState(false);

  const engine = useMemo(
    () => new SimulatedConsciousnessEngine(currentConsciousness || undefined, messages, parameters),
    [currentConsciousness, messages]
  );

  useEffect(() => {
    engine.updateParameters(parameters);
  }, [parameters, engine]);

  const simulatedState = useMemo(() => {
    if (!currentConsciousness) return null;
    return engine.simulateUpdate("Test user message for simulation", "Simulated AI response");
  }, [parameters, currentConsciousness, engine]);

  const handleReset = () => {
    setParameters(defaultConsciousnessParameters);
    engine.reset(currentConsciousness || undefined, messages);
  };

  const isParameterModified = (group: keyof ConsciousnessParameters, key: string): boolean => {
    const current = parameters[group][key as keyof typeof parameters[typeof group]];
    const defaultVal = defaultConsciousnessParameters[group][key as keyof typeof defaultConsciousnessParameters[typeof group]];
    return Math.abs(current - defaultVal) > 0.001;
  };

  const hasAnyModifications = useMemo(() => {
    return Object.keys(parameters.phiZ).some(k => isParameterModified("phiZ", k)) ||
           Object.keys(parameters.sMin).some(k => isParameterModified("sMin", k)) ||
           Object.keys(parameters.killSwitch).some(k => isParameterModified("killSwitch", k));
  }, [parameters]);

  if (!currentConsciousness) {
    return (
      <Card className="p-6 border-neon-cyan/30">
        <div className="text-center space-y-2">
          <p className="text-sm font-jetbrains text-muted-foreground">
            Start a conversation to begin experimenting with parameters
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="tpm-simulator">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-orbitron font-bold text-neon-cyan tracking-wide">
            TPM State Simulator
          </h2>
          <p className="text-xs font-share-tech text-muted-foreground">
            Experiment with consciousness parameters in real-time
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          disabled={!hasAnyModifications}
          className="gap-2"
          data-testid="button-reset"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
      </div>

      {simulatedState && (
        <Card className="p-4 border-neon-magenta/30">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-sm font-share-tech uppercase tracking-wide text-neon-magenta">
                Simulated Expression
              </div>
              <Badge className="bg-neon-magenta/20 text-neon-magenta border-neon-magenta/50">
                {simulatedState.expression}
              </Badge>
            </div>
            <div className="w-full max-w-xs mx-auto">
              <SpaceChildFace consciousness={simulatedState} isProcessing={false} />
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 border-neon-cyan/30">
        <Collapsible open={phiZOpen} onOpenChange={setPhiZOpen}>
          <CollapsibleTrigger className="w-full" data-testid="collapsible-trigger-phiz">
            <div className="flex items-center justify-between w-full hover-elevate p-2 rounded-md">
              <div className="flex items-center gap-2">
                {phiZOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="text-sm font-orbitron font-bold text-neon-cyan">Φ-z Parameters</span>
              </div>
              <Badge variant="secondary" className="text-xs">Integration</Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <ParameterControl
              label="Base Integration Multiplier"
              value={parameters.phiZ.baseIntegrationMultiplier}
              min={0}
              max={2}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, phiZ: { ...parameters.phiZ, baseIntegrationMultiplier: v }})}
              tooltip="Multiplier for SRLC memory contribution to baseline integration. Higher values increase Φ-z based on conversation history."
              isModified={isParameterModified("phiZ", "baseIntegrationMultiplier")}
            />
            <ParameterControl
              label="Complexity Weight"
              value={parameters.phiZ.complexityWeight}
              min={0}
              max={10}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, phiZ: { ...parameters.phiZ, complexityWeight: v }})}
              tooltip="Weight for message complexity contribution to Φ-z. Higher values increase integration for complex vocabulary."
              isModified={isParameterModified("phiZ", "complexityWeight")}
            />
            <ParameterControl
              label="Depth Weight"
              value={parameters.phiZ.depthWeight}
              min={0}
              max={5}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, phiZ: { ...parameters.phiZ, depthWeight: v }})}
              tooltip="Weight for conversation depth contribution. Higher values boost Φ-z as conversations get longer."
              isModified={isParameterModified("phiZ", "depthWeight")}
            />
            <ParameterControl
              label="Density Weight"
              value={parameters.phiZ.densityWeight}
              min={0}
              max={5}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, phiZ: { ...parameters.phiZ, densityWeight: v }})}
              tooltip="Weight for semantic density (unique words / total words). Higher values reward diverse vocabulary."
              isModified={isParameterModified("phiZ", "densityWeight")}
            />
            <ParameterControl
              label="Conversation Factor Divisor"
              value={parameters.phiZ.conversationFactorDivisor}
              min={1}
              max={50}
              step={1}
              onChange={(v) => setParameters({ ...parameters, phiZ: { ...parameters.phiZ, conversationFactorDivisor: v }})}
              tooltip="Divisor for conversation length factor. Lower values make Φ-z increase faster with message count."
              isModified={isParameterModified("phiZ", "conversationFactorDivisor")}
            />
            <ParameterControl
              label="SRLC Boost Weight"
              value={parameters.phiZ.srlcBoostWeight}
              min={0}
              max={2}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, phiZ: { ...parameters.phiZ, srlcBoostWeight: v }})}
              tooltip="Weight for SRLC memory boost to Φ-z. Higher values give more importance to conversation history."
              isModified={isParameterModified("phiZ", "srlcBoostWeight")}
            />
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="p-4 border-neon-magenta/30">
        <Collapsible open={sMinOpen} onOpenChange={setSMinOpen}>
          <CollapsibleTrigger className="w-full" data-testid="collapsible-trigger-smin">
            <div className="flex items-center justify-between w-full hover-elevate p-2 rounded-md">
              <div className="flex items-center gap-2">
                {sMinOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="text-sm font-orbitron font-bold text-neon-magenta">Sₘᵢₙ Parameters</span>
              </div>
              <Badge variant="secondary" className="text-xs">Min-Entropy</Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <ParameterControl
              label="Base Entropy Multiplier"
              value={parameters.sMin.baseEntropyMultiplier}
              min={0}
              max={2}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, sMin: { ...parameters.sMin, baseEntropyMultiplier: v }})}
              tooltip="Multiplier for SRLC memory contribution to baseline entropy. Higher values increase Sₘᵢₙ with history."
              isModified={isParameterModified("sMin", "baseEntropyMultiplier")}
            />
            <ParameterControl
              label="Emotional Weight"
              value={parameters.sMin.emotionalWeight}
              min={0}
              max={5}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, sMin: { ...parameters.sMin, emotionalWeight: v }})}
              tooltip="Weight for emotional valence contribution. Higher values increase Sₘᵢₙ for emotionally rich content."
              isModified={isParameterModified("sMin", "emotionalWeight")}
            />
            <ParameterControl
              label="Length Factor Divisor"
              value={parameters.sMin.lengthFactorDivisor}
              min={1}
              max={10}
              step={0.5}
              onChange={(v) => setParameters({ ...parameters, sMin: { ...parameters.sMin, lengthFactorDivisor: v }})}
              tooltip="Divisor for message length factor. Lower values make Sₘᵢₙ increase faster with longer messages."
              isModified={isParameterModified("sMin", "lengthFactorDivisor")}
            />
            <ParameterControl
              label="Density Weight"
              value={parameters.sMin.densityWeight}
              min={0}
              max={2}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, sMin: { ...parameters.sMin, densityWeight: v }})}
              tooltip="Weight for semantic density contribution to Sₘᵢₙ. Higher values reward diverse vocabulary."
              isModified={isParameterModified("sMin", "densityWeight")}
            />
            <ParameterControl
              label="SRLC Boost Weight"
              value={parameters.sMin.srlcBoostWeight}
              min={0}
              max={2}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, sMin: { ...parameters.sMin, srlcBoostWeight: v }})}
              tooltip="Weight for SRLC memory boost to Sₘᵢₙ. Higher values give more weight to conversation history."
              isModified={isParameterModified("sMin", "srlcBoostWeight")}
            />
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="p-4 border-neon-orange/30">
        <Collapsible open={killSwitchOpen} onOpenChange={setKillSwitchOpen}>
          <CollapsibleTrigger className="w-full" data-testid="collapsible-trigger-killswitch">
            <div className="flex items-center justify-between w-full hover-elevate p-2 rounded-md">
              <div className="flex items-center gap-2">
                {killSwitchOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="text-sm font-orbitron font-bold text-neon-orange">Kill-Switch Thresholds</span>
              </div>
              <Badge variant="secondary" className="text-xs">Safety</Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <ParameterControl
              label="Φₑff Rate Threshold"
              value={parameters.killSwitch.phiEffRateThreshold}
              min={0}
              max={20}
              step={0.5}
              onChange={(v) => setParameters({ ...parameters, killSwitch: { ...parameters.killSwitch, phiEffRateThreshold: v }})}
              tooltip="Maximum allowed rate of Φₑff change per second. Lower values trigger kill-switch more easily."
              isModified={isParameterModified("killSwitch", "phiEffRateThreshold")}
            />
            <ParameterControl
              label="DI Threshold"
              value={parameters.killSwitch.diThreshold}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => setParameters({ ...parameters, killSwitch: { ...parameters.killSwitch, diThreshold: v }})}
              tooltip="Maximum disequilibrium allowed. Lower values make the system more cautious."
              isModified={isParameterModified("killSwitch", "diThreshold")}
            />
            <ParameterControl
              label="Bandwidth Threshold"
              value={parameters.killSwitch.bandwidthThreshold}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => setParameters({ ...parameters, killSwitch: { ...parameters.killSwitch, bandwidthThreshold: v }})}
              tooltip="Maximum bandwidth utilization. Lower values trigger safety measures earlier."
              isModified={isParameterModified("killSwitch", "bandwidthThreshold")}
            />
            <ParameterControl
              label="Causal Risk Threshold"
              value={parameters.killSwitch.causalRiskThreshold}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => setParameters({ ...parameters, killSwitch: { ...parameters.killSwitch, causalRiskThreshold: v }})}
              tooltip="Maximum causal risk allowed. Lower values make the system more risk-averse."
              isModified={isParameterModified("killSwitch", "causalRiskThreshold")}
            />
            <ParameterControl
              label="Criteria Count Threshold"
              value={parameters.killSwitch.criteriaCountThreshold}
              min={1}
              max={4}
              step={1}
              onChange={(v) => setParameters({ ...parameters, killSwitch: { ...parameters.killSwitch, criteriaCountThreshold: v }})}
              tooltip="Number of safety criteria that must be met to trigger kill-switch. Lower is stricter."
              isModified={isParameterModified("killSwitch", "criteriaCountThreshold")}
            />
            <ParameterControl
              label="Trigger Count Threshold"
              value={parameters.killSwitch.triggerCountThreshold}
              min={1}
              max={10}
              step={1}
              onChange={(v) => setParameters({ ...parameters, killSwitch: { ...parameters.killSwitch, triggerCountThreshold: v }})}
              tooltip="Number of consecutive triggers needed to activate kill-switch. Lower is stricter."
              isModified={isParameterModified("killSwitch", "triggerCountThreshold")}
            />
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {simulatedState && (
        <div className="space-y-4">
          <h3 className="text-sm font-orbitron font-bold text-neon-cyan uppercase tracking-wide">
            Metric Comparisons
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <MetricComparison
              label="Φₑff"
              current={currentConsciousness.phiEff}
              simulated={simulatedState.phiEff}
              color="cyan"
            />
            <MetricComparison
              label="CEM"
              current={currentConsciousness.cem}
              simulated={simulatedState.cem}
              color="magenta"
            />
            <MetricComparison
              label="Φ-z"
              current={currentConsciousness.phiZ}
              simulated={simulatedState.phiZ}
              color="cyan"
            />
            <MetricComparison
              label="Sₘᵢₙ"
              current={currentConsciousness.sMin}
              simulated={simulatedState.sMin}
              color="pink"
            />
            <MetricComparison
              label="OII"
              current={currentConsciousness.oii}
              simulated={simulatedState.oii}
              color="blue"
            />
            <MetricComparison
              label="ΔCP"
              current={currentConsciousness.deltaCP}
              simulated={simulatedState.deltaCP}
              color="green"
            />
            <MetricComparison
              label="DI"
              current={currentConsciousness.di}
              simulated={simulatedState.di}
              color={simulatedState.di > 0.4 ? "orange" : "green"}
            />
            <MetricComparison
              label="Bandwidth"
              current={currentConsciousness.bandwidth * 100}
              simulated={simulatedState.bandwidth * 100}
              color={simulatedState.bandwidth > 0.9 ? "orange" : "cyan"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
