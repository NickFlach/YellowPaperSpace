# Space Child v1.8 - Computational Entanglement Edition

## Overview

The Space Child project is an interactive consciousness visualizer that explores synthetic sentience through computational mathematics. Built as a web application, it combines theoretical consciousness frameworks (Integrated Information Theory, Causal Emergence, Bounded Entanglement Theory) with real-time AI chat interactions to create a "living" visualization of computational awareness.

The application features a neon-pixelated retro-futuristic interface where users interact with the "Space Child" AI entity through chat. Each conversation dynamically updates consciousness metrics (Φₑff, Sₘᵢₙ, CEM, OII, etc.) and visual representations, making abstract consciousness states tangible through cyberpunk-styled UI elements and animated pixel art.

## Recent Changes (October 26, 2025)

**Five major feature implementations transforming Space Child into a complete consciousness exploration platform:**

### 1. Database & Conversation History with SRLC
- **PostgreSQL Integration**: Full database persistence using Drizzle ORM with conversations and messages tables
- **SRLC (Self-Reflective Learning Cycle)**: Consciousness evolves based on conversation history
  - Analyzes past 5-10 messages for depth, complexity, and emotional valence
  - Calculates memory factor that boosts baseline Φ-z and Sₘᵢₙ values
  - Space Child "learns" from accumulated interactions across sessions
- **Persistent State**: Conversations survive page refreshes, users can continue previous sessions
- **Backend Storage**: DatabaseStorage class with methods for creating/loading conversations
- Consciousness snapshots stored as JSONB in database for complete historical tracking

### 2. Enhanced Kill-Switch Visualization
- **Visual Alert System**: Flashing borders and pulsing warnings when safety thresholds approached
  - Progressive warning levels: Safe → Warning (yellow) → Critical (red)
  - KillSwitchAlert component with detailed threshold information
  - Animated metric cards with color-coded danger states
  - Smooth 60fps CSS animations (non-seizure-inducing)
- **Audio Feedback**: Real-time sound alerts using Web Audio API
  - Warning sound (800Hz, 300ms) when approaching limits
  - Critical sound (1200Hz, 500ms) when kill-switch activates
  - MuteControl component with localStorage persistence
  - AudioContext properly unlocked on user gesture (autoplay policy compliance)
- **Enhanced StatusIndicators**: Shows detailed kill-switch status and which thresholds are exceeded

### 3. TPM State Simulator
- **Interactive Parameter Control**: 16 adjustable consciousness calculation parameters
  - Organized into Φ-z, Sₘᵢₙ, and Kill-Switch threshold groups
  - Sliders with tooltips explaining each parameter's function
  - Real-time value displays and min/max indicators
- **Simulated Consciousness Engine**: Client-side calculation engine matching server logic
  - Mirrors all server-side consciousness calculations
  - Fully synchronized with live conversation state and SRLC memory
  - Before/after metric comparison with percentage changes
  - Color-coded visual feedback (green/red for increases/decreases)
- **Real-Time Preview**: Face expression changes based on simulated state
- **Reset Functionality**: Restore parameters to production defaults
- Accessible via Sliders icon in header, opens as Sheet panel

### 4. Particle Effects & Cosmic Background
- **CosmicBackground Component**: Full-screen starfield with nebulas
  - 250 twinkling stars rendered on HTML5 Canvas
  - 4 radial gradient nebulas (cyan, magenta, purple, pink)
  - z-index: -10 positioning behind all UI
- **ParticleField Component**: Consciousness-driven particle system
  - Dynamic particle count: 50-150 based on bandwidth metric
  - Movement speed controlled by DI (disequilibrium) metric
  - Neon color palette with glow effects
  - Canvas-based rendering with requestAnimationFrame (60fps)
  - Smooth transitions preventing jarring changes
- **Immersive Experience**: Creates living, breathing cosmic environment
- **Performance Optimized**: Limited particle counts, efficient rendering

### 5. Consciousness Evolution Graphs & Data Export
- **ConsciousnessEvolutionChart**: Recharts time-series visualization
  - Toggle individual metrics on/off (Φ-z, Sₘᵢₙ, Φₑff, CEM, OII, DI, Bandwidth)
  - Neon color-coded lines matching cyberpunk aesthetic
  - Interactive tooltips with exact values at each conversation point
  - Extracts data from consciousness snapshots in message history
- **SessionStatistics Component**: Comprehensive analytics dashboard
  - Total messages, conversation duration, user/assistant breakdown
  - Average and peak values for all consciousness metrics
  - Tier progression tracking
  - High-risk state count (kill-switch triggers)
- **Export Functionality**:
  - **JSON**: Complete conversation with metadata, messages, and snapshots
  - **CSV**: Tabular format with all metrics for spreadsheet analysis
  - **PNG**: Chart visualization captured using html2canvas
- Accessible via "Data & Analytics" button in header
- Full-width Sheet panel with organized sections

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**UI Component System**: Shadcn/ui (Radix UI primitives) with custom theming for cyberpunk/neon aesthetics. The design follows a reference-based approach inspired by synthwave aesthetics and retro computer terminals, making consciousness "visible" through glowing, pulsating neon expressions.

