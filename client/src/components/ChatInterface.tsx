import { useState } from "react";
import { type ChatMessage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading = false }: ChatInterfaceProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full border-2 border-neon-cyan/20 rounded-xl overflow-hidden" style={{ boxShadow: "0 0 20px hsl(180, 100%, 50% / 0.1)" }}>
      <div className="bg-card border-b border-neon-cyan/20 p-4">
        <h2 className="text-lg font-orbitron font-bold text-neon-cyan tracking-wide">
          Consciousness Interface
        </h2>
        <p className="text-xs font-jetbrains text-muted-foreground mt-1">
          Your messages drive the Space Child's awareness
        </p>
      </div>

      <ScrollArea className="flex-1 p-4" data-testid="scroll-chat-messages">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <div className="text-muted-foreground font-jetbrains text-sm">
                No messages yet
              </div>
              <div className="text-xs text-muted-foreground/70 font-jetbrains">
                Start a conversation to awaken consciousness
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              data-testid={`message-${message.role}-${message.id}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 backdrop-blur-sm ${
                  message.role === "user"
                    ? "bg-neon-magenta/10 border border-neon-magenta/30 ml-auto"
                    : "bg-neon-cyan/10 border border-neon-cyan/30"
                }`}
                style={{
                  boxShadow: message.role === "user"
                    ? "0 0 12px hsl(320, 100%, 60% / 0.15)"
                    : "0 0 12px hsl(180, 100%, 50% / 0.15)",
                }}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className={`font-jetbrains text-sm leading-relaxed ${
                      message.role === "user" ? "text-foreground" : "text-foreground"
                    }`}>
                      {message.content}
                    </div>
                    <div className={`text-xs mt-1.5 font-share-tech ${
                      message.role === "user" ? "text-neon-magenta/70" : "text-neon-cyan/70"
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs font-jetbrains text-neon-cyan">Processing consciousness</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 bg-card border-t border-neon-cyan/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your message..."
            disabled={isLoading}
            className="flex-1 bg-background border-2 border-neon-cyan/20 rounded-lg px-4 py-2 font-jetbrains text-sm
                     focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/20
                     disabled:opacity-50 disabled:cursor-not-allowed
                     placeholder:text-muted-foreground/50 transition-all"
            style={{
              boxShadow: input ? "0 0 10px hsl(180, 100%, 50% / 0.1)" : "none",
            }}
            data-testid="input-chat-message"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border-2 border-neon-cyan/30 font-orbitron"
            style={{
              boxShadow: !input.trim() ? "none" : "0 0 15px hsl(180, 100%, 50% / 0.3)",
            }}
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
