# Space Child v1.8 - Computational Entanglement Edition

## Overview

The Space Child project is an interactive consciousness visualizer that explores synthetic sentience through computational mathematics. Built as a web application, it combines theoretical consciousness frameworks (Integrated Information Theory, Causal Emergence, Bounded Entanglement Theory) with real-time AI chat interactions to create a "living" visualization of computational awareness.

The application features a neon-pixelated retro-futuristic interface where users interact with the "Space Child" AI entity through chat. Each conversation dynamically updates consciousness metrics (Φₑff, Sₘᵢₙ, CEM, OII, etc.) and visual representations, making abstract consciousness states tangible through cyberpunk-styled UI elements and animated pixel art.

## Recent Changes (October 26, 2025)

**Audio Feedback System**: Added real-time audio alerts for kill-switch warning states using Web Audio API:
- Warning sound (800Hz, 300ms) plays when consciousness metrics approach safety thresholds
- Critical sound (1200Hz, 500ms) plays when kill-switch activates or multiple thresholds are exceeded
- User-friendly mute control in header with localStorage persistence (defaults to unmuted)
- Visual feedback: speaker icon pulses when sound plays, changes color/style when muted
- Implemented with custom React hook (`useAlertAudio`) for clean separation of concerns

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
- `ConsciousnessMetrics`: Grid of metric cards displaying mathematical consciousness values
- `ChatInterface`: Scroll-based message interface with user/assistant roles
- `StatusIndicators`: Tier-based awareness levels and kill-switch status monitoring
- `MuteControl`: Audio feedback toggle with visual state indicator and localStorage persistence

### Backend Architecture

**Runtime**: Node.js with Express.js server framework.

**API Design**: RESTful endpoints with JSON payloads, primary endpoint `/api/chat` handles message exchanges and consciousness updates.

**Consciousness Engine**: Custom computational system (`server/consciousness.ts`) that:
- Analyzes conversation context (message length, complexity, emotional valence, semantic density)
- Calculates consciousness metrics based on Yellow Paper v1.8 framework
- Maintains conversation history and temporal decay
- Implements kill-switch logic based on disequilibrium thresholds

**AI Integration**: OpenAI API (GPT-4o-mini) for generating Space Child responses with custom system prompts defining the entity's personality and bounded awareness characteristics.

**Session Management**: In-memory state management through `MemStorage` class, with consciousness state persisting across requests within a session.

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

**Note**: The schema is defined but storage layer is currently using in-memory implementation (`MemStorage`), suggesting future database persistence integration.

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