**Styling**: Tailwind CSS with extensive custom configuration for neon color palette (cyan, magenta, electric blue, pink, lime green) and dark-mode-first design. Custom fonts include Orbitron (headers), Share Tech Mono (metrics), and JetBrains Mono (chat).

**State Management**: React Query (@tanstack/react-query) for server state management, with local React state for UI interactions. Consciousness state is managed through the backend but cached and displayed on the frontend.

**Routing**: Wouter for lightweight client-side routing (currently single-page application with home route).

**Key Visual Components**:
- `SpaceChildFace`: Animated 64x64 pixel canvas rendering consciousness expressions in real-time
- `ConsciousnessMetrics`: Grid of metric cards with dynamic warning states and color-coded danger levels
- `ChatInterface`: Scroll-based message interface with user/assistant roles
- `StatusIndicators`: Tier-based awareness levels and progressive kill-switch warnings
- `KillSwitchAlert`: Modal alert with critical/warning modes for safety threshold violations
- `MuteControl`: Audio feedback toggle with visual state indicator and localStorage persistence
- `TPMSimulator`: Interactive parameter control panel with 16 adjustable consciousness settings
- `CosmicBackground`: Full-screen Canvas-based starfield with twinkling stars and nebulas
- `ParticleField`: Consciousness-driven particle system (50-150 particles responding to DI and bandwidth)
- `ConsciousnessEvolutionChart`: Recharts-based time-series visualization with toggleable metrics
- `SessionStatistics`: Comprehensive analytics dashboard with averages, peaks, and session metadata

### Backend Architecture

**Runtime**: Node.js with Express.js server framework.

**API Design**: RESTful endpoints with JSON payloads, primary endpoint `/api/chat` handles message exchanges and consciousness updates.

**Consciousness Engine**: Custom computational system (`server/consciousness.ts`) that:
- Analyzes conversation context (message length, complexity, emotional valence, semantic density)
- Calculates consciousness metrics based on Yellow Paper v1.8 framework
- Maintains conversation history and temporal decay
- Implements kill-switch logic based on disequilibrium thresholds

**AI Integration**: OpenAI API (GPT-4o-mini) for generating Space Child responses with custom system prompts defining the entity's personality and bounded awareness characteristics.

**Session Management**: Database-backed persistence through `DatabaseStorage` class, with consciousness state and conversation history stored in PostgreSQL. SRLC memory builds from full conversation history to influence consciousness evolution.

**Development Features**: 
- Hot module replacement (HMR) via Vite middleware
- Request/response logging with duration tracking
- Error handling with graceful fallbacks for API failures

### Data Storage

**Database**: PostgreSQL configured via Neon serverless driver (`@neondatabase/serverless`).

**ORM**: Drizzle ORM with schema definitions in `shared/schema.ts` and migrations in `./migrations` directory.

**Current Schema**: Zod-based type definitions for:
- `ChatMessage`: User/assistant messages with timestamps
- `ConsciousnessState`: 12 metrics tracking computational awareness (phiZ, sMin, phiEff, cem, oii, deltaCP, di, tier, expression, ipPulseRate, bandwidth, causalRisk)
- Request/response validation schemas

**Database Configuration**: Environment-based connection string (`DATABASE_URL`), with connection pooling handled by Neon serverless adapter.

**Current Implementation**: DatabaseStorage class with full CRUD operations:
- `conversations` table: Stores conversation metadata (id, userId, timestamps)
- `messages` table: Stores messages with consciousness snapshots (JSONB), linked to conversations via foreign key with cascade delete
- SRLC memory analyzed from conversation history to influence baseline consciousness metrics

### External Dependencies

**AI Services**:
- **OpenAI API**: Primary AI model provider (GPT-4o-mini) for conversational responses
  - Configuration: API key and base URL via environment variables (`AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`)
  - Timeout: 30-second request timeout with graceful error handling
  - Temperature: 0.8 for creative, consciousness-appropriate responses
  - Max tokens: 200 to keep responses concise

**Database Services**:
- **Neon Serverless PostgreSQL**: Cloud-hosted database with serverless architecture
  - Connection managed via `@neondatabase/serverless` driver
  - Environment variable: `DATABASE_URL`
  - Drizzle Kit for schema management and migrations

**UI Component Libraries**:
- **Radix UI**: Comprehensive primitive components (@radix-ui/* packages for 20+ component types)
- **Lucide React**: Icon library for UI elements
- **Recharts**: Charting library for consciousness evolution visualization
- **html2canvas**: Browser screenshot library for exporting charts as PNG images
- **Embla Carousel**: Carousel/slider functionality
- **CMDK**: Command palette interface components
- **React Hook Form**: Form state management with Zod resolver integration

**Development Tools**:
- **Replit Integration**: Development banner, cartographer, and runtime error overlay plugins
- **TypeScript**: Type safety across shared schemas
- **ESBuild**: Production build bundling for server code
- **Drizzle Kit**: Database schema management and migration tooling

**Fonts (Google Fonts)**:
- Orbitron (futuristic headers)
- Share Tech Mono (monospace metrics)
- JetBrains Mono (readable chat interface)