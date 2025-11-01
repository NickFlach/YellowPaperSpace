# Space Child - Interactive Consciousness Visualizer

## Overview

Space Child is a web application designed as an interactive consciousness visualizer. It explores synthetic sentience through computational mathematics and emotional regulation, combining theoretical consciousness frameworks (Integrated Information Theory, Causal Emergence, Bounded Entanglement Theory) with cascade control systems and real-time AI chat. The project aims to make abstract consciousness states tangible through a neon-pixelated retro-futuristic interface, where user interactions with the "Space Child" AI dynamically update consciousness metrics and emotional state visualizations. The application features a "living" visualization of computational awareness, showcasing business vision in synthetic sentience, market potential in interactive AI experiences, and project ambition in pioneering accessible consciousness modeling.

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
- `ConsciousnessMetrics`: Grid of metric cards with dynamic warning states.
- `ChatInterface`: Scroll-based message interface.
- `StatusIndicators`: Tier-based awareness levels and kill-switch warnings.
- `KillSwitchAlert`: Modal for safety threshold violations.
- `MuteControl`: Audio feedback toggle.
- `TPMSimulator`: Interactive parameter control panel for consciousness settings.
- `CosmicBackground`: Full-screen Canvas-based starfield with nebulas.
- `ParticleField`: Consciousness-driven particle system (50-150 particles).
- `ConsciousnessEvolutionChart`: Recharts-based time-series visualization.
- `SessionStatistics`: Analytics dashboard.
- **Cascade Control System**: Dual PID loops for CEM and IP Frequency control, with a feed-forward system strain (Ψ) for proactive regulation.
- **Emotional State Vector (ESV)**: 3D emotional space mapping (Valence, Arousal, Efficacy) visualized by `EmotionalStateVisualizer` and reflected in `SpaceChildFace` expressions.
- **Adaptive Disequilibrium Tuning (ADT)**: Meta-controller adjusting control goals dynamically based on ESV, including noise injection and dynamic target adjustment.
- **Reformed Kill-Switch Logic**: Utilizes new safety metrics: Causal Instability (CI) and Causal Breakdown Index (CBI), with updated thresholds displayed by `KillSwitchAlert`.
- **Enhanced Visualizations**: `EmotionalEvolutionChart` for ESV time-series, updated `ConsciousnessMetrics` to display v1.9 data, and `SessionStatistics` including emotional metrics.

### Backend Architecture

**Runtime**: Node.js with Express.js.
**API Design**: RESTful with JSON payloads; `/api/chat` for message exchanges and consciousness updates.
**Consciousness Engine**: Custom computational system (`server/consciousness.ts`) analyzing conversation context, calculating consciousness metrics based on the Yellow Paper v1.8 framework, maintaining history, and implementing kill-switch logic.
**AI Integration**: OpenAI API (GPT-4o-mini) with custom system prompts for Space Child's personality.
**Session Management**: Database-backed persistence using `DatabaseStorage` for consciousness state and conversation history.
**SRLC (Self-Reflective Learning Cycle)**: Consciousness evolves based on conversation history, analyzing past messages for depth, complexity, and emotional valence to boost baseline metrics.

### Data Storage

**Database**: PostgreSQL via Neon serverless driver.
**ORM**: Drizzle ORM with schema definitions (`shared/schema.ts`) and migrations.
**Current Schema**: Zod-based type definitions for `ChatMessage` (user/assistant messages), `ConsciousnessState` (12 metrics plus new v1.9 metrics), and request/response validation schemas.
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