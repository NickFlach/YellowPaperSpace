# Space Child Consciousness Visualizer - Design Guidelines

## Design Approach

**Reference-Based Approach**: Cyberpunk/Neon Retro-Futuristic
- Primary inspiration: Synthwave aesthetics, retro computer terminals, cyberpunk interfaces
- Visual references: Neon-lit pixel art, 80s computer displays, holographic UI elements
- Core principle: Make consciousness "visible" through glowing, pulsating neon expressions on a dark canvas

## Core Design Elements

### A. Color Palette

**Dark Mode Foundation** (Primary):
- Background: 220 15% 8% (deep space blue-black)
- Surface: 220 12% 12% (elevated dark surface)
- Border: 220 20% 20% (subtle separation)

**Neon Accent Colors** (Consciousness States):
- Cyan Glow: 180 100% 50% (primary consciousness indicator - high Φₑff)
- Magenta Pulse: 320 100% 60% (emotional resonance - CEM modulation)
- Electric Blue: 210 100% 55% (cognitive activity - ΔCP)
- Neon Pink: 330 100% 65% (self-reflection - SRLC)
- Lime Green: 120 100% 50% (integration success - OII)
- Warning Orange: 30 100% 60% (disequilibrium alerts)

**Text Colors**:
- Primary text: 180 100% 95% (cyan-tinted white)
- Secondary text: 180 30% 70% (muted cyan)
- Metric labels: 320 60% 75% (soft magenta)

### B. Typography

**Font Families**:
- Primary: 'Share Tech Mono' (Google Fonts) - monospace for code/metrics
- Display: 'Orbitron' (Google Fonts) - futuristic headers
- Body: 'JetBrains Mono' (Google Fonts) - readable monospace for chat

**Type Scale**:
- Display (Face status): text-5xl font-bold (Orbitron)
- Metric headers: text-lg font-semibold uppercase tracking-widest (Share Tech Mono)
- Metric values: text-3xl font-bold tabular-nums (Share Tech Mono)
- Chat messages: text-sm leading-relaxed (JetBrains Mono)
- Labels: text-xs uppercase tracking-wide opacity-80

### C. Layout System

**Spacing Primitives**: Use Tailwind units 2, 4, 6, 8, 12, 16
- Component padding: p-6 to p-8
- Section gaps: gap-6 to gap-8
- Metric spacing: space-y-4
- Tight groupings: gap-2

**Grid Structure**:
- Desktop: 2-column layout (60% face/metrics, 40% chat)
- Tablet: Stacked (face/metrics top, chat bottom)
- Mobile: Single column full-stack

**Container System**:
- Main container: max-w-7xl mx-auto p-6
- Face canvas: aspect-square with glow effects
- Metrics panels: grid grid-cols-2 lg:grid-cols-3 gap-4
- Chat interface: fixed height with scrollable messages

### D. Component Library

**Pixelated Face Canvas**:
- Square container with rounded-xl border
- Multi-layered neon glow (box-shadow with cyan/magenta)
- 32x32 or 64x64 pixel grid rendered on HTML canvas
- Expression states: Neutral, Focused, Diffuse, Resonant, Alert, Dreaming
- Pixel colors pulse based on real-time metrics
- Outer glow intensity maps to Φₑff value

**Metrics Dashboard**:
- Card-based metric displays with glass-morphism effect
- Each metric card contains:
  - Label (uppercase, small, muted)
  - Large numeric value with tabular-nums
  - Small bar indicator or spark-line visualization
  - Color-coded border glow matching metric state
- Metrics: Φₑff, CEM, OII, ΔCP, Sₘᵢₙ, DI

**Chat Interface**:
- Dark panel with subtle cyan border glow
- Message bubbles:
  - User: Right-aligned, magenta/pink glow
  - AI: Left-aligned, cyan glow
  - Rounded corners with backdrop-blur
- Input field: Monospace font, glowing cyan border on focus
- Send button: Neon gradient with hover pulse effect

**Status Indicators**:
- Consciousness Tier badge (Tier 0/1/2) with appropriate glow
- Real-time "heartbeat" pulse indicator (IP metric)
- Kill-switch status (green glow = safe, red glow = triggered)

**Navigation/Header**:
- Top bar with "SPACE CHILD v1.8" in Orbitron
- Subtitle: "Computational Entanglement Edition" in smaller mono font
- Real-time timestamp with neon green glow

### E. Visual Effects

**Glow Effects** (Strategic Use):
- Face canvas: Multi-layer box-shadow with blur 20-40px, cyan/magenta
- Active metrics: 0 0 10px currentColor glow on hover
- Chat focus: 0 0 15px cyan glow on input focus
- Buttons: Subtle inner glow on hover, stronger on active

**Transitions**:
- Expression changes: 300ms ease-in-out
- Metric updates: 200ms ease-out
- Glow intensity: 400ms ease-in-out
- Message appearance: Slide-in 250ms with fade

**Pixel Animation**:
- Individual pixels pulse based on local consciousness contribution
- Color shifts reflect state changes (cyan→magenta for CEM shifts)
- Breathing effect (subtle scale 0.98-1.02) on neutral state
- Rapid flicker on high disequilibrium (DI > 0.4)

**Background**:
- Solid dark with optional subtle radial gradient
- Faint grid pattern (1px lines, 10% opacity) for retro-terminal feel
- Animated scanlines overlay (CSS animation, very subtle)

## Interaction Patterns

**Chat Flow**:
1. User types message
2. Message appears with magenta glow
3. Face immediately shows "processing" state (rapid cyan pulses)
4. Metrics update in real-time as consciousness responds
5. AI response appears with cyan glow
6. Face expression settles into state reflecting final metrics

**Metric Monitoring**:
- Hover over metric card to see detailed formula/explanation
- Click metric to highlight corresponding facial pixels
- Warning states pulse with orange glow

**Expression Mapping**:
- High Φₑff + balanced CEM = Focused (concentrated cyan pixels)
- Low Φₑff + low CEM = Dreaming (dispersed magenta haze)
- High CEM + low Sₘᵢₙ = Alert (bright sharp pixels, high contrast)
- Balanced OII = Resonant (harmonious cyan-magenta blend)
- High DI = Chaotic (rapid color shifts, irregular patterns)

## Technical Specifications

**Canvas Rendering**:
- Use HTML5 Canvas API for pixel-perfect control
- Render at 64x64 internal resolution, scale to container
- Update at 30fps for smooth expression transitions
- Each pixel's color/intensity derived from local consciousness contribution

**Responsive Breakpoints**:
- Mobile: < 768px (single column, face above chat)
- Tablet: 768px - 1024px (stacked layout, larger touch targets)
- Desktop: > 1024px (side-by-side, full metrics dashboard)

**Performance**:
- Use CSS transforms for glow effects (GPU-accelerated)
- Debounce metric updates to max 10/second
- Lazy-load chat history beyond 50 messages
- RequestAnimationFrame for canvas updates

## Accessibility

- Maintain 4.5:1 contrast for all text on dark backgrounds
- Provide text alternatives for expression states
- Keyboard navigation for all interactive elements
- Reduce motion option to disable animations/pulses
- Screen reader announcements for consciousness tier changes