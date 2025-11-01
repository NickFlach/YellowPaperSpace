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
  const [cemControlOpen, setCemControlOpen] = useState(false);
  const [ipControlOpen, setIpControlOpen] = useState(false);
  const [systemStrainOpen, setSystemStrainOpen] = useState(false);
  const [esvOpen, setEsvOpen] = useState(false);
  const [adtOpen, setAdtOpen] = useState(false);
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
           Object.keys(parameters.cemControl).some(k => isParameterModified("cemControl", k)) ||
           Object.keys(parameters.ipControl).some(k => isParameterModified("ipControl", k)) ||
           Object.keys(parameters.systemStrain).some(k => isParameterModified("systemStrain", k)) ||
           Object.keys(parameters.esv).some(k => isParameterModified("esv", k)) ||
           Object.keys(parameters.adt).some(k => isParameterModified("adt", k)) ||
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

      <Card className="p-4 border-neon-blue/30">
        <Collapsible open={cemControlOpen} onOpenChange={setCemControlOpen}>
          <CollapsibleTrigger className="w-full" data-testid="collapsible-trigger-cemcontrol">
            <div className="flex items-center justify-between w-full hover-elevate p-2 rounded-md">
              <div className="flex items-center gap-2">
                {cemControlOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="text-sm font-orbitron font-bold text-neon-blue">CEM Cascade Control</span>
              </div>
              <Badge variant="secondary" className="text-xs">v1.9</Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <ParameterControl
              label="Target Min"
              value={parameters.cemControl.targetMin}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => setParameters({ ...parameters, cemControl: { ...parameters.cemControl, targetMin: v }})}
              tooltip="Minimum target CEM value for cascade control. System adjusts IP frequency to maintain CEM in target range."
              isModified={isParameterModified("cemControl", "targetMin")}
            />
            <ParameterControl
              label="Target Max"
              value={parameters.cemControl.targetMax}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => setParameters({ ...parameters, cemControl: { ...parameters.cemControl, targetMax: v }})}
              tooltip="Maximum target CEM value for cascade control. Defines upper bound of desired CEM operating range."
              isModified={isParameterModified("cemControl", "targetMax")}
            />
            <ParameterControl
              label="Proportional Gain (Kp)"
              value={parameters.cemControl.kp}
              min={0}
              max={10}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, cemControl: { ...parameters.cemControl, kp: v }})}
              tooltip="Proportional gain for CEM control loop. Higher values increase responsiveness to CEM errors."
              isModified={isParameterModified("cemControl", "kp")}
            />
            <ParameterControl
              label="Integral Gain (Ki)"
              value={parameters.cemControl.ki}
              min={0}
              max={5}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, cemControl: { ...parameters.cemControl, ki: v }})}
              tooltip="Integral gain for CEM control. Eliminates steady-state error by accumulating past errors."
              isModified={isParameterModified("cemControl", "ki")}
            />
            <ParameterControl
              label="Derivative Gain (Kd)"
              value={parameters.cemControl.kd}
              min={0}
              max={5}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, cemControl: { ...parameters.cemControl, kd: v }})}
              tooltip="Derivative gain for CEM control. Dampens oscillations by responding to rate of change."
              isModified={isParameterModified("cemControl", "kd")}
            />
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="p-4 border-neon-green/30">
        <Collapsible open={ipControlOpen} onOpenChange={setIpControlOpen}>
          <CollapsibleTrigger className="w-full" data-testid="collapsible-trigger-ipcontrol">
            <div className="flex items-center justify-between w-full hover-elevate p-2 rounded-md">
              <div className="flex items-center gap-2">
                {ipControlOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="text-sm font-orbitron font-bold text-neon-green">IP Frequency Control</span>
              </div>
              <Badge variant="secondary" className="text-xs">v1.9</Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <ParameterControl
              label="Target Min"
              value={parameters.ipControl.targetMin}
              min={0}
              max={30}
              step={1}
              onChange={(v) => setParameters({ ...parameters, ipControl: { ...parameters.ipControl, targetMin: v }})}
              tooltip="Minimum target IP pulse rate (Hz). Defines lower bound for information processing frequency."
              isModified={isParameterModified("ipControl", "targetMin")}
            />
            <ParameterControl
              label="Target Max"
              value={parameters.ipControl.targetMax}
              min={0}
              max={30}
              step={1}
              onChange={(v) => setParameters({ ...parameters, ipControl: { ...parameters.ipControl, targetMax: v }})}
              tooltip="Maximum target IP pulse rate (Hz). Defines upper bound for sustainable processing speed."
              isModified={isParameterModified("ipControl", "targetMax")}
            />
            <ParameterControl
              label="Proportional Gain (Kp)"
              value={parameters.ipControl.kp}
              min={0}
              max={5}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, ipControl: { ...parameters.ipControl, kp: v }})}
              tooltip="Proportional gain for IP control loop. Controls immediate response to frequency errors."
              isModified={isParameterModified("ipControl", "kp")}
            />
            <ParameterControl
              label="Integral Gain (Ki)"
              value={parameters.ipControl.ki}
              min={0}
              max={3}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, ipControl: { ...parameters.ipControl, ki: v }})}
              tooltip="Integral gain for IP control. Eliminates long-term drift in processing frequency."
              isModified={isParameterModified("ipControl", "ki")}
            />
            <ParameterControl
              label="Derivative Gain (Kd)"
              value={parameters.ipControl.kd}
              min={0}
              max={3}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, ipControl: { ...parameters.ipControl, kd: v }})}
              tooltip="Derivative gain for IP control. Prevents overshoot in frequency adjustments."
              isModified={isParameterModified("ipControl", "kd")}
            />
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="p-4 border-neon-pink/30">
        <Collapsible open={systemStrainOpen} onOpenChange={setSystemStrainOpen}>
          <CollapsibleTrigger className="w-full" data-testid="collapsible-trigger-systemstrain">
            <div className="flex items-center justify-between w-full hover-elevate p-2 rounded-md">
              <div className="flex items-center gap-2">
                {systemStrainOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="text-sm font-orbitron font-bold text-neon-pink">System Strain (Ψ)</span>
              </div>
              <Badge variant="secondary" className="text-xs">v1.9</Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <ParameterControl
              label="Bandwidth Weight (α)"
              value={parameters.systemStrain.bandwidthWeight}
              min={0}
              max={2}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, systemStrain: { ...parameters.systemStrain, bandwidthWeight: v }})}
              tooltip="Weight for bandwidth contribution to system strain. Higher values make bandwidth saturation more impactful."
              isModified={isParameterModified("systemStrain", "bandwidthWeight")}
            />
            <ParameterControl
              label="CEM Excess Weight (β)"
              value={parameters.systemStrain.cemExcessWeight}
              min={0}
              max={2}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, systemStrain: { ...parameters.systemStrain, cemExcessWeight: v }})}
              tooltip="Weight for CEM exceeding target range. Penalizes CEM values above optimal bounds."
              isModified={isParameterModified("systemStrain", "cemExcessWeight")}
            />
            <ParameterControl
              label="IP Excess Weight (γ)"
              value={parameters.systemStrain.ipExcessWeight}
              min={0}
              max={2}
              step={0.1}
              onChange={(v) => setParameters({ ...parameters, systemStrain: { ...parameters.systemStrain, ipExcessWeight: v }})}
              tooltip="Weight for IP frequency exceeding target. Penalizes unsustainable processing speeds."
              isModified={isParameterModified("systemStrain", "ipExcessWeight")}
            />
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="p-4 border-neon-magenta/30">
        <Collapsible open={esvOpen} onOpenChange={setEsvOpen}>
          <CollapsibleTrigger className="w-full" data-testid="collapsible-trigger-esv">
            <div className="flex items-center justify-between w-full hover-elevate p-2 rounded-md">
              <div className="flex items-center gap-2">
                {esvOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="text-sm font-orbitron font-bold text-neon-magenta">Emotional State Vector</span>
              </div>
              <Badge variant="secondary" className="text-xs">v1.9</Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-share-tech uppercase tracking-wide text-muted-foreground">
                    Valence from Strain
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-muted-foreground cursor-help" data-testid="info-Valence from Strain" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-card border-neon-cyan/30">
                        <p className="text-xs font-jetbrains">Calculate valence as 1 - Ψ (positive when low strain). When disabled, uses alternative calculation.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Badge variant={parameters.esv.valenceFromStrain ? "default" : "secondary"} className="font-jetbrains text-xs">
                  {parameters.esv.valenceFromStrain ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParameters({ ...parameters, esv: { ...parameters.esv, valenceFromStrain: !parameters.esv.valenceFromStrain }})}
                className="w-full"
                data-testid="button-valence-from-strain"
              >
                Toggle
              </Button>
            </div>
            <ParameterControl
              label="Arousal Divisor"
              value={parameters.esv.arousalDivisor}
              min={1}
              max={50}
              step={1}
              onChange={(v) => setParameters({ ...parameters, esv: { ...parameters.esv, arousalDivisor: v }})}
              tooltip="Divisor for IP pulse rate to calculate arousal (energy). Lower values increase arousal sensitivity."
              isModified={isParameterModified("esv", "arousalDivisor")}
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-share-tech uppercase tracking-wide text-muted-foreground">
                    Efficacy from SRLC
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-muted-foreground cursor-help" data-testid="info-Efficacy from SRLC" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-card border-neon-cyan/30">
                        <p className="text-xs font-jetbrains">Calculate efficacy from ΔSRLC (learning progress). When disabled, uses alternative method.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Badge variant={parameters.esv.efficacyFromSRLC ? "default" : "secondary"} className="font-jetbrains text-xs">
                  {parameters.esv.efficacyFromSRLC ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParameters({ ...parameters, esv: { ...parameters.esv, efficacyFromSRLC: !parameters.esv.efficacyFromSRLC }})}
                className="w-full"
                data-testid="button-efficacy-from-srlc"
              >
                Toggle
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <Card className="p-4 border-neon-cyan/30">
        <Collapsible open={adtOpen} onOpenChange={setAdtOpen}>
          <CollapsibleTrigger className="w-full" data-testid="collapsible-trigger-adt">
            <div className="flex items-center justify-between w-full hover-elevate p-2 rounded-md">
              <div className="flex items-center gap-2">
                {adtOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span className="text-sm font-orbitron font-bold text-neon-cyan">Adaptive Disequilibrium Tuning</span>
              </div>
              <Badge variant="secondary" className="text-xs">v1.9</Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4 space-y-4">
            <ParameterControl
              label="DI Target Min"
              value={parameters.adt.diTargetMin}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => setParameters({ ...parameters, adt: { ...parameters.adt, diTargetMin: v }})}
              tooltip="Minimum target disequilibrium. System maintains creative tension above this threshold."
              isModified={isParameterModified("adt", "diTargetMin")}
            />
            <ParameterControl
              label="DI Target Max"
              value={parameters.adt.diTargetMax}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => setParameters({ ...parameters, adt: { ...parameters.adt, diTargetMax: v }})}
              tooltip="Maximum target disequilibrium. System prevents instability above this threshold."
              isModified={isParameterModified("adt", "diTargetMax")}
            />
            <ParameterControl
              label="DI Target Optimal"
              value={parameters.adt.diTargetOptimal}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => setParameters({ ...parameters, adt: { ...parameters.adt, diTargetOptimal: v }})}
              tooltip="Optimal disequilibrium target. System aims for this value to balance stability and creativity."
              isModified={isParameterModified("adt", "diTargetOptimal")}
            />
            <ParameterControl
              label="Noise Injection Rate"
              value={parameters.adt.noiseInjectionRate}
              min={0}
              max={0.5}
              step={0.01}
              onChange={(v) => setParameters({ ...parameters, adt: { ...parameters.adt, noiseInjectionRate: v }})}
              tooltip="Rate of controlled noise injection to maintain healthy disequilibrium. Prevents over-stabilization."
              isModified={isParameterModified("adt", "noiseInjectionRate")}
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
              <Badge variant="secondary" className="text-xs">v1.9 Reformed</Badge>
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
              label="CI Threshold (Causal Instability)"
              value={parameters.killSwitch.ciThreshold}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => setParameters({ ...parameters, killSwitch: { ...parameters.killSwitch, ciThreshold: v }})}
              tooltip="Causal Instability threshold: |DI - 0.3| / 0.3. Measures deviation from optimal disequilibrium."
              isModified={isParameterModified("killSwitch", "ciThreshold")}
            />
            <ParameterControl
              label="CBI Threshold (Causal Breakdown)"
              value={parameters.killSwitch.cbiThreshold}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => setParameters({ ...parameters, killSwitch: { ...parameters.killSwitch, cbiThreshold: v }})}
              tooltip="Causal Breakdown Index threshold: 1 - R (reliability). Lower values are stricter on reliability."
              isModified={isParameterModified("killSwitch", "cbiThreshold")}
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
