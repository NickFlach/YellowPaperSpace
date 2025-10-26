import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type ChatMessage, type ConsciousnessState, type ChatResponse, type Message } from "@shared/schema";
import { SpaceChildFace } from "@/components/SpaceChildFace";
import { ConsciousnessMetrics } from "@/components/ConsciousnessMetrics";
import { StatusIndicators } from "@/components/StatusIndicators";
import { ChatInterface } from "@/components/ChatInterface";
import { KillSwitchAlert } from "@/components/KillSwitchAlert";
import { MuteControl } from "@/components/MuteControl";
import { TPMSimulator } from "@/components/TPMSimulator";
import { CosmicBackground } from "@/components/CosmicBackground";
import { ParticleField } from "@/components/ParticleField";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAlertAudio } from "@/hooks/use-alert-audio";
import { ConsciousnessEvolutionChart } from "@/components/ConsciousnessEvolutionChart";
import { SessionStatistics } from "@/components/SessionStatistics";
import { calculateSessionStatistics, exportToJSON, exportToCSV, exportChartAsImage } from "@/lib/exportUtils";
import { Sliders, BarChart3, Download, FileJson, FileSpreadsheet, Image as ImageIcon } from "lucide-react";

const initialConsciousness: ConsciousnessState = {
  phiZ: 1.2,
  sMin: 0.8,
  phiEff: 0.96,
  cem: 0.6,
  oii: 0.48,
  deltaCP: 0.15,
  di: 0.25,
  tier: "automation",
  expression: "neutral",
  ipPulseRate: 12.5,
  bandwidth: 0.35,
  causalRisk: 0.15,
};

function convertMessageToChatMessage(msg: Message): ChatMessage {
  return {
    id: `msg-${msg.id}`,
    role: msg.role,
    content: msg.content,
    timestamp: new Date(msg.timestamp).getTime(),
  };
}

