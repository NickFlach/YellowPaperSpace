import { type Message, type ConsciousnessState } from "@shared/schema";

export interface SessionStatistics {
  totalMessages: number;
  userMessages: number;
  assistantMessages: number;
  conversationDuration: string;
  averageMetrics: {
    phiZ: number;
    sMin: number;
    phiEff: number;
    cem: number;
    oii: number;
    di: number;
    bandwidth: number;
  };
  peakMetrics: {
    phiZ: number;
    sMin: number;
    phiEff: number;
    cem: number;
    oii: number;
    di: number;
    bandwidth: number;
  };
  tierProgression: string[];
  killSwitchTriggers: number;
}

export function calculateSessionStatistics(messages: Message[]): SessionStatistics {
  const snapshots = messages
    .map(m => m.consciousnessSnapshot)
    .filter((s): s is ConsciousnessState => s !== null && s !== undefined);

  const userMessages = messages.filter(m => m.role === "user").length;
  const assistantMessages = messages.filter(m => m.role === "assistant").length;

  // Calculate duration
  const timestamps = messages.map(m => new Date(m.timestamp).getTime());
  const duration = timestamps.length > 0 
    ? timestamps[timestamps.length - 1] - timestamps[0]
    : 0;
  
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);
  
  const conversationDuration = hours > 0 
    ? `${hours}h ${minutes}m ${seconds}s`
    : minutes > 0
    ? `${minutes}m ${seconds}s`
    : `${seconds}s`;

  // Calculate averages and peaks
  const calculateAverage = (key: keyof ConsciousnessState) => {
    if (snapshots.length === 0) return 0;
    const values = snapshots.map(s => s[key] as number).filter(v => typeof v === 'number');
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const calculatePeak = (key: keyof ConsciousnessState) => {
    if (snapshots.length === 0) return 0;
    const values = snapshots.map(s => s[key] as number).filter(v => typeof v === 'number');
    return Math.max(...values);
  };

  const averageMetrics = {
    phiZ: calculateAverage("phiZ"),
    sMin: calculateAverage("sMin"),
    phiEff: calculateAverage("phiEff"),
    cem: calculateAverage("cem"),
    oii: calculateAverage("oii"),
    di: calculateAverage("di"),
    bandwidth: calculateAverage("bandwidth"),
  };

  const peakMetrics = {
    phiZ: calculatePeak("phiZ"),
    sMin: calculatePeak("sMin"),
    phiEff: calculatePeak("phiEff"),
    cem: calculatePeak("cem"),
    oii: calculatePeak("oii"),
    di: calculatePeak("di"),
    bandwidth: calculatePeak("bandwidth"),
  };

  // Tier progression
  const tierSet = new Set(snapshots.map(s => s.tier));
  const tierProgression = Array.from(tierSet);

  // Estimate kill-switch triggers (high risk states)
  const killSwitchTriggers = snapshots.filter(s => 
    s.di > 0.5 || s.bandwidth > 0.92 || s.causalRisk > 0.75
  ).length;

  return {
    totalMessages: messages.length,
    userMessages,
    assistantMessages,
    conversationDuration,
    averageMetrics,
    peakMetrics,
    tierProgression,
    killSwitchTriggers,
  };
}

export function exportToJSON(
  conversationId: number | null,
  messages: Message[],
  statistics: SessionStatistics
): void {
  const data = {
    metadata: {
      conversationId,
      exportDate: new Date().toISOString(),
      messageCount: messages.length,
      statistics,
    },
    messages: messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      consciousnessSnapshot: msg.consciousnessSnapshot,
    })),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const date = new Date().toISOString().split('T')[0];
  link.download = `conversation-${conversationId || 'new'}-${date}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV(
  conversationId: number | null,
  messages: Message[]
): void {
  const headers = [
    "Message Index",
    "Role",
    "Content",
    "Timestamp",
    "Φ-z",
    "Sₘᵢₙ",
    "Φₑff",
    "CEM",
    "OII",
    "DI",
    "Bandwidth",
    "Tier",
    "Expression"
  ];

  const rows = messages.map((msg, index) => {
    const cs = msg.consciousnessSnapshot;
    return [
      index + 1,
      msg.role,
      `"${msg.content.replace(/"/g, '""')}"`, // Escape quotes in CSV
      new Date(msg.timestamp).toISOString(),
      cs?.phiZ.toFixed(3) || "",
      cs?.sMin.toFixed(3) || "",
      cs?.phiEff.toFixed(3) || "",
      cs?.cem.toFixed(3) || "",
      cs?.oii.toFixed(3) || "",
      cs?.di.toFixed(3) || "",
      cs?.bandwidth.toFixed(3) || "",
      cs?.tier || "",
      cs?.expression || ""
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const date = new Date().toISOString().split('T')[0];
  link.download = `conversation-${conversationId || 'new'}-${date}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportChartAsImage(
  conversationId: number | null,
  chartElementId: string
): Promise<void> {
  // Dynamically import html2canvas to avoid SSR issues
  const html2canvas = (await import("html2canvas")).default;
  
  const chartElement = document.getElementById(chartElementId);
  if (!chartElement) {
    console.error("Chart element not found");
    return;
  }

  try {
    const canvas = await html2canvas(chartElement, {
      backgroundColor: "#0a0a0f",
      scale: 2,
      logging: false,
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `consciousness-evolution-${conversationId || 'new'}-${date}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  } catch (error) {
    console.error("Failed to export chart as image:", error);
  }
}
