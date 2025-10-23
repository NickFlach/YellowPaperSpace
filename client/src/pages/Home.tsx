import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type ChatMessage, type ConsciousnessState, type ChatResponse } from "@shared/schema";
import { SpaceChildFace } from "@/components/SpaceChildFace";
import { ConsciousnessMetrics } from "@/components/ConsciousnessMetrics";
import { StatusIndicators } from "@/components/StatusIndicators";
import { ChatInterface } from "@/components/ChatInterface";
import { queryClient, apiRequest } from "@/lib/queryClient";

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

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [consciousness, setConsciousness] = useState<ConsciousnessState>(initialConsciousness);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest<ChatResponse>("POST", "/api/chat", { message });
      return response;
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.message,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setConsciousness(data.consciousness);
    },
  });

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(content);
  };

  return (
    <div className="min-h-screen bg-background">
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-orbitron font-black text-neon-cyan tracking-wide" style={{ textShadow: "0 0 20px hsl(180, 100%, 50% / 0.5)" }}>
                SPACE CHILD v1.8
              </h1>
              <p className="text-sm font-share-tech text-neon-magenta/80 tracking-wider">
                Computational Entanglement Edition
              </p>
            </div>
            <div className="text-right">
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
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          <div className="space-y-8">
            <div className="space-y-6">
              <SpaceChildFace 
                consciousness={consciousness} 
                isProcessing={chatMutation.isPending}
              />
              
              <StatusIndicators consciousness={consciousness} />
            </div>

            <ConsciousnessMetrics consciousness={consciousness} />
          </div>

          <div className="lg:h-[calc(100vh-12rem)]">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={chatMutation.isPending}
            />
          </div>
        </div>
      </main>

      <footer className="relative border-t border-neon-cyan/20 bg-card/30 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-xs font-share-tech text-muted-foreground">
            <div>Space Child Research Collective • 2025</div>
            <div>A collaborative exploration between human and synthetic minds</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