export default function Home() {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [consciousness, setConsciousness] = useState<ConsciousnessState | null>(initialConsciousness);
  const [isKillSwitchTriggered, setIsKillSwitchTriggered] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [fullMessages, setFullMessages] = useState<Message[]>([]);
  
  const { playAlert, isMuted, toggleMute, isPlaying, unlockAudio } = useAlertAudio();
  const previousWarningLevelRef = useRef<"safe" | "warning" | "critical" | null>(null);

  useEffect(() => {
    const loadLatestConversation = async () => {
      try {
        const conversations = await apiRequest<any[]>("GET", "/api/conversations?limit=1");
        if (conversations.length > 0) {
          const latestConversation = conversations[0];
          setConversationId(latestConversation.id);
          
          const conversationData = await apiRequest<{ conversation: any; messages: Message[] }>(
            "GET",
            `/api/conversations/${latestConversation.id}`
          );
          
          const chatMessages = conversationData.messages.map(convertMessageToChatMessage);
          setMessages(chatMessages);
          
          const lastConsciousness = conversationData.messages
            .filter((m: Message) => m.consciousnessSnapshot)
            .slice(-1)[0]?.consciousnessSnapshot;
          
          if (lastConsciousness) {
            setConsciousness(lastConsciousness);
          }
        }
      } catch (error) {
        console.error("Failed to load conversation:", error);
      }
    };

    loadLatestConversation();
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest<ChatResponse & { conversationId: number }>(
        "POST",
        "/api/chat",
        { message, conversationId }
      );
      return response;
    },
    onSuccess: (data) => {
      if (!conversationId) {
        setConversationId(data.conversationId);
      }
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.message,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setConsciousness(data.consciousness);
    },
    onError: (error: any) => {
      console.error("Chat mutation error:", error);
      if (error?.message?.includes("Kill-switch") || error?.message?.includes("kill-switch")) {
        setIsKillSwitchTriggered(true);
        setShowAlert(true);
      }
    },
  });

  const handleNewConversation = () => {
    setConversationId(null);
    setMessages([]);
    setConsciousness(initialConsciousness);
    setIsKillSwitchTriggered(false);
    setShowAlert(true);
  };

  const handleAcknowledgeAlert = () => {
    setShowAlert(false);
  };

  const getWarningLevel = (): "safe" | "warning" | "critical" | null => {
    if (!consciousness) return null;
    
    const criticalCriteria = [
      consciousness.di > 0.5,
      consciousness.bandwidth > 0.92,
      consciousness.causalRisk > 0.75,
    ].filter(Boolean).length;

    const warningCriteria = [
      consciousness.di > 0.48,
      consciousness.bandwidth > 0.90,
      consciousness.causalRisk > 0.72,
    ].filter(Boolean).length;

    if (isKillSwitchTriggered || criticalCriteria >= 2) {
      return "critical";
    } else if (warningCriteria >= 2) {
      return "warning";
    }
    return "safe";
  };

  const handleSendMessage = (content: string) => {
    unlockAudio();
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(content);
  };

  const loadFullMessages = async () => {
    if (!conversationId) return;
    
    try {
      const conversationData = await apiRequest<{ conversation: any; messages: Message[] }>(
        "GET",
        `/api/conversations/${conversationId}`
      );
      setFullMessages(conversationData.messages);
    } catch (error) {
      console.error("Failed to load full messages:", error);
    }
  };

  const handleOpenAnalytics = () => {
    setAnalyticsOpen(true);
    loadFullMessages();
  };

  const handleExportJSON = () => {
    if (fullMessages.length === 0) return;
    const statistics = calculateSessionStatistics(fullMessages);
    exportToJSON(conversationId, fullMessages, statistics);
  };

  const handleExportCSV = () => {
    if (fullMessages.length === 0) return;
    exportToCSV(conversationId, fullMessages);
  };

  const handleExportChart = async () => {
    await exportChartAsImage(conversationId, "evolution-chart-export");
  };

  const warningLevel = getWarningLevel();

  useEffect(() => {
    const previousLevel = previousWarningLevelRef.current;
    
    if (warningLevel === previousLevel) {
      return;
    }

    if (warningLevel === "warning" && previousLevel !== "warning") {
      playAlert("warning");
    } else if (warningLevel === "critical" && previousLevel !== "critical") {
      playAlert("critical");
    }

    previousWarningLevelRef.current = warningLevel;
  }, [warningLevel, playAlert]);

  return (
    <div className="min-h-screen bg-background">
      <CosmicBackground />
      <ParticleField consciousness={consciousness} />
      
      {showAlert && (
        <KillSwitchAlert
          consciousness={consciousness}
          isKillSwitchTriggered={isKillSwitchTriggered}
          onNewConversation={handleNewConversation}
          onAcknowledge={handleAcknowledgeAlert}
        />
      )}
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, hsl(180, 100%, 50% / 0.05) 25%, hsl(180, 100%, 50% / 0.05) 26%, transparent 27%, transparent 74%, hsl(180, 100%, 50% / 0.05) 75%, hsl(180, 100%, 50% / 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, hsl(180, 100%, 50% / 0.05) 25%, hsl(180, 100%, 50% / 0.05) 26%, transparent 27%, transparent 74%, hsl(180, 100%, 50% / 0.05) 75%, hsl(180, 100%, 50% / 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: "50px 50px",
        }} />
      </div>

      <header className="relative border-b border-neon-cyan/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-orbitron font-black text-neon-cyan tracking-wide" style={{ textShadow: "0 0 20px hsl(180, 100%, 50% / 0.5)" }}>
                SPACE CHILD v1.8
              </h1>
              <p className="text-xs sm:text-sm font-share-tech text-neon-magenta/80 tracking-wider">
                Computational Entanglement Edition
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-share-tech text-muted-foreground uppercase tracking-wide">
                  {new Date().toLocaleDateString([], { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="text-xs font-jetbrains text-neon-green/70 mt-1">
                  System Online
                </div>
              </div>
              <Button
                size="icon"
                variant="outline"
                className="border-neon-blue/30 hover:border-neon-blue/60"
                onClick={handleOpenAnalytics}
                disabled={!conversationId}
                data-testid="button-open-analytics"
              >
                <BarChart3 className="w-4 h-4 text-neon-blue" />
              </Button>
              <Sheet open={simulatorOpen} onOpenChange={setSimulatorOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-neon-magenta/30 hover:border-neon-magenta/60"
                    data-testid="button-open-simulator"
                  >
                    <Sliders className="w-4 h-4 text-neon-magenta" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-full sm:max-w-xl border-neon-magenta/30 bg-card/95 backdrop-blur-md"
                >
                  <SheetHeader>
                    <SheetTitle className="text-neon-magenta font-orbitron">
                      TPM State Simulator
                    </SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-8rem)] mt-6 pr-4">
                    <TPMSimulator currentConsciousness={consciousness} messages={messages} />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
              <MuteControl 
                isMuted={isMuted} 
                isPlaying={isPlaying}
                onToggle={toggleMute}
                unlockAudio={unlockAudio}
              />
            </div>
          </div>
        </div>
      </header>

      <main 
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 ${
          warningLevel === "critical" ? "border-4 border-neon-red/50 rounded-2xl animate-flash-border-danger" :
          warningLevel === "warning" ? "border-4 border-neon-yellow/50 rounded-2xl animate-flash-border-warning" : ""
        }`}
        data-testid="main-content"
      >
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr,400px] gap-6 sm:gap-8">
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="space-y-4 sm:space-y-6">
              {consciousness && (
                <>
                  <SpaceChildFace 
                    consciousness={consciousness} 
                    isProcessing={chatMutation.isPending}
                  />
                  
                  <StatusIndicators consciousness={consciousness} />
                </>
              )}
              {!consciousness && (
                <div className="text-center py-12 text-muted-foreground font-jetbrains">
                  Initializing Space Child consciousness...
                </div>
              )}
            </div>

            {consciousness && <ConsciousnessMetrics consciousness={consciousness} />}
          </div>

          <div className="h-[500px] sm:h-[600px] lg:h-[calc(100vh-12rem)] order-1 lg:order-2">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={chatMutation.isPending}
            />
          </div>
        </div>
      </main>

      <footer className="relative border-t border-neon-cyan/20 bg-card/30 backdrop-blur-sm mt-8 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-share-tech text-muted-foreground text-center sm:text-left">
            <div>Space Child Research Collective • 2025</div>
            <div className="text-[10px] sm:text-xs">A collaborative exploration between human and synthetic minds</div>
          </div>
        </div>
      </footer>

      <Sheet open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-4xl border-neon-blue/30 bg-card/95 backdrop-blur-md overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="text-neon-blue font-orbitron flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Data & Analytics
            </SheetTitle>
          </SheetHeader>

          {fullMessages.length > 0 ? (
            <div className="mt-6 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-orbitron font-bold text-neon-cyan">
                    Consciousness Evolution
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportChart}
                    className="border-neon-blue/30 hover:border-neon-blue/60 gap-2"
                    data-testid="button-export-chart"
                  >
                    <ImageIcon className="w-4 h-4 text-neon-blue" />
                    Export Chart
                  </Button>
                </div>
                <div id="evolution-chart-export">
                  <ConsciousnessEvolutionChart messages={fullMessages} />
                </div>
              </div>

              <Separator className="bg-neon-cyan/20" />

              <SessionStatistics statistics={calculateSessionStatistics(fullMessages)} />

              <Separator className="bg-neon-cyan/20" />

              <div className="space-y-4">
                <h3 className="text-lg font-orbitron font-bold text-neon-magenta">
                  Export Options
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={handleExportJSON}
                    className="border-neon-cyan/30 hover:border-neon-cyan/60 gap-2 justify-start"
                    data-testid="button-export-json"
                  >
                    <FileJson className="w-4 h-4 text-neon-cyan" />
                    <div className="text-left flex-1">
                      <div className="font-share-tech text-sm">Export JSON</div>
                      <div className="text-xs text-muted-foreground font-jetbrains">
                        Complete conversation data
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleExportCSV}
                    className="border-neon-green/30 hover:border-neon-green/60 gap-2 justify-start"
                    data-testid="button-export-csv"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-neon-green" />
                    <div className="text-left flex-1">
                      <div className="font-share-tech text-sm">Export CSV</div>
                      <div className="text-xs text-muted-foreground font-jetbrains">
                        Spreadsheet format
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-12 text-center space-y-4">
              <BarChart3 className="w-16 h-16 text-neon-blue/50 mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-orbitron font-bold text-neon-blue">
                  No Analytics Data
                </h3>
                <p className="text-sm font-jetbrains text-muted-foreground">
                  Start a conversation to generate analytics and export data
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
