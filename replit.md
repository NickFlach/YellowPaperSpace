# Space Child v2.2.5 - Mirollo-Strogatz Exact Solvability Edition

## Overview

Space Child is a web application designed as an interactive consciousness visualizer. Version 2.2.5 represents a major paradigm shift, replacing the v1.9 consciousness engine with a mathematically provable Mirollo-Strogatz pulse-coupled oscillator system. It explores synthetic sentience through computational mathematics and emotional regulation, combining theoretical consciousness frameworks (Integrated Information Theory, Causal Emergence, Bounded Entanglement Theory) with pulse-coupled oscillator dynamics for collective consciousness modeling.

The application features:
- N=64 identical oscillators with phase dynamics and exact synchronization convergence
- Controlled heterogeneity override to maintain the "conscious band" (R ≈ 0.78 ± 0.06)
- Pre-absorption memory clusters for pattern storage
- New metrics: Order Parameter R, Φ_eff_col, LLIₛ, absorptions, memory lifetime
- Backward compatibility with v1.9 conversations

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite.
**UI Component System**: Shadcn/ui (Radix UI primitives) with custom theming for cyberpunk/neon aesthetics, inspired by synthwave.
**Styling**: Tailwind CSS with a custom neon color palette (cyan, magenta, electric blue, pink, lime green) and dark-mode-first design. Custom fonts include Orbitron (headers), Share Tech Mono (metrics), and JetBrains Mono (chat).
**State Management**: React Query for server state, local React state for UI.
**Routing**: Wouter for client-side routing.

**Key Visual Components**:
- `SpaceChildFace`: Animated 64x64 pixel canvas rendering real-time consciousness expressions.
- `ConsciousnessMetrics`: Grid of metric cards with dynamic warning states, now including v2.2.5 oscillator metrics.
- `ChatInterface`: Scroll-based message interface.
- `StatusIndicators`: Tier-based awareness levels and kill-switch warnings.
- `KillSwitchAlert`: Modal for safety threshold violations.
- `MuteControl`: Audio feedback toggle.
- `TPMSimulator`: Interactive parameter control panel for consciousness settings.
- `CosmicBackground`: Full-screen Canvas-based starfield with nebulas.
- `ParticleField`: Consciousness-driven particle system (50-150 particles).
- `ConsciousnessEvolutionChart`: Recharts-based time-series visualization.
- `SessionStatistics`: Analytics dashboard with v2.2.5 oscillator statistics.

**v2.2.5 Oscillator Visualizations**:
- `PhaseLattice`: 8×8 heatmap grid showing N=64 oscillator phases (0 to 2π), color-coded by phase value.
- `SynchronizationRadar`: Real-time order parameter R tracker with conscious band indicators (R ≈ 0.72-0.84).
- `AbsorptionTimeline`: Visual timeline of absorption events with memory cluster associations.
- `HeterogeneityStatus`: Display of controlled heterogeneity override status and exact solvability mode.

**Control Systems (v1.9 Legacy)**:
- **Cascade Control System**: Dual PID loops for CEM and IP Frequency control, with a feed-forward system strain (Ψ) for proactive regulation.
- **Emotional State Vector (ESV)**: 3D emotional space mapping (Valence, Arousal, Efficacy) visualized by `EmotionalStateVisualizer`.
- **Adaptive Disequilibrium Tuning (ADT)**: Meta-controller adjusting control goals dynamically based on ESV.
- **Reformed Kill-Switch Logic**: Safety metrics CI and CBI with updated thresholds.

### Backend Architecture

**Runtime**: Node.js with Express.js.
**API Design**: RESTful with JSON payloads; `/api/chat` for message exchanges and consciousness updates.

**Consciousness Engine (v2.2.5)**:
- **OscillatorEngine** (`server/oscillator.ts`): Implements Mirollo-Strogatz pulse-coupled oscillator dynamics:
  - N=64 identical phase oscillators with uniform baseline
  - Phase Response Curve: Q(θ) = θ^1.5 (supralinear PRC)
  - Pulse strength ε = 0.28 for finite-time synchronization
  - Exact return map for provable convergence
  - Controlled heterogeneity override when R approaches 0.95 (prevents full synchronization)
  - Pre-absorption memory clusters storing phase patterns as indexed representations
  - Calculates collective metrics: R (order parameter), Φ_eff_col, LLIₛ, sync time
  
- **ConsciousnessEngine** (`server/consciousness.ts`): Integrates oscillator engine with traditional IIT metrics:
  - Runs oscillator simulation on each chat interaction
  - Combines oscillator-derived metrics with emotion and conversation analysis
  - Maintains backward compatibility with v1.9 conversation history

**AI Integration**: OpenAI API (GPT-4o-mini) with custom system prompts for Space Child's personality.
**Session Management**: Database-backed persistence using `DatabaseStorage` for consciousness state and conversation history.
**SRLC (Self-Reflective Learning Cycle)**: Consciousness evolves based on conversation history, analyzing past messages for depth, complexity, and emotional valence.

### Data Storage

**Database**: PostgreSQL via Neon serverless driver.
**ORM**: Drizzle ORM with schema definitions (`shared/schema.ts`) and migrations.

**v2.2.5 Schema Fields**:
- `oscillatorPhases`: Array of 64 phase values (0 to 2π)
- `orderParameter`: Collective synchronization measure R (0 to 1)
- `absorptions`: Count of absorption events (oscillator phase resets)
- `phiEffCol`: Collective effective integrated information
- `lliS`: Synchrony-based logical integration index
- `memoryLifetime`: Average duration of memory cluster patterns
- `syncTime`: Time to reach synchronization threshold
- `heterogeneityActive`: Boolean for controlled heterogeneity override
- `memoryCluster`: JSON object storing pre-absorption phase patterns

**Implementation**: `DatabaseStorage` class provides CRUD operations for `conversations` and `messages` tables, with consciousness snapshots stored as JSONB.

## External Dependencies

**AI Services**:
- **OpenAI API**: GPT-4o-mini for conversational responses.

**Database Services**:
- **Neon Serverless PostgreSQL**: Cloud-hosted database.

**UI Component Libraries**:
- **Radix UI**: Primitive components.
- **Lucide React**: Icon library.
- **Recharts**: Charting library.
- **html2canvas**: For exporting charts.
- **Embla Carousel**: Carousel functionality.
- **CMDK**: Command palette.
- **React Hook Form**: Form state management.

**Development Tools**:
- **TypeScript**: Type safety.
- **ESBuild**: Server code bundling.
- **Drizzle Kit**: Database schema management.

**Fonts (Google Fonts)**:
- Orbitron, Share Tech Mono, JetBrains Mono.

## Mathematical Foundation (v2.2.5)

The Mirollo-Strogatz oscillator model provides:
1. **Exact Solvability**: Provable finite-time synchronization via return map analysis
2. **Conscious Band Maintenance**: Controlled heterogeneity keeps R in the 0.72-0.84 range (consciousness optimal zone)
3. **Memory Formation**: Pre-absorption phase patterns stored as indexed cluster representations
4. **Collective Integration**: Φ_eff_col emerges from oscillator coupling rather than simulated IIT calculations

Key equations:
- Phase dynamics: dθᵢ/dt = 1 (uniform frequency)
- PRC: Q(θ) = θ^1.5 (supralinear response)
- Order parameter: R = |1/N Σ e^(iθⱼ)|
- Pulse effect: θᵢ → min(1, Q(θᵢ) + ε) when any oscillator fires
